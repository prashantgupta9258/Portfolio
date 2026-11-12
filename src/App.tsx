/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
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
  const [adminSessionEmail, setAdminSessionEmail] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('admin_authenticated_email');
    } catch {
      return null;
    }
  });

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

  // Check URL path or hash for admin route and clean any legacy redirect query params
  useEffect(() => {
    const checkRoute = () => {
      const rawPath = window.location.pathname || '';
      const rawSearch = window.location.search || '';
      const rawHash = window.location.hash || '';

      const path = rawPath.toLowerCase().replace(/\/+$/, '');
      const hash = rawHash.toLowerCase().replace(/\/+$/, '');
      const search = rawSearch.toLowerCase();

      const isAdmin =
        path === '/admin' ||
        path.endsWith('/admin') ||
        path.includes('/admin/') ||
        hash === '#admin' ||
        hash === '#/admin' ||
        search.includes('admin');

      // Clean up any malformed '?/&/~and~' query strings if present
      if (rawSearch.includes('~and~') || rawSearch.startsWith('?/') || rawSearch.includes('/and/')) {
        const cleanUrl = isAdmin ? '/admin' : '/';
        window.history.replaceState(null, '', cleanUrl);
      }

      setIsAdminRoute(isAdmin);
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

  // Helper to reassemble chunked resume from Firestore if needed
  const resolveResumeData = async (raw: any): Promise<ResumeInfo> => {
    if (raw && raw.url === 'CHUNKED' && typeof raw.chunkCount === 'number' && raw.chunkCount > 0) {
      const chunkPromises = [];
      for (let i = 0; i < raw.chunkCount; i++) {
        chunkPromises.push(getDoc(doc(db, 'siteSettings', `resume_chunk_${i}`)));
      }
      const chunkSnaps = await Promise.all(chunkPromises);
      const fullUrl = chunkSnaps
        .map((snap) => (snap.exists() ? (snap.data().data as string) || '' : ''))
        .join('');
      return {
        url: fullUrl,
        fileName: raw.fileName || 'Resume.pdf',
        updatedAt: raw.updatedAt || ''
      };
    }
    return {
      url: raw?.url || '',
      fileName: raw?.fileName || '',
      updatedAt: raw?.updatedAt || ''
    };
  };

  // Fetch data from Firestore with isolated try/catch blocks per collection
  // and sync any locally trapped admin uploads to Firestore
  const fetchData = useCallback(async () => {
    // 1. Fetch Profile
    try {
      const profileSnap = await getDoc(doc(db, 'siteSettings', 'profile'));
      if (profileSnap.exists()) {
        const data = profileSnap.data() as UserProfile;
        setProfile(data);
        localStorage.setItem('portfolio_profile', JSON.stringify(data));
      } else {
        const localProfile = localStorage.getItem('portfolio_profile');
        if (localProfile && localProfile !== JSON.stringify(initialProfile)) {
          try {
            await setDoc(doc(db, 'siteSettings', 'profile'), JSON.parse(localProfile));
          } catch {}
        }
      }
    } catch (err) {
      console.warn('Profile fetch error:', err);
    }

    // 2. Fetch Projects
    try {
      const [projSnap, initSnap] = await Promise.all([
        getDocs(collection(db, 'projects')),
        getDoc(doc(db, 'siteSettings', 'initialized'))
      ]);
      if (!projSnap.empty) {
        const loadedProjects: Project[] = [];
        projSnap.forEach((d) => {
          loadedProjects.push({ id: d.id, ...d.data() } as Project);
        });
        loadedProjects.sort((a, b) => (a.order || 0) - (b.order || 0));
        setProjects(loadedProjects);
        localStorage.setItem('portfolio_projects', JSON.stringify(loadedProjects));
      } else if (initSnap.exists()) {
        setProjects([]);
        localStorage.setItem('portfolio_projects', JSON.stringify([]));
      } else {
        // If Firestore has no projects yet, check if admin has custom projects cached in localStorage
        const localProjsRaw = localStorage.getItem('portfolio_projects');
        if (localProjsRaw && localProjsRaw !== JSON.stringify(initialProjects)) {
          try {
            const localProjs = JSON.parse(localProjsRaw) as Project[];
            if (Array.isArray(localProjs) && localProjs.length > 0) {
              for (const p of localProjs) {
                const { id, ...rest } = p;
                await setDoc(doc(db, 'projects', id || `proj_${Date.now()}`), {
                  ...rest,
                  status: rest.status || 'published',
                  updatedAt: serverTimestamp()
                });
              }
            }
          } catch {}
        }
      }
    } catch (err) {
      console.warn('Projects fetch error:', err);
    }

    // 3. Fetch Skills
    try {
      const skillsSnap = await getDoc(doc(db, 'siteSettings', 'skills'));
      if (skillsSnap.exists() && skillsSnap.data().categories) {
        const categories = skillsSnap.data().categories as SkillCategory[];
        setSkills(categories);
        localStorage.setItem('portfolio_skills', JSON.stringify(categories));
      } else {
        const localSkills = localStorage.getItem('portfolio_skills');
        if (localSkills && localSkills !== JSON.stringify(initialSkills)) {
          try {
            await setDoc(doc(db, 'siteSettings', 'skills'), { categories: JSON.parse(localSkills) });
          } catch {}
        }
      }
    } catch (err) {
      console.warn('Skills fetch error:', err);
    }

    // 4. Fetch Education
    try {
      const eduSnap = await getDoc(doc(db, 'siteSettings', 'education'));
      if (eduSnap.exists() && eduSnap.data().items) {
        const items = eduSnap.data().items as EducationItem[];
        setEducation(items);
        localStorage.setItem('portfolio_education', JSON.stringify(items));
      } else {
        const localEdu = localStorage.getItem('portfolio_education');
        if (localEdu && localEdu !== JSON.stringify(initialEducation)) {
          try {
            await setDoc(doc(db, 'siteSettings', 'education'), { items: JSON.parse(localEdu) });
          } catch {}
        }
      }
    } catch (err) {
      console.warn('Education fetch error:', err);
    }

    // 5. Fetch Resume
    try {
      const resumeSnap = await getDoc(doc(db, 'siteSettings', 'resume'));
      if (resumeSnap.exists()) {
        const resData = await resolveResumeData(resumeSnap.data());
        setResumeInfo(resData);
        localStorage.setItem('portfolio_resume', JSON.stringify(resData));
      } else {
        // Sync locally cached resume to cloud if present
        const localResumeRaw = localStorage.getItem('portfolio_resume');
        if (localResumeRaw && localResumeRaw !== JSON.stringify(initialResume)) {
          try {
            const localResume = JSON.parse(localResumeRaw) as ResumeInfo;
            if (localResume && localResume.url && localResume.url !== '#') {
              const CHUNK_SIZE = 650000;
              if (localResume.url.length > CHUNK_SIZE) {
                const chunks: string[] = [];
                for (let i = 0; i < localResume.url.length; i += CHUNK_SIZE) {
                  chunks.push(localResume.url.slice(i, i + CHUNK_SIZE));
                }
                for (let i = 0; i < chunks.length; i++) {
                  await setDoc(doc(db, 'siteSettings', `resume_chunk_${i}`), {
                    data: chunks[i],
                    index: i,
                    updatedAt: localResume.updatedAt || new Date().toISOString().split('T')[0]
                  });
                }
                await setDoc(doc(db, 'siteSettings', 'resume'), {
                  url: 'CHUNKED',
                  chunkCount: chunks.length,
                  fileName: localResume.fileName,
                  updatedAt: localResume.updatedAt
                });
              } else {
                await setDoc(doc(db, 'siteSettings', 'resume'), {
                  url: localResume.url,
                  chunkCount: 0,
                  fileName: localResume.fileName,
                  updatedAt: localResume.updatedAt
                });
              }
            }
          } catch {}
        }
      }
    } catch (err) {
      console.warn('Resume fetch error:', err);
    }
  }, []);

  // Initial fetch + Real-time Firestore listeners so all visitors see admin updates live
  useEffect(() => {
    fetchData();

    const unsubProjects = onSnapshot(
      collection(db, 'projects'),
      (snap) => {
        if (!snap.empty) {
          const loadedProjects: Project[] = [];
          snap.forEach((d) => {
            loadedProjects.push({ id: d.id, ...d.data() } as Project);
          });
          loadedProjects.sort((a, b) => (a.order || 0) - (b.order || 0));
          setProjects(loadedProjects);
          localStorage.setItem('portfolio_projects', JSON.stringify(loadedProjects));
        }
      },
      (err) => console.warn('Projects live listener error:', err)
    );

    const unsubSettings = onSnapshot(
      collection(db, 'siteSettings'),
      async (snap) => {
        snap.docChanges().forEach(async (change) => {
          const id = change.doc.id;
          const data = change.doc.data();
          if (id === 'profile' && data) {
            setProfile(data as UserProfile);
            localStorage.setItem('portfolio_profile', JSON.stringify(data));
          } else if (id === 'skills' && data?.categories) {
            setSkills(data.categories as SkillCategory[]);
            localStorage.setItem('portfolio_skills', JSON.stringify(data.categories));
          } else if (id === 'education' && data?.items) {
            setEducation(data.items as EducationItem[]);
            localStorage.setItem('portfolio_education', JSON.stringify(data.items));
          } else if (id === 'resume' && data) {
            try {
              const resolved = await resolveResumeData(data);
              setResumeInfo(resolved);
              localStorage.setItem('portfolio_resume', JSON.stringify(resolved));
            } catch {}
          }
        });
      },
      (err) => console.warn('SiteSettings live listener error:', err)
    );

    return () => {
      unsubProjects();
      unsubSettings();
    };
  }, [fetchData]);

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
  const currentSessionEmail = adminSessionEmail || sessionStorage.getItem('admin_authenticated_email');
  const hasAdminSession = currentSessionEmail?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();
  const isAuthorizedAdmin = Boolean(
    hasAdminSession || (user && user.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase())
  );

  const handleExitAdmin = () => {
    setIsAdminRoute(false);
    try {
      window.history.pushState(null, '', '/');
      window.location.hash = '';
    } catch {
      window.location.hash = '';
    }
  };

  // Render Admin View
  if (isAdminRoute) {
    if (!isAuthorizedAdmin) {
      return (
        <AdminLogin
          currentUserEmail={user?.email || null}
          onBack={handleExitAdmin}
          onSuccess={() => {
            setAdminSessionEmail(AUTHORIZED_ADMIN_EMAIL);
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
          setAdminSessionEmail(null);
          setUser(null);
          handleExitAdmin();
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
