export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: "frontend" | "backend" | "fullstack";
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description:
      "A full-featured e-commerce platform with cart functionality, payment integration, and admin dashboard. Built with modern technologies for optimal performance.",
    image: "/projects/ecommerce.png",
    category: "fullstack",
    techStack: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Tailwind CSS"],
    githubUrl: "https://github.com/ucdexpert/e-commerce ",
    liveUrl: "https://e-commerce-mu-wheat-87.vercel.app/",
  },
  {
    id: 2,
    title: "Task Management App",
    description:
      "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
    image: "/projects/taskapp.png",
    category: "frontend",
    techStack: ["React", "TypeScript", "Framer Motion", "Zustand", "Tailwind CSS"],
    githubUrl: "https://github.com/ucdexpert/final-repo-phase-3",
    liveUrl: "https://auto-task-manager.vercel.app/dashboard ",
  },
  {
    id: 3,
    title: "REST API Service",
    description:
      "A robust RESTful API service with authentication, rate limiting, and comprehensive documentation. Designed for scalability and security.",
    image: "/projects/api.png",
    category: "backend",
    techStack: ["Node.js", "Express", "MongoDB", "JWT", "Swagger"],
    githubUrl: "https://github.com/ucdexpert/",
    liveUrl: "https://api-docs-demo.vercel.app",
  },
  {
    id: 4,
    title: "Portfolio Website",
    description:
      "A modern, responsive portfolio website with smooth animations, dark mode support, and optimized performance for showcasing creative work.",
    image: "/projects/portfolio.png",
    category: "frontend",
    techStack: ["Next.js", "TypeScript", "Framer Motion", "Tailwind CSS"],
    githubUrl: "https://github.com/ucdexpert/Personal_Portfolio1",
    liveUrl: "https://uzair-portfolio01.vercel.app",
  },
  {
    id: 5,
    title: "Physical AI Textbook Platform",
    description:
      "Interactive AI-powered textbook platform built on Docusaurus. Features RAZ chatbot for intelligent Q&A, structured learning modules, and modern documentation experience. Built for hackathon.",
    image: "/projects/ai-textbook.png",
    category: "frontend",
    techStack: ["Docusaurus", "React", "JavaScript", "AI Chatbot", "RAZ", "Vercel"],
    githubUrl: "https://github.com/ucdexpert/physical-ai-textbook-frontend001-heckathon",
    liveUrl: "https://physical-ai-textbook-frontend001-he.vercel.app/",
  },
  {
    id: 6,
    title: "Personal Library Manager",
    description:
      "Python-based personal library management system. Manage your book collection, track reading status, add/remove books, and organize your personal library with ease.",
    image: "/projects/library.png",
    category: "backend",
    techStack: ["Python"],
    githubUrl: "https://github.com/ucdexpert/Personal-Library-Manager",
    liveUrl: "https://github.com/ucdexpert/Personal-Library-Manager",
  },
  {
    id: 7,
    title: "Password Strength Meter",
    description:
      "Python application to analyze and measure password strength. Provides real-time feedback on password security, suggesting improvements for stronger passwords.",
    image: "/projects/password.png",
    category: "backend",
    techStack: ["Python", "Streamlit"],
    githubUrl: "https://github.com/ucdexpert/password-strength-meter",
    liveUrl: "https://github.com/ucdexpert/password-strength-meter",
  },
];

export const projectCategories = [
  { id: "all", label: "All" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "fullstack", label: "Full Stack" },
] as const;
