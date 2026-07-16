import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { productsMock, customProjectsMock } from "./src/data/mockData";
import crypto from "crypto";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// --- Relational Database Models & Tables ---
interface Role {
  id: string;
  name: string;
  permissions: string[];
}

interface UserTable {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  passwordHash: string;
  roleId: string;
  isVerified: boolean;
  balance: number;
  earnings: number;
  membership: "Free" | "Pro" | "Business" | "Enterprise";
  joinedDate: string;
  mustChangePassword?: boolean;
}

interface UserProfile {
  userId: string;
  avatar: string;
  bio: string;
  bankAccount: string;
  eWallet: string;
}

interface DesignerProfile {
  userId: string;
  studioName?: string;
  experience: string;
  startingPrice: number;
  banner: string;
  skills: string[];
  software: string[];
  socials: { instagram?: string; behance?: string; dribbble?: string };
}

interface BuyerProfile {
  userId: string;
  interests: string[];
  companyName?: string;
}

interface EmailVerification {
  userId: string;
  token: string;
  expiresAt: string;
  isUsed: boolean;
}

interface PhoneVerification {
  userId: string;
  otp: string;
  expiresAt: string;
  isUsed: boolean;
}

interface LoginLog {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
}

interface PortfolioLink {
  id: string;
  userId: string;
  title: string;
  url: string;
}

interface Skill {
  id: string;
  name: string;
}

interface DesignerSkill {
  designerId: string;
  skillId: string;
}

// Hashing helper
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// In-Memory Database State
const db_roles: Role[] = [
  { id: "admin", name: "Super Admin", permissions: ["all"] },
  { id: "moderator", name: "Moderator", permissions: ["moderate_products", "moderate_withdraws"] },
  { id: "designer", name: "Designer", permissions: ["sell_products", "create_portfolio"] },
  { id: "buyer", name: "Buyer", permissions: ["buy_products", "post_projects"] }
];

const db_users: UserTable[] = [
  {
    id: "admin_01",
    name: "Super Admin",
    username: "admin",
    email: "admin@desaine.com",
    phone: "081122334455",
    passwordHash: hashPassword("Admin123!"),
    roleId: "admin",
    isVerified: true,
    balance: 0,
    earnings: 0,
    membership: "Enterprise",
    joinedDate: "2025-12-01",
    mustChangePassword: true
  }
];

const db_user_profiles: UserProfile[] = [
  {
    userId: "admin_01",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    bio: "Super Admin DESAINE",
    bankAccount: "",
    eWallet: ""
  }
];

const db_designer_profiles: DesignerProfile[] = [];

const db_buyer_profiles: BuyerProfile[] = [];

const db_email_verifications: EmailVerification[] = [];
const db_phone_verifications: PhoneVerification[] = [];
const db_login_logs: LoginLog[] = [];
const db_sessions: Session[] = [];
const db_portfolio_links: PortfolioLink[] = [];
const db_skills: Skill[] = [
  { id: "s1", name: "UI UX" },
  { id: "s2", name: "Logo" },
  { id: "s3", name: "Poster" },
  { id: "s4", name: "Branding" },
  { id: "s5", name: "Illustration" },
  { id: "s6", name: "Motion Graphic" },
  { id: "s7", name: "Packaging" },
  { id: "s8", name: "Social Media" },
  { id: "s9", name: "Web Design" },
  { id: "s10", name: "Mobile Design" }
];
const db_designer_skills: DesignerSkill[] = [];

// Helper to authenticate session token
function getAuthUser(req: express.Request): UserTable | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  const sess = db_sessions.find(s => s.token === token && new Date(s.expiresAt) > new Date());
  if (!sess) return null;
  return db_users.find(u => u.id === sess.userId) || null;
}

// Simple In-Memory Rate Limiter for Production Security
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 100; // max requests per window

function rateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = req.ip || "127.0.0.1";
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    res.setHeader("X-RateLimit-Limit", RATE_LIMIT_MAX_REQUESTS);
    res.setHeader("X-RateLimit-Remaining", RATE_LIMIT_MAX_REQUESTS - 1);
    res.setHeader("X-RateLimit-Reset", Math.ceil((now + RATE_LIMIT_WINDOW_MS) / 1000));
    return next();
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    res.setHeader("Retry-After", Math.ceil((record.resetAt - now) / 1000));
    return res.status(429).json({
      error: "Terlalu banyak permintaan dari IP ini. Silakan coba lagi dalam 15 menit."
    });
  }

  record.count += 1;
  res.setHeader("X-RateLimit-Limit", RATE_LIMIT_MAX_REQUESTS);
  res.setHeader("X-RateLimit-Remaining", RATE_LIMIT_MAX_REQUESTS - record.count);
  res.setHeader("X-RateLimit-Reset", Math.ceil(record.resetAt / 1000));
  next();
}

// Production Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Content-Security-Policy", "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' https: data:; connect-src 'self' https: wss:;");
  next();
});

