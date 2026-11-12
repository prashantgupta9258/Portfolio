/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GraduationCap, Calendar, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { EducationItem } from '../types';
import ScrollReveal from './ScrollReveal';

interface EducationProps {
  education: EducationItem[];
}

export default function Education({ education }: EducationProps) {
  return (
    <section id="education" className="py-20 bg-[#fffefb] border-t border-[#e8e2d5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={50}>
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4efe6] text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Academic Background</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Education & Academic Excellence
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mt-3">
              Formal education, academic rigor, and foundational computer science training.
            </p>
          </div>
        </ScrollReveal>

        {/* Education Cards */}
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {education.map((edu, idx) => (
            <ScrollReveal key={edu.id} direction="up" delay={idx * 120} duration={600}>
              <div
                className="bg-[#fffefb] rounded-3xl p-8 border border-[#e8e2d5] shadow-sm flex flex-col gap-6 hover:shadow-md transition-shadow"
              >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/25 shrink-0">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{edu.degree}</h3>
                    <p className="text-blue-600 font-semibold text-base mt-0.5">{edu.institution}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#f4efe6] text-blue-700">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    {edu.period}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {edu.location}
                  </span>
                </div>
              </div>

              {/* Grade */}
              {edu.grade && (
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-[#fdfbf7] px-4 py-3 rounded-2xl border border-[#e8e2d5]">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Standing: {edu.grade}</span>
                </div>
              )}

              {/* Highlights */}
              {edu.highlights && edu.highlights.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Key Highlights & Coursework</h4>
                  <div className="flex flex-col gap-2.5">
                    {edu.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
