/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Send, Github, Linkedin, MapPin, CheckCircle2, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import ScrollReveal from './ScrollReveal';

interface ContactProps {
  profile: UserProfile;
}

export default function Contact({ profile }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-[#fffefb] to-[#f4efe6] border-t border-[#e8e2d5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={50}>
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4efe6] text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get In Touch</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Let's Build Something Amazing Together
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mt-3">
              Have an exciting project opportunity, technical question, or want to connect? Drop me a message below or reach out directly.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Info Column - Cream Theme */}
          <div className="lg:col-span-5">
            <ScrollReveal direction="right" delay={100}>
              <div className="bg-[#f4efe6] rounded-3xl p-8 border border-[#e8e2d5] shadow-sm flex flex-col gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Contact Information</h3>
                  <p className="text-slate-600 text-sm mt-1">Fill out the form or reach out directly via email or socials.</p>
                </div>

                <div className="flex flex-col gap-4 text-sm">
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#fffefb] border border-[#e8e2d5] hover:bg-white transition-colors group shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-medium">Email Me</div>
                        <div className="font-semibold text-slate-900">{profile.email}</div>
                      </div>
                    </a>
                  )}

                  {profile.location && (
                    <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#fffefb] border border-[#e8e2d5] shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-medium">Location</div>
                        <div className="font-semibold text-slate-900">{profile.location}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#e8e2d5]">
                  {profile.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[#fffefb] border border-[#e8e2d5] text-slate-700 hover:text-blue-600 hover:bg-white transition-colors shadow-sm"
                      aria-label="GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {profile.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[#fffefb] border border-[#e8e2d5] text-slate-700 hover:text-blue-600 hover:bg-white transition-colors shadow-sm"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>

              </div>
            </div>
            </ScrollReveal>
          </div>

          {/* Right Contact Form */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="left" delay={150}>
              <div className="bg-[#fffefb] rounded-3xl p-8 sm:p-10 border border-[#e8e2d5] shadow-sm">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Message Sent Successfully!</h3>
                  <p className="text-slate-600 max-w-md text-sm">
                    Thank you for reaching out. I have received your message and will get back to you at <span className="font-semibold text-slate-900">{profile.email}</span> shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {error && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Your Name *</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="px-4 py-3 rounded-xl bg-[#fdfbf7] border border-[#e8e2d5] text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Your Email *</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="px-4 py-3 rounded-xl bg-[#fdfbf7] border border-[#e8e2d5] text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Subject</label>
                    <input
                      type="text"
                      placeholder="Project Collaboration / Job Opportunity"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="px-4 py-3 rounded-xl bg-[#fdfbf7] border border-[#e8e2d5] text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Message *</label>
                    <textarea
                      rows={5}
                      placeholder="Hello, I would like to discuss..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="px-4 py-3 rounded-xl bg-[#fdfbf7] border border-[#e8e2d5] text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white font-semibold text-sm bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
}
