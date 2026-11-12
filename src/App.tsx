/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import { UserProfile, Project, SkillCategory, EducationItem, ResumeInfo } from './types';
import { initialProfile, initialProjects, initialSkills, initialEducation, initialResume } from './data/initialData';

import ScrollProgress from './components/ScrollProgress';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ResumeModal from './components/ResumeModal';

import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import ManageProjects from './admin/ManageProjects';
import ManageResume from './admin/ManageResume';
import ManageProfile from './admin/ManageProfile';
import ManageSkills from './admin/ManageSkills';
import ManageEducation from './admin/ManageEducation';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [adminTab, setAdminTab] = useState('dashboard');

  // Portfolio Data State with localStorage caching for instant UI rendering
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const cached = localStorage.getItem('portfolio_profile');
      return cached ? JSON.parse(cached) : initialProfile;
    } catch {
      return initialProfile;
    }
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const cached = localStorage.getItem('portfolio_projects');
      return cached ? JSON.parse(cached) : initialProjects;
    } catch {
      return initialProjects;
    }
  });

  const [skills, setSkills] = useState<SkillCategory[]>(() => {
    try {
      const cached = localStorage.getItem('portfolio_skills');
      return cached ? JSON.parse(cached) : initialSkills;
    } catch {
      return initialSkills;
    }
  });

  const [education, setEducation] = useState<EducationItem[]>(() => {
    try {
      const cached = localStorage.getItem('portfolio_education');
      return cached ? JSON.parse(cached) : initialEducation;
    } catch {
      return initialEducation;
    }
  });

  const [resumeInfo, setResumeInfo] = useState<ResumeInfo>(() => {
    try {
      const cached = localStorage.getItem('portfolio_resume');
      return cached ? JSON.parse(cached) : initialResume;
    } catch {
      return initialResume;
    }
  });

  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  // Check URL path or hash for admin route
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#admin') {
        setIsAdminRoute(true);
      } else {
        setIsAdminRoute(false);
      }
    };
    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  // Listen to Firebase Auth with safety timeout
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setAuthChecking(false);
    }, 2000);

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        clearTimeout(safetyTimer);
        setUser(currentUser);
        setAuthChecking(false);
      },
      (error) => {
        clearTimeout(safetyTimer);
        console.warn('Auth state check error:', error);
        setAuthChecking(false);
      }
    );
    return () => {
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  // Fetch data from Firestore and update localStorage cache
  const fetchData = async () => {
    try {
      // Fetch Profile
      const profileSnap = await getDoc(doc(db, 'siteSettings', 'profile'));
      if (profileSnap.exists()) {
        const data = profileSnap.data() as UserProfile;
        setProfile(data);
        localStorage.setItem('portfolio_profile', JSON.stringify(data));
      }

      // Fetch Projects
      const projSnap = await getDocs(collection(db, 'projects'));
      const initSnap = await getDoc(doc(db, 'siteSettings', 'initialized'));
      if (!projSnap.empty) {
        const loadedProjects: Project[] = [];
        projSnap.forEach((doc) => {
          loadedProjects.push({ id: doc.id, ...doc.data() } as Project);
        });
        loadedProjects.sort((a, b) => (a.order || 0) - (b.order || 0));
        setProjects(loadedProjects);
        localStorage.setItem('portfolio_projects', JSON.stringify(loadedProjects));
      } else if (initSnap.exists()) {
        setProjects([]);
        localStorage.setItem('portfolio_projects', JSON.stringify([]));
      }

      // Fetch Skills
      const skillsSnap = await getDoc(doc(db, 'siteSettings', 'skills'));
      if (skillsSnap.exists() && skillsSnap.data().categories) {
        const categories = skillsSnap.data().categories as SkillCategory[];
        setSkills(categories);
        localStorage.setItem('portfolio_skills', JSON.stringify(categories));
      }

      // Fetch Education
      const eduSnap = await getDoc(doc(db, 'siteSettings', 'education'));
      if (eduSnap.exists() && eduSnap.data().items) {
        const items = eduSnap.data().items as EducationItem[];
        setEducation(items);
        localStorage.setItem('portfolio_education', JSON.stringify(items));
      }

      // Fetch Resume
      const resumeSnap = await getDoc(doc(db, 'siteSettings', 'resume'));
      if (resumeSnap.exists()) {
        const resData = resumeSnap.data() as ResumeInfo;
        setResumeInfo(resData);
        localStorage.setItem('portfolio_resume', JSON.stringify(resData));
      }
    } catch (err) {
      console.warn('Using cached or fallback data due to Firestore connection state:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center text-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          <span className="text-sm font-medium text-slate-600">Loading Portfolio...</span>
        </div>
      </div>
    );
  }

  // Check strict administrator authorization
  const AUTHORIZED_ADMIN_EMAIL = 'prashantgupta9258@gmail.com';
  const hasAdminSession = sessionStorage.getItem('admin_authenticated_email')?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();
  const isAuthorizedAdmin = Boolean(
    hasAdminSession || (user && user.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase())
  );

  // Render Admin View
  if (isAdminRoute) {
    if (!isAuthorizedAdmin) {
      return (
        <AdminLogin
          currentUserEmail={user?.email || null}
          onSuccess={() => {
            setUser(auth.currentUser);
            setIsAdminRoute(true);
          }}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onTabChange={(tab) => setAdminTab(tab)}
        onLogout={async () => {
          try {
            await auth.signOut();
          } catch {}
          sessionStorage.removeItem('admin_authenticated_email');
          sessionStorage.removeItem('admin_authenticated_at');
          setUser(null);
          setIsAdminRoute(false);
          window.location.hash = '';
        }}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard
            projects={projects}
            profile={profile}
            resumeInfo={resumeInfo}
            onNavigate={(tab) => setAdminTab(tab)}
          />
        )}
        {adminTab === 'projects' && (
          <ManageProjects projects={projects} onRefresh={fetchData} initialMode="list" />
        )}
        {adminTab === 'add-project' && (
          <ManageProjects projects={projects} onRefresh={fetchData} initialMode="add" />
        )}
        {adminTab === 'resume' && (
          <ManageResume resumeInfo={resumeInfo} onRefresh={fetchData} />
        )}
        {adminTab === 'profile' && (
          <ManageProfile profile={profile} onRefresh={fetchData} />
        )}
        {adminTab === 'skills' && (
          <ManageSkills skills={skills} onRefresh={fetchData} />
        )}
        {adminTab === 'education' && (
          <ManageEducation education={education} onRefresh={fetchData} />
        )}
      </AdminLayout>
    );
  }

  // Render Public Portfolio View with Cream Theme
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      <ScrollProgress />
      <Navbar profile={profile} onOpenResume={() => setIsResumeModalOpen(true)} />
      <main className="relative w-full overflow-hidden">
        <Hero profile={profile} onOpenResume={() => setIsResumeModalOpen(true)} />
        <About profile={profile} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Experience />
        <Education education={education} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        profile={profile}
        skills={skills}
        education={education}
        resumeInfo={resumeInfo}
      />
    </div>
  );
}