// Production Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

app.use(express.json());

// SEO - Robots.txt Route
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`User-agent: *
Allow: /
Disallow: /api/admin/
Sitemap: https://${req.headers.host || "desaine.com"}/sitemap.xml
`);
});

// SEO - Sitemap.xml Route
app.get("/sitemap.xml", (req, res) => {
  res.type("application/xml");
  const host = req.headers.host || "desaine.com";
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://${host}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`);
});

// Backup - Export Current Memory State (Admin API)
app.get("/api/admin/backup", (req, res) => {
  const user = getAuthUser(req);
  if (!user || user.roleId !== "admin") {
    return res.status(403).json({ error: "Hanya Admin yang dapat mengunduh cadangan data." });
  }

  const backupData = {
    exportedAt: new Date().toISOString(),
    users: db_users,
    userProfiles: db_user_profiles,
    designerProfiles: db_designer_profiles,
    buyerProfiles: db_buyer_profiles,
    sessions: db_sessions,
    products: mockProducts,
    projects: customProjects,
    withdraws: withdrawsList,
    skills: db_skills
  };

  res.setHeader("Content-Disposition", `attachment; filename=desaine_backup_${Date.now()}.json`);
  res.json(backupData);
});

// In-memory simulated database state loaded from rich mock data
let mockProducts = [...productsMock];

let mockBalance = 0; // Rp 0 (buyer)
let mockEarnings = 0; // Rp 0 (seller)
let withdrawsList: any[] = [];

let customProjects = [...customProjectsMock];

// Lazy Gemini API Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      console.warn("WARNING: GEMINI_API_KEY env is not configured correctly or using placeholder. AI features will fallback to offline mock responses.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

// AI Copilot Endpoints using gemini-3.5-flash
app.post("/api/ai/copilot", async (req, res) => {
  const { prompt, type, productType } = req.body;
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    // Elegant Offline Mock Fallback
    console.log("Using offline mock fallback for AI generation");
    if (type === "seo_meta") {
      return res.json({
        success: true,
        title: `Premium ${productType || "Digital Aset"} - Modern & Clean Design`,
        description: `Tingkatkan estetika proyek desain Anda dengan ${productType || "Aset"} premium ini. Dirancang secara profesional oleh Desaine Creative Team, menggunakan standard grid modern, mudah diedit, dan dilengkapi dengan lisensi penggunaan komersial bebas royalti. Sempurna untuk presentasi klien, media promosi UMKM, startup, maupun portofolio perkuliahan.`,
        tags: ["Desain", productType || "Aset", "Premium", "Indonesia", "Figma", "Photoshop", "Editable"],
        priceSuggestion: 149000,
        marketingCopy: `🔥 PROMO TERBATAS! Dapatkan template ${productType || "Aset"} eksklusif ini sekarang juga hanya di Desaine. Menggunakan format file standar industri yang sangat ramah pemula!`
      });
    } else if (type === "color_palette") {
      return res.json({
        success: true,
        palette: [
          { name: "Royal Indigo", hex: "#4F46E5", dark: true },
          { name: "Emerald Mint", hex: "#10B981", dark: false },
          { name: "Cosmic Charcoal", hex: "#1F2937", dark: true },
          { name: "Soft Alabaster", hex: "#F9FAFB", dark: false }
        ],
        concept: "Perpaduan modern warna profesional yang melambangkan inovasi teknologi, pertumbuhan ekonomi lokal, dan keterbukaan visual."
      });
    }
    return res.json({ success: true, text: "Fallback: AI Copilot Assistant is ready. Silakan configure GEMINI_API_KEY di Secrets panel untuk mendapatkan hasil real-time!" });
  }

  try {
    const ai = getGeminiClient();
    let promptText = "";
    
    if (type === "seo_meta") {
      promptText = `Anda adalah Product Manager & Digital Marketing Expert di Desaine, marketplace desain digital terbesar di Indonesia.
Diberikan input/topik produk: "${prompt}" dengan kategori: "${productType}".
Hasilkan metadata produk dalam format JSON sebagai berikut:
{
  "title": "judul produk yang sangat menarik perhatian pembeli, menggunakan optimasi kata kunci SEO lokal Indonesia",
  "description": "deskripsi komprehensif, persuasif, menguraikan nilai tawar, fitur file, software pendukung, dan lisensi",
  "tags": ["array berisi 6-8 kata kunci relevan"],
  "priceSuggestion": angka_rekomendasi_harga_dalam_rupiah (misal 149000),
  "marketingCopy": "slogan promosi singkat bertema urgensi penjualan atau diskon"
}
Kembalikan respon HANYA dalam format JSON mentah tanpa membungkusnya dalam markdown blocks atau teks pengantar apapun.`;
    } else if (type === "color_palette") {
      promptText = `Anda adalah UI/UX Designer Google Material Design.
Berdasarkan tema desain ini: "${prompt}", rekomendasikan 4 warna palet harmonis beserta penjelasannya.
Kembalikan respon HANYA dalam format JSON mentah tanpa membungkusnya dalam markdown blocks:
{
  "palette": [
    {"name": "nama warna elegan", "hex": "kode hex", "dark": true_atau_false_apakah_warna_ini_gelap},
    {"name": "nama warna kedua", "hex": "kode hex", "dark": true_atau_false_apakah_warna_ini_gelap},
    ... (total 4 warna)
  ],
  "concept": "Penjelasan singkat filosofi pemilihan warna dan cara menggunakannya di UI/UX"
}`;
    } else {
      promptText = prompt;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
    });

    const responseText = response.text || "";
    try {
      // Safely parse JSON if possible, otherwise send as raw text
      const cleanJsonStr = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJsonStr);
      res.json({ success: true, ...parsed });
    } catch (e) {
      res.json({ success: true, rawText: responseText });
    }
  } catch (error: any) {
    console.error("Gemini Copilot Error:", error);
    res.status(500).json({ error: error.message || "Failed to communicate with AI model" });
  }
});

