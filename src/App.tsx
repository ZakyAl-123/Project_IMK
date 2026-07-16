import { useState, useEffect } from "react";
import { Product, CustomProject, User, AppRole } from "./types";
import { productsMock, customProjectsMock } from "./data/mockData";
import Header from "./components/Header";
import MarketplaceView from "./components/MarketplaceView";
import ProductDetailView from "./components/ProductDetailView";
import CustomOrderView from "./components/CustomOrderView";
import SellerDashboardView from "./components/SellerDashboardView";
import AdminPanel from "./components/AdminPanel";
import DeveloperPortal from "./components/DeveloperPortal";
import AuthScreens from "./components/AuthScreens";
import ForceChangePasswordModal from "./components/ForceChangePasswordModal";
import { CheckCircle, ShieldCheck, Sparkles, X, RefreshCw, Send, Bot, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Authentication & session states
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("desaine_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem("desaine_token");
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<"login" | "register">("login");

  // Global States aligned with tsc types and custom HeaderProps
  const [activeRole, setActiveRole] = useState<AppRole>(AppRole.BUYER);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  
  // View states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProject, setSelectedProject] = useState<CustomProject | null>(null);

  // Wallet and inventory state
  const [buyerBalance, setBuyerBalance] = useState(0); // Rp 0 starting balance
  const [sellerEarnings, setSellerEarnings] = useState(0); // Rp 0 starting
  const [purchasedProductIds, setPurchasedProductIds] = useState<string[]>([]); // Empty purchased assets
  
  // Data lists with state
  const [products, setProducts] = useState<Product[]>(productsMock);
  const [customProjects, setCustomProjects] = useState<CustomProject[]>(customProjectsMock);
  const [withdraws, setWithdraws] = useState<any[]>([]);

  // Payment Checkout Modal simulation
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [checkoutLicense, setCheckoutLicense] = useState("");
  const [checkoutPrice, setCheckoutPrice] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("QRIS");
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");

  // AI Copilot Chat State
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Halo! Saya Desaine AI Copilot bertenaga Gemini. Bagaimana saya bisa membantu riset pasar, rancangan poster, lisensi hak cipta, atau ide branding Anda hari ini?" }
  ]);
  const [aiChatLoading, setAiChatLoading] = useState(false);

  // Watch for role switching to reset state
  useEffect(() => {
    setSelectedProduct(null);
    setSelectedProject(null);
  }, [activeRole]);

  // Load data from backend on startup & restore auth session
  useEffect(() => {
    const token = localStorage.getItem("desaine_token");
    if (token) {
      fetch("/api/me", {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error("Sesi kedaluwarsa");
          return res.json();
        })
        .then(data => {
          setUser(data.user);
          setBuyerBalance(data.user.balance);
          setSellerEarnings(data.user.earnings);
          
          // Sync workspace role automatically
          if (data.user.role === "designer") {
            setActiveRole(AppRole.SELLER);
          } else if (data.user.role === "admin") {
            setActiveRole(AppRole.ADMIN);
          } else {
            setActiveRole(AppRole.BUYER);
          }
        })
        .catch(err => {
          console.error("Auth restoration failed:", err);
          localStorage.removeItem("desaine_user");
          localStorage.removeItem("desaine_token");
          setUser(null);
          setAuthToken(null);
        });
    } else {
      // Load public user state
      fetch("/api/user/state")
        .then(res => res.json())
        .then(data => {
          setBuyerBalance(data.balance);
          setSellerEarnings(data.earnings);
          setWithdraws(data.withdraws);
        })
        .catch(err => console.error("Error loading user state:", err));
    }

    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
      })
      .catch(err => console.error("Error loading products:", err));

    fetch("/api/projects")
      .then(res => res.json())
      .then(data => {
        setCustomProjects(data);
      })
      .catch(err => console.error("Error loading projects:", err));
  }, []);

  // Buy item action (triggers checkout modal)
  const handleInitiatePurchase = (product: Product, finalPrice: number, license: string) => {
    if (!user) {
      setAuthInitialMode("login");
      setShowAuthModal(true);
      return;
    }
    setCheckoutProduct(product);
    setCheckoutPrice(finalPrice);
    setCheckoutLicense(license);
    setCheckoutStatus("idle");
  };

  // Confirm payment in Midtrans/QRIS simulator
  const handleProcessPayment = () => {
    if (!checkoutProduct) return;
    
    setCheckoutStatus("processing");

    // Send payment checkout to backend API with Authorization
    fetch("/api/payment/checkout", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {})
      },
      body: JSON.stringify({
        productId: checkoutProduct.id,
        amount: checkoutPrice,
        title: checkoutProduct.title,
        paymentMethod: selectedPaymentMethod,
        licenseType: checkoutLicense,
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTimeout(() => {
            setBuyerBalance(data.userBalance);
            setPurchasedProductIds(prev => [...prev, checkoutProduct.id]);
            setCheckoutStatus("success");
            
            // Increment the product's sales count in state
            setProducts(prev => prev.map(p => {
              if (p.id === checkoutProduct.id) {
                return { ...p, sales: p.sales + 1 };
              }
              return p;
            }));
          }, 1500);
        } else {
          setCheckoutStatus("failed");
        }
      })
      .catch(err => {
        console.error("Backend checkout fallback:", err);
        // Offline simulation fallback
        setTimeout(() => {
          if (buyerBalance < checkoutPrice) {
            setCheckoutStatus("failed");
            return;
          }
          setBuyerBalance(prev => prev - checkoutPrice);
          setPurchasedProductIds(prev => [...prev, checkoutProduct.id]);
          setCheckoutStatus("success");
        }, 1500);
      });
  };

  // Chat conversation with Gemini
  const handleSendChatMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || chatInput;
    if (!promptToSend.trim()) return;

    // Add User message
    setChatMessages(prev => [...prev, { sender: "user", text: promptToSend }]);
    setChatInput("");
    setAiChatLoading(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptToSend,
          context: "Marketplace Desaine"
        })
      });
      const data = await res.json();
      if (data.success) {
        setChatMessages(prev => [...prev, { sender: "ai", text: data.text }]);
      } else {
        setChatMessages(prev => [...prev, { sender: "ai", text: "Maaf, sistem AI mengalami kendala pemrosesan. Coba tanyakan hal lain." }]);
      }
    } catch (e) {
      console.error(e);
      setChatMessages(prev => [...prev, { sender: "ai", text: "Terjadi kesalahan koneksi ke server AI." }]);
    } finally {
      setAiChatLoading(false);
    }
  };

  // Seller creates product -> active products state
  const handleAddProduct = (newProd: Product) => {
    fetch("/api/products", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {})
      },
      body: JSON.stringify(newProd)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.products);
        } else {
          setProducts(prev => [newProd, ...prev]);
        }
      })
      .catch(err => {
        console.error("Error creating product:", err);
        setProducts(prev => [newProd, ...prev]);
      });
  };

  // Seller submits withdraw
  const handleAddWithdraw = (amount: number, gateway: string) => {
    fetch("/api/user/withdraw", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {})
      },
      body: JSON.stringify({ amount, gateway })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSellerEarnings(data.earnings);
          setWithdraws(data.withdraws);
        }
      })
      .catch(err => {
        console.error("Error filing withdraw:", err);
        const newWd = {
          id: `wd_${Date.now()}`,
          amount,
          gateway,
          date: new Date().toISOString().split("T")[0],
          status: "pending"
        };
        setWithdraws(prev => [newWd, ...prev]);
        setSellerEarnings(prev => prev - amount);
      });
  };

  // Admin approves pending product
  const handleApproveProduct = (id: string) => {
    fetch(`/api/admin/product/approve`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {})
      },
      body: JSON.stringify({ productId: id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.products);
        }
      })
      .catch(err => {
        console.error(err);
        setProducts(prev => prev.map(p => {
          if (p.id === id) return { ...p, status: "active" as const };
          return p;
        }));
      });
  };

  // Admin approves pending withdraw
  const handleApproveWithdraw = (id: string) => {
    fetch("/api/admin/withdraw/approve", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {})
      },
      body: JSON.stringify({ id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setWithdraws(data.withdraws);
        }
      })
      .catch(err => {
        console.error("Error approving withdraw:", err);
        setWithdraws(prev => prev.map(w => {
          if (w.id === id) return { ...w, status: "completed" as const };
          return w;
        }));
      });
  };

  // Custom project milestone sync
  const handleUpdateProject = (updatedProj: CustomProject, newBuyerBalance?: number, newSellerEarnings?: number) => {
    setCustomProjects(prev => prev.map(p => p.id === updatedProj.id ? updatedProj : p));
    if (newBuyerBalance !== undefined) setBuyerBalance(newBuyerBalance);
    if (newSellerEarnings !== undefined) setSellerEarnings(newSellerEarnings);
    
    // update current viewing selection reference
    setSelectedProject(updatedProj);
  };

  const handleLogout = () => {
    if (authToken) {
      fetch("/api/logout", {
        method: "POST",
        headers: { "Authorization": `Bearer ${authToken}` }
      });
    }
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem("desaine_user");
    localStorage.removeItem("desaine_token");
    setBuyerBalance(0);
    setSellerEarnings(0);
    setActiveRole(AppRole.BUYER);
  };

  const handleAuthSuccess = (authUser: any, token: string) => {
    setUser(authUser);
    setAuthToken(token);
    localStorage.setItem("desaine_user", JSON.stringify(authUser));
    localStorage.setItem("desaine_token", token);
    setShowAuthModal(false);

    setBuyerBalance(authUser.balance);
    setSellerEarnings(authUser.earnings);

    if (authUser.role === "designer") {
      setActiveRole(AppRole.SELLER);
    } else if (authUser.role === "admin") {
      setActiveRole(AppRole.ADMIN);
    } else {
      setActiveRole(AppRole.BUYER);
    }
  };

  const handleForcePasswordSuccess = () => {
    if (user) {
      const updatedUser = { ...user, mustChangePassword: false };
      setUser(updatedUser);
      localStorage.setItem("desaine_user", JSON.stringify(updatedUser));
    }
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const activeUser: User = user || {
    id: "guest",
    name: "Tamu",
    email: "guest@desaine.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    role: AppRole.BUYER,
    balance: buyerBalance,
    earnings: sellerEarnings,
    membership: "Free",
    joinedDate: ""
  };

  return (
    <div id="desaine-app-container" className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      
      {/* Header bar - mapped to exact HeaderProps expectations */}
      <Header
        currentUser={activeUser}
        isLoggedIn={!!user}
        onOpenLogin={() => {
          setAuthInitialMode("login");
          setShowAuthModal(true);
        }}
        onOpenRegister={() => {
          setAuthInitialMode("register");
          setShowAuthModal(true);
        }}
        onLogout={handleLogout}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        buyerBalance={buyerBalance}
        sellerEarnings={sellerEarnings}
        onOpenCheckoutModal={() => {}}
        onOpenAIAssistant={() => setShowAIAssistant(true)}
      />

      {/* Main app body workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Render: Detail Views */}
        {selectedProduct ? (
          <ProductDetailView
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onPurchase={handleInitiatePurchase}
            purchasedProductIds={purchasedProductIds}
          />
        ) : selectedProject ? (
          <CustomOrderView
            project={selectedProject}
            onBack={() => setSelectedProject(null)}
            buyerBalance={buyerBalance}
            sellerEarnings={sellerEarnings}
            onUpdateProject={handleUpdateProject}
            authToken={authToken}
          />
        ) : (
          /* Render: Navigation sections mapped to Roles */
          <>
            {activeRole === AppRole.BUYER && (
              <MarketplaceView
                products={products}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onSelectProject={(proj) => setSelectedProject(proj)}
                buyerBalance={buyerBalance}
                customProjectsList={customProjects}
                onPostProject={(newProject) => setCustomProjects(prev => [newProject, ...prev])}
                authToken={authToken}
                onSwitchToSeller={() => setActiveRole(AppRole.SELLER)}
              />
            )}

            {activeRole === AppRole.SELLER && (
              <SellerDashboardView
                currentUser={activeUser}
                sellerEarnings={sellerEarnings}
                withdraws={withdraws}
                onWithdraw={handleAddWithdraw}
                onAddProduct={handleAddProduct}
                products={products}
              />
            )}

            {activeRole === AppRole.ADMIN && (
              <AdminPanel
                products={products}
                withdraws={withdraws}
                onApproveProduct={handleApproveProduct}
                onApproveWithdraw={handleApproveWithdraw}
              />
            )}

            {activeRole === AppRole.DEVELOPER && (
              <DeveloperPortal />
            )}
          </>
        )}

      </main>

      {/* MIDTRANS / QRIS GATEWAY PAYMENT CHECKOUT MODAL */}
      <AnimatePresence>
        {checkoutProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 flex flex-col justify-between"
            >
              
              <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Desaine Safe Pay Gateway</span>
                </div>
                <button
                  onClick={() => setCheckoutProduct(null)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                
                {checkoutStatus === "idle" && (
                  <>
                    <div className="border-b border-slate-100 pb-3">
                      <p className="text-slate-400 font-bold uppercase text-[10px]">Ringkasan Pembelian</p>
                      <h4 className="font-bold text-slate-800 text-sm mt-1">{checkoutProduct.title}</h4>
                      <p className="text-slate-500 mt-1">Jenis Lisensi: <strong>{checkoutLicense}</strong></p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-slate-400 font-bold uppercase text-[10px]">Pilih Metode Pembayaran</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "QRIS", name: "QRIS Cashback 5%", badge: "Otomatis" },
                          { id: "Mandiri", name: "Mandiri VA", badge: "Transfer Bank" },
                          { id: "BCA", name: "BCA Virtual Account", badge: "Transfer Bank" },
                          { id: "GoPay", name: "GoPay Wallet", badge: "E-wallet" }
                        ].map((m) => (
                          <button
                            key={m.id}
                            onClick={() => setSelectedPaymentMethod(m.id)}
                            className={`p-3 text-left rounded-xl border transition-all ${
                              selectedPaymentMethod === m.id
                                ? "border-blue-600 bg-blue-50/40"
                                : "border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <p className="font-bold text-slate-900 text-[11px]">{m.name}</p>
                            <p className="text-[9px] text-slate-400 mt-0.5">{m.badge}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedPaymentMethod === "QRIS" && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col items-center space-y-2">
                        <div className="w-24 h-24 bg-white border border-slate-200 rounded-lg p-1.5 flex items-center justify-center relative">
                          <img
                            src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80"
                            alt="Mock QR"
                            className="w-full h-full object-cover rounded"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-rose-500 animate-bounce" />
                        </div>
                        <p className="text-[10px] text-slate-400 text-center">Scan QR menggunakan OVO, GoPay, ShopeePay, atau Mobile Banking.</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-slate-400 text-[9px] uppercase font-bold">Total Pembayaran</p>
                        <p className="text-sm font-mono font-extrabold text-blue-600">{formatRupiah(checkoutPrice)}</p>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Saldo Dompet: {formatRupiah(buyerBalance)}
                      </span>
                    </div>

                    <button
                      onClick={handleProcessPayment}
                      disabled={buyerBalance < checkoutPrice}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-1.5 shadow-lg shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
                    >
                      <span>Bayar Sekarang</span>
                    </button>

                    {buyerBalance < checkoutPrice && (
                      <p className="text-[10px] text-rose-600 text-center font-semibold">
                        ⚠️ Saldo Dompet Anda tidak cukup. Pindah ke Seller atau hubungi support.
                      </p>
                    )}
                  </>
                )}

                {checkoutStatus === "processing" && (
                  <div className="py-12 text-center space-y-4">
                    <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Menghubungi Provider Gerbang Pembayaran...</h4>
                      <p className="text-slate-400 text-[10px] mt-1">Mengamankan dana Escrow dan mengenkripsi signature file...</p>
                    </div>
                  </div>
                )}

                {checkoutStatus === "success" && (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Pembayaran Sukses Berhasil!</h4>
                      <p className="text-slate-400 text-[10px] mt-1">Lisensi premium terdaftar. Watermark pada preview dibersihkan secara instan.</p>
                    </div>
                    <button
                      onClick={() => setCheckoutProduct(null)}
                      className="bg-slate-950 text-white font-bold px-5 py-2 rounded-xl hover:bg-slate-800 transition-colors"
                    >
                      Buka File Unduhan
                    </button>
                  </div>
                )}

                {checkoutStatus === "failed" && (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600">
                      <X className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Transaksi Pembayaran Gagal</h4>
                      <p className="text-slate-400 text-[10px] mt-1">Saldo dompet Anda tidak memadai atau jaringan escrow sibuk.</p>
                    </div>
                    <button
                      onClick={() => setCheckoutStatus("idle")}
                      className="bg-slate-200 text-slate-700 font-bold px-5 py-2 rounded-xl"
                    >
                      Coba Lagi
                    </button>
                  </div>
                )}

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SLIDING CHAT DRAWER: AI COPILOT RECRUITER */}
      <AnimatePresence>
        {showAIAssistant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex justify-end"
          >
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={() => setShowAIAssistant(false)} />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-150 z-50"
            >
              
              {/* Header */}
              <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-blue-500/20 rounded-lg">
                    <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">Desaine AI Copilot</h4>
                    <p className="text-[9px] text-slate-400">Gemini-Powered Design Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIAssistant(false)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat bubbles list */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start space-x-2 text-xs ${
                      msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <div className={`p-2 rounded-full shrink-0 ${
                      msg.sender === "user" ? "bg-slate-100 text-slate-800" : "bg-blue-50 text-blue-600"
                    }`}>
                      {msg.sender === "user" ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>
                    <div className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                      msg.sender === "user" ? "bg-blue-600 text-white shadow-md shadow-blue-500/15" : "bg-slate-50 border border-slate-150 text-slate-800"
                    }`}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                  </div>
                ))}

                {aiChatLoading && (
                  <div className="flex items-center space-x-2 text-xs text-slate-400 italic">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
                    <span>Gemini sedang merumuskan ide kreatif...</span>
                  </div>
                )}
              </div>

              {/* Preset quick helpers and input panel */}
              <div className="p-4 border-t border-slate-150 space-y-3 bg-slate-50">
                
                {/* Helpers */}
                <div className="flex space-x-1.5 overflow-x-auto pb-1.5 scrollbar-none">
                  {[
                    "Ide konsep packaging botol kopi",
                    "Rekomendasi harga aset UI Kit",
                    "Hak Cipta: Perbedaan Personal vs Commercial"
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendChatMessage(p)}
                      className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] text-slate-600 font-semibold hover:border-blue-500 hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Tanya AI tentang riset pasar, warna, copywriting..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                    className="flex-1 bg-white border border-slate-200 p-2.5 rounded-xl text-xs focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    onClick={() => handleSendChatMessage()}
                    className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl shadow-lg shadow-blue-500/20 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AUTHENTICATION / REGISTRATION WORKSPACE MODAL */}
      <AnimatePresence>
        {showAuthModal && (
          <AuthScreens
            initialMode={authInitialMode}
            onSuccess={handleAuthSuccess}
            onClose={() => setShowAuthModal(false)}
          />
        )}
      </AnimatePresence>

      {/* FORCE PASSWORD CHANGE ON FIRST LOGIN */}
      {user && user.mustChangePassword && authToken && (
        <ForceChangePasswordModal
          authToken={authToken}
          onSuccess={handleForcePasswordSuccess}
        />
      )}

    </div>
  );
}
