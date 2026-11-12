/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, Award, CheckCircle2, X } from 'lucide-react';
import { SkillCategory } from '../types';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

interface ManageSkillsProps {
  skills: SkillCategory[];
  onRefresh: () => void;
}

export default function ManageSkills({ skills, onRefresh }: ManageSkillsProps) {
  const [skillsList, setSkillsList] = useState<SkillCategory[]>(skills);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleAddCategory = () => {
    const newCat: SkillCategory = {
      id: `cat-${Date.now()}`,
      category: 'New Category',
      iconName: 'Code',
      skills: [{ name: 'Skill Name', level: 'Advanced', description: 'Description' }]
    };
    setSkillsList([...skillsList, newCat]);
  };

  const handleDeleteCategory = (index: number) => {
    const updated = [...skillsList];
    updated.splice(index, 1);
    setSkillsList(updated);
  };

  const handleAddSkillToCat = (catIndex: number) => {
    const updated = [...skillsList];
    updated[catIndex].skills.push({ name: 'New Skill', level: 'Intermediate', description: 'Skill description' });
    setSkillsList(updated);
  };

  const handleDeleteSkill = (catIndex: number, skillIndex: number) => {
    const updated = [...skillsList];
    updated[catIndex].skills.splice(skillIndex, 1);
    setSkillsList(updated);
  };

  const handleSaveAll = async () => {
    setError('');
    setSaving(true);
    setSuccess(false);

    try {
      await setDoc(doc(db, 'siteSettings', 'skills'), { categories: skillsList });
      localStorage.setItem('portfolio_skills', JSON.stringify(skillsList));
      setSaving(false);
      setSuccess(true);
      onRefresh();
    } catch (err: any) {
      setSaving(false);
      setError(err.message || 'Failed to save skills.');
      handleFirestoreError(err, OperationType.WRITE, 'siteSettings/skills');
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Manage Skills & Categories</h2>
          <p className="text-sm text-slate-500">Organize and edit your technical skill categories and competencies.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddCategory}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
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
          <span>Skills successfully updated!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-6">
        {skillsList.map((cat, catIdx) => (
          <div key={cat.id || catIdx} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <input
                type="text"
                value={cat.category}
                onChange={(e) => {
                  const updated = [...skillsList];
                  updated[catIdx].category = e.target.value;
                  setSkillsList(updated);
                }}
                className="text-lg font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-none px-1 py-0.5"
              />
              <button
                onClick={() => handleDeleteCategory(catIdx)}
                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                title="Delete Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {cat.skills?.map((skill, skillIdx) => (
                <div key={skillIdx} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => {
                        const updated = [...skillsList];
                        updated[catIdx].skills[skillIdx].name = e.target.value;
                        setSkillsList(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:border-blue-600"
                      placeholder="Skill Name"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      value={skill.level}
                      onChange={(e) => {
                        const updated = [...skillsList];
                        updated[catIdx].skills[skillIdx].level = e.target.value;
                        setSkillsList(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-600"
                      placeholder="Level (e.g. Advanced)"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      value={skill.description}
                      onChange={(e) => {
                        const updated = [...skillsList];
                        updated[catIdx].skills[skillIdx].description = e.target.value;
                        setSkillsList(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600"
                      placeholder="Description"
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      onClick={() => handleDeleteSkill(catIdx, skillIdx)}
                      className="p-2 rounded-lg text-rose-500 hover:bg-rose-100 transition-colors"
                      title="Remove Skill"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => handleAddSkillToCat(catIdx)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-slate-300 text-slate-600 hover:border-blue-600 hover:text-blue-600 text-xs font-semibold transition-colors mt-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
