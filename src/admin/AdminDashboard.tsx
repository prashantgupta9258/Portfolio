/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FolderKanban, FileText, User, Award, PlusCircle, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { Project, UserProfile, ResumeInfo } from '../types';

interface AdminDashboardProps {
  projects: Project[];
  profile: UserProfile;
  resumeInfo: ResumeInfo;
  onNavigate: (tab: string) => void;
}

export default function AdminDashboard({ projects, profile, resumeInfo, onNavigate }: AdminDashboardProps) {
  const publishedCount = projects.filter(p => p.status !== 'draft').length;
  const draftCount = projects.filter(p => p.status === 'draft').length;

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: FolderKanban, color: 'text-blue-600', bg: 'bg-blue-50', tab: 'projects' },
    { label: 'Published', value: publishedCount, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', tab: 'projects' },
    { label: 'Drafts', value: draftCount, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', tab: 'projects' },
    { label: 'Resume Status', value: resumeInfo.fileName ? 'Uploaded' : 'Missing', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50', tab: 'resume' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back, Admin!</h2>
          <p className="text-blue-100 text-sm mt-1">Manage your portfolio content, projects, and resume in real-time with Firebase synchronization.</p>
        </div>
        <button
          onClick={() => onNavigate('add-project')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-600 font-semibold text-sm shadow-md hover:bg-blue-50 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate(stat.tab)}
              className="bg-[#fffefb] rounded-3xl p-6 border border-[#e8e2d5] shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{stat.label}</span>
                <span className="text-2xl font-extrabold text-slate-900 font-mono">{stat.value}</span>
              </div>
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Projects Table Preview */}
      <div className="bg-[#fffefb] rounded-3xl p-6 sm:p-8 border border-[#e8e2d5] shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-[#f4efe6] pb-4">
          <h3 className="text-lg font-bold text-slate-900">Recent Projects</h3>
          <button
            onClick={() => onNavigate('projects')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-[#fdfbf7] text-xs font-semibold uppercase text-slate-400 tracking-wider">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Project Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4efe6]">
              {projects.slice(0, 5).map((project) => (
                <tr key={project.id} className="hover:bg-[#fdfbf7]/60 transition-colors">
                  <td className="py-4 px-4 font-semibold text-slate-900 flex items-center gap-3">
                    <img src={project.image} alt={project.title} className="w-10 h-10 rounded-lg object-cover" />
                    <span>{project.title}</span>
                  </td>
                  <td className="py-4 px-4 text-xs text-slate-500">{project.category || 'Web Development'}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${project.status === 'draft' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {project.status === 'draft' ? 'Draft' : 'Published'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => onNavigate('projects')}
                      className="px-3 py-1.5 rounded-lg bg-[#f4efe6] hover:bg-[#e8e2d5] text-slate-700 font-medium text-xs transition-colors"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
