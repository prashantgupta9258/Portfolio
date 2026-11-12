/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Download, FileText, ExternalLink, Maximize2, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';
import { UserProfile, EducationItem, SkillCategory, ResumeInfo } from '../types';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  skills: SkillCategory[];
  education: EducationItem[];
  resumeInfo: ResumeInfo;
}

export default function ResumeModal({ isOpen, onClose, profile, skills, education, resumeInfo }: ResumeModalProps) {
  const [isFullscreenView, setIsFullscreenView] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (resumeInfo.url && resumeInfo.url !== '#') {
      try {
        if (resumeInfo.url.startsWith('data:')) {
          const parts = resumeInfo.url.split(',');
          const mimeMatch = parts[0].match(/:(.*?);/);
          const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
          const byteCharacters = atob(parts[1]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: mime });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = resumeInfo.fileName || 'Prashant_Gupta_Resume.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          return;
        }

        const link = document.createElement('a');
        link.href = resumeInfo.url;
        link.target = '_blank';
        link.download = resumeInfo.fileName || 'Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (e) {
        console.error('Download error:', e);
      }
    } else {
      const resumeContent = `
========================================
${profile.name.toUpperCase()}
${profile.title}
========================================
Email: ${profile.email}
Location: ${profile.location}
GitHub: ${profile.github}
LinkedIn: ${profile.linkedin}

SUMMARY:
${profile.about}

TECHNICAL SKILLS:
${skills.map(cat => `${cat.category}: ${cat.skills.map(s => s.name).join(', ')}`).join('\n')}

EDUCATION:
${education.map(edu => `
- ${edu.degree}
  ${edu.institution} (${edu.period}) - ${edu.grade}
`).join('\n')}
      `.trim();

      const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Prashant_Gupta_Resume.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const urlLower = resumeInfo.url?.toLowerCase() || '';
  const hasUploadedResume = Boolean(resumeInfo.url && resumeInfo.url !== '#' && resumeInfo.url.trim() !== '');
  const isPdfResume = hasUploadedResume && (urlLower.includes('.pdf') || resumeInfo.url.startsWith('data:application/pdf'));

  // Handler for opening full document safely (supports Base64 data URLs without browser navigation block)
  const handleOpenFullDocument = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!resumeInfo.url || resumeInfo.url === '#') {
      return;
    }

    try {
      if (resumeInfo.url.startsWith('data:')) {
        // Convert data URL to Blob Object URL to bypass browser top-frame navigation restrictions
        const parts = resumeInfo.url.split(',');
        const mimeMatch = parts[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : (isPdfResume ? 'application/pdf' : 'image/png');
        const byteCharacters = atob(parts[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mime });
        const objectUrl = URL.createObjectURL(blob);

        const newWin = window.open(objectUrl, '_blank', 'noopener,noreferrer');
        if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
          // Fallback: If popup is blocked by browser sandbox, open fullscreen in-modal or trigger download
          setIsFullscreenView(true);
          const link = document.createElement('a');
          link.href = objectUrl;
          link.download = resumeInfo.fileName || 'Resume_Document';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        const newWin = window.open(resumeInfo.url, '_blank', 'noopener,noreferrer');
        if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
          setIsFullscreenView(true);
        }
      }
    } catch (err) {
      console.warn('Could not open in new tab, falling back to download:', err);
      handleDownload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/65 backdrop-blur-md transition-all duration-300">
      <div
        className={`bg-[#fffefb] rounded-3xl w-full shadow-2xl border border-[#e8e2d5] flex flex-col transition-all duration-300 animate-slide-up ${
          isFullscreenView ? 'max-w-[98vw] h-[96vh]' : 'max-w-4xl max-h-[90vh]'
        } overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Actions */}
        <div className="sticky top-0 z-20 bg-[#fffefb]/95 backdrop-blur-md px-6 py-4 border-b border-[#e8e2d5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">Curriculum Vitae</h3>
              <p className="text-xs text-slate-500">{profile.name} - {profile.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {hasUploadedResume && !isPdfResume && (
              <div className="hidden sm:flex items-center gap-1 bg-[#f4efe6] rounded-xl p-1 border border-[#e8e2d5]">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.7, Number((z - 0.2).toFixed(1))))}
                  className="p-1.5 rounded-lg text-slate-700 hover:bg-[#e8e2d5] transition-colors"
                  title="Zoom Out"
                  aria-label="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono px-1 font-semibold text-slate-600">{Math.round(zoomLevel * 100)}%</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(2.0, Number((z + 0.2).toFixed(1))))}
                  className="p-1.5 rounded-lg text-slate-700 hover:bg-[#e8e2d5] transition-colors"
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsFullscreenView(!isFullscreenView)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-[#f4efe6] hover:bg-[#e8e2d5] border border-[#e8e2d5] transition-colors"
              title={isFullscreenView ? 'Exit Fullscreen' : 'Expand View'}
            >
              {isFullscreenView ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isFullscreenView ? 'Shrink' : 'Expand'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-[#f4efe6] text-slate-700 hover:bg-[#e8e2d5] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resume Preview Paper */}
        <div className="p-4 sm:p-8 flex flex-col gap-6 bg-[#fdfbf7] overflow-y-auto flex-1">
          {hasUploadedResume ? (
            <div className="bg-[#fffefb] rounded-2xl p-4 sm:p-6 border border-[#e8e2d5] shadow-sm flex flex-col items-center gap-6">
              <div className="flex flex-wrap items-center justify-between w-full border-b border-[#f4efe6] pb-3 gap-2">
                <span className="text-sm font-bold text-slate-900 truncate max-w-sm">
                  Document: {resumeInfo.fileName || 'Resume Document'}
                </span>
                <span className="text-xs text-slate-500 font-mono">Updated: {resumeInfo.updatedAt || 'Recent'}</span>
              </div>

              {isPdfResume ? (
                <iframe
                  src={resumeInfo.url}
                  className={`w-full rounded-xl border border-[#e8e2d5] bg-white shadow-inner transition-all duration-300 ${
                    isFullscreenView ? 'h-[75vh]' : 'h-[620px]'
                  }`}
                  title="Resume PDF"
                />
              ) : (
                <div className="flex flex-col items-center gap-4 w-full overflow-auto max-h-[75vh] p-2 bg-slate-50/50 rounded-xl border border-[#e8e2d5]/60">
                  <img
                    src={resumeInfo.url}
                    alt="Uploaded Resume"
                    style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
                    className="max-w-full rounded-xl border border-[#e8e2d5] shadow-md object-contain transition-transform duration-200 bg-white"
                  />
                </div>
              )}

              {/* Action Buttons: Selected Element is the First <a> inside this <div> container */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <a
                  href={resumeInfo.url}
                  onClick={handleOpenFullDocument}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  <span>Open Full Document in New Tab</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#f4efe6] text-slate-800 font-semibold text-sm hover:bg-[#e8e2d5] border border-[#e8e2d5] active:scale-95 transition-all cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4 text-blue-600" />
                  <span>Download Document</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#fffefb] rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4 border border-[#e8e2d5]">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No Resume Uploaded Yet</h3>
              <p className="text-sm text-slate-600 max-w-md leading-relaxed">
                No resume has been uploaded by the administrator yet. Please log in to the private admin dashboard (<span className="font-mono font-semibold text-blue-600">/admin</span>) to securely upload your resume document (PDF, PNG, JPG, or WebP).
              </p>
              <a
                href="#admin"
                onClick={onClose}
                className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-md transition-all"
              >
                <span>Go to Admin Dashboard</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
