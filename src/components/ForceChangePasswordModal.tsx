import { useState } from "react";
import { Lock, KeyRound, ShieldAlert, CheckCircle2, AlertCircle, RefreshCw, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";

interface ForceChangePasswordModalProps {
  authToken: string;
  onSuccess: () => void;
}

export default function ForceChangePasswordModal({ authToken, onSuccess }: ForceChangePasswordModalProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password rules validation
  const rules = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    digit: /\d/.test(newPassword),
    special: /[@$!%*?&]/.test(newPassword),
  };

  const isPasswordValid = Object.values(rules).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!oldPassword) {
      setError("Password lama wajib diisi.");
      return;
    }

    if (!isPasswordValid) {
      setError("Password baru tidak memenuhi syarat keamanan.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password baru tidak cocok.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal memperbarui password.");
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden"
      >
        {/* Banner */}
        <div className="bg-gradient-to-r from-red-500 to-amber-600 p-6 text-white flex items-center space-x-4">
          <div className="bg-white/15 p-3 rounded-2xl">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-sans tracking-tight">Ganti Password Wajib</h2>
            <p className="text-xs text-white/90">Silakan ganti password bawaan Super Admin Anda.</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center space-y-4"
            >
              <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-2xl mb-2">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Password Diperbarui!</h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                Kata sandi baru berhasil disimpan. Mengalihkan Anda ke dasbor dalam beberapa saat...
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Password Lama */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Password Lama Bawaan</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Masukkan Admin123!"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Baru */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Password Baru Anda</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 8 karakter, huruf besar, angka, simbol"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements Checklist */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Persyaratan Keamanan:</p>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  <span className={`text-[10px] flex items-center space-x-1 font-medium ${rules.length ? "text-emerald-600" : "text-slate-400"}`}>
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>Min. 8 Karakter</span>
                  </span>
                  <span className={`text-[10px] flex items-center space-x-1 font-medium ${rules.uppercase ? "text-emerald-600" : "text-slate-400"}`}>
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>Huruf Besar (A-Z)</span>
                  </span>
                  <span className={`text-[10px] flex items-center space-x-1 font-medium ${rules.lowercase ? "text-emerald-600" : "text-slate-400"}`}>
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>Huruf Kecil (a-z)</span>
                  </span>
                  <span className={`text-[10px] flex items-center space-x-1 font-medium ${rules.digit ? "text-emerald-600" : "text-slate-400"}`}>
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>Angka (0-9)</span>
                  </span>
                  <span className={`text-[10px] flex items-center space-x-1 font-medium ${rules.special ? "text-emerald-600" : "text-slate-400"}`}>
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>Simbol (@$!%*?&)</span>
                  </span>
                </div>
              </div>

              {/* Konfirmasi Password Baru */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Konfirmasi Password Baru</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang password baru Anda"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !isPasswordValid || !confirmPassword || newPassword !== confirmPassword}
                className="w-full py-2.5 bg-gradient-to-r from-red-500 to-amber-600 hover:from-red-600 hover:to-amber-700 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-500/15 flex items-center justify-center space-x-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Perbarui & Masuk Platform</span>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
