/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, Project, SkillCategory, EducationItem, CertificationItem, ResumeInfo } from '../types';

export const initialProfile: UserProfile = {
  name: "Prashant Gupta",
  title: "Information Technology Student & Web Developer",
  email: "prashantgupta9258@gmail.com",
  phone: "+91 98765 43210",
  location: "Agra, Uttar Pradesh, India",
  about: "I am an Information Technology student interested in web development and practical software solutions. I enjoy creating responsive websites and working on projects that solve real-world problems. Through academic learning, personal projects, and hackathon participation, I am continuously developing my technical knowledge and problem-solving abilities.",
  bioSummary: "I am pursuing a Diploma in Information Technology at Dayalbagh Educational Institute (DEI), Polytechnic VIT. I enjoy building responsive websites, exploring modern web technologies, and developing practical software projects.",
  github: "https://github.com/prashantgupta9258",
  linkedin: "https://linkedin.com/in/prashant-gupta-dev",
  twitter: "https://twitter.com/prashant_dev",
  stats: [
    { label: "Course", value: "Diploma in IT" },
    { label: "Institution", value: "DEI, Polytechnic VIT" },
    { label: "Location", value: "Agra, UP" }
  ]
};

export const initialProjects: Project[] = [
  {
    id: "portfolio-website",
    title: "Personal Portfolio & Admin CMS",
    subtitle: "Responsive developer portfolio with Firebase backend",
    description: "A professional portfolio website featuring a light cream theme, responsive layout, dynamic project showcase, and a secure private admin dashboard for real-time content management.",
    detailedDescription: "Built a responsive portfolio website with HTML, CSS, JavaScript, and React. Features an integrated Firebase backend (Firestore and Authentication) allowing seamless project management, resume uploads, and profile updates directly from the private admin dashboard.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    additionalImages: [],
    tags: ["HTML", "CSS", "JavaScript", "React", "Firebase"],
    liveUrl: "https://github.com/prashantgupta9258/portfolio",
    githubUrl: "https://github.com/prashantgupta9258/portfolio",
    highlights: [
      "Responsive design optimized for desktop, tablet, and mobile viewports",
      "Secure admin dashboard protected with Firebase Authentication",
      "Dynamic content synchronization between Firestore and public portfolio"
    ],
    architecture: [
      "Frontend: React + Tailwind CSS with light cream theme",
      "Backend: Firebase Firestore and Firebase Storage",
      "Hosting: Cloud Run / Vercel"
    ],
    category: "Web Development",
    featured: true,
    order: 1,
    status: "published"
  },
  {
    id: "responsive-web-app",
    title: "Responsive Web Design Projects",
    subtitle: "Collection of practical web layouts and landing pages",
    description: "A series of responsive web layouts and landing pages built using modern HTML5, CSS3, and JavaScript, focusing on accessibility, clean typography, and mobile responsiveness.",
    detailedDescription: "Developed multiple responsive web projects as part of academic coursework and personal practice. Implemented CSS Grid, Flexbox, media queries, and interactive JavaScript UI components.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    additionalImages: [],
    tags: ["HTML", "CSS", "Responsive Web Design", "JavaScript"],
    liveUrl: "https://github.com/prashantgupta9258/web-projects",
    githubUrl: "https://github.com/prashantgupta9258/web-projects",
    highlights: [
      "Implemented mobile-first responsive layouts using CSS media queries",
      "Ensured clean semantic HTML markup and accessibility best practices",
      "Created interactive navigation menus and form validation scripts"
    ],
    architecture: [
      "Markup: Semantic HTML5",
      "Styling: CSS3 & Responsive Design",
      "Interactivity: Vanilla JavaScript"
    ],
    category: "Web Development",
    featured: true,
    order: 2,
    status: "published"
  }
];

export const initialSkills: SkillCategory[] = [
  {
    id: "sk-1",
    category: "Programming Languages",
    iconName: "Code",
    skills: [
      { name: "C", level: "Core", description: "Procedural programming, memory management, pointers, and fundamental syntax." },
      { name: "C++", level: "Basic", description: "Object-oriented programming concepts and basic data structures." },
      { name: "JavaScript", level: "Familiar", description: "DOM manipulation, event handling, and interactive web scripting." }
    ]
  },
  {
    id: "sk-2",
    category: "Web Development",
    iconName: "Layout",
    skills: [
      { name: "HTML", level: "Proficient", description: "Semantic markup, forms, tables, and document structure." },
      { name: "CSS", level: "Proficient", description: "Styling, Flexbox, Grid, and animations." },
      { name: "Responsive Web Design", level: "Proficient", description: "Media queries, mobile-first layouts, and cross-browser compatibility." },
      { name: "JavaScript", level: "Familiar", description: "Adding interactivity and dynamic behavior to web pages." }
    ]
  },
  {
    id: "sk-3",
    category: "Tools and Platforms",
    iconName: "Database",
    skills: [
      { name: "Firebase", level: "Familiar", description: "Authentication, Firestore database, and file storage." },
      { name: "Google AI Studio", level: "Familiar", description: "Prompt experimentation and development." },
      { name: "Vercel", level: "Familiar", description: "Web application deployment and hosting." },
      { name: "Netlify", level: "Familiar", description: "Static site hosting and deployment." },
      { name: "Git and GitHub", level: "Familiar", description: "Version control and repository management." }
    ]
  },
  {
    id: "sk-4",
    category: "Office and Productivity",
    iconName: "Briefcase",
    skills: [
      { name: "Microsoft Word", level: "Proficient", description: "Document formatting, reports, and academic papers." },
      { name: "Microsoft Excel", level: "Proficient", description: "Spreadsheets, data organization, and basic formulas." },
      { name: "Data Entry", level: "Proficient", description: "Accurate information recording and database entry." },
      { name: "File Management", level: "Proficient", description: "Directory organization and digital asset management." },
      { name: "Document Handling", level: "Proficient", description: "Scanning, converting, and archiving documents." },
      { name: "Internet Research", level: "Proficient", description: "Gathering, verifying, and synthesizing online information." }
    ]
  }
];

export const initialEducation: EducationItem[] = [
  {
    id: "edu-1",
    degree: "Diploma in Information Technology (Currently Pursuing)",
    institution: "Dayalbagh Educational Institute (DEI), Polytechnic VIT",
    period: "Pursuing",
    location: "Agra, Uttar Pradesh, India",
    grade: "Academic Study",
    highlights: [
      "Core coursework in Information Technology, computer fundamentals, programming, and web technologies.",
      "Engaged in practical software projects, web design assignments, and technical lab work."
    ]
  }
];

export const experienceData = [
  {
    id: "exp-1",
    role: "Academic & Personal Projects",
    company: "Dayalbagh Educational Institute (DEI)",
    period: "Ongoing",
    location: "Agra, Uttar Pradesh, India",
    description: [
      "Developed responsive web applications and landing pages as part of academic learning and personal practice.",
      "Gained hands-on experience with HTML, CSS, JavaScript, version control (Git/GitHub), and deployment platforms.",
      "Actively exploring software development principles, responsive design, and practical database tools."
    ],
    technologies: ["HTML", "CSS", "JavaScript", "Git", "GitHub"]
  }
];

export const certificationsData: CertificationItem[] = [];

export const initialResume: ResumeInfo = {
  url: "",
  fileName: "No resume uploaded yet",
  updatedAt: ""
};