// AI Chat Assistant
app.post("/api/ai/assistant", async (req, res) => {
  const { message, context } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    // Offline AI simulation response
    return res.json({
      success: true,
      text: `Halo! Saya AI Design Copilot di Desaine. Saat ini sistem berjalan dalam mode offline karena kunci API sedang dikonfigurasi. \n\nBerdasarkan pertanyaan Anda tentang *"${message}"*, saya menyarankan desainer profesional untuk selalu menyertakan format file mentah (.fig, .ai, atau .psd) dan lisensi komersial yang jelas untuk menarik pembeli korporasi atau UMKM lokal di Desaine!`
    });
  }

  try {
    const ai = getGeminiClient();
    const systemInstructions = `Anda adalah "AI Design Copilot" bertenaga Gemini yang ramah dan profesional, asisten khusus di platform DESAINE.
DESAINE adalah ekosistem desain digital terbesar di Indonesia untuk menjual template poster, logo, UI Kit, 3D assets, kustomisasi order, sayembara, dan portofolio desainer.
Tugas Anda adalah membantu pengguna:
1. Memberikan saran estetika desain (tren bento-grid, kontas warna WCAG, material design 3).
2. Membantu desainer menulis proposal penawaran custom order yang persuasif.
3. Menjelaskan jenis-jenis lisensi (Personal, Commercial, Extended) dengan jelas.
4. Memberikan saran optimasi penjualan aset digital.
Gunakan bahasa Indonesia yang sopan, profesional, ramah, dan memotivasi kreator lokal Indonesia.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Context: ${context || "Marketplace Desaine"}\nUser Question: ${message}`,
      config: {
        systemInstruction: systemInstructions
      }
    });

    res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error("Gemini Assistant Error:", error);
    res.status(500).json({ error: error.message || "Failed to communicate with AI assistant" });
  }
});

// --- AUTHENTICATION & REGISTER ENDPOINTS ---

// GET /api/roles
app.get("/api/roles", (req, res) => {
  res.json(db_roles);
});

