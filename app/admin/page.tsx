'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import AdminSidebar from './AdminSidebar';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

type Category = {
  id: string;
  name: string;
};

type ProjectInput = {
  title: string;
  description: string;
  categoryId: string;
  date: string;
  thumbnail: string;
  gallery: string;
  videoLink: string;
  projectUrl: string;
  toolsUsed: string;
};

type Project = {
  id: string;
  title: string;
  description: string;
  category: Category;
  date: string;
  thumbnail: string;
  gallery: string[];
  videoLink?: string;
  projectUrl?: string;
  toolsUsed: string[];
};

const initialState: ProjectInput = {
  title: '',
  description: '',
  categoryId: '',
  date: new Date().toISOString().split('T')[0],
  thumbnail: '',
  gallery: '',
  videoLink: '',
  projectUrl: '',
  toolsUsed: '',
};

export default function AdminPage() {
  const [form, setForm] = useState<ProjectInput>(initialState);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const galleryArray = useMemo(
    () =>
      form.gallery
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    [form.gallery]
  );

  const toolsArray = useMemo(
    () =>
      form.toolsUsed
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    [form.toolsUsed]
  );

  useEffect(() => {
    refresh();
    fetchCategories();
  }, []);


  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
      setError(null);
    } catch {
      setError('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch {
      setError('ไม่สามารถโหลดหมวดหมู่ได้');
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const payload = {
      title: form.title,
      description: form.description,
      categoryId: form.categoryId,
      date: form.date,
      thumbnail: form.thumbnail,
      gallery: galleryArray,
      videoLink: form.videoLink,
      projectUrl: form.projectUrl,
      toolsUsed: toolsArray,
    };

    try {
      const endpoint = editingId ? `/api/projects/${editingId}` : '/api/projects';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'เกิดข้อผิดพลาด');
      }

      setForm(initialState);
      setEditingId(null);
      setError(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('ไม่สามารถลบรายการได้');
      await refresh();
      setError(null);
    } catch {
      setError('เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }



  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-3 shadow-sm shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Admin Panel</h2>
            <p className="text-sm text-slate-500">จัดการเนื้อหาและหมวดหมู่</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">{editingId ? 'แก้ไขผลงาน' : 'สร้างผลงานใหม่'}</h3>
              {error && <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Form fields remain the same... */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
                  <input
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    type="text"
                    value={form.title}
                    required
                    onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                    value={form.categoryId}
                    onChange={(e) => setForm((s) => ({ ...s, categoryId: e.target.value }))}
                  >
                    <option value="">เลือกหมวดหมู่</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Date</label>
                  <input
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Thumbnail URL</label>
                  <input
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    type="text"
                    value={form.thumbnail}
                    onChange={(e) => setForm((s) => ({ ...s, thumbnail: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Description (Markdown)</label>
                  <div className="overflow-hidden rounded-lg border border-slate-300">
                    <MDEditor
                      value={form.description}
                      onChange={(value) => setForm((s) => ({ ...s, description: value ?? '' }))}
                      data-color-mode="light"
                      hideToolbar={false}
                      minHeight={250}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Gallery URLs (comma separated)</label>
                  <input
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    type="text"
                    value={form.gallery}
                    onChange={(e) => setForm((s) => ({ ...s, gallery: e.target.value }))}
                  />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Video Link</label>
                    <input
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                      type="text"
                      value={form.videoLink}
                      onChange={(e) => setForm((s) => ({ ...s, videoLink: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Project URL</label>
                    <input
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                      type="text"
                      value={form.projectUrl}
                      onChange={(e) => setForm((s) => ({ ...s, projectUrl: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Tools Used (comma separated)</label>
                  <input
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    type="text"
                    value={form.toolsUsed}
                    onChange={(e) => setForm((s) => ({ ...s, toolsUsed: e.target.value }))}
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : editingId ? 'Update Project' : 'Publish Project'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setForm(initialState);
                        setError(null);
                      }}
                      className="rounded-lg bg-slate-200 px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-300 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className="space-y-4">
              <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm h-full flex flex-col">
                <h3 className="mb-4 text-lg font-semibold">รายการผลงาน</h3>
                {loading && <p className="text-sm text-slate-500">กำลังโหลด...</p>}
                {!loading && projects.length === 0 && <p className="text-sm text-slate-500">ไม่มีโปรเจคที่ถูกสร้าง</p>}
                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {projects.map((project) => (
                    <div key={project.id} className="group rounded-xl border border-slate-100 bg-slate-50 p-4 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-slate-800 truncate">{project.title}</h4>
                          <p className="text-xs text-slate-500 mt-1">{project.category.name} • {new Date(project.date).toLocaleDateString('th-TH')}</p>
                        </div>
                        <div className="ml-4 flex gap-2 shrink-0">
                          <button
                            className="rounded-lg bg-white p-2 text-amber-600 border border-slate-200 hover:bg-amber-50 shadow-sm"
                            title="Edit"
                            onClick={() => {
                              setEditingId(project.id);
                              setForm({
                                title: project.title || '',
                                description: project.description || '',
                                categoryId: project.category.id,
                                date: project.date.split('T')[0],
                                thumbnail: project.thumbnail || '',
                                gallery: project.gallery.join(', '),
                                videoLink: project.videoLink || '',
                                projectUrl: project.projectUrl || '',
                                toolsUsed: project.toolsUsed.join(', '),
                              });
                            }}
                          >
                            ✎
                          </button>
                          <button
                            className="rounded-lg bg-white p-2 text-rose-500 border border-slate-200 hover:bg-rose-50 shadow-sm"
                            title="Delete"
                            onClick={() => handleDelete(project.id)}
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed italic">"{project.description || 'ไม่มีรายละเอียด'}"</p>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 p-3 text-center text-xs text-slate-400 shrink-0">
        © 2024 Micro Headless CMS | Fixed Layout No Scrollbar
      </footer>
    </div>
  );
}

