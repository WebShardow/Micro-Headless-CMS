'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const menuGroups = [
  {
    title: 'Management',
    items: [
      { label: '📂 Dashboard & Projects', href: '/admin' },
      { label: '🏷️ Categories', href: '/admin/categories' },
      { label: '📄 Pages Content', href: '/admin/pages' },
      { label: '🖼️ Media Gallery', href: '/admin/media' },
    ]
  },
  {
    title: 'Appearance',
    items: [
      { label: '🧭 Navigation / Menu', href: '/admin/menu' },
      { label: '🎨 Site Design', href: '/admin/design' },
    ]
  },
  {
    title: 'System',
    items: [
      { label: '⚙️ Configuration', href: '/admin/configuration' },
      { label: '🗄️ Backup & Restore', href: '/admin/database' },
      { label: '📦 Module Manager', href: '/admin/modules' },
    ]
  },
  {
    title: 'View Site',
    items: [
      { label: '🏠 Website Home', href: '/' },
      { label: '🖼️ Portfolio View', href: '/portfolio' },
    ]
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    if (!confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) return;
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <aside className="w-80 bg-slate-900 text-slate-100 shadow-2xl flex flex-col h-full border-r border-slate-800">
      {/* Branding */}
      <div className="p-8 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20">🚀</div>
          <div>
            <h1 className="text-lg font-black tracking-tighter uppercase">Micro CMS</h1>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] opacity-80">v1.2 Control Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto p-6 scrollbar-thin space-y-9">
        {menuGroups.map((group) => (
          <div key={group.title} className="space-y-4">
            <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] px-2">{group.title}</h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(item.href) && item.href !== '/';

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-xs font-bold transition-all duration-300 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 translate-x-1'
                        : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-100 hover:translate-x-1'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-6 border-t border-slate-800/50 bg-slate-950/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between group rounded-xl px-4 py-3.5 text-xs font-black uppercase tracking-widest text-rose-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all border border-transparent hover:border-rose-500/20"
        >
          <span>Sign Out</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </aside>
  );
}