// POST /api/register
app.post("/api/register", rateLimiter, (req, res) => {
  const { name, username, email, phone, password, role, studioName, experience, keahlian, portfolioLink, interests } = req.body;

  // Validation
  if (!name || name.trim().length < 3) {
    return res.status(400).json({ error: "Nama lengkap minimal harus terdiri dari 3 karakter." });
  }

  if (!username || username.trim().length < 3) {
    return res.status(400).json({ error: "Username minimal harus terdiri dari 3 karakter." });
  }

  // Check unique username
  const existingUserByUsername = db_users.find(u => u.username.toLowerCase() === username.toLowerCase().trim());
  if (existingUserByUsername) {
    return res.status(400).json({ error: "Username ini sudah terdaftar. Silakan pilih username lain." });
  }

  // Check unique email
  const existingUserByEmail = db_users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (existingUserByEmail) {
    return res.status(400).json({ error: "Email ini sudah terdaftar. Silakan masuk atau gunakan email lain." });
  }

  // Password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!password || !passwordRegex.test(password)) {
    return res.status(400).json({ 
      error: "Password minimal harus 8 karakter dan mengandung setidaknya satu huruf besar, satu huruf kecil, satu angka, dan satu simbol khusus." 
    });
  }

  // Phone validation
  const phoneClean = phone ? phone.replace(/[^0-9]/g, "") : "";
  if (!phone || phoneClean.length < 10 || phoneClean.length > 15) {
    return res.status(400).json({ error: "Nomor HP tidak valid. Harus terdiri dari 10 hingga 15 digit angka." });
  }

  if (role !== "buyer" && role !== "designer") {
    return res.status(400).json({ error: "Role yang dipilih tidak valid. Pilih Pembeli atau Desainer." });
  }

  // Create new user
  const userId = `user_${Date.now()}`;
  const newUser: UserTable = {
    id: userId,
    name: name.trim(),
    username: username.trim().toLowerCase(),
    email: email.trim().toLowerCase(),
    phone: phoneClean,
    passwordHash: hashPassword(password),
    roleId: role,
    isVerified: false, // Must verify email first
    balance: role === "buyer" ? 5000000 : 0, // Starting balance Rp 5.000.000 for buyer
    earnings: 0,
    membership: "Free",
    joinedDate: new Date().toISOString().split("T")[0]
  };

  db_users.push(newUser);

  // Create User Profile
  const defaultAvatar = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`;
  db_user_profiles.push({
    userId,
    avatar: defaultAvatar,
    bio: role === "designer" ? "Kreator desain baru di Desaine." : "Pecinta seni digital baru di Desaine.",
    bankAccount: "",
    eWallet: phoneClean
  });

  // Create specific profiles
  if (role === "designer") {
    db_designer_profiles.push({
      userId,
      studioName: studioName || undefined,
      experience: experience || "Pemula",
      startingPrice: 50000,
      banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
      skills: keahlian ? [keahlian] : ["UI UX"],
      software: ["Figma"],
      socials: {}
    });

    if (portfolioLink) {
      db_portfolio_links.push({
        id: `p_${Date.now()}`,
        userId,
        title: "Link Portofolio Utama",
        url: portfolioLink
      });
    }
  } else {
    db_buyer_profiles.push({
      userId,
      interests: interests || ["UI UX", "Poster"]
    });
  }

  // Email verification token generation
  const emailToken = `token_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  db_email_verifications.push({
    userId,
    token: emailToken,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 Hours
    isUsed: false
  });

  // OTP Mobile simulation
  const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
  db_phone_verifications.push({
    userId,
    otp: mockOtp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 Minutes
    isUsed: false
  });

  console.log(`[SIMULATION] Verification Email sent to ${email.trim()} with token: ${emailToken}`);
  console.log(`[SIMULATION] Verification OTP sent to ${phoneClean} with code: ${mockOtp}`);

  res.json({
    success: true,
    message: "Registrasi berhasil! Kami telah mengirimkan link verifikasi ke email Anda dan kode OTP ke nomor HP Anda.",
    userId,
    emailToken,
    otpCode: mockOtp
  });
});

// POST /api/verify-email
app.post("/api/verify-email", (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Token verifikasi wajib disertakan." });
  }

  const verification = db_email_verifications.find(
    v => v.token === token && !v.isUsed && new Date(v.expiresAt) > new Date()
  );

  if (!verification) {
    return res.status(400).json({ error: "Token tidak valid, sudah kadaluarsa, atau sudah pernah digunakan." });
  }

  const user = db_users.find(u => u.id === verification.userId);
  if (!user) {
    return res.status(404).json({ error: "User tidak ditemukan." });
  }

  user.isVerified = true;
  verification.isUsed = true;

  res.json({
    success: true,
    message: "Email Anda berhasil diverifikasi! Silakan login untuk masuk ke dashboard Anda."
  });
});

