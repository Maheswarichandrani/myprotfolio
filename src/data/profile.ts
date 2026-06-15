export const PROFILE = {
  fullName: "Chandrani Maheswari",
  role: "Full Stack Developer",
  tagline: "Building products that create real value",
  year: "2026",
};

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

// TODO: fill in real profile URLs
export const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "LeetCode", href: "https://leetcode.com/" },
  { label: "Email", href: "mailto:chandranimaheswari13@gmail.com" },
];

export type Project = {
  title: string;
  category: string;
  description: string;
  role: string;
  contributions?: string[];
  tech: string[];
  status: string;
  highlight?: string;
  link?: string;
  image: string;
};

export const PROJECTS: Project[] = [
  {
    title: "Creonex",
    category: "Creator Economy Platform",
    description:
      "A platform connecting creators and learners through mentorship, sessions, digital products, and meaningful interactions.",
    role: "Frontend Engineer & Product Builder",
    contributions: [
      "Production-grade frontend architecture",
      "Authentication flows",
      "TanStack Query integration",
      "Dashboard experiences",
      "Creator onboarding",
      "Responsive UI systems",
    ],
    tech: ["Next.js", "NestJS", "TypeScript", "TanStack Query", "Better Auth", "PostgreSQL"],
    status: "Currently Building",
    highlight: "Flagship Product",
    link: "#",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Nala Armoire",
    category: "Fashion E-Commerce",
    description:
      "A modern e-commerce platform built for fashion retail with a focus on user experience and performance.",
    role: "Full Stack Developer",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    status: "Live",
    link: "#",
    image: "/nala-armoire.png",
  },
  {
    title: "TreeKart",
    category: "Agri Commerce — Mangoes & Tree Rentals",
    description:
      "An e-commerce platform for a mango and tree-rental business — customers buy farm-fresh mangoes online or rent mango trees and receive the harvest each season.",
    role: "Full Stack Developer",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    status: "Live",
    link: "#",
    image: "/treekart.png",
  },
];

export type AcademicProject = {
  name: string;
  tagline: string;
  description: string;
  achievement: string;
  tech: string[];
  github?: string;
  image: string;
};

export const ACADEMIC_PROJECTS: AcademicProject[] = [
  {
    name: "DeepNox",
    tagline: "AI Deepfake Detection",
    description:
      "AI-powered deepfake detection browser extension that analyzes images, videos, and audio across social media platforms in real time.",
    achievement: "Hackathon Top 5 Winner",
    tech: ["React", "TypeScript", "Node.js", "Python"],
    github: "#",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "HealVerse",
    tagline: "AI Healthcare Ecosystem",
    description:
      "AI-driven healthcare platform connecting patients and care through intelligent diagnostics, built with a mobile-first cross-platform stack.",
    achievement: "Hackathon 1st Prize Winner",
    tech: ["React Native", "Spring Boot", "Java", "AI/ML"],
    github: "#",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=80",
  },
];

export type AboutSlide = {
  label: string;
  title: string;
  body: string;
  tags: string[];
  /** swap in a real image path later; gradient placeholder renders when undefined */
  image?: string;
};

export const ABOUT_SLIDES: AboutSlide[] = [
  {
    label: "Who I Am",
    title: "Engineer with a builder's mindset",
    body: "Final-year B.Tech CSE student at SRKR Engineering College and a Full Stack Developer passionate about building real-world products that solve meaningful problems.",
    tags: ["B.Tech CSE", "SRKR Engineering College", "Full Stack"],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80",
  },
  {
    label: "Experience",
    title: "Shipping in production at J33.ai",
    body: "Software Engineering Intern contributing to InfyClasses.com — frontend architecture, modern data-fetching patterns, and scalable application design. Freelancing on production-grade applications alongside.",
    tags: ["React", "Redux", "TanStack Query", "FastAPI", "Redis", "PostgreSQL"],
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=1000&q=80",
  },
  {
    label: "What I Build",
    title: "Products in the wild",
    body: "Currently building Creonex — a creator-learner ecosystem for monetizing expertise. Previously shipped TreeKart, Nala Armoire, DeepNox (AI deepfake detection), and HealVerse (AI healthcare).",
    tags: ["Next.js", "NestJS", "Better Auth", "PostgreSQL", "React Native"],
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80",
  },
  {
    label: "Beyond Code",
    title: "Sharpening the edge",
    body: "450+ LeetCode problems solved. 4+ hackathons with multiple prizes — 1st with HealVerse, 5th with DeepNox. Certified learning across ML, Deep Learning, and NLP. Seeking software engineering roles with impact.",
    tags: ["450+ LeetCode", "Hackathon Winner", "ML · DL · NLP"],
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1000&q=80",
  },
];
