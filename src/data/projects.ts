/*
 * Original migration reference and test fixture only.
 * Public portfolio content is read live from Supabase, never from this dataset.
 *
 * Rules: no invented links, outcomes, screenshots, testimonials or
 * achievements. Unknown data stays empty or is explicitly marked pending.
 */

export type ServiceKey =
  | "googleAds"
  | "metaAds"
  | "leadGen"
  | "ecommerce"
  | "webDev"
  | "webflow"
  | "platform"
  | "igContent"
  | "igAds"
  | "accountOps";

export type CategoryKey =
  | "web"
  | "ecommerce"
  | "realestate"
  | "hospitality"
  | "education"
  | "healthcare"
  | "finance"
  | "platform"
  | "energy"
  | "home"
  | "b2b"
  | "local";

export interface Project {
  id: string;
  slug: string;
  /** Client / project name */
  name: string;
  /** Company / professional context. Empty when attribution is pending. */
  context: string;
  /** True when the company/client attribution still needs verification. */
  contextPending?: boolean;
  /** Business category */
  category: CategoryKey;
  services: ServiceKey[];
  responsibilities: ServiceKey[];
  /** Display label, e.g. "2025" or "2024—2026" */
  yearLabel: string;
  featured: boolean;
  /** Optional thumbnail — none provided yet. */
  thumbnail?: string;
  /** Optional external URL — none provided yet. */
  externalUrl?: string;
  /** Optional verified results — none provided yet. */
  results?: string[];
  description: { tr: string; en: string };
}