// POST /api/login
app.post("/api/login", rateLimiter, (req, res) => {
  const { identifier, password, rememberMe } = req.body;
  const ipAddress = req.ip || "127.0.0.1";
  const userAgent = req.headers["user-agent"] || "unknown";

  if (!identifier || !password) {
    return res.status(400).json({ error: "Email/Username dan Password wajib diisi." });
  }

  const user = db_users.find(
    u => u.email.toLowerCase() === identifier.trim().toLowerCase() || u.username.toLowerCase() === identifier.trim().toLowerCase()
  );

  if (!user) {
    return res.status(400).json({ error: "Email atau Username tidak terdaftar." });
  }

  if (user.passwordHash !== hashPassword(password)) {
    return res.status(400).json({ error: "Password yang Anda masukkan salah." });
  }

  if (!user.isVerified) {
    const freshToken = `token_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    db_email_verifications.push({
      userId: user.id,
      token: freshToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      isUsed: false
    });
    console.log(`[SIMULATION] Resent Verification Email to ${user.email} with token: ${freshToken}`);
    return res.status(403).json({
      error: "Akun Anda belum diverifikasi. Kami telah mengirim ulang link verifikasi baru ke email Anda.",
      isNotVerified: true,
      emailToken: freshToken
    });
  }

  // Create session
  const token = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const days = rememberMe ? 30 : 1;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

  db_sessions.push({
    id: `session_${Date.now()}`,
    userId: user.id,
    token,
    expiresAt
  });

  // Log login attempt
  db_login_logs.push({
    id: `log_${Date.now()}`,
    userId: user.id,
    ipAddress,
    userAgent,
    timestamp: new Date().toISOString()
  });

  const profile = db_user_profiles.find(p => p.userId === user.id) || { avatar: "" };

  res.json({
    success: true,
    message: `Selamat datang kembali, ${user.name}!`,
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.roleId,
      balance: user.balance,
      earnings: user.earnings,
      membership: user.membership,
      joinedDate: user.joinedDate,
      avatar: profile.avatar,
      mustChangePassword: user.mustChangePassword
    }
  });
});

// POST /api/logout
app.post("/api/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(400).json({ error: "Token tidak ditemukan." });
  }

  const token = authHeader.replace("Bearer ", "");
  const sessionIndex = db_sessions.findIndex(s => s.token === token);

  if (sessionIndex !== -1) {
    db_sessions.splice(sessionIndex, 1);
  }

  res.json({ success: true, message: "Berhasil keluar." });
});

// POST /api/forgot-password
app.post("/api/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email wajib diisi." });
  }

  const user = db_users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "Email tidak terdaftar di sistem kami." });
  }

  const resetToken = `reset_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  // Reuse db_email_verifications for mock reset tokens as well
  db_email_verifications.push({
    userId: user.id,
    token: resetToken,
    expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 Hour
    isUsed: false
  });

  console.log(`[SIMULATION] Password recovery link sent to ${email} with reset token: ${resetToken}`);

  res.json({
    success: true,
    message: "Link pemulihan kata sandi telah dikirim ke email Anda.",
    resetToken
  });
});

// POST /api/reset-password
app.post("/api/reset-password", (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: "Token dan password baru wajib disertakan." });
  }

  const verification = db_email_verifications.find(
    v => v.token === token && !v.isUsed && new Date(v.expiresAt) > new Date()
  );

  if (!verification) {
    return res.status(400).json({ error: "Token pemulihan tidak valid atau telah kadaluarsa." });
  }

  const user = db_users.find(u => u.id === verification.userId);
  if (!user) {
    return res.status(404).json({ error: "User tidak ditemukan." });
  }

  // Password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ 
      error: "Password minimal harus 8 karakter dan mengandung setidaknya satu huruf besar, satu huruf kecil, satu angka, dan satu simbol khusus." 
    });
  }

  user.passwordHash = hashPassword(password);
  verification.isUsed = true;

  res.json({
    success: true,
    message: "Kata sandi Anda berhasil diperbarui. Silakan login dengan kata sandi baru Anda."
  });
});

// GET /api/me
app.get("/api/me", (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: "Sesi Anda telah berakhir. Silakan login kembali." });
  }

  const profile = db_user_profiles.find(p => p.userId === user.id) || { avatar: "", bio: "", bankAccount: "", eWallet: "" };
  const dProfile = db_designer_profiles.find(p => p.userId === user.id);
  const bProfile = db_buyer_profiles.find(p => p.userId === user.id);

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.roleId,
      balance: user.balance,
      earnings: user.earnings,
      membership: user.membership,
      joinedDate: user.joinedDate,
      avatar: profile.avatar,
      bio: profile.bio,
      bankAccount: profile.bankAccount,
      eWallet: profile.eWallet,
      designerProfile: dProfile,
      buyerProfile: bProfile,
      mustChangePassword: user.mustChangePassword
    }
  });
});

// POST /api/change-password
app.post("/api/change-password", (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: "Sesi Anda telah berakhir. Silakan login kembali." });
  }

  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: "Password lama dan password baru wajib diisi." });
  }

  if (user.passwordHash !== hashPassword(oldPassword)) {
    return res.status(400).json({ error: "Password lama yang Anda masukkan salah." });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({ 
      error: "Password minimal harus 8 karakter dan mengandung setidaknya satu huruf besar, satu huruf kecil, satu angka, dan satu simbol khusus." 
    });
  }

  user.passwordHash = hashPassword(newPassword);
  user.mustChangePassword = false;

  res.json({
    success: true,
    message: "Password Anda berhasil diperbarui! Silakan lanjutkan menjelajah DESAINE."
  });
});

// PUT /api/profile
app.put("/api/profile", (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: "Sesi Anda telah berakhir. Silakan login kembali." });
  }

  const { name, phone, avatar, bio, bankAccount, eWallet, studioName, experience, startingPrice, banner, skills, software, socials } = req.body;

  if (name && name.trim().length >= 3) {
    user.name = name.trim();
  }

  if (phone) {
    const phoneClean = phone.replace(/[^0-9]/g, "");
    if (phoneClean.length >= 10 && phoneClean.length <= 15) {
      user.phone = phoneClean;
    }
  }

  const profile = db_user_profiles.find(p => p.userId === user.id);
  if (profile) {
    if (avatar) profile.avatar = avatar;
    if (bio !== undefined) profile.bio = bio;
    if (bankAccount !== undefined) profile.bankAccount = bankAccount;
    if (eWallet !== undefined) profile.eWallet = eWallet;
  }

  if (user.roleId === "designer") {
    const dProfile = db_designer_profiles.find(p => p.userId === user.id);
    if (dProfile) {
      if (studioName !== undefined) dProfile.studioName = studioName;
      if (experience !== undefined) dProfile.experience = experience;
      if (startingPrice !== undefined) dProfile.startingPrice = Number(startingPrice || 0);
      if (banner !== undefined) dProfile.banner = banner;
      if (skills !== undefined) dProfile.skills = skills;
      if (software !== undefined) dProfile.software = software;
      if (socials !== undefined) dProfile.socials = socials;
    }
  }

  res.json({
    success: true,
    message: "Profil Anda berhasil diperbarui!",
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.roleId,
      balance: user.balance,
      earnings: user.earnings,
      membership: user.membership,
      joinedDate: user.joinedDate,
      avatar: profile ? profile.avatar : "",
      bio: profile ? profile.bio : "",
      bankAccount: profile ? profile.bankAccount : "",
      eWallet: profile ? profile.eWallet : ""
    }
  });
});

