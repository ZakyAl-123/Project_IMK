import React, { useState, useEffect } from "react";
import { Product, CustomProject, Competition } from "../types";
import { productsMock, categoriesList, customProjectsMock, competitionsMock } from "../data/mockData";
import { Search, SlidersHorizontal, Tag, Star, ArrowRight, ShieldCheck, Cpu, Vote, Send, FileText, Calendar, PlusCircle, ShoppingBag, Inbox } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MarketplaceViewProps {
  products: Product[];
  onSelectProduct: (p: Product) => void;
  onSelectProject: (proj: CustomProject) => void;
  buyerBalance: number;
  onPostProject: (newProject: CustomProject) => void;
  customProjectsList: CustomProject[];
  authToken?: string | null;
  onSwitchToSeller?: () => void;
}

export default function MarketplaceView({
  products,
  onSelectProduct,
  onSelectProject,
  buyerBalance,
  onPostProject,
  customProjectsList,
  authToken,
  onSwitchToSeller,
}: MarketplaceViewProps) {
  const [activeTab, setActiveTab] = useState<"assets" | "custom_projects" | "competitions">("assets");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedSearch, setSuggestedSearch] = useState("");
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  
  // Custom Project creation form state
  const [showPostForm, setShowPostForm] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjCat, setNewProjCat] = useState("Landing Page");
  const [newProjBudgetMin, setNewProjBudgetMin] = useState(1000000);
  const [newProjBudgetMax, setNewProjBudgetMax] = useState(3000000);
  const [newProjDeadline, setNewProjDeadline] = useState("2026-08-15");

  // Competition voting simulation
  const [competitions, setCompetitions] = useState<Competition[]>(competitionsMock);

  // Filter Software, License, Format, Price Range
  const [selectedSoftware, setSelectedSoftware] = useState("Semua");
  const [selectedLicense, setSelectedLicense] = useState("Semua");
  const [maxPriceFilter, setMaxPriceFilter] = useState(500000);

  // Simulated Typo Correction Dictionary
  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    if (q === "figam" || q === "figma" || q === "figm") {
      setSuggestedSearch(q === "figam" ? "Figma" : "");
    } else if (q === "canv" || q === "cnva" || q === "cava") {
      setSuggestedSearch("Canva");
    } else if (q === "ilustrasi" || q === "ilustration") {
      setSuggestedSearch("Illustration");
    } else {
      setSuggestedSearch("");
    }
  }, [searchQuery]);

  const handleApplySuggested = () => {
    if (suggestedSearch) {
      setSearchQuery(suggestedSearch);
      setSuggestedSearch("");
    }
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Filter Assets Catalog
  const filteredProducts = products.filter((prod) => {
    const matchSearch =
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchCategory = selectedCategory === "Semua" || prod.category === selectedCategory;
    const matchSoftware = selectedSoftware === "Semua" || prod.software.includes(selectedSoftware);
    const matchLicense = selectedLicense === "Semua" || prod.licenseType === selectedLicense;
    const matchPrice = prod.price <= maxPriceFilter;

    return matchSearch && matchCategory && matchSoftware && matchLicense && matchPrice;
  });

  const handleVote = (compId: string, subId: string) => {
    setCompetitions(prev => prev.map(c => {
      if (c.id === compId) {
        return {
          ...c,
          submissions: c.submissions.map(sub => {
            if (sub.id === subId) {
              return { ...sub, votes: sub.votes + 1 };
            }
            return sub;
          })
        };
      }
      return c;
    }));
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle || !newProjDesc) return;

    const newProj: CustomProject = {
      id: `proj_${Date.now()}`,
      clientId: "user_01",
      clientName: "Zaky Alfi (Klien)",
      title: newProjTitle,
      description: newProjDesc,
      category: newProjCat,
      budgetMin: Number(newProjBudgetMin),
      budgetMax: Number(newProjBudgetMax),
      deadline: newProjDeadline,
      status: "open",
      proposals: [],
      milestones: [
        { id: `ms_${Date.now()}_1`, title: "Review Konsep Desain Utama", amount: Math.floor(newProjBudgetMin * 0.3), status: "unfunded", deadline: newProjDeadline },
        { id: `ms_${Date.now()}_2`, title: "Penyerahan File Akhir & Revisi", amount: Math.floor(newProjBudgetMin * 0.7), status: "unfunded", deadline: newProjDeadline }
      ]
    };

    fetch("/api/projects", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {})
      },
      body: JSON.stringify(newProj)
    })
      .then(res => res.json())
      .then(data => {
        onPostProject(newProj);
      })
      .catch(err => {
        console.error("Backend error creating project, fallback:", err);
        onPostProject(newProj);
      });

    // Reset Form
    setNewProjTitle("");
    setNewProjDesc("");
    setShowPostForm(false);
  };

  return (
    <div id="marketplace-catalog" className="py-6">
      
      {/* Subtab Navigation (Marketplace Mode) */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab("assets")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all flex items-center space-x-2 ${
              activeTab === "assets"
                ? "bg-white text-blue-600 shadow-md border border-slate-100 font-extrabold"
                : "text-slate-600 hover:text-slate-950"
            }`}
          >
            <Tag className="w-4 h-4 text-blue-500" />
            <span>Marketplace Produk</span>
          </button>
          <button
            onClick={() => setActiveTab("custom_projects")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all flex items-center space-x-2 ${
              activeTab === "custom_projects"
                ? "bg-white text-blue-600 shadow-md border border-slate-100 font-extrabold"
                : "text-slate-600 hover:text-slate-950"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-blue-500" />
            <span>Custom Design Feed</span>
          </button>
          <button
            onClick={() => setActiveTab("competitions")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all flex items-center space-x-2 ${
              activeTab === "competitions"
                ? "bg-white text-blue-600 shadow-md border border-slate-100 font-extrabold"
                : "text-slate-600 hover:text-slate-950"
            }`}
          >
            <Vote className="w-4 h-4 text-blue-500" />
            <span>Sayembara Desain</span>
          </button>
        </div>
      </div>

      {/* RENDER TAB: MARKETPLACE ASSETS */}
      {activeTab === "assets" && (
        <div>
          {/* Search bar & Typo assist */}
          <div className="relative max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari ribuan aset desain premium (e.g. Figma UI Kit, Canva feed, mockup)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-24 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
                className="absolute right-3 top-2.5 bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center space-x-1.5 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Typo Auto-Suggestion Banner */}
            <AnimatePresence>
              {suggestedSearch && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute left-0 right-0 mt-2 p-3 bg-blue-50 border border-blue-100 rounded-xl flex justify-between items-center text-xs text-blue-800"
                >
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-blue-600 animate-spin" />
                    <span>
                      Apakah yang Anda maksud adalah:{" "}
                      <strong className="underline cursor-pointer" onClick={handleApplySuggested}>
                        {suggestedSearch}
                      </strong>
                      ?
                    </span>
                  </div>
                  <button
                    onClick={handleApplySuggested}
                    className="bg-blue-600 text-white font-bold px-3 py-1 rounded-lg hover:bg-blue-700 transition-all cursor-pointer"
                  >
                    Terapkan
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Filters Drawer/Sidebar Area if open */}
          {isFilterSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="max-w-2xl mx-auto mb-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-3 gap-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-2">Software</label>
                <select
                  value={selectedSoftware}
                  onChange={(e) => setSelectedSoftware(e.target.value)}
                  className="w-full bg-white p-2 rounded-lg border border-slate-200"
                >
                  <option value="Semua">Semua Software</option>
                  <option value="Figma">Template Figma</option>
                  <option value="Canva">Template Canva</option>
                  <option value="Photoshop">Template Photoshop</option>
                  <option value="Illustrator">Template Illustrator</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">Lisensi</label>
                <select
                  value={selectedLicense}
                  onChange={(e) => setSelectedLicense(e.target.value)}
                  className="w-full bg-white p-2 rounded-lg border border-slate-200"
                >
                  <option value="Semua">Semua Lisensi</option>
                  <option value="Personal">Personal License</option>
                  <option value="Commercial">Commercial License</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">Maks. Harga: {formatRupiah(maxPriceFilter)}</label>
                <input
                  type="range"
                  min="50000"
                  max="1000000"
                  step="50000"
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </motion.div>
          )}

          {/* Categories List Slider */}
          <div className="flex space-x-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "bg-white border border-slate-100 hover:bg-slate-50 text-slate-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Asset Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
              <motion.div
                key={prod.id}
                id={`product-card-${prod.id}`}
                whileHover={{ y: -6, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs cursor-pointer flex flex-col justify-between"
                onClick={() => onSelectProduct(prod)}
              >
                <div>
                  <div className="relative aspect-video bg-slate-100">
                    <img
                       src={prod.thumbnail}
                       alt={prod.title}
                       className="w-full h-full object-cover"
                       referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-extrabold text-blue-600 tracking-wide uppercase border border-white/20">
                      {prod.category}
                    </div>
                    {prod.discountPrice && (
                      <div className="absolute top-3 right-3 bg-rose-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase animate-pulse">
                        Diskon
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {prod.software.split(" ")[1] || prod.software}
                      </span>
                      <span className="text-[10px] text-slate-400">•</span>
                      <div className="flex items-center space-x-0.5 text-amber-500">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span className="text-[11px] font-bold">{prod.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-sans font-bold text-slate-900 text-sm line-clamp-1 hover:text-blue-600 transition-colors">
                      {prod.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1.5">
                      {prod.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-50 mt-4 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center space-x-2">
                    <img
                      src={prod.sellerAvatar}
                      alt={prod.sellerName}
                      className="w-6 h-6 rounded-full border border-white shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[10px] font-medium text-slate-600 truncate max-w-[80px]">
                      {prod.sellerName.split(" ")[0]}
                    </span>
                  </div>
                  <div className="text-right">
                    {prod.discountPrice ? (
                      <div className="flex flex-col">
                        <span className="text-[10px] line-through text-slate-400">
                          {formatRupiah(prod.price)}
                        </span>
                        <span className="text-xs font-mono font-extrabold text-blue-600">
                          {formatRupiah(prod.discountPrice)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-mono font-extrabold text-slate-900">
                        {formatRupiah(prod.price)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {products.length === 0 ? (
              <div className="col-span-full py-16 px-4 text-center bg-white rounded-3xl border border-slate-100 shadow-xs flex flex-col items-center justify-center space-y-4 max-w-md mx-auto mt-8">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="bg-blue-50 p-4 rounded-2xl text-blue-600"
                >
                  <span className="text-3xl">📦</span>
                </motion.div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800">Belum ada produk.</h3>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    Jadilah desainer pertama yang menjual karya di DESAINE.
                  </p>
                </div>
                {onSwitchToSeller && (
                  <button
                    onClick={onSwitchToSeller}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    Upload Produk
                  </button>
                )}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">Tidak ada aset desain yang cocok dengan filter Anda.</p>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* RENDER TAB: CUSTOM PROJECTS FEED */}
      {activeTab === "custom_projects" && (
        <div className="max-w-4xl mx-auto">
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-sans font-bold text-lg text-slate-900">Project Brief & Custom Order</h2>
              <p className="text-xs text-slate-500">Posting proyek desain Anda dan biarkan desainer top mengirimkan penawaran.</p>
            </div>
            <button
              onClick={() => setShowPostForm(!showPostForm)}
              className="bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center space-x-1.5 hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Project Brief</span>
            </button>
          </div>

          {/* Expandable Project Brief Form */}
          <AnimatePresence>
            {showPostForm && (
              <motion.form
                onSubmit={handleCreateProject}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white border border-slate-200 p-6 rounded-2xl mb-8 shadow-xs space-y-4"
              >
                <h3 className="font-sans font-bold text-sm text-slate-800">Brief Proyek Desain Baru</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Judul Proyek</label>
                    <input
                      type="text"
                      placeholder="Contoh: Desain Ulang Kemasan Kopi Robusta"
                      value={newProjTitle}
                      onChange={(e) => setNewProjTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs focus:ring-blue-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Kategori Desain</label>
                    <select
                      value={newProjCat}
                      onChange={(e) => setNewProjCat(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs"
                    >
                      <option value="Landing Page">Landing Page UI</option>
                      <option value="Logo">Desain Logo</option>
                      <option value="Packaging">Desain Kemasan (Packaging)</option>
                      <option value="Mascot">Ilustrasi Maskot</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Rincian Brief / Deskripsi Kebutuhan</label>
                  <textarea
                    rows={4}
                    placeholder="Uraikan detail kebutuhan desain Anda, referensi warna, gaya desain, dan ekspektasi file final..."
                    value={newProjDesc}
                    onChange={(e) => setNewProjDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Minimal Anggaran (Rp)</label>
                    <input
                      type="number"
                      value={newProjBudgetMin}
                      onChange={(e) => setNewProjBudgetMin(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Maksimal Anggaran (Rp)</label>
                    <input
                      type="number"
                      value={newProjBudgetMax}
                      onChange={(e) => setNewProjBudgetMax(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Batas Waktu (Deadline)</label>
                    <input
                      type="date"
                      value={newProjDeadline}
                      onChange={(e) => setNewProjDeadline(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPostForm(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Posting Brief Sekarang</span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Project List */}
          <div className="space-y-4">
            {customProjectsList.length === 0 ? (
              <div className="py-16 px-4 text-center bg-white rounded-3xl border border-slate-100 shadow-xs flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="bg-blue-50 p-4 rounded-2xl text-blue-600"
                >
                  <FileText className="w-10 h-10" />
                </motion.div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800">Belum ada project.</h3>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    Publikasikan brief proyek desain Anda untuk mendapatkan penawaran dari desainer terverifikasi.
                  </p>
                </div>
                {!showPostForm && (
                  <button
                    onClick={() => setShowPostForm(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    Buat Project Brief
                  </button>
                )}
              </div>
            ) : (
              customProjectsList.map((proj) => (
                <motion.div
                  key={proj.id}
                  id={`project-card-${proj.id}`}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
                  onClick={() => onSelectProject(proj)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md uppercase border border-blue-100">
                        {proj.category}
                      </span>
                      <h3 className="font-sans font-extrabold text-slate-900 text-base mt-2 hover:text-blue-600 transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1.5">
                        {proj.description}
                      </p>
                    </div>
                    <div className="text-right bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Estimasi Budget</p>
                      <p className="text-xs font-mono font-extrabold text-blue-600">
                        {formatRupiah(proj.budgetMin)} - {formatRupiah(proj.budgetMax)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-5 text-xs text-slate-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span><strong>{proj.proposals.length} proposal</strong> masuk</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Batas: {proj.deadline}</span>
                      </span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      proj.status === "open"
                        ? "bg-blue-50 text-blue-800 border border-blue-100"
                        : proj.status === "ongoing"
                        ? "bg-indigo-50 text-indigo-800 border border-indigo-100"
                        : "bg-slate-150 text-slate-800"
                    }`}>
                      {proj.status === "open" ? "Terbuka" : proj.status === "ongoing" ? "Pengerjaan" : "Selesai"}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>

        </div>
      )}

      {/* RENDER TAB: DESIGN COMPETITIONS */}
      {activeTab === "competitions" && (
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="text-center max-w-xl mx-auto">
            <h2 className="font-sans font-bold text-xl text-slate-900">Sayembara & Kontes Desain</h2>
            <p className="text-xs text-slate-500 mt-1">
              Sambut tantangan kreatif, dapatkan hadiah puluhan juta rupiah, raih sertifikat nasional, dan bangun portofolio emas Anda.
            </p>
          </div>          <div className="grid grid-cols-1 gap-8">
            {competitions.length === 0 ? (
              <div className="py-16 px-4 text-center bg-white rounded-3xl border border-slate-100 shadow-xs flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="bg-blue-50 p-4 rounded-2xl text-blue-600"
                >
                  <span className="text-3xl">🏆</span>
                </motion.div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800">Belum ada sayembara.</h3>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    Admin belum membuat kompetisi.
                  </p>
                </div>
              </div>
            ) : (
              competitions.map((comp) => (
                <div key={comp.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between gap-6">
                  
                  {/* Details */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider border border-blue-100">
                        Penyenanggar: {comp.organizer}
                      </span>
                      <h3 className="font-sans font-extrabold text-slate-950 text-base mt-2.5">{comp.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed mt-2">{comp.description}</p>
                    </div>

                    <div className="flex space-x-6 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Total Hadiah</p>
                        <p className="text-sm font-mono font-extrabold text-blue-600">{formatRupiah(comp.prizePool)}</p>
                      </div>
                      <div className="border-l border-slate-200 pl-6">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Sisa Waktu</p>
                        <p className="text-sm font-sans font-extrabold text-slate-700">{comp.deadline}</p>
                      </div>
                      <div className="border-l border-slate-200 pl-6">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Peserta</p>
                        <p className="text-sm font-sans font-extrabold text-slate-700">{comp.participantsCount} desainer</p>
                      </div>
                    </div>
                  </div>

                  {/* Live Submissions Vote Grid */}
                  <div className="w-full md:w-80 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                      <span>🔥 Voting Karya Terpopuler</span>
                    </h4>

                    {comp.submissions.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {comp.submissions.map((sub) => (
                          <div key={sub.id} className="bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                            <img
                              src={sub.preview}
                              alt={sub.designerName}
                              className="w-full h-24 object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="p-2 flex justify-between items-center bg-white text-[10px]">
                              <span className="font-medium text-slate-700 truncate max-w-[60px]">
                                {sub.designerName.split(" ")[0]}
                              </span>
                              <button
                                onClick={() => handleVote(comp.id, sub.id)}
                                className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold px-2 py-0.5 rounded-md flex items-center space-x-0.5 transition-colors cursor-pointer"
                              >
                                <span>👍</span>
                                <span>{sub.votes}</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center">
                        <Cpu className="w-6 h-6 text-slate-300 mx-auto mb-1 animate-pulse" />
                        <p className="text-[10px] text-slate-400 font-medium">Belum ada karya.</p>
                      </div>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
}