export const projects: Project[] = [
  {
    id: "bakir-teknik-servis",
    slug: "bakir-teknik-servis",
    name: "Bakır Teknik Servis",
    context: "Personal",
    category: "local",
    services: ["webDev"],
    responsibilities: ["webDev"],
    yearLabel: "2026—",
    featured: true,
    description: {
      tr: "Bakır Teknik Servis için web sitesi geliştirme.",
      en: "Website development for Bakır Teknik Servis.",
    },
  },
  {
    id: "detay-emlak",
    slug: "detay-emlak",
    name: "Detay Emlak",
    context: "Personal",
    category: "realestate",
    services: ["webDev"],
    responsibilities: ["webDev"],
    yearLabel: "2025—",
    featured: true,
    description: {
      tr: "Detay Emlak için web sitesi geliştirme.",
      en: "Website development for Detay Emlak.",
    },
  },
  {
    id: "alfashopping",
    slug: "alfashopping",
    name: "Alfashopping",
    context: "Personal",
    category: "ecommerce",
    services: ["igContent", "igAds", "accountOps"],
    responsibilities: ["igContent", "igAds", "accountOps"],
    yearLabel: "2025—",
    featured: false,
    description: {
      tr: "Alfashopping için Instagram içerik, reklam ve hesap operasyonları.",
      en: "Instagram content, advertising and account operations for Alfashopping.",
    },
  },
  {
    id: "ulger-emlak",
    slug: "ulger-emlak",
    name: "Ülger Emlak",
    context: "Personal",
    category: "realestate",
    services: ["igContent", "igAds"],
    responsibilities: ["igContent", "igAds"],
    yearLabel: "2025—",
    featured: false,
    description: {
      tr: "Ülger Emlak için Instagram içerik ve reklam yönetimi.",
      en: "Instagram content and advertising for Ülger Emlak.",
    },
  },
  {
    id: "kiraz-beach-otel",
    slug: "kiraz-beach-otel",
    name: "Kiraz Beach Otel",
    context: "Kolektif Ninja",
    category: "hospitality",
    services: ["metaAds", "leadGen"],
    responsibilities: ["metaAds", "leadGen"],
    yearLabel: "2025",
    featured: true,
    description: {
      tr: "Kiraz Beach Otel için Meta Ads ile rezervasyon talebi üretimi.",
      en: "Reservation lead generation with Meta Ads for Kiraz Beach Otel.",
    },
  },
  {
    id: "konum-ca",
    slug: "konum-ca",
    name: "Konum.ca",
    context: "",
    contextPending: true,
    category: "platform",
    services: ["platform"],
    responsibilities: ["platform"],
    yearLabel: "2024—2026",
    featured: true,
    description: {
      tr: "Konum.ca platformunun sıfırdan geliştirilmesi.",
      en: "Konum.ca platform built from scratch.",
    },
  },
  {
    id: "makwa-capital",
    slug: "makwa-capital",
    name: "Makwa Capital",
    context: "Kolektif Ninja",
    category: "finance",
    services: ["googleAds", "leadGen"],
    responsibilities: ["googleAds", "leadGen"],
    yearLabel: "2024",
    featured: true,
    description: {
      tr: "Makwa Capital için Google Ads ile lead üretimi.",
      en: "Lead generation with Google Ads for Makwa Capital.",
    },
  },
  {
    id: "mrs-tutor",
    slug: "mrs-tutor",
    name: "Mrs. Tutor",
    context: "Kolektif Ninja",
    category: "education",
    services: ["googleAds", "leadGen"],
    responsibilities: ["googleAds", "leadGen"],
    yearLabel: "2025",
    featured: false,
    description: {
      tr: "Mrs. Tutor için Google Ads ile lead üretimi.",
      en: "Lead generation with Google Ads for Mrs. Tutor.",
    },
  },
  {
    id: "solary-ca",
    slug: "solary-ca",
    name: "Solary.ca",
    context: "Kolektif Ninja",
    category: "energy",
    services: ["googleAds", "leadGen"],
    responsibilities: ["googleAds", "leadGen"],
    yearLabel: "2025",
    featured: false,
    description: {
      tr: "Solary.ca için Google Ads ile lead üretimi.",
      en: "Lead generation with Google Ads for Solary.ca.",
    },
  },
  {
    id: "otto-deck",
    slug: "otto-deck",
    name: "Otto Deck",
    context: "Kolektif Ninja",
    category: "home",
    services: ["googleAds", "leadGen"],
    responsibilities: ["googleAds", "leadGen"],
    yearLabel: "2025",
    featured: false,
    description: {
      tr: "Otto Deck için Google Ads ile lead üretimi.",
      en: "Lead generation with Google Ads for Otto Deck.",
    },
  },
  {
    id: "unico-student",
    slug: "unico-student",
    name: "Unico Student",
    context: "Kolektif Ninja",
    category: "education",
    services: ["googleAds", "leadGen"],
    responsibilities: ["googleAds", "leadGen"],
    yearLabel: "2024—2025",
    featured: false,
    description: {
      tr: "Unico Student için Google Ads ile lead üretimi.",
      en: "Lead generation with Google Ads for Unico Student.",
    },
  },
  {
    id: "ico-group",
    slug: "ico-group",
    name: "ICO Group",
    context: "Kolektif Ninja",
    category: "b2b",
    services: ["googleAds", "leadGen"],
    responsibilities: ["googleAds", "leadGen"],
    yearLabel: "2024—2025",
    featured: false,
    description: {
      tr: "ICO Group için Google Ads ile lead üretimi.",
      en: "Lead generation with Google Ads for ICO Group.",
    },
  },
  {
    id: "mikos-store",
    slug: "mikos-store",
    name: "Mikos Store",
    context: "Turnalar",
    category: "ecommerce",
    services: ["googleAds", "ecommerce"],
    responsibilities: ["googleAds", "ecommerce"],
    yearLabel: "2023—2024",
    featured: true,
    description: {
      tr: "Mikos Store için Google Ads e-ticaret kampanyaları.",
      en: "Google Ads e-commerce campaigns for Mikos Store.",
    },
  },
  {
    id: "nove-group",
    slug: "nove-group",
    name: "Nove Group",
    context: "Turnalar",
    category: "healthcare",
    services: ["googleAds", "leadGen"],
    responsibilities: ["googleAds", "leadGen"],
    yearLabel: "2023—2024",
    featured: true,
    description: {
      tr: "Nove Group için sağlık alanında Google Ads lead üretimi.",
      en: "Healthcare lead generation with Google Ads for Nove Group.",
    },
  },
  {
    id: "acro",
    slug: "acro",
    name: "Acro",
    context: "Turnalar",
    category: "ecommerce",
    services: ["googleAds", "ecommerce"],
    responsibilities: ["googleAds", "ecommerce"],
    yearLabel: "2023—2024",
    featured: false,
    description: {
      tr: "Acro için Google Ads e-ticaret kampanyaları.",
      en: "Google Ads e-commerce campaigns for Acro.",
    },
  },
  {
    id: "erimos",
    slug: "erimos",
    name: "Erimos",
    context: "Turnalar",
    category: "ecommerce",
    services: ["googleAds", "ecommerce"],
    responsibilities: ["googleAds", "ecommerce"],
    yearLabel: "2023—2024",
    featured: false,
    description: {
      tr: "Erimos için Google Ads e-ticaret kampanyaları.",
      en: "Google Ads e-commerce campaigns for Erimos.",
    },
  },
  {
    id: "day-antique",
    slug: "day-antique",
    name: "Day Antique",
    context: "Turnalar",
    category: "ecommerce",
    services: ["googleAds", "ecommerce"],
    responsibilities: ["googleAds", "ecommerce"],
    yearLabel: "2023—2024",
    featured: false,
    description: {
      tr: "Day Antique için Google Ads e-ticaret kampanyaları.",
      en: "Google Ads e-commerce campaigns for Day Antique.",
    },
  },
  {
    id: "turnalar-emlak",
    slug: "turnalar-emlak",
    name: "Turnalar Emlak",
    context: "Turnalar Emlak",
    category: "realestate",
    services: ["webflow"],
    responsibilities: ["webflow"],
    yearLabel: "2023—2024",
    featured: true,
    description: {
      tr: "Turnalar Emlak için Webflow ile web sitesi geliştirme.",
      en: "Webflow website development for Turnalar Emlak.",
    },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export const projectCategories: CategoryKey[] = Array.from(
  new Set(projects.map((p) => p.category)),
);
