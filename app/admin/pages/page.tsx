"use client";

import { useState, useEffect } from "react";

type PageData = {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
};

export default function PagesAdmin() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", slug: "", content: "", isPublished: true });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  async function fetchPages() {
    setLoading(true);
    try {
      const res = await fetch("/api/pages");
      const data = await res.json();
      setPages(data);
    } catch {
      setError("โหลดข้อมูลล้มเหลว");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId ? `/api/pages/${editingId}` : "/api/pages";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();
      
      setEditingId(null);
      setFormData({ title: "", slug: "", content: "", isPublished: true });
      fetchPages();
    } catch {
      setError("บันทึกข้อมูลไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("คุณต้องการลบหน้าเพจนี้ใช่หรือไม่?")) return;
    try {
      const res = await fetch(`/api/pages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      fetchPages();
    } catch {
       setError("ลบข้อมูลไม่สำเร็จ");
    }
  }

  function startEdit(p: PageData) {
    setEditingId(p.id);
    setFormData({ title: p.title, slug: p.slug, content: p.content, isPublished: p.isPublished });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (loading && pages.length === 0) return <div className="p-8 text-center opacity-50 font-black">กำลังโหลด...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter uppercase text-slate-900">จัดการหน้าเพจ (Pages)</h1>
          <p className="text-sm font-bold opacity-40 uppercase tracking-widest">สร้างและแก้ไขเนื้อหาหน้าต่างๆ เช่น Services, About, Contact</p>
        </div>
      </header>

      {/* Editor Form */}
      <section className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 ring-1 ring-slate-100/50">
        <h2 className="text-xl font-black tracking-tight mb-8 uppercase flex items-center gap-3">
          <span className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">✍️</span>
          {editingId ? "แก้ไขหน้าเพจ" : "เพิ่มหน้าเพจใหม่"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">หัวข้อหน้าเพจ (Title)</label>
                 <input
                   type="text"
                   required
                   value={formData.title}
                   onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                   className="w-full rounded-2xl bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold px-5 py-4 outline-none"
                   placeholder="เช่น Services, Contact Us"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">URL Slug (ต่อท้าย /...)</label>
                 <input
                   type="text"
                   required
                   value={formData.slug}
                   onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                   className="w-full rounded-2xl bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono text-sm px-5 py-4 outline-none"
                   placeholder="เช่น services, about-me"
                 />
              </div>
           </div>

           <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">เนื้อหาหน้าเพจ (HTML Supported)</label>
                <div className="text-[9px] opacity-30 italic px-3 py-1 bg-slate-100 rounded-full font-bold">รองรับ TAG HTML พื้นฐาน เช่น h1, p, img</div>
              </div>
              <textarea
                required
                rows={12}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full rounded-[2rem] bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium px-6 py-6 outline-none scrollbar-thin leading-relaxed"
                placeholder="เขียนเนื้อหาเพจของคุณที่นี่... สามารถใช้ Tag HTML ได้"
              />
           </div>

           <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-50">
              <label className="flex items-center gap-3 group cursor-pointer">
                 <div className="h-6 w-11 rounded-full bg-slate-200 p-1 group-hover:bg-slate-300 transition-all relative">
                    <input 
                      type="checkbox" 
                      className="peer hidden" 
                      checked={formData.isPublished} 
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} 
                    />
                    <div className="h-4 w-4 rounded-full bg-white shadow-sm transition-all peer-checked:translate-x-5 peer-checked:bg-indigo-600" />
                 </div>
                 <span className="text-xs font-black uppercase tracking-widest opacity-60">เผยแพร่หน้านี้ (Published)</span>
              </label>

              <div className="flex items-center gap-4 w-full md:w-auto">
                 {editingId && (
                   <button
                    type="button"
                    onClick={() => { setEditingId(null); setFormData({ title: "", slug: "", content: "", isPublished: true }); }}
                    className="flex-1 md:flex-none px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 transition-all"
                   >
                     ยกเลิก
                   </button>
                 )}
                 <button
                   disabled={saving}
                   className="flex-1 md:flex-none px-12 py-4 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest shadow-2xl shadow-slate-300 hover:bg-slate-800 hover:translate-y-[-2px] active:translate-y-[0] transition-all disabled:opacity-50"
                 >
                   {saving ? "กำลังบันทึก..." : (editingId ? "บันทึกการแก้ไข" : "สร้างหน้าเพจใหม่")}
                 </button>
              </div>
           </div>
        </form>
      </section>

      {/* List Section */}
      <section className="space-y-6">
         <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-30 px-2 flex items-center gap-2">
            <div className="h-1 w-6 rounded-full bg-indigo-600" />
            หน้าเพจทั้งหมดที่สร้างไว้
         </h2>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map(p => (
              <div key={p.id} className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between overflow-hidden relative">
                 <div className={`absolute top-6 right-6 h-2 w-2 rounded-full ${p.isPublished ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                 
                 <div className="space-y-3">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Slug:</span>
                       <span className="text-[9px] font-mono bg-slate-50 px-2 py-0.5 rounded text-indigo-500">/{p.slug}</span>
                    </div>
                    <h3 className="text-xl font-black tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">{p.title}</h3>
                    <div className="h-20 overflow-hidden relative">
                       <div className="text-xs opacity-40 leading-relaxed font-medium line-clamp-3" dangerouslySetInnerHTML={{ __html: p.content.replace(/<[^>]*>/g, '') }} />
                       <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white" />
                    </div>
                 </div>

                 <div className="flex items-center justify-between pt-8 border-t border-slate-50 mt-8">
                    <div className="flex items-center gap-2">
                       <button 
                         onClick={() => startEdit(p)}
                         className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
                       >
                         ✎
                       </button>
                       <button 
                         onClick={() => handleDelete(p.id)}
                         className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                       >
                         🗑️
                       </button>
                    </div>
                    <Link 
                      href={`/${p.slug}`} 
                      target="_blank"
                      className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:opacity-100 opacity-40 transition-opacity"
                    >
                      ดูหน้าเว็บ →
                    </Link>
                 </div>
              </div>
            ))}

            {pages.length === 0 && (
              <div className="col-span-full py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
                 <p className="text-xl font-bold opacity-20 uppercase tracking-widest">ยังไม่มีหน้าเพจในระบบ</p>
              </div>
            )}
         </div>
      </section>

      {error && (
        <div className="fixed bottom-8 right-8 bg-rose-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-black text-xs uppercase tracking-widest animate-bounce">
           ⚠️ {error}
           <button onClick={() => setError(null)} className="ml-4 opacity-50">×</button>
        </div>
      )}
    </div>
  );
}

// ── Components Shim ──
function Link({ href, target, children, className }: any) {
  return <a href={href} target={target} className={className}>{children}</a>;
}
