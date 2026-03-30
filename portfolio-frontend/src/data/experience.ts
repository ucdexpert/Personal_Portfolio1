export interface ExperienceItem {
  id: number;
  type: "work" | "education";
  title: string;
  company: string;
  dateRange: string;
  description: string[];
  icon: string;
}

export const experiences: ExperienceItem[] = [
  {
    id: 1,
    type: "work",
    title: "Full Stack Developer (Fresher)",
    company: "Self-Employed / Freelance",
    dateRange: "2023 - Present",
    description: [
      "Building scalable web applications using Next.js, TypeScript, and Python",
      "Implemented CI/CD pipelines reducing deployment time by 60%",
      "Developed and deployed production-ready e-commerce platform",
      "Working with LLM-based applications and prompt engineering",
    ],
    icon: "briefcase",
  },
  {
    id: 2,
    type: "education",
    title: "Diploma in Agentic AI (In Progress)",
    company: "Governor House IT Initiative",
    dateRange: "2023 - 2026",
    description: [
      "Modern web technologies and AI concepts",
      "LLM applications and practical industry exposure",
      "Agentic AI and automation tools",     
      "spektive projects and real-world applications and hands-on experience",
    ],
    icon: "education",
  },
  {
    id: 3,
    type: "education",
    title: "Diploma in Computer Information Technology",
    company: "Jinnah Polytechnic Institute, Karachi",
    dateRange: "Completed: 2023",
    description: [
      "Computer Information Technology fundamentals",
      "Programming basics and web development",
      "Software development principles",
      "project-based learning and practical experience",
    ],
    icon: "education",
  },
  {
    id: 4,
    type: "work",
    title: "Frontend Developer",
    company: "StartUp Hub",
    dateRange: "2019 - 2021",
    description: [
      "Built responsive web applications using React and TypeScript",
      "Implemented state management with Redux and Context API",
      "Created reusable component library for internal use",
      "Participated in agile development processes",
    ],
    icon: "briefcase",
  },
 
];
