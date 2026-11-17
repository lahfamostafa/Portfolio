/**
 * Central personal data — edit this file to update the content of the site.
 * Every value here is rendered as-is; nothing is generated or invented elsewhere.
 */

export const personal = {
  name: "Mostafa Lahfa",
  firstName: "Mostafa",
  lastName: "Lahfa",
  initials: "ML",
  title: "Full Stack Developer",
  subtitle: "Java & Spring Boot Developer",
  location: "Oujda, Morocco",
  country: "Morocco",
  availability: "Open to internship opportunities",
  availabilityDetail: "PFE / Stage · Full Stack · Java & Spring Boot",

  // Email shown in the contact section and used by the mailto fallback.
  email: "lahfa.mostafa1@gmail.com",

  // Set to null to hide the "Download CV" button.
  cvUrl: "/Mostafa-Lahfa-CV.pdf",

  // Portrait used in the About section. Set to null to show a monogram instead.
  portrait: "/images/portrait-cutout.webp",

  /**
   * Intro soundtrack. Put the file at public/audio/ascension-slowed.mp3 (or change `src`).
   * When the file is missing, the site starts without the entry screen and without sound.
   */
  intro: {
    music: {
      src: "/audio/ascension-slowed1.mp3",
      title: "ASCENSION! (Slowed)",
      startAt: 112, // 1:52
      volume: 0.6,
    },
  },

  hero: {
    eyebrow: "Full-Stack Developer",
    motto: ["Build", "Learn", "Innovate"],
    headline: ["Building digital", "experiences that", "make an impact."],
    // The word rendered in italic serif inside the headline.
    emphasis: "impact.",
    intro:
      "I'm Mostafa Lahfa — a Full Stack Developer passionate about crafting modern digital experiences and scalable software solutions.",
  },

  about: {
    title: "A little about me.",
    paragraphs: [
      "I'm a developer who enjoys understanding how things work, solving problems, and building useful digital products. My journey combines academic learning, hands-on development, and continuous experimentation.",
      "From designing intuitive interfaces to implementing robust backend systems, I enjoy every stage of the development process.",
      "Currently, I'm deepening my expertise in Java and Spring Boot while exploring modern frontend technologies and software architecture.",
    ],
    pullQuote: "Clean code, clear architecture, and interfaces people enjoy using.",
    facts: [
      { label: "Based in", value: "Oujda, Morocco" },
      { label: "Currently", value: "YouCode — 2nd year, Java track" },
      { label: "Focus", value: "Spring Boot · REST APIs · React" },
      { label: "Languages", value: "Arabic · French · English" },
    ],
    objective:
      "I am looking for an internship (PFE / Stage) or professional opportunities where I can contribute to real-world projects, improve my technical skills, collaborate with experienced developers, and grow as a Full Stack Developer.",
  },

  interests: [
    {
      title: "Software architecture",
      text: "Modular monoliths, clear boundaries and systems that stay understandable as they grow.",
      icon: "Boxes",
    },
    {
      title: "Clean code",
      text: "Readable names, small functions, SOLID principles — code written for the next developer.",
      icon: "Sparkles",
    },
    {
      title: "Backend engineering",
      text: "REST APIs, data modelling, validation and the quiet reliability behind good products.",
      icon: "Server",
    },
    {
      title: "Modern UI/UX",
      text: "Interfaces with hierarchy, rhythm and motion that serves the content.",
      icon: "PenTool",
    },
    {
      title: "Continuous learning",
      text: "Learning by doing: every project is an excuse to understand one more thing deeply.",
      icon: "GraduationCap",
    },
    {
      title: "Open source",
      text: "Sharing projects publicly on GitHub and learning from the work of others.",
      icon: "GitBranch",
    },
  ],

  contact: {
    headline: ["Have a project in mind?", "Let's build something", "great together."],
    text: "Whether it's an internship, a collaboration or just a conversation about code — my inbox is open. I usually reply within a couple of days.",
  },
};

export const socials = [
  { label: "GitHub", handle: "@lahfamostafa", href: "https://github.com/lahfamostafa", icon: "github" },
  {
    label: "LinkedIn",
    handle: "mostafa-lahfa",
    href: "https://linkedin.com/in/mostafa-lahfa-912aab397",
    icon: "linkedin",
  },
];

export const navLinks = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
];

/** Hero figures — every number is factual (edit when it changes). */
export const stats = [
  { value: "04", label: "Featured projects", note: "Java · Laravel · OCR" },
  { value: "02", label: "Internships", note: "Al Akhawayn · AXA" },
  { value: "47", label: "Public repositories", note: "github.com/lahfamostafa" },
];

/** How I work — shown in the About section. */
export const process = [
  { title: "Understand", text: "Clarify the need, the users and the data before writing a line of code." },
  { title: "Model", text: "UML / Merise, database schema and API contract — the plan the code follows." },
  { title: "Build", text: "Clean, layered code: controllers, services, repositories, components." },
  { title: "Test", text: "Unit and integration tests with JUnit & Mockito, Postman for the APIs." },
  { title: "Ship", text: "Git workflow, Docker environments and readable documentation." },
];

export const softSkills = [
  "Autonomy & initiative",
  "Team work (Agile / Scrum)",
  "Problem solving & analysis",
  "Time management",
  "Fast learner",
];
