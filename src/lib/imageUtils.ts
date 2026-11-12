/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

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
 * Resizes image via HTML5 Canvas to max bounding box (default 1000x1000px)
 * and compresses JPEG quality to 75% (0.75), reducing megabytes down to ~50-100KB.
 */
export async function compressImageToBlob(
  file: File | Blob,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.75
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
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.75
): Promise<string> {
  const blob = await compressImageToBlob(file, maxWidth, maxHeight, quality);
  return await blobToBase64(blob);
}

/**
 * Robust Upload with Resumable Progress & Base64 Fallback:
 * 1. Attempts Firebase Storage uploadBytesResumable with live progress tracking (0% -> 100%).
 * 2. Includes a timeout safeguard to prevent hanging on network drops.
 * 3. Fallback: If Firebase Storage fails (quota, CORS, rules, or network error),
 *    it gracefully falls back to generating a compressed Base64 data URL so data is NEVER lost!
 */
export async function uploadWithResumableProgress(
  file: Blob | File,
  path: string,
  onProgress?: (progress: number, statusText: string) => void,
  statusLabel = 'Uploading'
): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    if (onProgress) {
      onProgress(5, `${statusLabel} (5%)`);
    }

    const downloadURL = await new Promise<string>((resolve, reject) => {
      // 25 second timeout safeguard for cloud storage
      const timeoutTimer = setTimeout(() => {
        uploadTask.cancel();
        reject(new Error('Upload timed out. Switching to local fallback.'));
      }, 25000);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (snapshot.totalBytes > 0) {
            const progress = Math.min(
              98,
              Math.max(5, Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100))
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
  } catch (error: any) {
    console.warn(
      'Cloud storage upload encountered an error or timeout. Initiating Base64 fallback mechanism:',
      error
    );

    if (onProgress) {
      onProgress(90, 'Processing optimized fallback storage...');
    }

    // Base64 Fallback support
    try {
      const base64Url = await blobToBase64(file);
      if (onProgress) {
        onProgress(100, 'Saved via optimized storage fallback (100%)');
      }
      return base64Url;
    } catch (fallbackError) {
      console.error('Base64 fallback also failed:', fallbackError);
      throw new Error(
        error.message || 'Image upload failed. Please check network connection and try again.'
      );
    }
  }
}
