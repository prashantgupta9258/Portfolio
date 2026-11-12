/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Code2, Github, Linkedin, Mail } from 'lucide-react';
import { UserProfile } from '../types';

interface FooterProps {
  profile: UserProfile;
}

export default function Footer({ profile }: FooterProps) {
  return (
    <footer className="bg-[#f4efe6] text-slate-700 py-12 border-t border-[#e8e2d5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-[#e8e2d5]">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-blue-600/40 shadow-md bg-white shrink-0">
              <img
                src="/assets/aistudio/image_eb281061.png"
                alt="Prashant Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-slate-900 font-bold text-lg">{profile.name}</span>
              <p className="text-xs text-slate-600">{profile.title}</p>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
            <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
            <a href="#skills" className="hover:text-blue-600 transition-colors">Skills</a>
            <a href="#projects" className="hover:text-blue-600 transition-colors">Projects</a>
            <a href="#experience" className="hover:text-blue-600 transition-colors">Experience</a>
            <a href="#education" className="hover:text-blue-600 transition-colors">Education</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#fffefb] border border-[#e8e2d5] text-slate-700 hover:text-blue-600 hover:bg-white transition-colors shadow-sm"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#fffefb] border border-[#e8e2d5] text-slate-700 hover:text-blue-600 hover:bg-white transition-colors shadow-sm"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="p-2.5 rounded-xl bg-[#fffefb] border border-[#e8e2d5] text-slate-700 hover:text-blue-600 hover:bg-white transition-colors shadow-sm"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>

        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <p>Built with React, Tailwind CSS, & Three.js WebGL.</p>
        </div>
      </div>
    </footer>
  );
}
