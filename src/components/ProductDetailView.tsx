import { useState } from "react";
import { Product } from "../types";
import { ArrowLeft, Star, Download, ShieldCheck, Cpu, RefreshCw, Layers, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onPurchase: (p: Product, finalPrice: number, license: string) => void;
  purchasedProductIds: string[];
}

export default function ProductDetailView({
  product,
  onBack,
  onPurchase,
  purchasedProductIds,
}: ProductDetailViewProps) {
  const [activeLicense, setActiveLicense] = useState<"Personal" | "Commercial" | "Extended">("Commercial");
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [showWatermark, setShowWatermark] = useState(true);

  const isPurchased = purchasedProductIds.includes(product.id);

  // Price adjustment based on license
  const basePrice = product.price;
  const getLicensePrice = () => {
    if (activeLicense === "Personal") return Math.floor(basePrice * 0.7); // 30% cheaper
    if (activeLicense === "Commercial") return basePrice;
    return Math.floor(basePrice * 2.5); // Extended license is 2.5x
  };

  const currentPrice = getLicensePrice();

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div id="product-detail-workspace" className="py-6">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-6 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Katalog</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Middle Column (70%): Preview & Description */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Preview with watermarking toggle */}
          <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-xs border border-slate-800">
            <img
              src={product.previews[activePreviewIndex] || product.thumbnail}
              alt={product.title}
              className="w-full h-full object-cover select-none pointer-events-none"
              referrerPolicy="no-referrer"
            />
            
            {/* Live Watermark Overlay Simulator */}
            {!isPurchased && showWatermark && (
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30 select-none pointer-events-none">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center text-white font-sans text-xs font-extrabold uppercase tracking-widest rotate-[-30deg]"
                  >
                    DESAINE.ID PROTECTED
                  </div>
                ))}
              </div>
            )}

            {/* Simulated Watermark Indicator */}
            {!isPurchased && (
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl flex justify-between items-center text-[10px] text-white">
                <span className="font-semibold flex items-center space-x-1">
                  <span>🔒 Watermark aktif. Beli lisensi untuk menghapus secara permanen.</span>
                </span>
                <button
                  onClick={() => setShowWatermark(!showWatermark)}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-2.5 py-1 rounded-lg border border-white/10"
                >
                  {showWatermark ? "Sembunyikan Simulasi" : "Tampilkan Simulasi"}
                </button>
              </div>
            )}

            {isPurchased && (
              <div className="absolute bottom-4 left-4 bg-blue-600 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 shadow-sm">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Terbeli • File Bersih Tanpa Watermark</span>
              </div>
            )}
          </div>

          {/* Thumbnail Selectors */}
          {product.previews.length > 1 && (
            <div className="flex space-x-2">
              {product.previews.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePreviewIndex(idx)}
                  className={`w-20 aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                    activePreviewIndex === idx ? "border-blue-600 scale-105" : "border-slate-200 opacity-70"
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}

          {/* Tabs: Description & Technical details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md uppercase">
                {product.category}
              </span>
              <h1 className="font-sans font-extrabold text-slate-900 text-xl mt-3">{product.title}</h1>
              
              <div className="flex items-center space-x-4 mt-3 text-xs text-slate-500">
                <div className="flex items-center space-x-1.5">
                  <img src={product.sellerAvatar} alt="seller" className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                  <span className="font-semibold text-slate-800">{product.sellerName}</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-0.5 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <strong className="text-slate-800">{product.rating}</strong>
                </div>
                <span>•</span>
                <span>{product.sales} Penjualan</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="font-sans font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Deskripsi Produk</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>

            {/* Technical Metadata */}
            <div className="border-t border-slate-100 pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <p className="text-slate-400 font-medium">Software</p>
                <p className="font-semibold text-slate-800">{product.software}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Format File</p>
                <p className="font-mono font-semibold text-slate-800">{product.formats.join(", ")}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Ukuran File</p>
                <p className="font-semibold text-slate-800">{product.fileSize}</p>
              </div>
            </div>

            {/* Changelog */}
            {product.changelog && product.changelog.length > 0 && (
              <div className="border-t border-slate-100 pt-4">
                <h3 className="font-sans font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
                  <span>Changelog (Versi {product.version})</span>
                </h3>
                <ul className="list-disc list-inside text-xs text-slate-500 space-y-1">
                  {product.changelog.map((log, i) => (
                    <li key={i}>{log}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (30%): Purchase Board */}
        <div className="space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
            
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pilih Jenis Lisensi</p>
              
              {/* License selectors */}
              <div className="space-y-2">
                {[
                  { id: "Personal", title: "Personal License", desc: "Satu pengguna, projek non-komersial" },
                  { id: "Commercial", title: "Commercial License", desc: "Kebutuhan brand UMKM & komersial klien" },
                  { id: "Extended", title: "Extended License", desc: "Produk dijual kembali, tim agensi" }
                ].map((lic) => (
                  <button
                    key={lic.id}
                    onClick={() => setActiveLicense(lic.id as any)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      activeLicense === lic.id
                        ? "border-blue-600 bg-blue-50/50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-900">{lic.title}</span>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        activeLicense === lic.id ? "border-blue-600 bg-blue-600" : "border-slate-300"
                      }`}>
                        {activeLicense === lic.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{lic.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-between items-end">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Harga Lisensi</p>
                <p className="text-lg font-mono font-extrabold text-blue-600">{formatRupiah(currentPrice)}</p>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                Rupiah IDR
              </span>
            </div>

            {/* Checkout Actions */}
            {isPurchased ? (
              <div className="space-y-2">
                <a
                  href={`/api/download/${product.id}`}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download File Utama (.ZIP)</span>
                </a>
                <p className="text-[10px] text-slate-400 text-center">
                  Tautan aman berekstensi token kedaluwarsa otomatis.
                </p>
              </div>
            ) : (
              <button
                onClick={() => onPurchase(product, currentPrice, activeLicense)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Beli Lisensi Sekarang</span>
              </button>
            )}

            <div className="text-[10px] text-slate-400 space-y-1">
              <p className="flex items-center space-x-1">
                <span>🛡️</span>
                <span>Garansi Escrow: Desaine mengamankan file asli</span>
              </p>
              <p className="flex items-center space-x-1">
                <span>⚡</span>
                <span>Akses download langsung instan setelah bayar</span>
              </p>
            </div>

          </div>

          {/* Help card */}
          <div className="bg-gradient-to-tr from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 text-xs text-blue-950 space-y-2">
            <h4 className="font-bold flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Butuh Kustomisasi Khusus?</span>
            </h4>
            <p className="text-[11px] leading-relaxed text-blue-900">
              Desainer ini menerima custom order. Anda bisa meminta perubahan warna, branding logo, atau format file khusus sesuai kebutuhan.
            </p>
            <button className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
              Ajukan Custom Project &rarr;
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
