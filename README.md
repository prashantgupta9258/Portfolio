# Prashant Gupta | Developer Portfolio & Admin CMS

A high-performance modern developer portfolio and CMS built with React, TypeScript, Tailwind CSS, and Firebase. Features a light cream aesthetic, continuous scroll reveal animations, interactive project modal showcase, dynamic resume document viewer, and a secure private admin portal for real-time portfolio management.

---

## 📌 Project Descriptions (For GitHub & Vercel)

### 1. Short Description (For GitHub Repository "About" Section)
> **"Modern developer portfolio & real-time CMS built with React, TypeScript, Tailwind CSS, and Firebase. Features smooth sliding animations, project showcase modal, resume viewer, and secure admin portal."**

### 2. GitHub Topics / Tags
`react` `typescript` `tailwindcss` `firebase` `portfolio` `developer-portfolio` `cms` `vite` `vercel` `responsive-design` `admin-dashboard` `fullstack`

### 3. Comprehensive Project Overview (For Portfolio & Resume)
> "Developed a responsive personal portfolio and content management system for showcasing software engineering projects, technical competencies, and professional credentials. Architected using React 19, TypeScript, and Tailwind CSS with custom scroll-driven reveal animations, client-side image compression, and Firebase Firestore persistence. Includes a secure administrator portal protected with multi-tier role-based authentication, enabling instant updates to project archives, skills matrix, and uploaded resume documents without code redeployment."

---

## ✨ Key Features

- **Light Cream Aesthetic**: Custom color palette (`#fdfbf7`, `#f4efe6`, `#fffefb`) with typography and contrast.
- **Continuous Scroll & Sliding Animations**: Re-triggerable scroll reveal animations (`ScrollReveal`) utilizing `IntersectionObserver` that slide smoothly into view every time you scroll up or down.
- **Interactive Project Showcase**: Filterable project gallery with image inspection modal, technical tags, and live demo / source code links.
- **Dynamic Resume Document Viewer**: Built-in resume viewer supporting PDFs and images with in-modal fullscreen expand, zoom controls, and safe Base64 object URL downloads.
- **Secure Administrator CMS (`/admin`)**:
  - Protected with role-based authentication for `prashantgupta9258@gmail.com`.
  - Client-side image auto-compression (HTML5 canvas) reducing upload sizes by up to 90%.
  - Real-time updates for projects, skills, education, profile bio, and resume files.
- **Production-Ready Deployment**: Configured out of the box with `vercel.json` SPA rewrites and flexible environment variable fallbacks.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React Icons
- **Build System**: Vite 8, Node.js
- **Backend & Database**: Firebase Firestore, Firebase Authentication, Firebase Storage
- **Deployment Platform**: Vercel & GitHub

---

## 🚀 Quick Deployment Guide: GitHub & Vercel

### Step 1: Push Code to GitHub

1. Open your terminal in the project directory:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Prashant Gupta portfolio with Admin CMS"
   ```

2. Create a new repository on [GitHub](https://github.com/new).

3. Link and push to your GitHub repository:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git
   git push -u origin main
   ```

---

### Step 2: Deploy to Vercel

1. Log in to [Vercel](https://vercel.com) and click **"Add New Project"** -> **"Project"**.
2. Select your GitHub repository from the list and click **"Import"**.
3. Vercel automatically detects the build settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. *(Optional)* If you wish to set custom environment variables in Vercel (`Project Settings -> Environment Variables`), you can copy keys from `.env.example`.
5. Click **"Deploy"**. Your website will be live in under 1 minute with automatic SSL and continuous deployment on every Git push!

---

### Step 3: Enable GitHub Pages (Automated Zero-Config)

If you are using **GitHub Pages**:
1. On your GitHub repository page, go to **Settings** -> **Pages** (in the left sidebar).
2. Under **"Build and deployment"** -> **"Source"**, select **"GitHub Actions"**.
3. That's it! The repository already includes `.github/workflows/deploy.yml` which automatically builds and deploys your site whenever you push to `main` without white screens.

---

### 🔐 Admin Dashboard Access

- **Admin URL**: `https://your-domain.vercel.app/#admin` or `/admin`
- **Authorized Admin Email**: `prashantgupta9258@gmail.com`
- **Admin Password**: `7818066137@9258`

Only this authorized email and password can access the admin dashboard to manage projects, edit profile details, upload new resume documents, and update skills.

---

### 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
