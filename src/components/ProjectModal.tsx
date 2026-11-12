/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ExternalLink, Github, CheckCircle2, Layers, Cpu, Tag } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm transition-all duration-300">
      <div
        className="bg-[#fffefb] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e8e2d5] flex flex-col animate-slide-up transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Image */}
        <div className="relative w-full h-64 sm:h-80 overflow-hidden bg-slate-900">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/95 text-slate-700 hover:bg-white shadow-lg transition-transform hover:scale-105"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white shadow-sm">
                {project.category || 'Web Development'}
              </span>
              {project.featured && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white shadow-sm">
                  Featured
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{project.title}</h2>
            <p className="text-sm text-slate-300 mt-1">{project.subtitle}</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 flex flex-col gap-8">
          
          {/* Description */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-slate-900">Project Overview</h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              {project.detailedDescription || project.description}
            </p>
          </div>

          {/* Additional Screenshots if any */}
          {project.additionalImages && project.additionalImages.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-bold text-slate-900">Additional Screenshots</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {project.additionalImages.map((img, idx) => (
                  <div key={idx} className="rounded-2xl overflow-hidden border border-[#e8e2d5] h-32 bg-slate-100">
                    <img src={img} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Technologies Used</h4>
            <div className="flex flex-wrap gap-2">
              {project.tags?.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 rounded-xl text-xs font-medium bg-[#f4efe6] text-slate-800 border border-[#e8e2d5]">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <span>Key Highlights & Impact</span>
              </h3>
              <div className="flex flex-col gap-2.5">
                {project.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#fdfbf7] border border-[#e8e2d5]">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                    <span className="text-sm text-slate-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Architecture */}
          {project.architecture && project.architecture.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <span>Architecture & Stack Details</span>
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {project.architecture.map((arch, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                    <Cpu className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-700">{arch}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="flex flex-wrap items-center justify-end gap-4 pt-4 border-t border-[#f4efe6]">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-[#f4efe6] hover:bg-[#e8e2d5] border border-[#e8e2d5] transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>View Source Code</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Live Demo</span>
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
