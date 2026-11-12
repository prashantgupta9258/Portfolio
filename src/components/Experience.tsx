/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Briefcase, Award, Calendar, MapPin, CheckCircle2, ExternalLink } from 'lucide-react';
import { experienceData, certificationsData } from '../data/initialData';
import ScrollReveal from './ScrollReveal';

export default function Experience() {
  return (
    <section id="experience" className="py-20 bg-gradient-to-b from-[#f4efe6] to-[#fffefb] border-t border-[#e8e2d5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={50}>
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4efe6] text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Career Journey</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Professional Experience & Certifications
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mt-3">
              A chronicle of my professional engineering roles, impactful responsibilities, and industry certifications.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Experience Timeline */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <ScrollReveal direction="right" delay={80}>
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <Briefcase className="w-6 h-6 text-blue-600" />
                <span>Work Experience</span>
              </h3>
            </ScrollReveal>

            <div className="flex flex-col gap-6">
              {experienceData.map((item, idx) => (
                <ScrollReveal key={item.id} direction="up" delay={idx * 120} duration={600}>
                  <div
                    className="bg-[#fffefb] rounded-3xl p-6 sm:p-8 border border-[#e8e2d5] shadow-sm flex flex-col gap-5 relative overflow-hidden hover:shadow-md transition-shadow"
                  >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">{item.role}</h4>
                      <p className="text-blue-600 font-semibold text-sm">{item.company}</p>
                    </div>
                    <div className="flex flex-col sm:items-end gap-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#f4efe6] text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        {item.period}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {item.location}
                      </span>
                    </div>
                  </div>

                  {/* Description points */}
                  <div className="flex flex-col gap-2.5">
                    {item.description.map((desc, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
                        <span className="text-sm text-slate-600 leading-relaxed">{desc}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-[#f4efe6]">
                    {item.technologies.map((tech, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Certifications Sidebar */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <ScrollReveal direction="left" delay={80}>
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <Award className="w-6 h-6 text-indigo-600" />
                <span>Certifications</span>
              </h3>
            </ScrollReveal>

            <div className="flex flex-col gap-5">
              {certificationsData.map((cert, idx) => (
                <ScrollReveal key={cert.id} direction="up" delay={idx * 120} duration={600}>
                  <div
                    className="bg-[#fffefb] rounded-3xl p-6 border border-[#e8e2d5] shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold shrink-0 shadow-sm">
                        <Award className="w-6 h-6" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 font-mono">
                        {cert.issueDate}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-900">{cert.title}</h4>
                      <p className="text-sm font-medium text-slate-600 mt-0.5">Issuer: {cert.issuer}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#f4efe6] text-xs text-slate-500">
                      <span className="font-mono">ID: {cert.credentialId}</span>
                      <a
                        href={cert.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <span>Verify</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
