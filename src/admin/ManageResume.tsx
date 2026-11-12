/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileText, Upload, CheckCircle2, Download, Image as ImageIcon, Trash2, AlertTriangle, X, Info } from 'lucide-react';
import { ResumeInfo } from '../types';
import { db, storage, auth, handleFirestoreError, OperationType } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { compressImageToBlob, uploadWithResumableProgress, validateResumeFile, formatFileSize } from '../lib/imageUtils';

interface ManageResumeProps {
  resumeInfo: ResumeInfo;
  onRefresh: () => void;
}

export default function ManageResume({ resumeInfo, onRefresh }: ManageResumeProps) {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validation = validateResumeFile(selectedFile, 10);
      if (!validation.valid) {
        setError(validation.error || 'Invalid file.');
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(selectedFile));
      } else {
        setFilePreview('');
      }
      setError('');
      setUploadState('idle');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    if (!auth.currentUser) {
      setError('You must be signed in as admin to upload a resume.');
      setUploadState('error');
      return;
    }
    setError('');
    setUploadState('uploading');
    setSuccess(false);
    setUploadStatus('Preparing resume upload...');
    setUploadProgress(0);

    try {
      let fileToUpload: Blob | File = file;
      if (file.type.startsWith('image/')) {
        setUploadStatus('Optimizing resume image (Canvas resizing & compression)...');
        fileToUpload = await compressImageToBlob(file, 1200, 1200, 0.75);
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const url = await uploadWithResumableProgress(
        fileToUpload,
        `resume/${Date.now()}_${safeName}`,
        (progress, statusText) => {
          setUploadProgress(progress);
          setUploadStatus(statusText);
        },
        'Uploading resume'
      );

      setUploadStatus('Saving resume metadata...');
      const resumeData: ResumeInfo = {
        url,
        fileName: file.name,
        updatedAt: new Date().toISOString().split('T')[0]
      };

      await setDoc(doc(db, 'siteSettings', 'resume'), resumeData);

      setUploadState('success');
      setSuccess(true);
      setFile(null);
      setFilePreview('');
      onRefresh();
    } catch (err: any) {
      let msg = err.message || 'Failed to upload resume.';
      if (err.code === 'storage/unauthorized') {
        msg = 'Unauthorized: Please check Firebase Storage permissions and ensure you are logged in.';
      } else if (err.code === 'storage/canceled') {
        msg = 'Resume upload was canceled.';
      }
      try {
        const parsed = JSON.parse(msg);
        if (parsed.error) msg = parsed.error;
      } catch {}
      setError(msg);
      setUploadState('error');
      console.error('Resume upload error:', err);
    } finally {
      setUploadStatus('');
    }
  };

  const handleDeleteResume = async () => {
    setIsDeleting(true);
    setError('');
    try {
      const emptyResume: ResumeInfo = {
        url: '',
        fileName: '',
        updatedAt: ''
      };
      await setDoc(doc(db, 'siteSettings', 'resume'), emptyResume);
      localStorage.removeItem('portfolio_resume');
      setShowDeleteModal(false);
      setSuccess(true);
      onRefresh();
    } catch (err: any) {
      setError('Failed to delete resume.');
      handleFirestoreError(err, OperationType.WRITE, 'siteSettings/resume');
    } finally {
      setIsDeleting(false);
    }
  };

  const isImage = resumeInfo.url && (resumeInfo.url.includes('.png') || resumeInfo.url.includes('.jpg') || resumeInfo.url.includes('.jpeg') || resumeInfo.url.includes('image'));

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Manage Resume</h2>
        <p className="text-sm text-slate-500">Upload, view, replace, or delete your portfolio resume.</p>
      </div>

      <div className="bg-[#fffefb] rounded-3xl p-8 border border-[#e8e2d5] shadow-sm flex flex-col gap-8">
        {/* Current Resume Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#fdfbf7] border border-[#e8e2d5]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              {isImage ? <ImageIcon className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{resumeInfo.fileName || 'No resume uploaded'}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Last updated: {resumeInfo.updatedAt || 'Never'}</p>
            </div>
          </div>

          {resumeInfo.url && resumeInfo.url !== '#' && (
            <div className="flex items-center gap-2">
              <a
                href={resumeInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>View Resume</span>
              </a>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs border border-rose-200 transition-colors"
                title="Delete Current Resume"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {success && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Resume successfully uploaded and updated across the public website!</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        )}

        {/* Resume Upload Limit Note */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 text-blue-950 text-xs shadow-sm">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="font-bold text-sm text-blue-900">Resume Upload Size & Format Note</span>
            <p className="text-blue-800 leading-relaxed">
              • <strong>Maximum Allowed Size:</strong> Up to <strong>10MB</strong>.<br />
              • <strong>Supported Formats:</strong> <strong>PDF (.pdf)</strong> document or image (<strong>PNG, JPG, JPEG, WebP</strong>).<br />
              • <strong>Instant Download & Sync:</strong> Files are optimized and instantly linked across your public portfolio website.
            </p>
          </div>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleUpload} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Upload Resume File</label>
              <span className="text-[11px] font-medium text-slate-500">Max size: 10MB • PDF, PNG, JPG, WebP</span>
            </div>
            <div className="border-2 border-dashed border-[#e8e2d5] rounded-3xl p-8 flex flex-col items-center justify-center gap-4 bg-[#fdfbf7] hover:bg-[#f4efe6] transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-center">
                <span className="text-sm font-semibold text-slate-900">
                  {file ? file.name : 'Click to select file or drag and drop'}
                </span>
                {file ? (
                  <p className="text-xs font-semibold text-blue-600 mt-1">
                    File Size: {formatFileSize(file.size)} (Within 10MB limit)
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1">Max limit: 10MB • Accepts PDF, PNG, JPG, WebP</p>
                )}
              </div>
              {filePreview && (
                <div className="w-24 h-24 rounded-xl overflow-hidden border border-[#e8e2d5]">
                  <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,image/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
                id="resume-file-input"
              />
              <label
                htmlFor="resume-file-input"
                className="px-4 py-2 rounded-xl bg-[#fffefb] border border-[#e8e2d5] text-slate-700 text-xs font-semibold shadow-sm hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Browse File
              </label>
            </div>
          </div>

        {uploadState === 'uploading' && (
            <div className="flex flex-col gap-2 p-4 rounded-2xl bg-blue-50 border border-blue-200">
              <div className="flex items-center justify-between text-xs font-semibold text-blue-700">
                <span>{uploadStatus}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!file || uploadState === 'uploading'}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white font-semibold text-sm bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
          >
            {uploadState === 'uploading' ? uploadStatus || 'Uploading Resume...' : 'Upload & Update Resume'}
          </button>
        </form>
      </div>

      {/* In-App Delete Resume Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#fffefb] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#e8e2d5] shadow-2xl flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Delete Resume?</h3>
                <p className="text-xs text-slate-500 mt-0.5">This will remove the resume file from your public website.</p>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              Are you sure you want to delete <strong className="text-slate-900">{resumeInfo.fileName}</strong>? Visitors will see "No Resume Uploaded Yet" until you upload a new one.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#fdfbf7] hover:bg-[#f4efe6] text-slate-700 font-semibold text-sm border border-[#e8e2d5] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteResume}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md shadow-rose-500/25 transition-all disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Delete Resume</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
