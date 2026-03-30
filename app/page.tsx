import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-300">API-first content platform</p>
          <h1 className="mt-4 text-5xl font-black tracking-tight text-white">Micro Headless CMS</h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            This repository is the content backend. Use it to manage projects, staff, pages, menus, media, and site configuration, then let your frontend applications render the public experience.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/login" className="rounded-2xl bg-indigo-600 px-6 py-5 text-center text-sm font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-indigo-950/40 transition-all hover:bg-indigo-500">
            Admin Login
          </Link>
          <Link href="/admin" className="rounded-2xl border border-slate-700 bg-slate-900 px-6 py-5 text-center text-sm font-black uppercase tracking-[0.2em] text-slate-100 transition-all hover:border-slate-500">
            Open Dashboard
          </Link>
          <Link href="/setup" className="rounded-2xl border border-slate-700 bg-slate-900 px-6 py-5 text-center text-sm font-black uppercase tracking-[0.2em] text-slate-100 transition-all hover:border-slate-500">
            Initial Setup
          </Link>
        </div>

        <section className="grid gap-6 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-8 md:grid-cols-3">
          <article>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Projects</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">Maintain content records in admin modules rather than public-facing pages.</p>
          </article>
          <article>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">API Delivery</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">Serve data to multiple frontend websites from the same stable backend.</p>
          </article>
          <article>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Reusable Modules</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">Use staff, pages, menu, and media as shared content modules across projects.</p>
          </article>
        </section>
      </div>
    </main>
  );
}
