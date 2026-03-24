"use client";

import { useState, useEffect } from "react";

type Module = { name: string };

export default function ModuleAdmin() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [installing, setInstalling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchModules();
  }, []);

  async function fetchModules() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/modules");
      const data = await res.json();
      setModules(data);
    } catch {
      setError("Failed to fetch modules");
    } finally {
      setLoading(false);
    }
  }

  async function handleInstall(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setInstalling(true);
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/modules", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Install failed");
      
      setSuccess(`${file.name} ติดตั้งสำเร็จ!`);
      fetchModules();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setInstalling(false);
      e.target.value = "";
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Hero Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-slate-900 text-white p-12 rounded-[4rem] shadow-2xl overflow-hidden relative border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-4">
             <span className="px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-[0.3em] border border-indigo-400/20 shadow-inner">Architecture v2.0 Ready</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">ตัวจัดการโมดูล (Modules Manager)</h1>
          <p className="text-sm font-bold opacity-40 uppercase tracking-widest leading-relaxed max-w-lg">ขยายความสามารถโปรเจกต์ของคุณด้วยระบบ Plugin ที่สามารถอัปโหลดและติดตั้งโครงสร้างโค้ดได้แบบ On-the-fly</p>
        </div>
        
        <label className="group relative z-10">
           <div className={`px-12 py-5 rounded-3xl bg-white text-slate-900 font-black uppercase text-xs tracking-widest shadow-2xl shadow-indigo-500/20 transition-all hover:scale-105 hover:bg-indigo-50 active:scale-95 cursor-pointer flex items-center gap-4 ${installing ? 'opacity-50 animate-pulse' : ''}`}>
              <span>{installing ? "กำลังติดตั้ง..." : "อัปโหลดโมดูล .ZIP"}</span>
              <span className="text-xl">📦</span>
           </div>
           <input type="file" accept=".zip" onChange={handleInstall} disabled={installing} className="absolute inset-0 opacity-0 cursor-pointer" />
        </label>
      </header>

      {/* Installed Modules Grid */}
      <section className="space-y-6">
         <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-30 px-4 flex items-center gap-4">
            <div className="h-0.5 w-12 bg-indigo-600 rounded-full" />
            โมดูลที่ติดตั้งแล้ว (Installed Extensions)
         </h2>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((m) => (
               <div key={m.name} className="group flex items-center p-8 bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:translate-y-[-4px]">
                  <div className="h-14 w-14 shrink-0 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">⚙️</div>
                  <div className="ml-6 space-y-1">
                     <h3 className="text-lg font-black tracking-tight">{m.name}</h3>
                     <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest text-emerald-600">Active & Ready</span>
                     </div>
                  </div>
               </div>
            ))}

            {modules.length === 0 && !loading && (
               <div className="col-span-full py-24 text-center bg-slate-50/50 rounded-[4rem] border-4 border-dashed border-slate-200/50">
                  <p className="text-sm font-black uppercase tracking-[0.4em] opacity-20">ไม่มีโมดูลติดตั้งเพิ่ม</p>
               </div>
            )}
         </div>
      </section>

      {/* Developer Note */}
      <footer className="bg-indigo-500/5 p-12 rounded-[4rem] border border-indigo-500/10 space-y-6">
         <div className="flex items-center gap-3">
            <span className="text-2xl">👩‍💻</span>
            <h3 className="text-xl font-black tracking-tight uppercase">สำหรับการพัฒนา (Developer Guide)</h3>
         </div>
         <p className="text-sm font-medium opacity-60 leading-relaxed max-w-2xl">
            เราใช้โครงสร้างมาตรฐานสำหรับโมดูล เพื่อให้สามารถแยกส่วนและเรียกใช้งานได้จริง (Headless Native) <br/>
            ให้นักพัฒนาจัดหมวดหมู่โค้ดในรูปแบบ <b>Folder/API/Components</b> เสมอ และสามารถเรียกใช้ผ่าน Next.js Dynamic Imports ได้ทันทีครับ
         </p>
         <button className="px-8 py-3 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-opacity shadow-lg">อ่านคู่มือทางเทคนิค</button>
      </footer>

      {(error || success) && (
        <div className={`fixed bottom-10 right-10 px-12 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl animate-bounce ${error ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
           {error ? `⚠️ ERROR: ${error}` : `✅ SUCCESS: ${success}`}
           <button onClick={() => { setError(null); setSuccess(null); }} className="ml-6 opacity-50">✕</button>
        </div>
      )}
    </div>
  );
}
