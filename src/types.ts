export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  detailedDescription: string;
  image: string;
  additionalImages?: string[];
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  highlights: string[];
  architecture: string[];
  category: string;
  featured: boolean;
  order: number;
  status: 'published' | 'draft';
  createdAt?: any;
  updatedAt?: any;
}

export interface SkillItem {
  name: string;
  level: string;
  description: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  iconName: string;
  skills: SkillItem[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string[];
  technologies: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  location: string;
  grade: string;
  highlights: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  verificationUrl: string;
}

export interface UserProfile {
  name: string;
  title: string;
  email: string;
  phone?: string;
  location: string;
  about: string;
  bioSummary: string;
  github: string;
  linkedin: string;
  twitter: string;
  stats: {
    label: string;
    value: string;
  }[];
}

export interface ResumeInfo {
  url: string;
  fileName: string;
  updatedAt: string;
}
