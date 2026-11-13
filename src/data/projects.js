/**
 * Projects — the single source of truth for the Projects section and the detail modal.
 *
 * - `github` / `demo`: set to a real URL or `null`. Buttons are only rendered when a URL exists.
 * - `image`: screenshot in /public. When null, `mockup` selects a built-in illustrated preview.
 * - `gallery`: optional extra screenshots shown in the detail view.
 */

export const projects = [
  {
    id: "affiliatelink",
    number: "01",
    title: "AffiliateLink",
    category: "Full Stack · Java · Spring Boot",
    year: "2026",
    tagline: "An affiliate marketing platform with a modular Spring backend.",
    description:
      "An affiliate marketing platform connecting advertisers and publishers. Advertisers publish offers and manage campaigns, while publishers discover offers and promote products.",
    highlights: [
      "Modular architecture with Spring Modulith and clear domain separation",
      "REST APIs for offers, campaigns and publisher activity",
      "Request validation and centralised exception handling",
      "Automated tests with JUnit and Mockito",
      "Containerised PostgreSQL environment with Docker",
    ],
    stack: [
      "Java 17",
      "Spring Boot",
      "Spring Modulith",
      "Spring Data JPA",
      "PostgreSQL",
      "Docker",
      "Maven",
      "JUnit / Mockito",
    ],
    accent: "#FF3B30",
    url: "localhost:8080/api/offers",
    image: null,
    mockup: "modules",
    gallery: [],
    github: "https://github.com/lahfamostafa/JAVA-AffiliateLink",
    demo: null,
  },
  {
    id: "ocr-diploma",
    number: "02",
    title: "OCR CIN Reader to Diploma Writer",
    category: "Automation · Web Application",
    year: "2026",
    tagline: "From an ID card to a print-ready PDF diploma — automatically.",
    description:
      "Built during my internship at Al Akhawayn University. The application extracts information from Moroccan identity cards (or passports) through an external vision API, lets an operator verify the data, then generates diplomas as PDF documents from predefined templates.",
    highlights: [
      "Upload of CIN front/back or passport, with OCR extraction through an external AI vision API",
      "Human validation step: extracted fields are reviewed and corrected before saving",
      "PDF diploma generation from database-backed Blade templates",
      "Role-based user management and authentication",
      "Dashboard of recent scans and generated diplomas",
    ],
    stack: [
      "Laravel 10",
      "PHP",
      "Blade",
      "Vite",
      "Tailwind CSS",
      "Alpine.js",
      "MySQL",
      "Vision API",
      "PDF Generation",
    ],
    accent: "#FF3B30",
    url: "localhost:8000",
    image: "/images/projects/ocr-landing.webp",
    gallery: [
      { src: "/images/projects/ocr-dashboard.webp", alt: "OCR application dashboard with recent scans" },
      { src: "/images/projects/ocr-full.webp", alt: "Full landing page of the OCR diploma application", tall: true },
    ],
    github: "https://github.com/lahfamostafa/OCR-CIN-Reader-to-Diploma-Writer",
    demo: null,
  },
  {
    id: "easymatch",
    number: "03",
    title: "EasyMatch",
    category: "Full Stack · Laravel",
    year: "2026",
    tagline: "Book a pitch, build a match, find your players.",
    description:
      "A web application for booking sports fields, organising matches and connecting players with field managers. Clients reserve time slots, managers validate bookings, and players create matches and request to join them.",
    highlights: [
      "Field listing and availability-based slot booking",
      "Manager workflow to validate or cancel reservations",
      "Match creation from a booking, with join requests and participant validation",
      "Announcements and comments attached to matches",
      "Feature and unit tests with PHPUnit",
    ],
    stack: ["Laravel 12", "PHP 8.2", "Blade", "Tailwind CSS", "Alpine.js", "Vite", "PHPUnit"],
    accent: "#FF3B30",
    url: "localhost:8000",
    image: "/images/projects/easymatch.webp",
    gallery: [],
    github: "https://github.com/lahfamostafa/Fil-rouge",
    demo: null,
  },
  {
    id: "easycoloc",
    number: "04",
    title: "EasyColoc",
    category: "Full Stack Web Application",
    year: "2026",
    tagline: "Shared living, without the spreadsheet.",
    description:
      "A web platform that simplifies shared accommodation: create a household, invite roommates by email, record shared expenses and see each member's balance update automatically.",
    highlights: [
      "Household creation with owner role and member invitations by email",
      "Invitation acceptance, refusal and expiry",
      "Shared expenses split equally with automatic balance calculation",
      "Member departure with balance redistribution and a reputation score",
      "Authentication, email verification and profile management",
    ],
    stack: ["Laravel", "PHP", "MySQL", "JavaScript", "Tailwind CSS", "Alpine.js", "Pest"],
    accent: "#FF3B30",
    url: "localhost:8000/colocations",
    image: "/images/projects/easycoloc.webp",
    gallery: [],
    github: "https://github.com/lahfamostafa/soutenance-croise-EasyColoc",
    demo: null,
  },
];

/** Smaller projects listed under the featured showcase. */
export const otherProjects = [
  {
    title: "Log Analyzer",
    description:
      "Java command-line application for file management, read/write/delete permission control and operation auditing with SQLite and the Stream API.",
    stack: ["Java", "Stream API", "SQLite", "JDBC"],
    github: "https://github.com/lahfamostafa/JAVA---LogAnalyzer-gestion-des-fichiers-et-permissions",
  },
];
