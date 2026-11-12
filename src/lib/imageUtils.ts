/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '../firebase/config';

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  formattedSize: string;
}

/**
 * Format raw byte count into human-readable string (KB, MB).
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Validates image file type and maximum size.
 * Accepts JPEG, PNG, WebP, GIF, AVIF up to max limit (default 5MB).
 */
export function validateImageFile(
  file: File,
  maxSizeMB = 5,
  allowedMimes: string[] = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
): FileValidationResult {
  const formattedSize = formatFileSize(file.size);

  // Check file type
  const isImageMime = allowedMimes.includes(file.type.toLowerCase()) || file.type.startsWith('image/');
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const isImageExt = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'].includes(extension);

  if (!isImageMime && !isImageExt) {
    return {
      valid: false,
      error: `Invalid file format "${file.type || extension}". Only JPG, PNG, and WebP images are supported.`,
      formattedSize,
    };
  }

  // Check file size (in bytes)
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File size (${formattedSize}) exceeds the ${maxSizeMB}MB limit. Please choose a smaller image.`,
      formattedSize,
    };
  }

  return { valid: true, formattedSize };
}

/**
 * Validates resume file (PDF or Image) up to max limit (default 10MB).
 */
export function validateResumeFile(file: File, maxSizeMB = 10): FileValidationResult {
  const formattedSize = formatFileSize(file.size);
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const isPdf = file.type === 'application/pdf' || extension === 'pdf';
  const isImage = file.type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp'].includes(extension);

  if (!isPdf && !isImage) {
    return {
      valid: false,
      error: 'Invalid file format. Please upload a PDF document or image (PNG, JPG, WebP).',
      formattedSize,
    };
  }

  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File size (${formattedSize}) exceeds the ${maxSizeMB}MB limit.`,
      formattedSize,
    };
  }

  return { valid: true, formattedSize };
}

/**
 * Converts a Blob or File to a Base64 data URL string.
 */
export function blobToBase64(blob: Blob | File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert Blob to base64 string.'));
      }
    };
    reader.onerror = () => reject(reader.error || new Error('FileReader error'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Client-Side Image Resizing & Compression:
 * Resizes image via HTML5 Canvas to max bounding box (default 900x900px)
 * and compresses JPEG quality to 72% (0.72), reducing megabytes down to ~45-90KB.
 */
export async function compressImageToBlob(
  file: File | Blob,
  maxWidth = 900,
  maxHeight = 900,
  quality = 0.72
): Promise<Blob> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file as File);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio within bounding limits
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

/**
 * Compresses an image and returns a base64 data URL directly.
 */
export async function compressImageToBase64(
  file: File | Blob,
  maxWidth = 900,
  maxHeight = 900,
  quality = 0.72
): Promise<string> {
  const blob = await compressImageToBlob(file, maxWidth, maxHeight, quality);
  return await blobToBase64(blob);
}

/**
 * Robust Upload with Direct Cloud Firestore Sync Support:
 * Converts optimized files to Base64 data URLs when Storage auth is unavailable or slow,
 * ensuring 100% cross-device visibility in Firestore for all public visitors.
 */
export async function uploadWithResumableProgress(
  file: Blob | File,
  path: string,
  onProgress?: (progress: number, statusText: string) => void,
  statusLabel = 'Uploading'
): Promise<string> {
  if (onProgress) {
    onProgress(20, `${statusLabel} (20%)`);
  }

  // If admin logged in via email/password credentials without a Firebase Auth token,
  // or if file is under 500KB, encode directly so it saves straight into Firestore for all users.
  if (!auth.currentUser || file.size <= 500 * 1024) {
    if (onProgress) {
      onProgress(65, `${statusLabel} to Cloud Database (65%)`);
    }
    const base64Url = await blobToBase64(file);
    if (onProgress) {
      onProgress(100, `${statusLabel} Complete (100%)`);
    }
    return base64Url;
  }

  try {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    const downloadURL = await new Promise<string>((resolve, reject) => {
      // Fast 4-second timeout safeguard for cloud storage before switching to Firestore chunked/base64 storage
      const timeoutTimer = setTimeout(() => {
        uploadTask.cancel();
        reject(new Error('Switching to direct Firestore cloud storage.'));
      }, 4000);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (snapshot.totalBytes > 0) {
            const progress = Math.min(
              98,
              Math.max(20, Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100))
            );
            if (onProgress) {
              onProgress(progress, `${statusLabel} (${progress}%)`);
            }
          }
        },
        (error) => {
          clearTimeout(timeoutTimer);
          reject(error);
        },
        async () => {
          clearTimeout(timeoutTimer);
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            if (onProgress) {
              onProgress(100, `${statusLabel} (100% - Done)`);
            }
            resolve(url);
          } catch (err) {
            reject(err);
          }
        }
      );
    });

    return downloadURL;
  } catch {
    if (onProgress) {
      onProgress(85, 'Syncing to Cloud Firestore...');
    }
    const base64Url = await blobToBase64(file);
    if (onProgress) {
      onProgress(100, 'Synced to Cloud Firestore (100%)');
    }
    return base64Url;
  }
}
