/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, Edit3, ExternalLink, Github, Sparkles, Check, X, Upload, AlertTriangle, Info } from 'lucide-react';
import { Project } from '../types';
import { db, storage, handleFirestoreError, OperationType } from '../firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { compressImageToBlob, uploadWithResumableProgress, validateImageFile, formatFileSize } from '../lib/imageUtils';

interface ManageProjectsProps {
  projects: Project[];
  onRefresh: () => void;
  initialMode?: 'list' | 'add';
}

export default function ManageProjects({ projects, onRefresh, initialMode = 'list' }: ManageProjectsProps) {
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>(initialMode);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    detailedDescription: '',
    image: '',
    tags: '',
    liveUrl: '',
    githubUrl: '',
    highlights: '',
    architecture: '',
    category: 'Web Development',
    featured: false,
    order: 0,
    status: 'published' as 'published' | 'draft'
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);
  const [existingAdditional, setExistingAdditional] = useState<string[]>([]);

  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const [deleteTargetProject, setDeleteTargetProject] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateImageFile(file, 5);
      if (!validation.valid) {
        setError(validation.error || 'Invalid image file.');
        e.target.value = '';
        return;
      }
      setError('');
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAdditionalFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const validFiles: File[] = [];

      for (const f of filesArray) {
        const validation = validateImageFile(f, 5);
        if (!validation.valid) {
          setError(validation.error || 'One or more files exceed the 5MB limit or have an invalid format.');
          return;
        }
        validFiles.push(f);
      }

      setError('');
      setAdditionalFiles(prev => [...prev, ...validFiles]);
      const newPreviews = validFiles.map(f => URL.createObjectURL(f));
      setAdditionalPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleStartEdit = (proj: Project) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title,
      subtitle: proj.subtitle,
      description: proj.description,
      detailedDescription: proj.detailedDescription,
      image: proj.image,
      tags: proj.tags ? proj.tags.join(', ') : '',
      liveUrl: proj.liveUrl || '',
      githubUrl: proj.githubUrl || '',
      highlights: proj.highlights ? proj.highlights.join('\n') : '',
      architecture: proj.architecture ? proj.architecture.join('\n') : '',
      category: proj.category || 'Web Development',
      featured: proj.featured || false,
      order: proj.order || 0,
      status: proj.status || 'published'
    });
    setImagePreview(proj.image);
    setExistingAdditional(proj.additionalImages || []);
    setAdditionalFiles([]);
    setAdditionalPreviews([]);
    setImageFile(null);
    setMode('edit');
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetProject) return;
    const target = deleteTargetProject;
    setIsDeleting(true);
    setError('');

    try {
      // 1. Delete document from Firestore
      await deleteDoc(doc(db, 'projects', target.id));

      // 2. Mark initialized setting so empty collection state is preserved
      try {
        await setDoc(doc(db, 'siteSettings', 'initialized'), {
          initialized: true,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (e) {
        console.warn('Could not update initialized flag:', e);
      }

      // 3. Update local storage cache immediately so UI reflects deletion instantly
      const updated = projects.filter(p => p.id !== target.id);
      localStorage.setItem('portfolio_projects', JSON.stringify(updated));

      // 4. Close modal and show feedback
      setDeleteTargetProject(null);
      setDeleteSuccess(`"${target.title}" was successfully deleted.`);
      setTimeout(() => setDeleteSuccess(''), 4000);

      // 5. Trigger refresh
      onRefresh();
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete project.');
      handleFirestoreError(err, OperationType.DELETE, `projects/${target.id}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUploading(true);
    setUploadStatus('Validating and preparing images...');
    setUploadProgress(0);

    try {
      let imageUrl = formData.image;

      if (imageFile) {
        setUploadStatus('Resizing & compressing cover image (max 1000px, 75% quality)...');
        const compressedBlob = await compressImageToBlob(imageFile, 1000, 1000, 0.75);
        const safeName = imageFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        imageUrl = await uploadWithResumableProgress(
          compressedBlob,
          `projects/${Date.now()}_${safeName}`,
          (progress, statusText) => {
            setUploadProgress(progress);
            setUploadStatus(statusText);
          },
          'Uploading cover image'
        );
      }

      const newAdditionalUrls: string[] = [];
      if (additionalFiles.length > 0) {
        for (let i = 0; i < additionalFiles.length; i++) {
          const file = additionalFiles[i];
          setUploadStatus(`Compressing screenshot ${i + 1} of ${additionalFiles.length}...`);
          const compressedBlob = await compressImageToBlob(file, 1000, 1000, 0.75);
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const url = await uploadWithResumableProgress(
            compressedBlob,
            `projects/additional_${Date.now()}_${safeName}`,
            (progress, statusText) => {
              setUploadProgress(progress);
              setUploadStatus(statusText);
            },
            `Uploading screenshot ${i + 1}/${additionalFiles.length}`
          );
          newAdditionalUrls.push(url);
        }
      }

      const combinedAdditional = [...existingAdditional, ...newAdditionalUrls];

      setUploadStatus('Saving project data...');
      const projectPayload = {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        detailedDescription: formData.detailedDescription,
        image: imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        additionalImages: combinedAdditional,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        liveUrl: formData.liveUrl,
        githubUrl: formData.githubUrl,
        highlights: formData.highlights.split('\n').map(h => h.trim()).filter(Boolean),
        architecture: formData.architecture.split('\n').map(a => a.trim()).filter(Boolean),
        category: formData.category,
        featured: formData.featured,
        order: Number(formData.order) || 0,
        status: formData.status,
        updatedAt: serverTimestamp()
      };

      if (mode === 'edit' && editingProject) {
        await updateDoc(doc(db, 'projects', editingProject.id), projectPayload);
      } else {
        await addDoc(collection(db, 'projects'), {
          ...projectPayload,
          createdAt: serverTimestamp()
        });
      }

      localStorage.removeItem('portfolio_projects');
      setMode('list');
      setEditingProject(null);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save project.');
      handleFirestoreError(err, OperationType.WRITE, 'projects');
    } finally {
      setUploading(false);
      setUploadStatus('');
    }
  };

  if (mode === 'add' || mode === 'edit') {
    return (
      <div className="bg-[#fffefb] rounded-3xl p-8 border border-[#e8e2d5] shadow-sm max-w-3xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-[#f4efe6] pb-4">
          <h2 className="text-xl font-bold text-slate-900">
            {mode === 'edit' ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button
            onClick={() => {
              setMode('list');
              setEditingProject(null);
            }}
            className="p-2 rounded-xl text-slate-500 hover:bg-[#f4efe6]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Project Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="px-4 py-3 rounded-xl bg-[#fdfbf7] border border-[#e8e2d5] text-slate-900 text-sm focus:outline-none focus:border-blue-600"
                placeholder="Personal Portfolio"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Subtitle *</label>
              <input
                type="text"
                required
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="px-4 py-3 rounded-xl bg-[#fdfbf7] border border-[#e8e2d5] text-slate-900 text-sm focus:outline-none focus:border-blue-600"
                placeholder="Responsive developer portfolio"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-4 py-3 rounded-xl bg-[#fdfbf7] border border-[#e8e2d5] text-slate-900 text-sm focus:outline-none focus:border-blue-600"
                placeholder="Web Development"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Publication Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })}
                className="px-4 py-3 rounded-xl bg-[#fdfbf7] border border-[#e8e2d5] text-slate-900 text-sm focus:outline-none focus:border-blue-600"
              >
                <option value="published">Published (Public)</option>
                <option value="draft">Draft (Private)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Short Description *</label>
            <textarea
              rows={2}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="px-4 py-3 rounded-xl bg-[#fdfbf7] border border-[#e8e2d5] text-slate-900 text-sm focus:outline-none focus:border-blue-600 resize-none"
              placeholder="Brief summary for project card..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Detailed Description *</label>
            <textarea
              rows={4}
              required
              value={formData.detailedDescription}
              onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
              className="px-4 py-3 rounded-xl bg-[#fdfbf7] border border-[#e8e2d5] text-slate-900 text-sm focus:outline-none focus:border-blue-600 resize-none"
              placeholder="In-depth project overview..."
            />
          </div>

          {/* Image Upload Size Guidelines & Note */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 text-blue-950 text-xs shadow-sm">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-bold text-sm text-blue-900">Image Upload Size & Limit Note</span>
              <p className="text-blue-800 leading-relaxed">
                • <strong>Maximum Allowed Size:</strong> You can upload images up to <strong>5MB</strong> each.<br />
                • <strong>Supported Formats:</strong> <strong>JPG, JPEG, PNG, WebP</strong>.<br />
                • <strong>Automatic Optimization:</strong> Images are automatically resized (max 1000px) and compressed with 75% quality on your device before transfer, reducing file weight to ~50–100KB for instant, lag-free uploads.
              </p>
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Project Cover Image *</label>
              <span className="text-[11px] font-medium text-slate-500">Max size: 5MB • JPG, PNG, WebP</span>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              {imagePreview && (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-24 h-20 rounded-xl object-cover border border-[#e8e2d5]" />
                  {imageFile && (
                    <span className="absolute -bottom-2 -right-2 px-1.5 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-mono shadow-sm">
                      {formatFileSize(imageFile.size)}
                    </span>
                  )}
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#fdfbf7] hover:bg-[#f4efe6] text-slate-700 text-sm font-medium cursor-pointer border border-[#e8e2d5] transition-colors">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span>{imageFile ? 'Change Cover Image' : 'Choose Cover Image'}</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/jpg" onChange={handleImageChange} className="hidden" />
                </label>
                {imageFile && (
                  <span className="text-xs text-slate-600 font-medium truncate max-w-xs">
                    Selected: {imageFile.name} ({formatFileSize(imageFile.size)})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Additional Screenshots Upload */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Additional Screenshots (Optional)</label>
              <span className="text-[11px] font-medium text-slate-500">Max 5MB each • JPG, PNG, WebP</span>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              {existingAdditional.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#e8e2d5]">
                  <img src={url} alt="Additional" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setExistingAdditional(existingAdditional.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white text-xs"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {additionalPreviews.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#e8e2d5]">
                  <img src={url} alt="New Additional" className="w-full h-full object-cover" />
                  {additionalFiles[i] && (
                    <span className="absolute bottom-0 inset-x-0 bg-slate-900/70 text-white text-[9px] text-center truncate px-0.5">
                      {formatFileSize(additionalFiles[i].size)}
                    </span>
                  )}
                </div>
              ))}
              <label className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#fdfbf7] hover:bg-[#f4efe6] text-slate-700 text-sm font-medium cursor-pointer border border-[#e8e2d5] transition-colors">
                <Upload className="w-4 h-4 text-blue-600" />
                <span>Add Screenshots</span>
                <input type="file" accept="image/jpeg,image/png,image/webp,image/jpg" multiple onChange={handleAdditionalFilesChange} className="hidden" />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Technologies (comma separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="px-4 py-3 rounded-xl bg-[#fdfbf7] border border-[#e8e2d5] text-slate-900 text-sm focus:outline-none focus:border-blue-600"
                placeholder="HTML, CSS, JavaScript, React"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="px-4 py-3 rounded-xl bg-[#fdfbf7] border border-[#e8e2d5] text-slate-900 text-sm focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Live Demo URL</label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                className="px-4 py-3 rounded-xl bg-[#fdfbf7] border border-[#e8e2d5] text-slate-900 text-sm focus:outline-none focus:border-blue-600"
                placeholder="https://..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">GitHub Repository URL</label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="px-4 py-3 rounded-xl bg-[#fdfbf7] border border-[#e8e2d5] text-slate-900 text-sm focus:outline-none focus:border-blue-600"
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Key Achievements / Highlights (one per line)</label>
            <textarea
              rows={3}
              value={formData.highlights}
              onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
              className="px-4 py-3 rounded-xl bg-[#fdfbf7] border border-[#e8e2d5] text-slate-900 text-sm focus:outline-none focus:border-blue-600 resize-none"
              placeholder="Responsive layout&#10;Clean typography"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Architecture Details (one per line)</label>
            <textarea
              rows={3}
              value={formData.architecture}
              onChange={(e) => setFormData({ ...formData, architecture: e.target.value })}
              className="px-4 py-3 rounded-xl bg-[#fdfbf7] border border-[#e8e2d5] text-slate-900 text-sm focus:outline-none focus:border-blue-600 resize-none"
              placeholder="Frontend: HTML5 + CSS3&#10;Styling: Flexbox & Grid"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 accent-blue-600 rounded"
            />
            <label htmlFor="featured" className="text-sm font-semibold text-slate-700">Mark as Featured Project</label>
          </div>

          {uploading && (
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

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#f4efe6]">
            <button
              type="button"
              disabled={uploading}
              onClick={() => {
                setMode('list');
                setEditingProject(null);
              }}
              className="px-6 py-3 rounded-xl bg-[#fdfbf7] text-slate-700 font-semibold text-sm hover:bg-[#f4efe6] border border-[#e8e2d5] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {uploading && <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />}
              <span>{uploading ? 'Processing & Uploading...' : mode === 'edit' ? 'Update Project' : 'Save Project'}</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Manage Projects</h2>
          <p className="text-sm text-slate-500">Add, edit, publish, or remove portfolio projects in real time.</p>
        </div>
        <button
          onClick={() => {
            setFormData({
              title: '',
              subtitle: '',
              description: '',
              detailedDescription: '',
              image: '',
              tags: '',
              liveUrl: '',
              githubUrl: '',
              highlights: '',
              architecture: '',
              category: 'Web Development',
              featured: false,
              order: projects.length + 1,
              status: 'published'
            });
            setImagePreview('');
            setImageFile(null);
            setAdditionalFiles([]);
            setAdditionalPreviews([]);
            setExistingAdditional([]);
            setMode('add');
          }}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-md hover:bg-blue-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {deleteSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{deleteSuccess}</span>
          </div>
          <button onClick={() => setDeleteSuccess('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && !deleteTargetProject && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      )}

      <div className="bg-[#fffefb] rounded-3xl border border-[#e8e2d5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-[#fdfbf7] text-xs font-semibold uppercase text-slate-400 tracking-wider border-b border-[#e8e2d5]">
              <tr>
                <th className="py-4 px-6">Project</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4efe6]">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    No projects found. Click "Add New Project" above to create one.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-[#fdfbf7]/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900 flex items-center gap-4">
                      <img src={project.image} alt={project.title} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#e8e2d5]" />
                      <div>
                        <div className="font-bold text-slate-900">{project.title}</div>
                        <div className="text-xs text-slate-500 font-normal">{project.subtitle}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600">{project.category || 'Web Development'}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${project.status === 'draft' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {project.status === 'draft' ? 'Draft' : 'Published'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleStartEdit(project)}
                          className="p-2 rounded-xl bg-[#f4efe6] hover:bg-[#e8e2d5] text-slate-700 transition-colors"
                          title="Edit Project"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetProject(project)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* In-App Delete Confirmation Modal (Replaces browser window.confirm blocked by iframes) */}
      {deleteTargetProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#fffefb] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#e8e2d5] shadow-2xl flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Delete Project?</h3>
                <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#fdfbf7] border border-[#e8e2d5] flex items-center gap-3">
              <img
                src={deleteTargetProject.image}
                alt={deleteTargetProject.title}
                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#e8e2d5]"
              />
              <div className="overflow-hidden">
                <div className="font-bold text-slate-900 text-sm truncate">{deleteTargetProject.title}</div>
                <div className="text-xs text-slate-500 truncate">{deleteTargetProject.category || 'Web Development'}</div>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              Are you sure you want to permanently delete <strong className="text-slate-900">"{deleteTargetProject.title}"</strong> from your portfolio?
            </p>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setDeleteTargetProject(null);
                  setError('');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#fdfbf7] hover:bg-[#f4efe6] text-slate-700 font-semibold text-sm border border-[#e8e2d5] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
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
                    <span>Yes, Delete</span>
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
