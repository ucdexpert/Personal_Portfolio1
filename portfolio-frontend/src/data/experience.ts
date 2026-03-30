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
    title: "Senior Full Stack Developer",
    company: "Tech Innovations Inc.",
    dateRange: "2023 - Present",
    description: [
      "Led development of microservices architecture serving 100K+ daily users",
      "Implemented CI/CD pipelines reducing deployment time by 60%",
      "Mentored junior developers and conducted code reviews",
      "Architected scalable solutions using Next.js and Node.js",
    ],
    icon: "briefcase",
  },
  {
    id: 2,
    type: "work",
    title: "Full Stack Developer",
    company: "Digital Solutions Ltd.",
    dateRange: "2021 - 2023",
    description: [
      "Developed and maintained 15+ client projects using React and Node.js",
      "Integrated third-party APIs including Stripe, Twilio, and Google Maps",
      "Optimized database queries improving performance by 40%",
      "Collaborated with design team to implement pixel-perfect UIs",
    ],
    icon: "briefcase",
  },
  {
    id: 3,
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
  {
    id: 4,
    type: "education",
    title: "Bachelor of Science in Computer Science",
    company: "University of Karachi",
    dateRange: "2015 - 2019",
    description: [
      "Graduated with Honors (3.8 GPA)",
      "Specialized in Software Engineering and Web Technologies",
      "Completed capstone project on Machine Learning applications",
      "Active member of Computer Science Society",
    ],
    icon: "graduation-cap",
  },
  {
    id: 5,
    type: "education",
    title: "Full Stack Web Development Certification",
    company: "freeCodeCamp",
    dateRange: "2018 - 2019",
    description: [
      "Completed 300+ hours of intensive web development training",
      "Built 20+ projects including full-stack applications",
      "Earned certifications in Frontend and Backend Development",
      "Contributed to open-source projects",
    ],
    icon: "certificate",
  },
];
