/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ExternalLink, Github, Sparkles, ArrowUpRight, Info } from 'lucide-react';
import { Project } from '../types';
import ProjectModal from './ProjectModal';
import ScrollReveal from './ScrollReveal';

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Only show published projects publicly
  const publishedProjects = projects.filter((p) => p.status !== 'draft');

  return (
    <section id="projects" className="py-20 bg-[#fffefb] border-t border-[#e8e2d5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal direction="up" delay={50}>
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4efe6] text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured Portfolio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Production Projects & Systems
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mt-3">
              Explore web applications, landing pages, and practical software projects I've designed and shipped.
            </p>
          </div>
        </ScrollReveal>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedProjects.map((project, idx) => (
            <ScrollReveal key={project.id} direction="up" delay={(idx % 3) * 100} duration={600} className="h-full">
              <div
                className="bg-[#fffefb] rounded-3xl overflow-hidden border border-[#e8e2d5] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group h-full"
              >
              {/* Project Image Container */}
              <div
                className="relative w-full h-56 overflow-hidden bg-slate-900 cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <img
                  src={project.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                
                {/* Click to Inspect Badge */}
                <div className="absolute top-4 right-4 bg-[#fffefb]/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 shadow-sm flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  <span>View Details</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">{project.subtitle}</span>
                  <h3 className="text-xl font-bold tracking-tight mt-0.5">{project.title}</h3>
                </div>
              </div>

              {/* Project Card Body */}
              <div className="p-6 flex flex-col flex-grow justify-between gap-6">
                
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#f4efe6] text-slate-700 border border-[#e8e2d5]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-[#f4efe6]">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-[#f4efe6] text-slate-700 hover:bg-[#e8e2d5] hover:text-blue-600 transition-colors"
                        aria-label="GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-blue-600 text-white font-medium text-xs hover:bg-blue-700 shadow-sm transition-all"
                      >
                        <span>Demo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </ScrollReveal>
          ))}
        </div>

      </div>

      {/* Project Details Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
