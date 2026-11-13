/**
 * Skills grouped by category. `icon` keys map to logos in src/components/ui/TechIcon.jsx.
 * No percentages or self-rated levels on purpose — the projects show the depth.
 */

export const skillGroups = [
  {
    id: "backend",
    index: "01",
    title: "Backend",
    tagline: "Where most of my energy goes.",
    description:
      "Designing APIs, modelling domains and writing services that are tested, validated and easy to reason about.",
    featured: true,
    skills: [
      { name: "Java", icon: "java" },
      { name: "Spring Boot", icon: "springboot" },
      { name: "Spring MVC", icon: "spring" },
      { name: "Spring Data JPA", icon: "spring" },
      { name: "Hibernate", icon: "hibernate" },
      { name: "REST API", icon: "api" },
      { name: "Maven", icon: "maven" },
      { name: "PHP", icon: "php" },
      { name: "Laravel", icon: "laravel" },
    ],
  },
  {
    id: "frontend",
    index: "02",
    title: "Frontend",
    tagline: "Interfaces with intent.",
    description: "Responsive, accessible interfaces — from Blade templates to React component systems.",
    skills: [
      { name: "HTML5", icon: "html" },
      { name: "CSS3", icon: "css" },
      { name: "JavaScript", icon: "js" },
      { name: "React.js", icon: "react" },
      { name: "Tailwind CSS", icon: "tailwind" },
      { name: "Bootstrap", icon: "bootstrap" },
      { name: "Alpine.js", icon: "alpine" },
    ],
  },
  {
    id: "data",
    index: "03",
    title: "Databases",
    tagline: "Data that makes sense.",
    description: "Relational modelling, normalisation and queries that stay readable.",
    skills: [
      { name: "PostgreSQL", icon: "postgres" },
      { name: "MySQL", icon: "mysql" },
      { name: "SQL", icon: "sql" },
    ],
  },
  {
    id: "tools",
    index: "04",
    title: "Tools & Workflow",
    tagline: "The everyday toolbox.",
    description: "Version control, containers and the IDEs I ship with.",
    skills: [
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "Docker", icon: "docker" },
      { name: "Postman", icon: "postman" },
      { name: "IntelliJ IDEA", icon: "intellij" },
      { name: "VS Code", icon: "vscode" },
      { name: "Figma", icon: "figma" },
      { name: "Linux", icon: "linux" },
    ],
  },
];

export const concepts = [
  "Object-Oriented Programming",
  "MVC Architecture",
  "RESTful APIs",
  "SOLID Principles",
  "Design Patterns",
  "Microservices fundamentals",
  "Testing — JUnit & Mockito",
  "Spring Modulith",
  "Database Design",
  "UML & Merise",
  "Agile / Scrum",
];

// Technologies shown in the scrolling marquee under the hero.
export const marquee = [
  "Java",
  "Spring Boot",
  "Spring Modulith",
  "PostgreSQL",
  "React",
  "Laravel",
  "Docker",
  "REST APIs",
  "Tailwind CSS",
  "JUnit & Mockito",
  "TypeScript",
  "MySQL",
];
