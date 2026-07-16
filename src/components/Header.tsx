import { useState } from "react";
import { AppRole, User } from "../types";
import { Wallet, LogIn, LogOut, ChevronDown, Sparkles, BookOpen, UserCheck, ShieldAlert, MonitorPlay, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  currentUser: User;
  isLoggedIn: boolean;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLogout: () => void;
  activeRole: AppRole;
  setActiveRole: (role: AppRole) => void;
  buyerBalance: number;
  sellerEarnings: number;
  onOpenCheckoutModal: () => void;
  onOpenAIAssistant: () => void;
}

export default function Header({
  currentUser,
  isLoggedIn,
  onOpenLogin,
  onOpenRegister,
  onLogout,
  activeRole,
  setActiveRole,
  buyerBalance,
  sellerEarnings,
  onOpenCheckoutModal,
  onOpenAIAssistant,
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roles = [
    { id: AppRole.BUYER, label: "Explore Market", icon: BookOpen, color: "text-blue-500 bg-blue-50" },
    { id: AppRole.SELLER, label: "Seller Dashboard", icon: UserCheck, color: "text-emerald-500 bg-emerald-50" },
    { id: AppRole.ADMIN, label: "Admin Panel", icon: ShieldAlert, color: "text-rose-500 bg-rose-50" },
    { id: AppRole.DEVELOPER, label: "Technical Specs", icon: MonitorPlay, color: "text-indigo-500 bg-indigo-50" },
  ].filter((r) => {
    if (!isLoggedIn) {
      return r.id === AppRole.BUYER || r.id === AppRole.DEVELOPER;
    }
    const userRoleStr = (currentUser.role as string).toLowerCase();
    if (currentUser.role === AppRole.ADMIN || userRoleStr === "admin") return true;
    if (currentUser.role === AppRole.SELLER || userRoleStr === "designer" || userRoleStr === "seller") {
      return r.id !== AppRole.ADMIN;
    }
    // Buyer
    return r.id === AppRole.BUYER || r.id === AppRole.DEVELOPER;
  });

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <header id="main-header" className="sticky top-0 z-50 w-full bg-white/75 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.05 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20"
            >
              <span className="font-sans font-bold text-lg tracking-wider">D</span>
            </motion.div>
            <div className="flex flex-col">
              <span className="font-sans font-extrabold text-xl tracking-tight text-slate-900">
                DESAINE<span className="text-blue-600 font-black">.</span>
              </span>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-blue-600">
                Creative Hub
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {roles.map((r) => {
              const IconComp = r.icon;
              const isActive = activeRole === r.id;
              return (
                <button
                  key={r.id}
                  id={`role-btn-${r.id}`}
                  onClick={() => setActiveRole(r.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Wallet & Profile Controls */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* AI Assistant Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenAIAssistant}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>AI Copilot</span>
            </motion.button>

            {isLoggedIn ? (
              <>
                {/* Wallet Tracker */}
                <div className="flex flex-col items-end text-xs">
                  <div className="flex items-center space-x-1.5 text-slate-500 font-medium">
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Dompet:</span>
                    <span className="font-mono text-blue-600 font-bold">
                      {formatRupiah(activeRole === AppRole.SELLER ? sellerEarnings : buyerBalance)}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {activeRole === AppRole.SELLER ? "Penghasilan Seller" : "Saldo Belanja"}
                  </span>
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    id="profile-dropdown-btn"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-semibold text-slate-800">{currentUser.name}</p>
                      <p className="text-[10px] text-blue-600 font-bold">{currentUser.membership} Plan</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-slate-50">
                          <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                        </div>
                        <div className="p-2 space-y-1">
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              setActiveRole(AppRole.DEVELOPER);
                            }}
                            className="flex w-full items-center space-x-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left"
                          >
                            <BookOpen className="w-4 h-4 text-slate-400" />
                            <span>Technical Documents</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              onLogout();
                            }}
                            className="flex w-full items-center space-x-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left font-bold border-t border-slate-100"
                          >
                            <LogOut className="w-4 h-4 text-rose-500" />
                            <span>Keluar Platform</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenLogin}
                  className="flex items-center space-x-1 px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors rounded-lg text-xs font-bold cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk</span>
                </button>
                <button
                  onClick={onOpenRegister}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold transition-all rounded-lg text-xs shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  Daftar
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={onOpenAIAssistant}
              className="bg-blue-600 text-white p-1.5 rounded-full shadow-lg shadow-blue-500/20"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-700 p-2 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white"
          >
            <div className="px-4 py-3 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Ganti Ruang Kerja</p>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => {
                  const IconComp = r.icon;
                  const isActive = activeRole === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        setActiveRole(r.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center space-x-2 p-2.5 rounded-lg text-xs font-semibold ${
                        isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-slate-50 text-slate-700"
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                      <span>{r.label.split(" ")[0]}</span>
                    </button>
                  );
                })}
              </div>

              {isLoggedIn ? (
                <div className="pt-3 border-t border-slate-100 flex flex-col space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-full"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                        <p className="text-[10px] text-blue-600 font-bold">{currentUser.membership} Plan</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400">Saldo Dompet:</p>
                      <p className="text-xs font-mono font-extrabold text-blue-600">
                        {formatRupiah(activeRole === AppRole.SELLER ? sellerEarnings : buyerBalance)}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full bg-rose-50 text-rose-600 font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar Platform</span>
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Masuk</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenRegister();
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center"
                  >
                    <span>Daftar</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
