/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, FileText, Github, Linkedin, Mail, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import ProfileHeroCard from './ProfileHeroCard';
import ScrollReveal from './ScrollReveal';

interface HeroProps {
  profile: UserProfile;
  onOpenResume: () => void;
}

export default function Hero({ profile, onOpenResume }: HeroProps) {
  return (
    <section id="home" className="pt-28 pb-16 lg:pt-36 lg:pb-24 bg-gradient-to-b from-[#fdfbf7] via-[#fffefb] to-[#f4efe6] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Bio & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start text-left gap-6">
            <ScrollReveal direction="up" delay={0}>
            
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4efe6] border border-[#e8e2d5] text-blue-700 text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Full-Stack Engineer & AI Systems Developer</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Hi, I'm <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">{profile.name}</span>
            </h1>

            {/* Subtitle / Headline */}
            <p className="text-lg sm:text-xl font-medium text-slate-700">
              {profile.title}
            </p>

            {/* Bio Summary */}
            <p className="text-base text-slate-600 leading-relaxed max-w-xl">
              {profile.bioSummary}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#projects"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all hover:translate-y-[-2px]"
              >
                <span>View My Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={onOpenResume}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-[#fffefb] hover:bg-[#f4efe6] border border-[#e8e2d5] shadow-sm transition-all hover:translate-y-[-2px]"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Download Resume</span>
              </button>
            </div>

            {/* Social Links & Email */}
            <div className="flex items-center gap-4 pt-4 border-t border-[#e8e2d5] w-full">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Connect:</span>
              <div className="flex items-center gap-3">
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#fffefb] border border-[#e8e2d5] text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-colors shadow-sm"
                    aria-label="GitHub Profile"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#fffefb] border border-[#e8e2d5] text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-colors shadow-sm"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="p-2.5 rounded-xl bg-[#fffefb] border border-[#e8e2d5] text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-colors shadow-sm"
                    aria-label="Email Contact"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full pt-4 min-w-0">
              {profile.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-[#fffefb] p-4 rounded-2xl border border-[#e8e2d5] shadow-sm flex flex-col justify-between gap-1 overflow-hidden min-w-0"
                >
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">
                    {stat.label}
                  </div>
                  <div className="text-sm sm:text-base font-bold text-blue-600 leading-snug break-words">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Profile Hero Card with User Face Image */}
          <div className="lg:col-span-6 w-full">
            <ScrollReveal direction="left" delay={120}>
              <ProfileHeroCard profile={profile} />
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
