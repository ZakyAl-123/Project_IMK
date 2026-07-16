import { Product, CustomProject, Competition, DiscussionThread, BlogPost, User, AppRole } from "../types";

export const currentUserMock: User = {
  id: "admin_01",
  name: "Super Admin",
  email: "admin@desaine.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
  role: AppRole.ADMIN,
  balance: 0,
  earnings: 0,
  membership: "Enterprise",
  joinedDate: "2025-12-01",
};

export const categoriesList = [
  "Semua",
  "Poster",
  "Logo",
  "Banner",
  "Feed Instagram",
  "Template PPT",
  "CV & Resume",
  "Sertifikat",
  "UI Kit",
  "Landing Page",
  "Website Template",
  "Mobile UI",
  "Icon",
  "Illustration",
  "Mockup",
  "Packaging",
  "3D",
  "Template Canva",
  "Template Figma",
];

export const productsMock: Product[] = [];

export const customProjectsMock: CustomProject[] = [];

export const competitionsMock: Competition[] = [];

export const forumThreadsMock: DiscussionThread[] = [];

export const blogPostsMock: BlogPost[] = [];

export const pricingTiers = [
  {
    name: "Free",
    price: "Rp 0",
    period: "selamanya",
    desc: "Untuk desainer pemula yang ingin membangun portofolio.",
    features: [
      "Upload hingga 5 produk gratis",
      "Komisi penjualan flat 15%",
      "Portofolio publik basic",
      "Standar forum & blog akses",
    ],
    cta: "Mulai Gratis",
    popular: false,
  },
  {
    name: "Pro",
    price: "Rp 149.000",
    period: "bulan",
    desc: "Terbaik untuk freelancer profesional & kreator aset aktif.",
    features: [
      "Upload produk digital tak terbatas",
      "Komisi penjualan dipotong hanya 8%",
      "Sertifikat desainer terverifikasi (Verified Seller)",
      "Akses AI Copilot (200x per bulan)",
      "Badge 'PRO' di profil portofolio",
      "Dukungan obrolan prioritas",
    ],
    cta: "Gabung Pro",
    popular: true,
  },
  {
    name: "Business / Enterprise",
    price: "Rp 499.000",
    period: "bulan",
    desc: "Sempurna untuk studio desain, agensi, dan korporat skala besar.",
    features: [
      "Hingga 10 akun anggota tim",
      "Komisi penjualan terendah hanya 5%",
      "Iklan produk di-feature (2 slot/bulan)",
      "Sistem custom design escrow bebas biaya platform",
      "AI Copilot tanpa batas",
      "Dedicated account manager",
    ],
    cta: "Hubungi Penjualan",
    popular: false,
  }
];
