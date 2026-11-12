/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, MapPin, Mail, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';
import ScrollReveal from './ScrollReveal';

interface AboutProps {
  profile: UserProfile;
}

export default function About({ profile }: AboutProps) {
  const highlights = [
    "Full-stack architecture with React, TypeScript, and Node.js",
    "AI integration utilizing Google Gemini APIs and vector embeddings",
    "High-performance WebGL 3D visualizations with Three.js",
    "Relational database design and query optimization with PostgreSQL",
    "Clean code philosophy, automated testing, and CI/CD workflows"
  ];

  return (
    <section id="about" className="py-20 bg-[#fffefb] border-t border-[#e8e2d5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={50}>
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4efe6] text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
              <User className="w-3.5 h-3.5" />
              <span>About Me</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Engineering robust systems with precision and purpose
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mt-3">
              Get to know my background, technical philosophy, and what drives my passion for software engineering.
            </p>
          </div>
        </ScrollReveal>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Card: Profile & Quick Info - Cream Theme */}
          <div className="lg:col-span-5">
            <ScrollReveal direction="right" delay={100}>
              <div className="bg-[#f4efe6] rounded-3xl p-8 border border-[#e8e2d5] shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-blue-500/20">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{profile.name}</h3>
                    <p className="text-blue-600 font-semibold text-sm mt-1">{profile.title}</p>
                  </div>

                  <div className="flex flex-col gap-3 pt-2 border-t border-[#e8e2d5] text-sm text-slate-700">
                    {profile.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    {profile.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                        <a href={`mailto:${profile.email}`} className="hover:text-blue-600 transition-colors">
                          {profile.email}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    <a
                      href="#contact"
                      className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all"
                    >
                      Get In Touch
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Narrative */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="left" delay={150}>
              <div className="flex flex-col gap-6">
                <h3 className="text-2xl font-bold text-slate-900">
                  Passionate Computer Science Student & Builder
                </h3>
                
                <p className="text-base text-slate-600 leading-relaxed">
                  {profile.about}
                </p>

                <p className="text-base text-slate-600 leading-relaxed">
                  Whether building enterprise RAG search engines, designing real-time SaaS observability dashboards, or crafting interactive 3D WebGL experiences, I focus on writing maintainable, well-tested code that delivers exceptional user experiences.
                </p>

                {/* Highlights List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 bg-[#fdfbf7] p-3.5 rounded-2xl border border-[#e8e2d5]">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>

              </div>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
}
