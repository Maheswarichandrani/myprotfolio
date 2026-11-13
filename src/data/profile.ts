export const PROFILE = {
  fullName: "Chandrani Maheswari",
  role: "Full Stack Developer",
  tagline: "Building products that create real value",
  year: "2026",
};

/** Contact page details. */
export const CONTACT = {
  email: "chandranimaheswari13@gmail.com",
  location: "India · IST (UTC+5:30)",
  availability: "Open to full-time roles & freelance projects",
  /** Photo on the ID card — drop an image in /public and set e.g. "/chandrani.jpg". Empty = initials. */
  photo: "/protfolio-image.jpeg",
  resume: "https://drive.google.com/file/d/10Hk_oyprPmj1jz1Oxei6lMIVevbU7Ol4/view?usp=drive_link",
};

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/Maheswarichandrani" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/chandrani-maheswari-70a034290/" },
  { label: "LeetCode", href: "https://leetcode.com/u/Maheswarichandrani/" },
  { label: "Email", href: "mailto:chandranimaheswari13@gmail.com" },
];

export type Project = {
  title: string;
  category: string;
  description: string;
  role: string;
  /** small badge on the book page, e.g. "Client Project" */
  kind: string;
  /** shorter category for the badge, e.g. "E-commerce Platform" */
  domain: string;
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
    category: "CREATOR ECONOMY PLATFORM",
    description:
      "Monetization ecosystem empowering creators through 1:1 mentorship, sessions, digital products, and community interactions.",
    role: "Frontend Engineer & Product Builder",
    kind: "Flagship Product",
    domain: "Creator Economy",
    // TODO(chandrani): review — drafted from the project description
    contributions: [
      "Built the creator and learner experiences with Next.js and TypeScript.",
      "Developed mentorship sessions, digital products and community flows.",
      "Integrated Better Auth for sign-in and TanStack Query for data fetching.",
      "Shaped product decisions with the team, from wireframes to release.",
    ],
    tech: ["Next.js", "NestJS", "TypeScript", "TanStack Query", "Better Auth", "PostgreSQL"],
    status: "Currently Building",
    highlight: "Flagship Product",
    link: "https://creonex-beta.vercel.app",
    image: "/creonex.png",
  },
  {
    title: "Nala Armoire",
    category: "FASHION E-COMMERCE",
    description:
      "A full-fledged e-commerce platform for an ethnic wear brand, delivering a seamless shopping experience from product discovery to secure checkout.",
    role: "Full Stack Developer",
    kind: "Client Project",
    domain: "E-commerce Platform",
    contributions: [
      "Designed and developed the complete frontend using Next.js and Tailwind CSS.",
      "Integrated APIs and connected with the backend.",
      "Implemented secure payments using Razorpay.",
      "Focused on performance, responsiveness, and clean UI.",
    ],
    tech: ["Next.js", "Tailwind CSS", "Sanity", "Razorpay"],
    status: "Live",
    link: "https://nalaarmoire.com",
    image: "/nala-armoire.png",
  },
  {
    title: "TreeKart",
    category: "AGRI COMMERCE PLATFORM",
    description:
      "E-commerce & rental platform enabling customers to order farm-fresh mangoes online or rent trees for seasonal harvest.",
    role: "Full Stack Developer",
    kind: "Client Project",
    domain: "Agri Commerce",
    // TODO(chandrani): review — drafted from the project description
    contributions: [
      "Built the storefront and tree-rental flows with Next.js and Tailwind CSS.",
      "Designed responsive product, cart and checkout experiences.",
      "Connected the frontend to backend APIs for orders and rentals.",
      "Optimised images and pages for fast, mobile-first browsing.",
    ],
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    status: "Live",
    link: "https://treekart.in",
    image: "/treekart.png",
  },
];

export type AcademicProject = {
  name: string;
  category: string;
  tagline: string;
  description: string;
  achievement: string;
  isWinner?: boolean;
  bgGradient: string;
  tech: string[];
  github?: string;
  link?: string;
  image: string;
  keyMetric?: string;
};

export const ACADEMIC_PROJECTS: AcademicProject[] = [
  {
    name: "HealVerse",
    category: "AI + Healthcare Ecosystem",
    tagline: "AI Healthcare Ecosystem",
    description:
      "AI-driven healthcare platform automating patient triage and clinical diagnostics with a mobile-first stack.",
    achievement: "1st Prize Winner · Vedic Vision Hackathon",
    isWinner: true,
    bgGradient: "from-[#2e2017] via-[#211710] to-[#17100c]",
    keyMetric: "Cross-Platform Diagnostics",
    tech: ["React Native", "Spring Boot", "Java", "AI/ML"],
    github: "https://github.com/Ashok-Dd/healverse.git",
    image: "/healverse.png",
  },
  {
    name: "DeepNox",
    category: "AI + Media Security",
    tagline: "AI Deepfake Detection System",
    description:
      "AI-powered deepfake detection extension analyzing synthetic media across social platforms in real time.",
    achievement: "5th Prize Winner · Prajwalan Hackathon",
    isWinner: true,
    bgGradient: "from-[#33231a] via-[#241811] to-[#17100c]",
    keyMetric: "Multi-Modal AI Inference",
    tech: ["React", "TypeScript", "Node.js", "Python"],
    github: "https://github.com/Srikar132/deep-nox.git",
    image: "/deepnox.png",
  },
  {
    name: "InfraInk",
    category: "Developer Blogging Platform",
    tagline: "Developer Knowledge Platform",
    description:
      "High-performance technical blogging platform engineered for headless CMS content delivery and real-time sync.",
    achievement: "Full Stack Academic Project",
    isWinner: false,
    bgGradient: "from-[#2a1f16] via-[#1f1610] to-[#17100c]",
    keyMetric: "Headless CMS & Real-Time Sync",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Sanity"],
    link: "https://infraink.vercel.app/",
    image: "/infraink.png",
  },
];

export type AboutSlide = {
  label: string;
  title: string;
  body: string;
  tags: string[];
  /** swap in a real image path later; gradient placeholder renders when undefined */
  image?: string;
  /** optional live link rendered as a "View Live" action */
  link?: { label: string; href: string };
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
    image: "/infyclasses.png",
    link: { label: "InfyClasses.com", href: "https://infyclasses.com" },
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
    image: "/leetcode.png",
  },
];