// GET /api/designer/profile
app.get("/api/designer/profile", (req, res) => {
  const user = getAuthUser(req);
  if (!user || user.roleId !== "designer") {
    return res.status(403).json({ error: "Hanya desainer yang dapat mengakses profil ini." });
  }

  const dProfile = db_designer_profiles.find(p => p.userId === user.id);
  const links = db_portfolio_links.filter(l => l.userId === user.id);

  res.json({
    success: true,
    profile: dProfile,
    portfolioLinks: links
  });
});

// GET /api/buyer/profile
app.get("/api/buyer/profile", (req, res) => {
  const user = getAuthUser(req);
  if (!user || user.roleId !== "buyer") {
    return res.status(403).json({ error: "Hanya pembeli yang dapat mengakses profil ini." });
  }

  const bProfile = db_buyer_profiles.find(p => p.userId === user.id);

  res.json({
    success: true,
    profile: bProfile
  });
});

// Balance state sync endpoints
app.get("/api/user/state", (req, res) => {
  const user = getAuthUser(req);
  if (user) {
    const userWds = withdrawsList.filter(w => w.userId === user.id);
    return res.json({ balance: user.balance, earnings: user.earnings, withdraws: userWds });
  }
  res.json({ balance: mockBalance, earnings: mockEarnings, withdraws: withdrawsList });
});

// Products catalog endpoints
app.get("/api/products", (req, res) => {
  res.json(mockProducts);
});

app.post("/api/products", (req, res) => {
  const newProduct = req.body;
  if (!newProduct || !newProduct.title) {
    return res.status(400).json({ error: "Data produk tidak lengkap" });
  }

  const user = getAuthUser(req);
  if (user) {
    newProduct.sellerId = user.id;
    newProduct.sellerName = user.name;
    const profile = db_user_profiles.find(p => p.userId === user.id);
    newProduct.sellerAvatar = profile ? profile.avatar : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";
  }

  mockProducts.unshift(newProduct);
  res.json({ success: true, products: mockProducts });
});

app.post("/api/admin/product/approve", (req, res) => {
  const { productId } = req.body;
  const prod = mockProducts.find(p => p.id === productId);
  if (prod) {
    prod.status = "active";
  }
  res.json({ success: true, products: mockProducts });
});

// Post custom project
app.post("/api/projects", (req, res) => {
  const newProject = req.body;
  if (!newProject || !newProject.title) {
    return res.status(400).json({ error: "Data project tidak lengkap" });
  }

  const user = getAuthUser(req);
  if (user) {
    newProject.clientId = user.id;
    newProject.clientName = user.name;
  }

  customProjects.unshift(newProject);
  res.json({ success: true, projects: customProjects });
});

app.post("/api/user/withdraw", (req, res) => {
  const { amount, gateway } = req.body;
  const numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: "Jumlah penarikan saldo tidak valid" });
  }

  const user = getAuthUser(req);
  if (user) {
    if (numAmount > user.earnings) {
      return res.status(400).json({ error: "Saldo penghasilan tidak mencukupi untuk ditarik" });
    }
    user.earnings -= numAmount;
    const newWithdraw = {
      id: `wd_${Date.now()}`,
      userId: user.id,
      date: new Date().toISOString().split("T")[0],
      amount: numAmount,
      status: "pending",
      gateway: gateway || "GoPay"
    };
    withdrawsList.unshift(newWithdraw);
    const userWds = withdrawsList.filter(w => w.userId === user.id);
    return res.json({ success: true, balance: user.balance, earnings: user.earnings, withdraws: userWds });
  }

  if (numAmount > mockEarnings) {
    return res.status(400).json({ error: "Saldo penghasilan tidak mencukupi untuk ditarik" });
  }

  mockEarnings -= numAmount;
  const newWithdraw = {
    id: `wd_${Date.now()}`,
    userId: "sell_01",
    date: new Date().toISOString().split("T")[0],
    amount: numAmount,
    status: "pending",
    gateway: gateway || "GoPay"
  };
  withdrawsList.unshift(newWithdraw);
  res.json({ success: true, balance: mockBalance, earnings: mockEarnings, withdraws: withdrawsList });
});

