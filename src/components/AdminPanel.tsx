import { useState, useEffect } from "react";
import { Product, User } from "../types";
import { productsMock } from "../data/mockData";
import { Shield, Check, X, ShieldAlert, Cpu, HeartHandshake, History, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdminPanelProps {
  products: Product[];
  withdraws: any[];
  onApproveProduct: (id: string) => void;
  onApproveWithdraw: (id: string) => void;
}

export default function AdminPanel({
  products,
  withdraws,
  onApproveProduct,
  onApproveWithdraw,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"moderation" | "withdraws" | "audit_logs">("moderation");
  
  // Local lists
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [pendingWithdraws, setPendingWithdraws] = useState<any[]>([]);

  useEffect(() => {
    setPendingProducts(products.filter(p => p.status === "pending"));
  }, [products]);

  useEffect(() => {
    setPendingWithdraws(withdraws.filter(w => w.status === "pending"));
  }, [withdraws]);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const systemAuditLogs = [
    { id: "log_01", time: new Date().toISOString().replace('T', ' ').substring(0, 19), type: "SYSTEM_LAUNCH", user: "System Curated", desc: "Sistem DESAINE berhasil diluncurkan ke produksi. Seluruh gerbang API aktif.", status: "success" },
    { id: "log_02", time: new Date().toISOString().replace('T', ' ').substring(0, 19), type: "DB_INIT", user: "System Curated", desc: "Inisialisasi database produksi berhasil dilakukan. Super Admin terdaftar.", status: "success" }
  ];

  return (
    <div id="admin-panel-workspace" className="py-6">
      
      {/* Upper overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-xs text-slate-500">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-bold uppercase tracking-wider text-slate-400">Moderasi Produk Pending</p>
            <p className="text-base font-extrabold text-slate-900 mt-0.5">{pendingProducts.length} produk</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-amber-50 rounded-xl">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="font-bold uppercase tracking-wider text-slate-400">Withdraw Pending</p>
            <p className="text-base font-extrabold text-slate-900 mt-0.5">{pendingWithdraws.length} antrean</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <HeartHandshake className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-bold uppercase tracking-wider text-slate-400">Status Platform Security</p>
            <p className="text-base font-extrabold text-blue-600 mt-0.5">Protected & Online</p>
          </div>
        </div>
      </div>

      {/* Admin Tab Nav */}
      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab("moderation")}
          className={`py-3 px-4 text-xs font-bold whitespace-nowrap transition-all border-b-2 -mb-px ${
            activeTab === "moderation" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Moderasi Kurasi Produk ({pendingProducts.length})
        </button>
        <button
          onClick={() => setActiveTab("withdraws")}
          className={`py-3 px-4 text-xs font-bold whitespace-nowrap transition-all border-b-2 -mb-px ${
            activeTab === "withdraws" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Validasi Payout Withdraws ({pendingWithdraws.length})
        </button>
        <button
          onClick={() => setActiveTab("audit_logs")}
          className={`py-3 px-4 text-xs font-bold whitespace-nowrap transition-all border-b-2 -mb-px flex items-center space-x-1 ${
            activeTab === "audit_logs" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <History className="w-4 h-4 text-slate-400" />
          <span>Audit Security Logs</span>
        </button>
      </div>

      {/* SUBTAB: MODERATION */}
      {activeTab === "moderation" && (
        <div className="space-y-4">
          {pendingProducts.length > 0 ? (
            pendingProducts.map((prod) => (
              <div key={prod.id} className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                
                <div className="flex items-center space-x-4">
                  <img src={prod.thumbnail} alt="thumbnail" className="w-20 aspect-video rounded-xl object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded uppercase">
                      {prod.category}
                    </span>
                    <h4 className="font-sans font-bold text-slate-900 text-sm mt-1.5">{prod.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Oleh desainer: {prod.sellerName} • Software: {prod.software}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold">Harga</p>
                    <p className="font-mono font-bold text-slate-800">{formatRupiah(prod.price)}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onApproveProduct(prod.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-2.5 rounded-xl cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold p-2.5 rounded-xl cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Cpu className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-pulse" />
              <p className="text-xs text-slate-500 font-medium">Antrean kurasi kosong. Seluruh produk digital aktif telah terverifikasi!</p>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB: WITHDRAWS PAYOUT */}
      {activeTab === "withdraws" && (
        <div className="space-y-4">
          {pendingWithdraws.length > 0 ? (
            pendingWithdraws.map((w) => (
              <div key={w.id} className="bg-white border border-slate-200 p-5 rounded-2xl flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-slate-800 text-sm">{formatRupiah(w.amount)}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Diajukan tanggal: {w.date} • Tujuan: {w.gateway}</p>
                </div>

                <button
                  onClick={() => onApproveWithdraw(w.id)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Approve & Transfer</span>
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Check className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">Tidak ada antrean penarikan dana pending.</p>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB: SECURITY AUDIT LOGS */}
      {activeTab === "audit_logs" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs text-xs font-mono">
          <div className="bg-slate-950 text-slate-300 p-3 flex justify-between items-center px-5 border-b border-slate-800">
            <span className="text-[10px] font-bold">Desaine Cloud Run Container Security Hub</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          </div>

          <div className="divide-y divide-slate-100">
            {systemAuditLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50 flex flex-col sm:flex-row justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      log.status === "success"
                        ? "bg-emerald-50 text-emerald-700"
                        : log.status === "warning"
                        ? "bg-rose-50 text-rose-700"
                        : "bg-blue-50 text-blue-700"
                    }`}>
                      {log.type}
                    </span>
                    <span className="text-[10px] text-slate-400">{log.time}</span>
                  </div>
                  <p className="text-slate-600 font-sans text-xs">{log.desc}</p>
                </div>
                <span className="text-[10px] text-slate-400 self-start sm:self-center">{log.user}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
