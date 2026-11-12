/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutDashboard, FolderKanban, FileText, User, Award, GraduationCap, LogOut, Menu, X } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

interface AdminLayoutProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function AdminLayout({ currentTab, onTabChange, onLogout, children }: AdminLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Manage Projects', icon: FolderKanban },
    { id: 'resume', label: 'Manage Resume', icon: FileText },
    { id: 'profile', label: 'Manage Profile', icon: User },
    { id: 'skills', label: 'Manage Skills', icon: Award },
    { id: 'education', label: 'Manage Education', icon: GraduationCap },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex">
      {/* Sidebar for Desktop - Cream Theme */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-[#f4efe6] text-slate-800 border-r border-[#e8e2d5] shrink-0 overflow-hidden">
        <div className="p-5 border-b border-[#e8e2d5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-600/40 shadow-md bg-white shrink-0">
              <img
                src="/assets/aistudio/image_eb281061.png"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">Admin Portal</h2>
              <p className="text-xs text-slate-500">Portfolio CMS</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-700 hover:bg-[#e8e2d5] hover:text-blue-600'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#e8e2d5] shrink-0 flex flex-col gap-2">
          <div className="px-3 py-2 rounded-xl bg-[#fffefb] border border-[#e8e2d5] flex flex-col">
            <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Authorized Admin</span>
            <span className="text-xs font-mono text-slate-700 truncate" title="prashantgupta9258@gmail.com">
              prashantgupta9258@gmail.com
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header - Cream Theme */}
        <header className="bg-[#fffefb] border-b border-[#e8e2d5] h-16 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-[#f4efe6]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-900 capitalize">
              {currentTab.replace('-', ' ')}
            </h1>
          </div>
        </header>

        {/* Mobile Sidebar Modal */}
        {isMobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex">
            <div className="w-72 bg-[#f4efe6] text-slate-900 h-full flex flex-col p-6 shadow-2xl border-r border-[#e8e2d5]">
              <div className="flex items-center justify-between pb-6 border-b border-[#e8e2d5]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-blue-600/40 shadow-sm bg-white shrink-0">
                    <img
                      src="/assets/aistudio/image_eb281061.png"
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-bold text-lg text-slate-900">Admin Portal</span>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 py-6 flex flex-col gap-1.5 overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-700 hover:bg-[#e8e2d5]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
            <div className="flex-1" onClick={() => setIsMobileSidebarOpen(false)} />
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
