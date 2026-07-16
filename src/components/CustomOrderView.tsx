import React, { useState } from "react";
import { CustomProject, Proposal } from "../types";
import { ArrowLeft, User, DollarSign, Calendar, FileText, Send, Sparkles, CheckCircle, Lock, ShieldAlert, Star } from "lucide-react";
import { motion } from "motion/react";

interface CustomOrderViewProps {
  project: CustomProject;
  onBack: () => void;
  buyerBalance: number;
  sellerEarnings: number;
  onUpdateProject: (updatedProj: CustomProject, newBuyerBalance?: number, newSellerEarnings?: number) => void;
  authToken?: string | null;
}

export default function CustomOrderView({
  project,
  onBack,
  buyerBalance,
  sellerEarnings,
  onUpdateProject,
  authToken,
}: CustomOrderViewProps) {
  const [activeTab, setActiveTab] = useState<"brief" | "proposals" | "milestones">("brief");
  const [coverLetter, setCoverLetter] = useState("");
  const [bidAmount, setBidAmount] = useState(project.budgetMin);
  const [deliveryDays, setDeliveryDays] = useState(7);
  const [submitMessage, setSubmitMessage] = useState("");

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Submit designer proposal simulation
  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverLetter) return;

    const newProposal: Proposal = {
      id: `prop_${Date.now()}`,
      designerId: "sell_01",
      designerName: "Pratama Design Studio (Anda)",
      designerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      designerRating: 4.9,
      amount: Number(bidAmount),
      deliveryDays: Number(deliveryDays),
      coverLetter,
      status: "pending",
    };

    const updated = {
      ...project,
      proposals: [...project.proposals, newProposal]
    };

    // Send mock POST
    fetch("/api/projects/proposal", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {})
      },
      body: JSON.stringify({
        projectId: project.id,
        designerName: newProposal.designerName,
        amount: newProposal.amount,
        deliveryDays: newProposal.deliveryDays,
        coverLetter: newProposal.coverLetter
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          onUpdateProject(data.project);
          setCoverLetter("");
          setSubmitMessage("Penawaran proposal Anda berhasil dikirim ke feed proyek!");
        }
      })
      .catch(err => {
        console.error(err);
        onUpdateProject(updated); // fallback
      });
  };

  // Client funds or approves proposal
  const handleApproveProposal = (prop: Proposal) => {
    const totalAmount = prop.amount;
    
    fetch("/api/projects/escrow-fund", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {})
      },
      body: JSON.stringify({
        projectId: project.id,
        proposalId: prop.id
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          onUpdateProject(data.project, data.userBalance, undefined);
          setActiveTab("milestones");
        }
      })
      .catch(err => {
        console.error(err);
        // Offline simulation
        if (buyerBalance < totalAmount) {
          alert("Saldo Dompet tidak cukup.");
          return;
        }
        const updatedProposals = project.proposals.map(p => {
          if (p.id === prop.id) return { ...p, status: "approved" as const };
          return { ...p, status: "rejected" as const };
        });

        const updatedMilestones = project.milestones.map((m, idx) => {
          if (idx === 0) return { ...m, status: "funded" as const };
          return m;
        });

        const updatedProj: CustomProject = {
          ...project,
          status: "ongoing",
          chosenProposalId: prop.id,
          proposals: updatedProposals,
          milestones: updatedMilestones
        };

        onUpdateProject(updatedProj, buyerBalance - project.milestones[0].amount);
        setActiveTab("milestones");
      });
  };

  // Fund specifically a single milestone
  const handleFundMilestone = (msId: string, amount: number) => {
    if (buyerBalance < amount) {
      alert("Saldo tidak mencukupi untuk mendanai milestone ini.");
      return;
    }

    fetch("/api/projects/escrow-fund", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {})
      },
      body: JSON.stringify({
        projectId: project.id,
        milestoneId: msId
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          onUpdateProject(data.project, data.userBalance, undefined);
        }
      })
      .catch(err => {
        console.error(err);
        const updated = {
          ...project,
          milestones: project.milestones.map(m => {
            if (m.id === msId) return { ...m, status: "funded" as const };
            return m;
          })
        };
        onUpdateProject(updated, buyerBalance - amount);
      });
  };

  // Release specifically a funded milestone to desainer
  const handleReleaseMilestone = (msId: string, amount: number) => {
    fetch("/api/projects/escrow-release", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {})
      },
      body: JSON.stringify({
        projectId: project.id,
        milestoneId: msId
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          onUpdateProject(data.project, undefined, data.sellerEarnings);
        }
      })
      .catch(err => {
        console.error(err);
        const updated = {
          ...project,
          milestones: project.milestones.map(m => {
            if (m.id === msId) return { ...m, status: "released" as const };
            return m;
          })
        };
        const allReleased = updated.milestones.every(m => m.status === "released");
        if (allReleased) {
          updated.status = "completed";
        }
        onUpdateProject(updated, undefined, sellerEarnings + amount);
      });
  };

  return (
    <div id="custom-order-workspace" className="py-6">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-6 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Feed Proyek</span>
      </button>

      {/* Main card */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs mb-8">
        <div className="p-6 bg-slate-900 text-white">
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-[10px] font-mono font-bold bg-white/10 px-2.5 py-1 rounded-md uppercase text-blue-400">
                {project.category}
              </span>
              <h1 className="font-sans font-extrabold text-lg sm:text-xl mt-3">{project.title}</h1>
              <p className="text-xs text-slate-400 mt-2 flex items-center space-x-1">
                <User className="w-3.5 h-3.5" />
                <span>Oleh: <strong>{project.clientName}</strong></span>
              </p>
            </div>

            <div className="text-right">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                project.status === "open"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10"
                  : project.status === "ongoing"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-700 text-slate-200"
              }`}>
                {project.status === "open" ? "Terbuka" : project.status === "ongoing" ? "Sedang Dikerjakan" : "Selesai"}
              </span>
              <p className="text-[10px] text-slate-400 mt-2 font-mono">
                Budget: {formatRupiah(project.budgetMin)} - {formatRupiah(project.budgetMax)}
              </p>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50">
          <button
            onClick={() => setActiveTab("brief")}
            className={`py-3.5 px-4 text-xs font-bold transition-all border-b-2 -mb-px ${
              activeTab === "brief" ? "border-blue-600 text-blue-600 font-extrabold" : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Project Brief
          </button>
          <button
            onClick={() => setActiveTab("proposals")}
            className={`py-3.5 px-4 text-xs font-bold transition-all border-b-2 -mb-px flex items-center space-x-1.5 ${
              activeTab === "proposals" ? "border-blue-600 text-blue-600 font-extrabold" : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>Daftar Proposal</span>
            <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-full text-[9px]">
              {project.proposals.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("milestones")}
            className={`py-3.5 px-4 text-xs font-bold transition-all border-b-2 -mb-px flex items-center space-x-1.5 ${
              activeTab === "milestones" ? "border-blue-600 text-blue-600 font-extrabold" : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>Escrow Milestones</span>
            {project.status !== "open" && (
              <Lock className="w-3 h-3 text-blue-600" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          
          {/* TAB: BRIEF */}
          {activeTab === "brief" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="md:col-span-2 space-y-4">
                <h3 className="font-sans font-bold text-sm text-slate-800 uppercase tracking-wider">Kebutuhan Utama</h3>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{project.description}</p>
                
                <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-slate-400">Target Tenggat Waktu (Deadline)</p>
                    <p className="font-semibold text-slate-800 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{project.deadline}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400">Status Escrow Proyek</p>
                    <p className="font-semibold text-slate-800 flex items-center space-x-1">
                      <Lock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Rekening Bersama Aktif (Safe Checkout)</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit proposal sidebar simulator */}
              {project.status === "open" && (
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                  <h3 className="font-sans font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                    <span>Kirim Penawaran (Bidding)</span>
                  </h3>
                  
                  {submitMessage ? (
                    <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-xl border border-blue-100 flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                      <span>{submitMessage}</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSendProposal} className="space-y-3">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold mb-1">Cover Letter (Pengenalan & Portofolio)</label>
                        <textarea
                          rows={3}
                          placeholder="Saya siap mengerjakan dengan gaya vintage..."
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs focus:ring-blue-500 outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold mb-1">Jumlah Ajuan Bid (Rp)</label>
                        <input
                          type="number"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold mb-1">Lama Pengiriman (Hari)</label>
                        <input
                          type="number"
                          value={deliveryDays}
                          onChange={(e) => setDeliveryDays(Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Kirim Proposal</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

            </div>
          )}

          {/* TAB: PROPOSALS */}
          {activeTab === "proposals" && (
            <div className="space-y-4">
              {project.proposals.length > 0 ? (
                project.proposals.map((prop) => (
                  <div key={prop.id} className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col sm:flex-row justify-between gap-4">
                    
                    <div className="flex items-start space-x-3 flex-1">
                      <img src={prop.designerAvatar} alt={prop.designerName} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{prop.designerName}</h4>
                        <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 mt-0.5">
                          <span className="flex items-center space-x-0.5 text-amber-500">
                            <Star className="w-3 h-3 fill-amber-500" />
                            <strong>{prop.designerRating}</strong>
                          </span>
                          <span>•</span>
                          <span>Durasi: {prop.deliveryDays} hari kerja</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-2 italic">"{prop.coverLetter}"</p>
                      </div>
                    </div>

                    <div className="text-right flex sm:flex-col justify-between items-end gap-2 shrink-0">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Harga Penawaran</p>
                        <p className="text-sm font-mono font-extrabold text-blue-600">{formatRupiah(prop.amount)}</p>
                      </div>

                      {project.status === "open" ? (
                        <button
                          onClick={() => handleApproveProposal(prop)}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                        >
                          <Lock className="w-3 h-3 text-white" />
                          <span>Pilih & Danai Escrow</span>
                        </button>
                      ) : prop.status === "approved" ? (
                        <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border border-blue-100">
                          Desainer Terpilih
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 uppercase">Ditolak</span>
                      )}
                    </div>

                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-medium">Belum ada desainer yang mengirimkan proposal untuk brief ini.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB: MILESTONES / ESCROW HUB */}
          {activeTab === "milestones" && (
            <div className="space-y-6">
              
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-5 rounded-2xl text-white flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg shadow-blue-500/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-white/10 rounded-xl">
                    <Lock className="w-6 h-6 text-blue-200" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Sistem Rekening Bersama Escrow Desaine</h4>
                    <p className="text-[11px] text-slate-200 mt-0.5">
                      Dana terpendam aman di platform. Dilepas secara bertahap hanya setelah hasil review disetujui klien.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {project.milestones.map((ms, index) => (
                  <div key={ms.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                    
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold font-mono text-[11px]">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900">{ms.title}</h4>
                        <p className="text-[10px] text-slate-400">Tenggat milestone: {ms.deadline}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-right">
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Dana Milestone</p>
                        <p className="font-mono font-bold text-slate-800">{formatRupiah(ms.amount)}</p>
                      </div>

                      {/* State button togglers */}
                      {ms.status === "unfunded" ? (
                        <button
                          onClick={() => handleFundMilestone(ms.id, ms.amount)}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-lg shadow-blue-500/15 transition-all cursor-pointer"
                        >
                          Isi Escrow (Fund)
                        </button>
                      ) : ms.status === "funded" ? (
                        <div className="flex items-center space-x-2">
                          <span className="bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded text-[9px] font-bold uppercase border border-indigo-150">
                            Terdanai (Held)
                          </span>
                          <button
                            onClick={() => handleReleaseMilestone(ms.id, ms.amount)}
                            className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-lg shadow-blue-500/15 transition-all cursor-pointer"
                          >
                            Lepas Dana (Release)
                          </button>
                        </div>
                      ) : (
                        <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border border-blue-100">
                          Released to Designer
                        </span>
                      )}
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      </div>

    </div>
  );
}
