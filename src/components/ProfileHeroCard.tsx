/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Brain, Cpu, Code, CheckCircle2, ShieldCheck, Award } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileHeroCardProps {
  profile: UserProfile;
}

export default function ProfileHeroCard({ profile }: ProfileHeroCardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'education'>('overview');

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-[#f4efe6] border border-[#e8e2d5] shadow-xl p-6 sm:p-8 flex flex-col gap-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Badge */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fffefb] border border-[#e8e2d5] text-xs font-semibold text-slate-800 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <span>Information Technology Student @ DEI</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified Profile</span>
        </div>
      </div>

      {/* Main Profile Showcase Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        {/* User Uploaded Face Image */}
        <div className="sm:col-span-5 flex justify-center">
          <div className="relative w-48 h-56 sm:w-56 sm:h-64 rounded-2xl overflow-hidden border-4 border-[#fffefb] shadow-xl bg-white group shrink-0">
            <img
              src="/assets/aistudio/image_3bddc74c.png"
              alt={profile.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <span className="text-white text-xs font-semibold tracking-wide truncate">{profile.name}</span>
            </div>
          </div>
        </div>

        {/* Profile Info & Quick Knowledge Tabs */}
        <div className="sm:col-span-7 flex flex-col gap-4 min-w-0">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 truncate">{profile.name}</h3>
            <p className="text-blue-600 font-semibold text-sm mt-0.5">{profile.title}</p>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
              {profile.bioSummary}
            </p>
          </div>

          {/* Interactive Knowledge Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-[#e8e2d5] pb-2">
            {(['overview', 'skills', 'education'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-[#fffefb] text-slate-700 hover:bg-[#e8e2d5]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[110px] bg-[#fffefb] p-4 rounded-2xl border border-[#e8e2d5] text-xs text-slate-700 flex flex-col justify-center gap-2 overflow-hidden">
            {activeTab === 'overview' && (
              <>
                <div className="flex items-center gap-2 font-bold text-slate-900 truncate">
                  <Brain className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="truncate">Web Development & Practical Solutions</span>
                </div>
                <p className="text-slate-600 leading-relaxed line-clamp-3">
                  Passionate about building responsive web applications, creating clean user interfaces, and learning modern web technologies through academic and hands-on projects.
                </p>
              </>
            )}
            {activeTab === 'skills' && (
              <>
                <div className="flex items-center gap-2 font-bold text-slate-900 truncate">
                  <Code className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="truncate">Core Skills & Tools</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1 overflow-hidden">
                  {['HTML', 'CSS', 'JavaScript', 'Responsive Design', 'Firebase', 'Git & GitHub', 'MS Excel'].map((t, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-[#f4efe6] text-slate-800 font-medium text-[11px] border border-[#e8e2d5] truncate">
                      {t}
                    </span>
                  ))}
                </div>
              </>
            )}
            {activeTab === 'education' && (
              <>
                <div className="flex items-center gap-2 font-bold text-slate-900 truncate">
                  <Award className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="truncate">Dayalbagh Educational Institute (DEI)</span>
                </div>
                <p className="text-slate-600 truncate">
                  Diploma in Information Technology (Currently Pursuing) at Polytechnic VIT, Agra.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
