'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';

type SiteConfig = {
  id: string;
  siteName: string;
  domain: string;
  language: string;
  timezone: string;
  footerCopyright: string;
  discordUrl: string;
};

const initialState: Omit<SiteConfig, 'id'> = {
  siteName: '',
  domain: '',
  language: '',
  timezone: '',
  footerCopyright: '',
  discordUrl: '',
};

export default function ConfigurationPage() {
  const [form, setForm] = useState<Omit<SiteConfig, 'id'>>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    setLoading(true);
    try {
      const res = await fetch('/api/site-config');
      const data = await res.json();
      setForm({
        siteName: data.siteName || '',
        domain: data.domain || '',
        language: data.language || '',
        timezone: data.timezone || '',
        footerCopyright: data.footerCopyright || '',
        discordUrl: data.discordUrl || '',
      });
      setError(null);
    } catch {
      setError('ไม่สามารถโหลดการตั้งค่าได้');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/site-config', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'เกิดข้อผิดพลาด');
      }

      setSuccess('บันทึกการตั้งค่าเรียบร้อยแล้ว');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden text-slate-900">
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-3 shadow-sm shrink-0">
        <div>
          <h2 className="text-lg font-bold">Configuration</h2>
          <p className="text-sm text-slate-500">ตั้งค่ามาตรฐานของเว็บไซต์</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-tight text-slate-400">ตั้งค่าทั่วไป</h3>
            {error && (
              <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">⚠️ {error}</div>
            )}
            {success && (
              <div className="mb-4 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">✅ {success}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5 text-slate-700">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">ชื่อเว็บไซต์</label>
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  type="text"
                  value={form.siteName || ''}
                  required
                  onChange={(e) => setForm((s) => ({ ...s, siteName: e.target.value }))}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">โดเมน</label>
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  type="text"
                  value={form.domain || ''}
                  placeholder="example.com"
                  onChange={(e) => setForm((s) => ({ ...s, domain: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">ภาษา</label>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    value={form.language || ''}
                    onChange={(e) => setForm((s) => ({ ...s, language: e.target.value }))}
                  >
                    <option value="th">ไทย (th)</option>
                    <option value="en">English (en)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">เขตเวลา</label>
                  <input
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    type="text"
                    value={form.timezone || ''}
                    placeholder="Asia/Bangkok"
                    onChange={(e) => setForm((s) => ({ ...s, timezone: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Copyright Footer</label>
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  type="text"
                  value={form.footerCopyright || ''}
                  placeholder="© 2024 Your Site"
                  onChange={(e) => setForm((s) => ({ ...s, footerCopyright: e.target.value }))}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Discord URL (Community)</label>
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  type="text"
                  value={form.discordUrl || ''}
                  placeholder="https://discord.gg/..."
                  onChange={(e) => setForm((s) => ({ ...s, discordUrl: e.target.value }))}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60 transition-all shadow-lg shadow-emerald-100"
                >
                  {loading ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่าทั้งหมด'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 p-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
        © 2024 Micro Headless CMS | System Core Configuration
      </footer>
    </div>
  );
}