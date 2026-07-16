import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  Phone, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  ShoppingCart, 
  Palette, 
  Github, 
  KeyRound, 
  Check, 
  Upload, 
  Sparkles, 
  ExternalLink,
  Smartphone,
  Eye,
  EyeOff,
  UserCheck2,
  Wallet,
  ShieldCheck,
  X
} from "lucide-react";

// Types
interface AuthUser {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: "buyer" | "designer" | "admin";
  balance: number;
  earnings: number;
  membership: string;
  joinedDate: string;
  avatar: string;
}

interface AuthScreensProps {
  onSuccess: (user: AuthUser, token: string) => void;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export default function AuthScreens({ onSuccess, onClose, initialMode = "login" }: AuthScreensProps) {
  const [mode, setMode] = useState<"login" | "register" | "forgot" | "verify" | "onboarding">(initialMode);
  const [selectedRole, setSelectedRole] = useState<"buyer" | "designer" | null>(null);
  
  // Registration and Login state
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // Role specific states (Designer)
  const [studioName, setStudioName] = useState("");
  const [experience, setExperience] = useState("1-3 Tahun");
  const [keahlian, setKeahlian] = useState("UI UX");
  const [portfolioLink, setPortfolioLink] = useState("");

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Verification State
  const [pendingUserId, setPendingUserId] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [userOtpInput, setUserOtpInput] = useState("");
  const [isOtpSuccess, setIsOtpSuccess] = useState(false);

  // Onboarding State for Designer
  const [tempToken, setTempToken] = useState("");
  const [onboardUser, setOnboardUser] = useState<AuthUser | null>(null);
  const [bio, setBio] = useState("");
  const [startingPrice, setStartingPrice] = useState("150000");
  const [skillsSelected, setSkillsSelected] = useState<string[]>(["UI UX"]);
  const [softwares, setSoftwares] = useState<string[]>(["Figma"]);
  const [instagram, setInstagram] = useState("");
  const [behance, setBehance] = useState("");
  const [dribbble, setDribbble] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [eWallet, setEWallet] = useState("");
  const [bannerUrl, setBannerUrl] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80");
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80");

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score, label: "Sangat Lemah", color: "bg-rose-500 w-0" };
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[@$!%*?&]/.test(pass)) score++;

    switch (score) {
      case 1: return { score, label: "Sangat Lemah", color: "bg-rose-500 w-1/5" };
      case 2: return { score, label: "Lemah", color: "bg-orange-500 w-2/5" };
      case 3: return { score, label: "Sedang", color: "bg-amber-500 w-3/5" };
      case 4: return { score, label: "Kuat", color: "bg-emerald-500 w-4/5" };
      case 5: return { score, label: "Sangat Kuat", color: "bg-teal-500 w-full" };
      default: return { score, label: "Sangat Lemah", color: "bg-rose-500 w-0" };
    }
  };

  const strength = getPasswordStrength(password);

  // Clean error after delay
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handle registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError("Anda harus menyetujui Syarat dan Ketentuan untuk mendaftar.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          username,
          email,
          phone,
          password,
          role: selectedRole,
          studioName: selectedRole === "designer" ? studioName : undefined,
          experience: selectedRole === "designer" ? experience : undefined,
          keahlian: selectedRole === "designer" ? keahlian : undefined,
          portfolioLink: selectedRole === "designer" ? portfolioLink : undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Pendaftaran gagal.");
      }

      setPendingUserId(data.userId);
      setVerificationToken(data.emailToken);
      setOtpCode(data.otpCode);
      setSuccess("Registrasi Berhasil! Silakan lakukan verifikasi.");
      setMode("verify");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Email Verification Simulation
  const handleVerifyEmailSimulated = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: verificationToken })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Verifikasi gagal.");
      }

      setSuccess("Email berhasil diverifikasi! Silakan login.");
      setMode("login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Code check
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (userOtpInput === otpCode) {
      setIsOtpSuccess(true);
      handleVerifyEmailSimulated();
    } else {
      setError("Kode OTP yang Anda masukkan salah.");
    }
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: email, // works with username or email
          password,
          rememberMe: true
        })
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.isNotVerified) {
          setVerificationToken(data.emailToken);
          setMode("verify");
          throw new Error("Akun Anda belum diverifikasi. Silakan periksa email/OTP Anda.");
        }
        throw new Error(data.error || "Gagal masuk.");
      }

      if (data.user.role === "designer") {
        // Designer first-time login onboarding check
        setTempToken(data.token);
        setOnboardUser(data.user);
        // Pre-populate onboarding fields
        setBio(`Desainer profesional dengan keahlian utama di bidang ${keahlian || "UI UX"}.`);
        setMode("onboarding");
      } else {
        onSuccess(data.user, data.token);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Onboarding Completion for Designer
  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tempToken}`
        },
        body: JSON.stringify({
          bio,
          startingPrice: Number(startingPrice),
          skills: skillsSelected,
          software: softwares,
          socials: { instagram, behance, dribbble },
          bankAccount,
          eWallet,
          banner: bannerUrl,
          avatar: avatarUrl
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan onboarding.");
      }

      if (onboardUser) {
        const updatedUser = {
          ...onboardUser,
          avatar: avatarUrl,
          balance: data.user.balance,
          earnings: data.user.earnings
        };
        onSuccess(updatedUser, tempToken);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password link trigger
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirim pemulihan.");
      }
      setResetToken(data.resetToken);
      setSuccess("Link reset kata sandi telah disimulasikan. Silakan isi password baru.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, password: newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mereset sandi.");
      }
      setSuccess("Sandi berhasil diperbarui! Silakan masuk kembali.");
      setMode("login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Pre-configured elegant Designer Avatars for onboarding selection
  const designerAvatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  ];

  // Pre-configured Banners for design studio
  const designerBanners = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1618005198143-e5283b519a7f?w=1200&auto=format&fit=crop&q=80",
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-lg flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden grid md:grid-cols-12 text-slate-100"
      >
        {/* Left Side: Aesthetic Brand Banner */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-tr from-blue-900 via-indigo-950 to-slate-900 p-8 flex-col justify-between border-r border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm">
                D
              </div>
              <span className="font-extrabold text-lg tracking-tight">DESAINE<span className="text-blue-500 font-bold">.</span></span>
            </div>
            <div className="mt-12 space-y-4">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                Hubungkan Ide Kreatif dengan Kebutuhan Dunia
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Platform ekosistem kreatif terbesar di Indonesia untuk memasarkan aset desain premium, kolaborasi custom order, dan mengikuti sayembara desain.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Proteksi Pembayaran Escrow Handal</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              v2.1.0 • Secure Authentication System
            </div>
          </div>
        </div>

        {/* Right Side: Dynamic Screens */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center min-h-[500px]">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 p-1.5 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Feedback alerts */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-start space-x-2 text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-start space-x-2 text-xs"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </motion.div>
          )}

          {/* SCREEN: ROLE SELECTION */}
          {mode === "register" && selectedRole === null && (
            <div className="space-y-6">
              <div>
                <span className="text-xs text-blue-400 uppercase tracking-widest font-mono">Langkah 1 dari 2</span>
                <h2 className="text-2xl font-extrabold mt-1">Pilih Jenis Akun Anda</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Pilih bagaimana Anda ingin berpartisipasi di ekosistem DESAINE.
                </p>
              </div>

              <div className="grid gap-4">
                {/* BUYER CARD */}
                <button
                  onClick={() => setSelectedRole("buyer")}
                  className="flex items-start text-left p-4 rounded-2xl border border-slate-800 bg-slate-900 hover:bg-slate-850 hover:border-blue-500 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                    🛒
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-bold text-slate-100">Daftar Sebagai Pembeli (Buyer)</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Saya ingin membeli desain digital untuk kebutuhan pribadi, tugas kuliah, bisnis, sekolah, atau perusahaan.
                    </p>
                  </div>
                </button>

                {/* SELLER CARD */}
                <button
                  onClick={() => setSelectedRole("designer")}
                  className="flex items-start text-left p-4 rounded-2xl border border-slate-800 bg-slate-900 hover:bg-slate-850 hover:border-indigo-500 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                    🎨
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-bold text-slate-100">Daftar Sebagai Desainer (Seller)</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Saya ingin menawarkan jasa desain kustom, menjual template aset digital, atau mengikuti sayembara desain.
                    </p>
                  </div>
                </button>
              </div>

              <div className="text-center pt-4 border-t border-slate-800/50">
                <p className="text-xs text-slate-400">
                  Sudah memiliki akun?{" "}
                  <button onClick={() => setMode("login")} className="text-blue-400 hover:underline font-semibold">
                    Masuk
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* SCREEN: REGISTRATION FORM */}
          {mode === "register" && selectedRole !== null && (
            <div className="space-y-4">
              <button 
                onClick={() => setSelectedRole(null)}
                className="flex items-center text-xs text-slate-400 hover:text-white mb-2"
              >
                <ArrowLeft className="w-3 h-3 mr-1" /> Kembali ke pemilihan akun
              </button>

              <div>
                <span className="text-xs text-blue-400 uppercase tracking-widest font-mono">Langkah 2 dari 2</span>
                <h2 className="text-xl font-extrabold mt-0.5">
                  Registrasi {selectedRole === "buyer" ? "Pembeli" : "Desainer"}
                </h2>
                <p className="text-xs text-slate-400">
                  Lengkapi form berikut dengan data asli Anda.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Nama Lengkap</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="Zaky Alfi"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-hidden focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Username</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs font-mono text-slate-500">@</span>
                      <input
                        type="text"
                        required
                        placeholder="zakya"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 pl-7 pr-3 text-xs text-white focus:outline-hidden focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                      <input
                        type="email"
                        required
                        placeholder="name@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-hidden focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Nomor HP (WhatsApp)</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                      <input
                        type="tel"
                        required
                        placeholder="081234567890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-hidden focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* ROLE SPECIFIC FIELDS */}
                {selectedRole === "designer" && (
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Nama Studio / Brand (Opsional)</label>
                      <input
                        type="text"
                        placeholder="Pratama Design Studio"
                        value={studioName}
                        onChange={(e) => setStudioName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-2.5 text-xs text-white focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Keahlian Utama</label>
                      <select
                        value={keahlian}
                        onChange={(e) => setKeahlian(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-2 text-xs text-white"
                      >
                        <option value="UI UX">UI UX & Web</option>
                        <option value="Logo">Logo & Branding</option>
                        <option value="Poster">Poster & Social Media</option>
                        <option value="Illustration">Illustration & Vector</option>
                        <option value="3D">3D Model Assets</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Link Portofolio Utama (Dribbble/Behance)</label>
                      <input
                        type="url"
                        placeholder="https://behance.net/username"
                        value={portfolioLink}
                        onChange={(e) => setPortfolioLink(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-2.5 text-xs text-white"
                      />
                    </div>
                  </div>
                )}

                {/* Password field */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400">Kata Sandi</label>
                    {password && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-slate-800">
                        {strength.label}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Kata sandi minimal 8 karakter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 pl-9 pr-9 text-xs text-white focus:outline-hidden focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength Bar */}
                  {password && (
                    <div className="w-full bg-slate-850 h-1 rounded-full mt-1.5 overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${strength.color}`} />
                    </div>
                  )}
                  {password && (
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      Wajib mengandung: 8+ karakter, huruf besar, huruf kecil, angka, dan simbol.
                    </p>
                  )}
                </div>

                {/* Terms and Conditions checkbox */}
                <label className="flex items-start space-x-2.5 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded-sm border-slate-700 bg-slate-950 text-blue-500 focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="text-[10px] text-slate-400 leading-normal">
                    Saya menyetujui <span className="text-blue-400 font-bold hover:underline">Syarat & Ketentuan</span> serta <span className="text-blue-400 font-bold hover:underline">Kebijakan Privasi</span> DESAINE.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 mt-3 flex items-center justify-center space-x-1"
                >
                  {loading ? "Memproses..." : "Daftar Akun"}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-slate-800/40">
                <p className="text-xs text-slate-400">
                  Sudah memiliki akun?{" "}
                  <button onClick={() => setMode("login")} className="text-blue-400 hover:underline font-semibold">
                    Masuk
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* SCREEN: VERIFICATION ACCOUNT */}
          {mode === "verify" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto text-2xl animate-bounce">
                  📧
                </div>
                <h2 className="text-xl font-extrabold mt-4">Verifikasikan Akun Anda</h2>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                  Kami telah mengirimkan link verifikasi email dan kode OTP ke HP Anda. Masukkan kode OTP di bawah ini untuk mengaktifkan akun Anda.
                </p>
              </div>

              {/* simulated codes panel */}
              <div className="p-3.5 rounded-2xl bg-blue-950/20 border border-blue-500/20 text-xs text-slate-300">
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold block mb-1">📦 Simulator Kotak Masuk</span>
                <p className="text-[11px] leading-relaxed">
                  [Simulasi Email] Token verifikasi Anda: <span className="font-mono bg-slate-900 px-1 py-0.5 rounded text-yellow-400 border border-slate-800">{verificationToken}</span>
                </p>
                <p className="text-[11px] leading-relaxed mt-1">
                  [Simulasi SMS] OTP WhatsApp Anda: <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded text-teal-400 font-extrabold border border-slate-800">{otpCode}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1.5 text-center">Masukkan 6 Digit OTP</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Contoh: 123456"
                    value={userOtpInput}
                    onChange={(e) => setUserOtpInput(e.target.value)}
                    className="w-full max-w-[200px] mx-auto text-center font-mono font-extrabold bg-slate-950 border border-slate-850 rounded-xl py-3 text-lg text-white tracking-widest focus:outline-hidden focus:border-blue-500 focus:ring-0 block"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleVerifyEmailSimulated}
                    disabled={loading}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center space-x-1"
                  >
                    <span>Simulasikan Klik Link Email</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-md transition-all"
                  >
                    {loading ? "Verifikasi..." : "Verifikasi OTP HP"}
                  </button>
                </div>
              </form>

              <div className="text-center">
                <button 
                  onClick={() => {
                    setError("");
                    setMode("login");
                  }} 
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Kembali ke halaman login
                </button>
              </div>
            </div>
          )}

          {/* SCREEN: LOGIN SCREEN */}
          {mode === "login" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold">Selamat Datang Kembali</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Masukkan akun DESAINE Anda untuk melanjutkan transaksi dan pameran portofolio.
                </p>
              </div>

              {/* Mock accounts help box */}
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-850 text-[11px] text-slate-400 leading-relaxed">
                <span className="font-bold text-blue-400 uppercase tracking-widest text-[9px] block mb-1">Akses Cepat Developer (Gunakan Sandi: <span className="text-white">Password123!</span>)</span>
                <div>• Pembeli: <span className="font-mono text-slate-300">alfiyanzaky85@gmail.com</span> atau <span className="font-mono text-slate-300">zakya</span></div>
                <div>• Desainer: <span className="font-mono text-slate-300">pratama@desaine.com</span> atau <span className="font-mono text-slate-300">pratama</span></div>
                <div>• Admin: <span className="font-mono text-slate-300">admin@desaine.com</span> atau <span className="font-mono text-slate-300">admin</span></div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Email atau Username</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Masukkan email atau username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-hidden focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400">Kata Sandi</label>
                    <button 
                      type="button" 
                      onClick={() => setMode("forgot")} 
                      className="text-[10px] text-blue-400 hover:underline"
                    >
                      Lupa Sandi?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Masukkan kata sandi Anda"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 pl-9 pr-9 text-xs text-white focus:outline-hidden focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? "Menghubungkan..." : "Masuk Platform"}
                </button>
              </form>

              {/* Social Login Integrations */}
              <div className="space-y-3 pt-2">
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-800"></div>
                  <span className="flex-shrink mx-4 text-slate-500 text-[10px] uppercase font-bold tracking-widest">atau masuk dengan</span>
                  <div className="flex-grow border-t border-slate-800"></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setLoading(true);
                      setTimeout(() => {
                        setLoading(false);
                        // Simulate Google login as user_01
                        setEmail("alfiyanzaky85@gmail.com");
                        setPassword("Password123!");
                        setError("Klik 'Masuk Platform' untuk menyelesaikan login Google yang disimulasikan.");
                      }, 800);
                    }}
                    className="flex items-center justify-center space-x-2 bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-slate-300 hover:bg-slate-900 transition-all cursor-pointer"
                  >
                    <span className="text-sm font-bold text-red-500">G</span>
                    <span>Google Secure</span>
                  </button>
                  <button
                    onClick={() => {
                      setLoading(true);
                      setTimeout(() => {
                        setLoading(false);
                        // Simulate Github login as sell_01
                        setEmail("pratama@desaine.com");
                        setPassword("Password123!");
                        setError("Klik 'Masuk Platform' untuk menyelesaikan login GitHub yang disimulasikan.");
                      }, 800);
                    }}
                    className="flex items-center justify-center space-x-2 bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-slate-300 hover:bg-slate-900 transition-all cursor-pointer"
                  >
                    <Github className="w-3.5 h-3.5 text-slate-100" />
                    <span>GitHub Hub</span>
                  </button>
                </div>
              </div>

              <div className="text-center pt-2 border-t border-slate-800/40">
                <p className="text-xs text-slate-400">
                  Belum memiliki akun?{" "}
                  <button onClick={() => setMode("register")} className="text-blue-400 hover:underline font-semibold">
                    Daftar Baru
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* SCREEN: FORGOT PASSWORD */}
          {mode === "forgot" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold">Pemulihan Akun</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Masukkan email terdaftar Anda untuk menerima tautan pemulihan kata sandi.
                </p>
              </div>

              {resetToken && (
                <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs">
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold block mb-1">🔗 Simulator Tautan Reset Sandi</span>
                  <p className="text-[11px]">
                    Token pemulihan Anda: <span className="font-mono bg-slate-900 px-1 py-0.5 rounded text-yellow-400 border border-slate-800">{resetToken}</span>
                  </p>
                </div>
              )}

              {!resetToken ? (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Alamat Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                      <input
                        type="email"
                        required
                        placeholder="Contoh: user@email.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                  >
                    {loading ? "Mengirim..." : "Kirim Link Pemulihan"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Kata Sandi Baru</label>
                    <input
                      type="password"
                      required
                      placeholder="Masukkan kata sandi baru"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                  >
                    {loading ? "Menyimpan..." : "Simpan Kata Sandi Baru"}
                  </button>
                </form>
              )}

              <div className="text-center">
                <button 
                  onClick={() => {
                    setResetToken("");
                    setMode("login");
                  }} 
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Kembali ke halaman masuk
                </button>
              </div>
            </div>
          )}

          {/* SCREEN: DESIGNER ONBOARDING */}
          {mode === "onboarding" && (
            <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
              <div className="text-center py-2">
                <Sparkles className="w-8 h-8 text-yellow-400 mx-auto animate-pulse" />
                <h2 className="text-lg font-extrabold mt-1">Lengkapi Studio Desain Anda</h2>
                <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                  Langkah penting bagi seller baru untuk mulai mempublikasikan aset digital dan menarik perhatian klien di marketplace.
                </p>
              </div>

              <form onSubmit={handleOnboardingSubmit} className="space-y-4">
                {/* Visual Customizers (Avatar & Banner) */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-850 space-y-3">
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-slate-400 mb-1.5 font-bold">Pilih Avatar Studio Anda</label>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={avatarUrl} 
                        alt="Preview" 
                        className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover" 
                      />
                      <div className="flex space-x-2">
                        {designerAvatars.map((av, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setAvatarUrl(av)}
                            className={`w-7 h-7 rounded-full overflow-hidden border ${avatarUrl === av ? 'border-blue-500 scale-110' : 'border-slate-700'}`}
                          >
                            <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-slate-400 mb-1.5 font-bold">Pilih Banner Galeri Toko</label>
                    <div className="flex flex-col space-y-2">
                      <img 
                        src={bannerUrl} 
                        alt="Banner Preview" 
                        className="w-full h-12 rounded-lg object-cover border border-slate-850" 
                      />
                      <div className="flex space-x-2 overflow-x-auto py-1">
                        {designerBanners.map((bn, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setBannerUrl(bn)}
                            className={`w-14 h-7 rounded-md overflow-hidden shrink-0 border ${bannerUrl === bn ? 'border-blue-500 scale-105' : 'border-slate-800'}`}
                          >
                            <img src={bn} alt="Banner option" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Deskripsi Bio / Studio</label>
                    <textarea
                      required
                      placeholder="Tulis kelebihan studio desain Anda atau penawaran jasa utama Anda..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 text-xs text-white h-16 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Harga Mulai Dari (Rp)</label>
                      <input
                        type="number"
                        required
                        value={startingPrice}
                        onChange={(e) => setStartingPrice(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Tag software yang dikuasai</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {["Figma", "Photoshop", "Illustrator", "Blender", "Canva"].map(sw => {
                          const active = softwares.includes(sw);
                          return (
                            <button
                              key={sw}
                              type="button"
                              onClick={() => {
                                if (active) {
                                  setSoftwares(softwares.filter(s => s !== sw));
                                } else {
                                  setSoftwares([...softwares, sw]);
                                }
                              }}
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${active ? 'bg-blue-600/20 text-blue-400 border-blue-500/40' : 'bg-slate-950 text-slate-500 border-slate-850'}`}
                            >
                              {sw}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Social Link Inputs */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 space-y-2">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Tautan Sosial Media</span>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Instagram (username)"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-2 text-[11px] text-white"
                      />
                      <input
                        type="text"
                        placeholder="Behance (username)"
                        value={behance}
                        onChange={(e) => setBehance(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-2 text-[11px] text-white"
                      />
                      <input
                        type="text"
                        placeholder="Dribbble (username)"
                        value={dribbble}
                        onChange={(e) => setDribbble(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-2 text-[11px] text-white"
                      />
                    </div>
                  </div>

                  {/* Payment integration info */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 space-y-2">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Integrasi Rekening & E-Wallet untuk Pencairan Saldo</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] text-slate-500 mb-0.5">Rekening Bank</label>
                        <input
                          type="text"
                          placeholder="Nomor BCA/Mandiri"
                          value={bankAccount}
                          onChange={(e) => setBankAccount(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-2 text-[11px] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-slate-500 mb-0.5">E-Wallet (GoPay/OVO)</label>
                        <input
                          type="text"
                          placeholder="Nomor E-Wallet"
                          value={eWallet}
                          onChange={(e) => setEWallet(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-2 text-[11px] text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-2 rounded-xl text-xs shadow-lg transition-all"
                >
                  {loading ? "Menyimpan Studio..." : "Luncurkan Studio Desain Saya! 🚀"}
                </button>
              </form>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