app.post("/api/admin/withdraw/approve", (req, res) => {
  const { id } = req.body;
  const wd = withdrawsList.find(w => w.id === id);
  if (wd) {
    wd.status = "completed";
    // If it's a real user's withdraw log, we already deducted it. If not, deduct from mock.
    if (!wd.userId) {
      // already deducted in mockEarnings
    }
  }
  res.json({ success: true, withdraws: withdrawsList });
});

// Payment simulate
app.post("/api/payment/checkout", (req, res) => {
  const { productId, amount, title, licenseType } = req.body;
  
  const user = getAuthUser(req);
  if (user) {
    if (user.balance < amount) {
      return res.status(400).json({ error: "Saldo Dompet Desaine Anda tidak cukup. Silakan isi saldo atau gunakan metode Virtual Account/QRIS simulasi." });
    }
    user.balance -= amount;
    
    // Distribute to seller (90%) and platform (10%)
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      product.sales += 1;
      const sellerId = product.sellerId;
      const seller = db_users.find(u => u.id === sellerId);
      if (seller) {
        seller.earnings += Math.floor(amount * 0.9);
      } else {
        mockEarnings += Math.floor(amount * 0.9);
      }
    } else {
      mockEarnings += Math.floor(amount * 0.9);
    }

    return res.json({
      success: true,
      invoiceId: `INV-${Date.now().toString().slice(-6)}`,
      amount,
      title,
      licenseType,
      date: new Date().toISOString().split("T")[0],
      userBalance: user.balance,
      sellerEarnings: user.earnings
    });
  }

  if (mockBalance < amount) {
    return res.status(400).json({ error: "Saldo Dompet Desaine Anda tidak cukup. Silakan isi saldo atau gunakan metode Virtual Account/QRIS simulasi." });
  }

  mockBalance -= amount;
  mockEarnings += Math.floor(amount * 0.9); // 10% platform commission

  // Update mock sales count
  const prod = mockProducts.find(p => p.id === productId);
  if (prod) {
    prod.sales += 1;
  }

  res.json({
    success: true,
    invoiceId: `INV-${Date.now().toString().slice(-6)}`,
    amount,
    title,
    licenseType,
    date: new Date().toISOString().split("T")[0],
    userBalance: mockBalance,
    sellerEarnings: mockEarnings
  });
});

// Secure download generator with license certificate
app.get("/api/download/:productId", (req, res) => {
  const productId = req.params.productId;
  
  const products = [
    { id: "prod_01", filename: "saas_dashboard_uikit.zip", size: "42.5 MB" },
    { id: "prod_02", filename: "instagram_carousel_umkm.zip", size: "18.2 MB" },
    { id: "prod_03", filename: "3d_tech_illustration.zip", size: "155.0 MB" },
    { id: "prod_04", filename: "startup_pitchdeck.zip", size: "24.1 MB" },
    { id: "prod_05", filename: "coffee_mockup_pack.zip", size: "85.6 MB" }
  ];

  const match = products.find(p => p.id === productId) || { id: "unknown", filename: "desaine_license.zip", size: "1.0 MB" };

  res.setHeader("Content-Disposition", `attachment; filename="SECURE_${match.filename}"`);
  res.setHeader("Content-Type", "application/octet-stream");

  // Create highly professional aesthetic text license certificate instead of corrupt binary
  const licenseCertificate = `
========================================================================
                      DESAINE - DIGITAL MARKETPLACE
                  SUITE 404, INDONESIAN CREATIVE HUB
========================================================================
CERTIFICATE OF DIGITAL LICENSE & PURCHASE RECEIPT
Generated on: ${new Date().toISOString()}

Licensed Product ID : ${match.id}
Package Filename    : SECURE_${match.filename}
File Size           : ${match.size}
Authorized License  : COMMERCIAL USE GRANTED

========================================================================
TERMS OF USE (LISENSI KOMERSIAL):
1. Anda diperbolehkan menggunakan aset ini untuk kebutuhan pribadi atau klien komersial.
2. Anda TIDAK diperbolehkan mendistribusikan ulang, menjual kembali, atau 
   membagikan link download mentah file ini kepada pihak ketiga tanpa persetujuan tertulis.
3. Seluruh hak cipta desain asli tetap dimiliki oleh desainer terverifikasi Desaine.

Terima kasih telah mendukung kreator lokal Indonesia!
Desaine.id - Platform Ekosistem Desain Terbesar di Indonesia
========================================================================
  `;

  res.send(Buffer.from(licenseCertificate));
});

// Custom Project simulation
app.get("/api/projects", (req, res) => {
  res.json(customProjects);
});

