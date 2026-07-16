import React, { useState, useEffect } from "react";
import { Product, User } from "../types";
import { Sparkles, TrendingUp, DollarSign, Download, Eye, Tag, AlertCircle, PlusCircle, CheckCircle, Wallet, ArrowUpRight, RefreshCw, Inbox } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { motion, AnimatePresence } from "motion/react";

interface SellerDashboardViewProps {
  currentUser: User;
  sellerEarnings: number;
  withdraws: any[];
  onWithdraw: (amount: number, gateway: string) => void;
  onAddProduct: (newProd: Product) => void;
  products: Product[];
}

const revenueTrendData = [
  { month: "Jan", earnings: 1800000 },
  { month: "Feb", earnings: 3200000 },
  { month: "Mar", earnings: 2900000 },
  { month: "Apr", earnings: 4500000 },
  { month: "May", earnings: 6200000 },
  { month: "Jun", earnings: 9400000 },
  { month: "Jul", earnings: 12450000 },
];

export default function SellerDashboardView({
  currentUser,
  sellerEarnings,
  withdraws,
  onWithdraw,
  onAddProduct,
  products,
}: SellerDashboardViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<"analytics" | "my_products" | "upload" | "withdraw">("analytics");
  const [productsList, setProductsList] = useState<Product[]>([]);
  
  // New Product state
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCat, setNewCat] = useState("Poster");
  const [newPrice, setNewPrice] = useState(150000);
  const [newSoftware, setNewSoftware] = useState("Template Figma");
  const [newTagsString, setNewTagsString] = useState("");
  const [newThumbnail, setNewThumbnail] = useState("https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80");

  // AI Generation status
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiInputConcept, setAiInputConcept] = useState("");

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState(1000000);
  const [withdrawGateway, setWithdrawGateway] = useState("GoPay");
  const [wdMessage, setWdMessage] = useState("");

  useEffect(() => {
    // Filter only current seller products dynamically
    setProductsList(products.filter(p => p.sellerId === currentUser.id));
  }, [products, currentUser.id]);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Run Gemini Copilot SEO optimizer
  const handleAICopilotGenerate = async () => {
    if (!aiInputConcept) return;
    setAiGenerating(true);

    try {
      const response = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiInputConcept,
          type: "seo_meta",
          productType: newCat
        })
      });
      const data = await response.json();
      if (data.success) {
        setNewTitle(data.title || "");
        setNewDesc(data.description || "");
        setNewPrice(data.priceSuggestion || 149000);
        if (data.tags && data.tags.length > 0) {
          setNewTagsString(data.tags.join(", "));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;

    const tagsArr = newTagsString.split(",").map(t => t.trim()).filter(Boolean);

    const newProd: Product = {
      id: `prod_${Date.now()}`,
      title: newTitle,
      description: newDesc,
      category: newCat,
      price: Number(newPrice),
      thumbnail: newThumbnail,
      previews: [newThumbnail],
      fileUrl: "/downloads/secured_asset.zip",
      fileSize: "28.5 MB",
      sellerId: "sell_01",
      sellerName: currentUser.name,
      sellerAvatar: currentUser.avatar,
      rating: 5.0,
      reviews: [],
      tags: tagsArr,
      sales: 0,
      status: "pending", // must be verified by admin!
      licenseType: "Commercial",
      version: "1.0.0",
      changelog: ["Initial release"],
      software: newSoftware,
      formats: [".zip", ".fig"]
    };

    onAddProduct(newProd);
    setProductsList(prev => [newProd, ...prev]);
    // Reset Form
    setNewTitle("");
    setNewDesc("");
    setNewTagsString("");
    setAiInputConcept("");
    setActiveSubTab("my_products");
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount > sellerEarnings) {
      alert("Jumlah withdraw melebihi saldo penghasilan Anda.");
      return;
    }
    onWithdraw(withdrawAmount, withdrawGateway);
    setWdMessage(`Permohonan penarikan dana ${formatRupiah(withdrawAmount)} via ${withdrawGateway} berhasil diajukan! Admin akan memvalidasi dalam 1x24 jam.`);
  };

  const totalSales = productsList.reduce((acc, p) => acc + (p.sales || 0), 0);
  const visitorsCount = totalSales * 25 + (productsList.length * 12);
  const monthlyVisitors = visitorsCount > 0 ? `${visitorsCount.toLocaleString("id-ID")} user` : "0 user";
  const conversionRate = visitorsCount > 0 ? `${((totalSales / visitorsCount) * 100).toFixed(1)}%` : "0%";
  const dynamicChartData = sellerEarnings > 0 ? revenueTrendData.map(d => ({ ...d, earnings: Math.round(sellerEarnings * (d.earnings / 40450000)) })) : [];

  return (
    <div id="seller-dashboard-workspace" className="py-6">
      
      {/* Upper stats bento box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex justify-between items-center">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Pendapatan</p>
            <p className="text-base font-mono font-extrabold text-blue-600 mt-1">{formatRupiah(sellerEarnings)}</p>
          </div>
          <div className="p-2.5 bg-blue-50 rounded-xl">
            <DollarSign className="text-blue-600 w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex justify-between items-center">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Aset Terjual</p>
            <p className="text-base font-sans font-extrabold text-slate-900 mt-1">{totalSales} item</p>
          </div>
          <div className="p-2.5 bg-indigo-50 rounded-xl">
            <Download className="text-indigo-600 w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex justify-between items-center">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Conversion Rate</p>
            <p className="text-base font-sans font-extrabold text-slate-900 mt-1">{conversionRate}</p>
          </div>
          <div className="p-2.5 bg-blue-50 rounded-xl">
            <TrendingUp className="text-blue-600 w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex justify-between items-center">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pengunjung Bulanan</p>
            <p className="text-base font-sans font-extrabold text-slate-900 mt-1">{monthlyVisitors}</p>
          </div>
          <div className="p-2.5 bg-amber-50 rounded-xl">
            <Eye className="text-amber-600 w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Workspace Subtabs */}
      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab("analytics")}
          className={`py-3 px-4 text-xs font-bold whitespace-nowrap transition-all border-b-2 -mb-px ${
            activeSubTab === "analytics" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Statistik & Grafik
        </button>
        <button
          onClick={() => setActiveSubTab("my_products")}
          className={`py-3 px-4 text-xs font-bold whitespace-nowrap transition-all border-b-2 -mb-px ${
            activeSubTab === "my_products" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Katalog Produk Saya
        </button>
        <button
          onClick={() => setActiveSubTab("upload")}
          className={`py-3 px-4 text-xs font-bold whitespace-nowrap transition-all border-b-2 -mb-px flex items-center space-x-1 ${
            activeSubTab === "upload" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <PlusCircle className="w-4 h-4 text-blue-600" />
          <span>Upload Produk Baru</span>
        </button>
        <button
          onClick={() => setActiveSubTab("withdraw")}
          className={`py-3 px-4 text-xs font-bold whitespace-nowrap transition-all border-b-2 -mb-px flex items-center space-x-1 ${
            activeSubTab === "withdraw" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Wallet className="w-4 h-4 text-blue-600" />
          <span>Tarik Dana (Withdraw)</span>
        </button>
      </div>

      {/* RENDER SUBTAB: ANALYTICS */}
      {activeSubTab === "analytics" && (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-sans font-bold text-slate-900 text-sm uppercase tracking-wider">Performa Penghasilan Bulanan</h3>
              <p className="text-xs text-slate-400">Total akumulasi royalti penjualan aset pasif Anda di Desaine.</p>
            </div>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
              Verified Seller Status Active
            </span>
          </div>

          <div className="h-72 w-full">
            {dynamicChartData.length === 0 ? (
              <div className="h-full w-full flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
                <TrendingUp className="w-8 h-8 text-slate-300 animate-pulse" />
                <p className="text-xs font-semibold text-slate-500">Belum ada data penjualan.</p>
                <p className="text-[10px] text-slate-400">Pendapatan penjualan Anda akan divisualisasikan di sini secara real-time.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dynamicChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    formatter={(val) => [formatRupiah(Number(val)), "Royalti"]}
                    contentStyle={{ background: "#0F172A", borderRadius: "12px", color: "#fff", fontSize: "11px" }}
                  />
                  <Area type="monotone" dataKey="earnings" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEarnings)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/* RENDER SUBTAB: MY PRODUCTS */}
      {activeSubTab === "my_products" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          {productsList.length === 0 ? (
            <div className="py-16 px-4 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="bg-indigo-50 p-4 rounded-2xl text-indigo-600"
              >
                <Inbox className="w-10 h-10" />
              </motion.div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">Katalog Produk Kosong</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Anda belum menerbitkan atau mengunggah produk aset desain apa pun ke platform DESAINE.
                </p>
              </div>
              <button
                onClick={() => setActiveSubTab("upload")}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                Upload Produk Pertama Anda
              </button>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Nama Produk</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Harga Aset</th>
                  <th className="p-4">Total Terjual</th>
                  <th className="p-4">Status Moderasi</th>
                </tr>
              </thead>
              <tbody>
                {productsList.map((prod) => (
                  <tr key={prod.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="p-4 font-semibold text-slate-900">{prod.title}</td>
                    <td className="p-4 text-slate-500">{prod.category}</td>
                    <td className="p-4 font-mono font-bold text-slate-700">{formatRupiah(prod.price)}</td>
                    <td className="p-4 font-mono">{prod.sales} kali</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        prod.status === "active"
                          ? "bg-blue-50 text-blue-800 border border-blue-100"
                          : prod.status === "pending"
                          ? "bg-indigo-50 text-indigo-800 border border-indigo-100"
                          : "bg-rose-100 text-rose-800"
                      }`}>
                        {prod.status === "active" ? "Aktif" : prod.status === "pending" ? "Dalam Kurasi" : "Ditolak"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* RENDER SUBTAB: UPLOAD FORM WITH GEMINI AI SEO COPILOT */}
      {activeSubTab === "upload" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form */}
          <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
            <h3 className="font-sans font-bold text-sm text-slate-900 uppercase tracking-wider mb-4">Form Penerbitan Produk Baru</h3>
            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Kategori Aset</label>
                  <select value={newCat} onChange={(e) => setNewCat(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                    <option value="Poster">Poster</option>
                    <option value="Logo">Logo</option>
                    <option value="Feed Instagram">Feed Instagram</option>
                    <option value="UI Kit">UI Kit</option>
                    <option value="3D">3D Model Asset</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Format Desain / Software</label>
                  <select value={newSoftware} onChange={(e) => setNewSoftware(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                    <option value="Template Figma">Template Figma (.fig)</option>
                    <option value="Template Canva">Template Canva (Canva Link)</option>
                    <option value="Template Photoshop">Template Photoshop (.psd)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Judul Produk</label>
                <input
                  type="text"
                  placeholder="Isi manual atau gunakan AI Copilot di sebelah kanan..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Deskripsi Lengkap & Spesifikasi</label>
                <textarea
                  rows={5}
                  placeholder="Uraikan detail file, isi aset, cara penggunaan..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Harga Komersial Jual (Rp)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Tag Aset (Pisahkan dengan koma)</label>
                  <input
                    type="text"
                    placeholder="e.g. clean, modern, travel"
                    value={newTagsString}
                    onChange={(e) => setNewTagsString(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Kirim Produk ke Kurator</span>
                </button>
              </div>

            </form>
          </div>

          {/* AI Copilot Side Panel */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-blue-500/20 rounded-lg">
                  <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                </div>
                <h4 className="font-sans font-extrabold text-xs uppercase tracking-wider">AI SEO Copilot Writer</h4>
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed">
                Tulis ide/konsep desain Anda dalam 1 kalimat kasar. AI bertenaga Gemini akan auto-generate judul optimal SEO, deskripsi penjualan persuasif, tag, serta harga pasaran rupiah!
              </p>

              <div>
                <label className="block text-[10px] text-slate-500 font-bold mb-1.5">Konsep Kasar Desain Anda</label>
                <textarea
                  rows={3}
                  placeholder="kopi susu kemasan botol retro 80an asik"
                  value={aiInputConcept}
                  onChange={(e) => setAiInputConcept(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-[11px] text-white focus:ring-blue-600 focus:border-blue-600 outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleAICopilotGenerate}
                disabled={aiGenerating || !aiInputConcept}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 rounded-xl text-[11px] flex items-center justify-center space-x-1.5 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                {aiGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>AI Sedang Berpikir...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Generate Detail Produk</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-6 border-t border-slate-800 text-[10px] text-slate-500 space-y-1">
              <p>✔ Auto-optimize keywords for Tokopedia & Google SEO Indonesian market.</p>
              <p>✔ Pricing dynamic calculated based on category demands.</p>
            </div>
          </div>

        </div>
      )}

      {/* RENDER SUBTAB: WITHDRAWAL MANAGEMENT */}
      {activeSubTab === "withdraw" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-5">
            <h3 className="font-sans font-bold text-sm text-slate-900 uppercase tracking-wider">Tarik Dana Penghasilan</h3>
            
            {wdMessage && (
              <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-xl border border-blue-100">
                {wdMessage}
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs">
              <div>
                <p className="text-slate-400 font-medium">Saldo Royalti Dapat Ditarik</p>
                <p className="text-2xl font-mono font-extrabold text-blue-600 mt-1">{formatRupiah(sellerEarnings)}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Jumlah Penarikan (Rp)</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Pilih Metode Transfer</label>
                  <select
                    value={withdrawGateway}
                    onChange={(e) => setWithdrawGateway(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl"
                  >
                    <option value="GoPay">GoPay (E-wallet Instant)</option>
                    <option value="OVO">OVO (E-wallet Instant)</option>
                    <option value="Bank Central Asia (BCA)">Bank Central Asia (BCA)</option>
                    <option value="Bank Mandiri">Bank Mandiri</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                <span>Ajukan Withdraw</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Withdraw log list */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
            <h4 className="font-sans font-bold text-xs text-slate-800 uppercase tracking-wider mb-4">Riwayat Penarikan Saldo</h4>
            <div className="space-y-3">
              {withdraws.map((w) => (
                <div key={w.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{formatRupiah(w.amount)}</p>
                    <p className="text-[10px] text-slate-400">{w.date} via {w.gateway}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    w.status === "completed" ? "bg-blue-50 text-blue-800 border border-blue-100" : "bg-indigo-50 text-indigo-800 border border-indigo-100"
                  }`}>
                    {w.status === "completed" ? "Selesai" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
