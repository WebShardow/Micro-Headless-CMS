'use client';

import { FormEvent, useEffect, useState } from 'react';
import AdminSidebar from '../AdminSidebar';

type Category = {
  id: string;
  name: string;
  _count?: { projects: number };
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setFetching(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch {
      setError('ไม่สามารถโหลดหมวดหมู่ได้');
    } finally {
      setFetching(false);
    }
  }

  function showSuccess(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      if (!res.ok) throw new Error('ไม่สามารถสร้างหมวดหมู่ได้');
      setNewCategoryName('');
      showSuccess('เพิ่มหมวดหมู่สำเร็จ');
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e: FormEvent) {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/categories/${editingCategory.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingCategory.name.trim() }),
      });
      if (!res.ok) throw new Error('ไม่สามารถอัปเดตหมวดหมู่ได้');
      setEditingCategory(null);
      showSuccess('อัปเดตหมวดหมู่สำเร็จ');
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`ต้องการลบหมวดหมู่ "${name}" ใช่หรือไม่?`)) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('ไม่สามารถลบหมวดหมู่ได้');
      showSuccess('ลบหมวดหมู่สำเร็จ');
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-3 shadow-sm shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">จัดการหมวดหมู่</h2>
            <p className="text-sm text-slate-500">เพิ่ม แก้ไข หรือลบหมวดหมู่ผลงาน</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
        <div className="mx-auto max-w-2xl space-y-6">
          {error && <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2 animate-pulse">⚠️ {error}</div>}
          {successMsg && <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2 animate-bounce">✅ {successMsg}</div>}

          {/* Add Category Card */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-slate-800 uppercase tracking-tight">เพิ่มหมวดหมู่ใหม่</h3>
            <form onSubmit={handleCreate} className="flex gap-3">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="ชื่อหมวดหมู่ใหม่..."
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
              <button type="submit" disabled={loading} className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors shadow-lg shadow-emerald-100">+ ADD</button>
            </form>
          </section>

          {/* Category Tree List */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-fit">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/30">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">รายการหมวดหมู่ทั้งหมด</h3>
              <span className="rounded-full bg-white border px-3 py-0.5 text-[10px] font-black text-slate-400 tracking-widest">{categories.length} CATEGORIES</span>
            </div>

            {fetching ? (
              <div className="flex items-center gap-2 py-10 justify-center text-sm text-slate-400">⏳ กำลังโหลด...</div>
            ) : categories.length === 0 ? (
              <div className="py-20 text-center text-sm text-slate-400">
                <p className="text-4xl mb-3 opacity-20">📂</p>
                <p>ยังไม่มีหมวดหมู่ เพิ่มหมวดหมู่แรกได้เลย</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                {categories.map((category, index) => (
                  <li key={category.id} className="group hover:bg-slate-50 transition-colors">
                    <div className="flex items-center py-4 px-5 gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-lg opacity-40 shrink-0 select-none">{index === categories.length - 1 ? '└' : '├'}</span>
                        {editingCategory?.id === category.id ? (
                          <form onSubmit={handleUpdate} className="flex flex-1 items-center gap-2">
                            <input
                              type="text"
                              value={editingCategory.name}
                              onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                              className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              autoFocus
                              required
                            />
                            <div className="flex gap-1.5">
                               <button type="submit" disabled={loading} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white uppercase tracking-tighter shadow-md">SAVE</button>
                               <button type="button" onClick={() => setEditingCategory(null)} className="rounded-lg bg-slate-200 px-4 py-1.5 text-xs font-bold text-slate-600 uppercase tracking-tighter">Cancel</button>
                            </div>
                          </form>
                        ) : (
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-sm font-bold text-slate-800 truncate">{category.name}</span>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-400">ID: {index + 1}</span>
                          </div>
                        )}
                      </div>

                      {editingCategory?.id !== category.id && (
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button onClick={() => setEditingCategory(category)} className="rounded-lg bg-white p-2 text-amber-500 border border-slate-100 hover:bg-amber-50 shadow-sm" title="แก้ไข">✎</button>
                          <button onClick={() => handleDelete(category.id, category.name)} className="rounded-lg bg-white p-2 text-rose-500 border border-slate-100 hover:bg-rose-50 shadow-sm" title="ลบ">🗑</button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 p-3 text-center text-xs text-slate-400 shrink-0">
        © 2024 Micro Headless CMS | Categories Management
      </footer>
    </div>
  );
}