app.post("/api/projects/proposal", (req, res) => {
  const { projectId, designerName, designerId, designerAvatar, designerRating, amount, deliveryDays, coverLetter } = req.body;
  const proj = customProjects.find(p => p.id === projectId);
  if (!proj) return res.status(404).json({ error: "Project tidak ditemukan" });

  const user = getAuthUser(req);
  const realDesignerName = user ? user.name : (designerName || "Desainer Anonim");
  const realDesignerId = user ? user.id : (designerId || "sell_01");
  const profile = user ? db_user_profiles.find(p => p.userId === user.id) : null;
  const realDesignerAvatar = profile ? profile.avatar : (designerAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80");

  const newProp = {
    id: `prop_${Date.now()}`,
    designerId: realDesignerId,
    designerName: realDesignerName,
    designerAvatar: realDesignerAvatar,
    designerRating: Number(designerRating || 5.0),
    amount: Number(amount),
    deliveryDays: Number(deliveryDays),
    coverLetter,
    status: "pending" as const
  };
  proj.proposals.push(newProp);
  res.json({ success: true, project: proj });
});

app.post("/api/projects/escrow-fund", (req, res) => {
  const { projectId, proposalId, milestoneId } = req.body;
  const proj = customProjects.find(p => p.id === projectId);
  if (!proj) return res.status(404).json({ error: "Project tidak ditemukan" });

  const user = getAuthUser(req);

  if (milestoneId) {
    const ms = proj.milestones.find(m => m.id === milestoneId);
    if (ms) {
      if (user) {
        if (user.balance < ms.amount) {
          return res.status(400).json({ error: "Saldo Dompet Desaine Anda tidak cukup untuk mendanai milestone ini." });
        }
        user.balance -= ms.amount;
        ms.status = "funded";
        return res.json({ success: true, project: proj, userBalance: user.balance });
      } else {
        if (mockBalance < ms.amount) {
          return res.status(400).json({ error: "Saldo Dompet Desaine Anda tidak cukup untuk mendanai milestone ini." });
        }
        mockBalance -= ms.amount;
        ms.status = "funded";
        return res.json({ success: true, project: proj, userBalance: mockBalance });
      }
    }
  } else if (proposalId) {
    // Fund all milestones or choose proposal
    const prop = proj.proposals.find(p => p.id === proposalId);
    if (prop) {
      prop.status = "approved";
      proj.status = "ongoing";
      // Auto-fund first milestone
      proj.milestones[0].status = "funded";
      if (user) {
        user.balance -= proj.milestones[0].amount;
        return res.json({ success: true, project: proj, userBalance: user.balance });
      } else {
        mockBalance -= proj.milestones[0].amount;
        return res.json({ success: true, project: proj, userBalance: mockBalance });
      }
    }
  }

  res.json({ success: true, project: proj, userBalance: user ? user.balance : mockBalance });
});

app.post("/api/projects/escrow-release", (req, res) => {
  const { projectId, milestoneId } = req.body;
  const proj = customProjects.find(p => p.id === projectId);
  if (!proj) return res.status(440).json({ error: "Project tidak ditemukan" });

  const user = getAuthUser(req);
  const ms = proj.milestones.find(m => m.id === milestoneId);
  if (ms && ms.status === "funded") {
    ms.status = "released";
    // Add to designer's earnings
    const prop = proj.proposals.find(p => p.id === proj.chosenProposalId);
    const designerId = prop ? prop.designerId : "sell_01";
    const designer = db_users.find(u => u.id === designerId);
    if (designer) {
      designer.earnings += ms.amount;
    } else {
      mockEarnings += ms.amount;
    }
  }

  // Check if all milestones released to mark project completed
  const allReleased = proj.milestones.every(m => m.status === "released");
  if (allReleased) {
    proj.status = "completed";
  }

  res.json({ success: true, project: proj, sellerEarnings: user ? user.earnings : mockEarnings });
});

// Global Error-Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(`[SYSTEM ERROR] Unhandled API error at ${req.method} ${req.url}:`, err);
  res.status(500).json({
    error: "Terjadi kesalahan internal pada server Desaine. Tim teknik kami telah dinotifikasi.",
    message: process.env.NODE_ENV === "production" ? undefined : err.message
  });
});

// Mount Vite Dev Server or Production Static Handlers
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware integrated.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, {
      maxAge: "1d",
      etag: true,
      lastModified: true
    }));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Static production handlers mounted with aggressive caching.");
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`DESAINE platform backend running at http://0.0.0.0:${PORT}`);
  });

  // Graceful Shutdown routines
  const handleShutdown = (signal: string) => {
    console.log(`[SHUTDOWN] Received ${signal}. Closing active connections...`);
    server.close(() => {
      console.log("[SHUTDOWN] HTTP server closed. Exiting process.");
      process.exit(0);
    });
    
    // Force close after 10s
    setTimeout(() => {
      console.error("[SHUTDOWN] Forceful termination initiated.");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => handleShutdown("SIGTERM"));
  process.on("SIGINT", () => handleShutdown("SIGINT"));
}

// Global Process Uncaught Listeners
process.on("unhandledRejection", (reason, promise) => {
  console.error("[CRITICAL] Unhandled Promise Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("[CRITICAL] Uncaught Exception occurred:", error);
  // It is recommended to exit with failure after uncaughtException to avoid undefined memory states
  process.exit(1);
});

startServer();
