import { useState } from "react";
import { DocItem, documentationList } from "../data/docsData";
import { BookOpen, Table, Code, ShieldCheck, Cpu, Layout, FileText, Compass } from "lucide-react";
import { motion } from "motion/react";

export default function DeveloperPortal() {
  const [selectedDocId, setSelectedDocId] = useState("doc_01");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  const activeDoc = documentationList.find(d => d.id === selectedDocId) || documentationList[0];

  const categories = ["Semua", "Bisnis", "UX & UI", "Sistem & UML", "Basis Data", "API & Koding", "Panduan & Manual"];

  const filteredDocs = documentationList.filter(doc => {
    return selectedCategory === "Semua" || doc.category === selectedCategory;
  });

  // Custom visual rendering maps
  const renderVisualComponent = (doc: DocItem) => {
    if (!doc.visualData) return null;

    // Render 1. Business Model Canvas Grid
    if (doc.id === "doc_01") {
      const data = doc.visualData;
      return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-4 text-[11px] leading-relaxed">
          <div className="md:col-span-1 bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col justify-between">
            <h5 className="font-bold text-blue-900 uppercase">Partners</h5>
            <p className="whitespace-pre-line text-slate-700 mt-2">{data.rows[0].partners}</p>
          </div>
          <div className="md:col-span-1 flex flex-col gap-3">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex-1">
              <h5 className="font-bold text-slate-800 uppercase">Key Activities</h5>
              <p className="whitespace-pre-line text-slate-600 mt-2">{data.rows[0].activities}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex-1">
              <h5 className="font-bold text-slate-800 uppercase">Key Resources</h5>
              <p className="whitespace-pre-line text-slate-600 mt-2">{data.rows[1].key_resources}</p>
            </div>
          </div>
          <div className="md:col-span-1 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
            <h5 className="font-bold text-emerald-900 uppercase">Value Propositions</h5>
            <p className="whitespace-pre-line text-slate-700 mt-2">{data.rows[0].value_propositions}</p>
          </div>
          <div className="md:col-span-1 flex flex-col gap-3">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex-1">
              <h5 className="font-bold text-slate-800 uppercase">Relationships</h5>
              <p className="whitespace-pre-line text-slate-600 mt-2">{data.rows[0].relationships}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex-1">
              <h5 className="font-bold text-slate-800 uppercase">Channels</h5>
              <p className="whitespace-pre-line text-slate-600 mt-2">{data.rows[1].channels}</p>
            </div>
          </div>
          <div className="md:col-span-1 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
            <h5 className="font-bold text-indigo-900 uppercase">Customer Segments</h5>
            <p className="whitespace-pre-line text-slate-700 mt-2">{data.rows[0].customer_segments || data.rows[0].segments}</p>
          </div>
          <div className="md:col-span-5 grid grid-cols-2 gap-3 mt-2">
            <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
              <h5 className="font-bold text-rose-900 uppercase">Cost Structure</h5>
              <p className="whitespace-pre-line text-slate-700 mt-2">{data.rows[1].cost_structure}</p>
            </div>
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
              <h5 className="font-bold text-emerald-900 uppercase">Revenue Streams</h5>
              <p className="whitespace-pre-line text-slate-700 mt-2">{data.rows[1].revenue_streams}</p>
            </div>
          </div>
        </div>
      );
    }

    // Render 2. Lean Canvas
    if (doc.id === "doc_02") {
      const data = doc.visualData;
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h5 className="font-bold text-slate-800 uppercase">Problems</h5>
            <p className="whitespace-pre-line text-slate-600 mt-2">{data.problem}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h5 className="font-bold text-slate-800 uppercase">Solutions</h5>
            <p className="whitespace-pre-line text-slate-600 mt-2">{data.solution}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h5 className="font-bold text-slate-800 uppercase">Key Metrics</h5>
            <p className="whitespace-pre-line text-slate-600 mt-2">{data.key_metrics}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h5 className="font-bold text-slate-800 uppercase">Unfair Advantage</h5>
            <p className="whitespace-pre-line text-slate-600 mt-2">{data.unfair_advantage}</p>
          </div>
          <div className="md:col-span-2 bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-center">
            <h5 className="font-bold text-indigo-950 uppercase">High Level Concept</h5>
            <p className="text-indigo-900 font-semibold mt-2">"{data.high_level_concept}"</p>
          </div>
        </div>
      );
    }

    // Render 4. SWOT Matrix
    if (doc.id === "doc_04") {
      const data = doc.visualData as any[];
      const colors = ["bg-emerald-50 border-emerald-100 text-emerald-950", "bg-rose-50 border-rose-100 text-rose-950", "bg-blue-50 border-blue-100 text-blue-950", "bg-amber-50 border-amber-100 text-amber-950"];
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
          {data.map((item, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${colors[idx] || "bg-slate-50 border-slate-200"}`}>
              <h5 className="font-bold uppercase tracking-wider mb-2">{item.type}</h5>
              <ul className="list-disc list-inside space-y-1">
                {item.items.map((sub: string, i: number) => (
                  <li key={i} className="leading-relaxed">{sub}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    }

    // Render 17. Database Schema 80+ Tables
    if (doc.id === "doc_017" || doc.title.includes("ERD") || doc.title.includes("17")) {
      const data = doc.visualData;
      return (
        <div className="mt-4 space-y-4 text-xs">
          <div className="p-4 bg-indigo-950 text-white rounded-xl">
            <h5 className="font-bold uppercase tracking-wider mb-1">Pemisahan 6 Modul Logis (Total: 82 Tabel Database)</h5>
            <p className="text-[11px] text-slate-300">Dirancang secara normalisasi 3NF lengkap dengan foreign keys dan index penelusuran optimal.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.key_tables.map((table: any, idx: number) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <h6 className="font-bold text-slate-900 uppercase">{table.name}</h6>
                <p className="text-slate-600 mt-1.5 leading-relaxed">{table.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-[11px] border border-slate-800">
            <h5 className="font-bold text-white mb-2 font-sans">CONTOH HUBUNGAN ENTITAS (RELASI):</h5>
            <p className="whitespace-pre-line">{data.relationships}</p>
          </div>
        </div>
      );
    }

    // Default table display for raw JSON visual arrays
    if (Array.isArray(doc.visualData)) {
      const list = doc.visualData as any[];
      return (
        <div className="mt-4 overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                {Object.keys(list[0]).map((k) => (
                  <th key={k} className="p-3">{k.replace("_", " ")}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  {Object.values(row).map((v: any, j) => (
                    <td key={j} className="p-3 whitespace-pre-line text-slate-700">
                      {typeof v === "object" ? JSON.stringify(v) : String(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Default object visual box
    return (
      <div className="mt-4 p-4 bg-slate-50 rounded-xl font-mono text-[11px] border border-slate-200 text-slate-700 whitespace-pre-wrap">
        {JSON.stringify(doc.visualData, null, 2)}
      </div>
    );
  };

  return (
    <div id="developer-portal-suite" className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-4">
      
      {/* Sidebar navigation */}
      <div className="lg:col-span-1 space-y-4">
        
        {/* Category selectors */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">Filter Kategori Spec</p>
          <div className="flex flex-wrap lg:flex-col gap-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Spec Documents Nav */}
        <div className="space-y-1.5 border-t border-slate-100 pt-4">
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">Daftar Spesifikasi ({filteredDocs.length})</p>
          <div className="max-h-[450px] overflow-y-auto space-y-1 pr-1 scrollbar-thin">
            {filteredDocs.map(doc => (
              <button
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center space-x-2 border ${
                  selectedDocId === doc.id
                    ? "border-blue-600 bg-blue-50/40 text-blue-900 font-bold"
                    : "border-transparent text-slate-600 hover:bg-slate-50"
                }`}
              >
                <FileText className="w-4 h-4 shrink-0 text-slate-400" />
                <span className="truncate">{doc.title}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Main specification renderer */}
      <div className="lg:col-span-3 bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-xs space-y-6">
        
        <div>
          <span className="bg-blue-50 text-blue-700 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider border border-blue-100">
            {activeDoc.category}
          </span>
          <h2 className="font-sans font-extrabold text-slate-950 text-lg sm:text-xl mt-3">{activeDoc.title}</h2>
          <p className="text-xs text-slate-500 mt-1.5">{activeDoc.description}</p>
        </div>

        {/* Content text */}
        <div className="border-t border-slate-100 pt-5 text-xs text-slate-600 leading-relaxed space-y-3">
          <p className="font-sans">{activeDoc.content}</p>
        </div>

        {/* Custom Visual Interactive Panels */}
        {renderVisualComponent(activeDoc)}

        <div className="pt-6 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between items-center">
          <span>DESAINE Enterprise Technical Specification Platform v12.0</span>
          <span>Approved: Technical Architect Committee</span>
        </div>

      </div>

    </div>
  );
}
