export interface Skill {
  name: string;
  level: number;
  icon: string;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    skills: [
      { name: "React", level: 95, icon: "react" },
      { name: "Next.js", level: 90, icon: "nextjs" },
      { name: "TypeScript", level: 88, icon: "typescript" },
      { name: "Tailwind CSS", level: 92, icon: "tailwind" },
      { name: "Framer Motion", level: 85, icon: "motion" },
      { name: "HTML/CSS", level: 98, icon: "html" },
    ],
  },
  {
    name: "Backend",
    skills: [
      { name: "Node.js", level: 88, icon: "nodejs" },
      { name: "Python", level: 85, icon: "python" },
      { name: "Express.js", level: 87, icon: "express" },
      { name: "FastAPI", level: 82, icon: "fastapi" },
      { name: "PostgreSQL", level: 80, icon: "postgresql" },
      { name: "MongoDB", level: 83, icon: "mongodb" },
    ],
  },
  {
    name: "Tools & DevOps",
    skills: [
      { name: "Git", level: 90, icon: "git" },
      { name: "Docker", level: 78, icon: "docker" },
      { name: "AWS", level: 75, icon: "aws" },
      { name: "CI/CD", level: 80, icon: "cicd" },
      { name: "Linux", level: 82, icon: "linux" },
      { name: "Vercel", level: 88, icon: "vercel" },
    ],
  },
];

export const getSkillIconColor = (icon: string): string => {
  const colors: Record<string, string> = {
    react: "text-cyan-500",
    nextjs: "text-white",
    typescript: "text-blue-500",
    tailwind: "text-teal-400",
    motion: "text-purple-500",
    html: "text-orange-500",
    nodejs: "text-green-500",
    python: "text-yellow-500",
    express: "text-gray-500",
    fastapi: "text-green-600",
    postgresql: "text-blue-400",
    mongodb: "text-green-400",
    git: "text-red-500",
    docker: "text-blue-600",
    aws: "text-orange-400",
    cicd: "text-indigo-500",
    linux: "text-yellow-600",
    vercel: "text-black dark:text-white",
  };
  return colors[icon] || "text-gray-500";
};
