"use client";

import { useState } from "react";

export default function DatabaseAdmin() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleBackup() {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/admin/database");
      if (!res.ok) throw new Error("Backup failed");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `backup-${new Date().toISOString().slice(0, 10)}.db`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setMessage("ดาวน์โหลดไฟล์สำรองข้อมูลสำเร็จ!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm("⚠️ คำเตือน: การกู้คืนข้อมูลจะเขียนทับฐานข้อมูลปัจจุบันทั้งหมด คุณแน่ใจหรือไม่? (แนะนำให้ Backup ไว้ก่อน)")) {
        e.target.value = "";
        return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/database", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Restore failed");
      }
      
      setMessage("กู้คืนข้อมูลสำเร็จ! ระบบจะรีเฟรชข้อมูลใหม่ครับ");
      setTimeout(() => window.location.reload(), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      <header className="space-y-1">
        <h1 className="text-4xl font-black tracking-tighter uppercase text-slate-900">ฐานข้อมูล (Database)</h1>
        <p className="text-sm font-bold opacity-40 uppercase tracking-widest">การสำรองและการกู้คืนข้อมูลระบบ (SQLite Backup & Restore)</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Backup Box */}
         <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-indigo-100 border border-slate-100 space-y-6">
            <div className="h-16 w-16 rounded-3xl bg-indigo-50 flex items-center justify-center text-3xl">📥</div>
            <div className="space-y-2">
               <h3 className="text-xl font-bold">สำรองข้อมูล (Backup)</h3>
               <p className="text-sm opacity-50 font-medium leading-relaxed">ดาวน์โหลดไฟล์ฐานข้อมูล (.db) เพื่อเก็บไว้ป้องกันเหตุฉุกเฉิน</p>
            </div>
            <button 
              onClick={handleBackup}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95 disabled:opacity-50"
            >
               {loading ? "กำลังดำเนินการ..." : "กดเพื่อ Backup"}
            </button>
         </div>

         {/* Restore Box */}
         <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-rose-100 border border-slate-100 space-y-6">
            <div className="h-16 w-16 rounded-3xl bg-rose-50 flex items-center justify-center text-3xl">📤</div>
            <div className="space-y-2">
               <h3 className="text-xl font-bold text-rose-950">กู้คืนข้อมูล (Restore)</h3>
               <p className="text-sm opacity-50 font-medium leading-relaxed">อัปโหลดไฟล์ .db ที่เคย Backup ไว้กลับเข้าสู่ระบบ</p>
            </div>
            <label className="block">
               <span className="sr-only">เลือกไฟล์กู้คืน</span>
               <input 
                 type="file" 
                 accept=".db"
                 onChange={handleRestore}
                 disabled={loading}
                 className="block w-full text-xs text-slate-500
                   file:mr-4 file:py-4 file:px-8
                   file:rounded-2xl file:border-0
                   file:text-xs file:font-black file:uppercase file:tracking-widest
                   file:bg-rose-50 file:text-rose-700
                   hover:file:bg-rose-100 transition-all cursor-pointer opacity-80"
               />
            </label>
         </div>
      </div>

      {(message || error) && (
        <div className={`p-6 rounded-3xl text-xs font-black uppercase tracking-widest text-center shadow-lg animate-bounce ${error ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
           {error ? `⚠️ ERROR: ${error}` : `✅ Success: ${message}`}
        </div>
      )}

      <footer className="pt-20 text-center opacity-20">
         <p className="text-[10px] font-black uppercase tracking-widest italic">⚠️ คำแนะนำ: ควรสำรองข้อมูลสัปดาห์ละหนึ่งครั้งเพื่อความปลอดภัยสูงสุด</p>
      </footer>
    </div>
  );
}
