/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Code, Layout, Database, Briefcase, Sparkles } from 'lucide-react';
import { SkillCategory } from '../types';
import ScrollReveal from './ScrollReveal';

interface SkillsProps {
  skills: SkillCategory[];
}

export default function Skills({ skills }: SkillsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...skills.map(c => c.category)];

  const filteredCategories = selectedCategory === "All" 
    ? skills 
    : skills.filter(c => c.category === selectedCategory);

  const getCategoryIcon = (iconName: string) => {
    switch(iconName) {
      case 'Code': return <Code className="w-5 h-5 text-blue-600" />;
      case 'Layout': return <Layout className="w-5 h-5 text-indigo-600" />;
      case 'Database': return <Database className="w-5 h-5 text-sky-600" />;
      default: return <Briefcase className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <section id="skills" className="py-20 bg-gradient-to-b from-[#fffefb] to-[#f4efe6] border-t border-[#e8e2d5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal direction="up" delay={50}>
          <div className="flex flex-col items-center text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4efe6] text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Technical Expertise</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Skills & Technology Stack
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mt-3">
              A comprehensive breakdown of the languages, frameworks, databases, and professional tools I use to ship production-grade software.
            </p>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'bg-[#fffefb] text-slate-700 hover:bg-[#f4efe6] border border-[#e8e2d5]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Skills Grid by Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCategories.map((catData, idx) => (
            <ScrollReveal key={catData.id || idx} direction="up" delay={(idx % 2) * 120} duration={600} className="h-full">
              <div
                className="bg-[#fffefb] rounded-3xl p-6 sm:p-8 border border-[#e8e2d5] shadow-sm flex flex-col gap-6 hover:shadow-md transition-shadow h-full"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 border-b border-[#f4efe6] pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#f4efe6] flex items-center justify-center">
                    {getCategoryIcon(catData.iconName)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{catData.category}</h3>
                    <p className="text-xs text-slate-500">{catData.skills?.length || 0} core competencies</p>
                  </div>
                </div>

                {/* Skills List */}
                <div className="flex flex-col gap-4">
                  {catData.skills?.map((skill, sIdx) => (
                    <div key={sIdx} className="flex flex-col gap-1.5 p-3 rounded-2xl bg-[#fdfbf7] border border-[#e8e2d5]/60 hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 text-sm">{skill.name}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 font-mono">
                          {skill.level}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{skill.description}</p>
                    </div>
                  ))}
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
