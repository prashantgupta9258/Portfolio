/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, GraduationCap, CheckCircle2 } from 'lucide-react';
import { EducationItem } from '../types';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

interface ManageEducationProps {
  education: EducationItem[];
  onRefresh: () => void;
}

export default function ManageEducation({ education, onRefresh }: ManageEducationProps) {
  const [eduList, setEduList] = useState<EducationItem[]>(education);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      degree: 'Degree Title',
      institution: 'Institution Name',
      period: '2021 - 2025',
      location: 'City, Country',
      grade: 'Distinction',
      highlights: ['Key coursework or achievement']
    };
    setEduList([...eduList, newEdu]);
  };

  const handleDelete = (index: number) => {
    const updated = [...eduList];
    updated.splice(index, 1);
    setEduList(updated);
  };

  const handleSaveAll = async () => {
    setError('');
    setSaving(true);
    setSuccess(false);

    try {
      await setDoc(doc(db, 'siteSettings', 'education'), { items: eduList });
      localStorage.setItem('portfolio_education', JSON.stringify(eduList));
      setSaving(false);
      setSuccess(true);
      onRefresh();
    } catch (err: any) {
      setSaving(false);
      setError(err.message || 'Failed to save education.');
      handleFirestoreError(err, OperationType.WRITE, 'siteSettings/education');
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Manage Education</h2>
          <p className="text-sm text-slate-500">Add or edit your educational qualifications and academic achievements.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Education</span>
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/25 transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Education successfully updated!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-6">
        {eduList.map((edu, idx) => (
          <div key={edu.id || idx} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="font-bold text-slate-900">Education #{idx + 1}</span>
              </div>
              <button
                onClick={() => handleDelete(idx)}
                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                title="Delete Education"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Degree Title</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => {
                    const updated = [...eduList];
                    updated[idx].degree = e.target.value;
                    setEduList(updated);
                  }}
                  className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Institution</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => {
                    const updated = [...eduList];
                    updated[idx].institution = e.target.value;
                    setEduList(updated);
                  }}
                  className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Period</label>
                <input
                  type="text"
                  value={edu.period}
                  onChange={(e) => {
                    const updated = [...eduList];
                    updated[idx].period = e.target.value;
                    setEduList(updated);
                  }}
                  className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Location</label>
                <input
                  type="text"
                  value={edu.location}
                  onChange={(e) => {
                    const updated = [...eduList];
                    updated[idx].location = e.target.value;
                    setEduList(updated);
                  }}
                  className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">Grade / Standing</label>
                <input
                  type="text"
                  value={edu.grade}
                  onChange={(e) => {
                    const updated = [...eduList];
                    updated[idx].grade = e.target.value;
                    setEduList(updated);
                  }}
                  className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
