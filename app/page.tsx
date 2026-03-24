import Link from "next/link";
import { getAllProjects } from "@/lib/project-data";
import { getSiteConfig } from "@/lib/site-config-data";
import { getAllMenuItems } from "@/lib/menu-data";
import { NavLink, SidebarLink } from "@/components/nav-link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, config, menuItems] = await Promise.all([
    getAllProjects(),
    getSiteConfig(),
    getAllMenuItems(),
  ]);

  const visibleMenu = menuItems.filter((m) => m.isVisible);
  const navbarMenu = visibleMenu.filter((m) => m.showInNavbar);
  const sidebarMenu = visibleMenu.filter((m) => m.showInSidebar);
  const footerMenu = visibleMenu.filter((m) => m.showInFooter);

  const navPosition =
    config.navStyle === "fixed" ? "fixed top-0 left-0 right-0 z-50"
    : config.navStyle === "sticky" ? "sticky top-0 z-50"
    : "relative";

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: config.bgColor, color: config.textColor, fontFamily: config.fontFamily }}>
      
      {/* ── Zone 1: Premium Glass Navbar ── */}
      <header className={`${navPosition} border-b border-white/10 backdrop-blur-xl bg-white/70 shadow-2xl shadow-indigo-500/5`} style={{ backgroundColor: config.navBgColor + 'cc' }}>
        <div className="mx-auto max-w-7xl px-8 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-sky-400 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform">🚀</div>
            {config.showLogoText && <span className="text-2xl font-black tracking-tighter uppercase" style={{ color: config.navTextColor }}>{config.siteName}</span>}
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {navbarMenu.map((item) => (
              <NavLink
                key={item.id}
                href={item.url}
                label={item.label}
                isExternal={item.isExternal}
                baseColor={config.navTextColor}
                activeColor={config.primaryColor}
              />
            ))}
            <Link href="/admin" className="px-8 py-3 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-300">Admin Panel</Link>
          </nav>
        </div>
      </header>

      {config.navStyle === "fixed" && <div className="h-[88px]" />}

      <main className="flex-1">
        {/* ── Zone 2: Grand Hero Section ── */}
        <section className="relative px-8 pt-20 pb-32 overflow-hidden">
          {/* Background Hero Image with Overlay */}
          <div className="absolute inset-0 z-0 scale-105 animate-pulse-slow">
             <img src="/images/hero.png" alt="Hero Background" className="w-full h-full object-cover opacity-100" />
             <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/80 to-white" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
             <div className="flex justify-center">
                <span className="px-6 py-2 rounded-full bg-indigo-500/10 text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-500/20 shadow-inner">Architecture & Engineering</span>
             </div>
             <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase py-1" style={{ color: config.textColor }}>
                {config.heroHeading}
             </h1>
             <p className="mx-auto max-w-2xl text-xl md:text-2xl font-medium opacity-60 leading-relaxed">
                {config.heroSubheading}
             </p>
             <div className="flex flex-wrap justify-center gap-6 pt-6">
                <Link href="/portfolio" className="px-12 py-5 rounded-2xl bg-indigo-600 text-white font-black uppercase text-xs tracking-widest hover:bg-indigo-700 hover:translate-y-[-4px] transition-all shadow-2xl shadow-indigo-600/30">View Portfolio</Link>
                <Link href="/admin/pages" className="px-12 py-5 rounded-2xl bg-white text-slate-900 border border-slate-100 font-black uppercase text-xs tracking-widest hover:bg-slate-50 hover:translate-y-[-4px] transition-all shadow-xl shadow-slate-200">Start Writing →</Link>
             </div>
          </div>
        </section>

        {/* ── Zone 3: Main Dynamic Content ── */}
        <div className={`mx-auto max-w-7xl px-8 py-20 flex flex-col gap-16 ${config.showSidebar && config.sidebarPosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
          
          {/* Sidebar Navigation */}
          {config.showSidebar && (
            <aside className="w-full md:w-80 shrink-0 space-y-12">
               <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 space-y-8 border border-white/50 shadow-2xl shadow-slate-200/50">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 px-2 flex items-center gap-2">
                       <div className="h-1 w-4 bg-indigo-600 rounded-full" /> Quick Link
                    </h4>
                    <nav className="flex flex-col gap-2">
                      {sidebarMenu.map((item) => (
                        <SidebarLink key={item.id} href={item.url} label={item.label} activeColor={config.primaryColor} />
                      ))}
                    </nav>
                  </div>

                  <div className="pt-8 border-t border-slate-100 flex items-center gap-4">
                     <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl">💡</div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Pro Tip</p>
                        <p className="text-[11px] font-medium opacity-40">Manage your sidebar in Admin dashboard.</p>
                     </div>
                  </div>
               </div>
            </aside>
          )}

          {/* Featured Projects Grid */}
          <section className="flex-1 space-y-12 min-w-0">
             <header className="flex items-end justify-between px-2">
                <div className="space-y-2">
                   <h2 className="text-3xl font-black tracking-tight uppercase">Featured Works</h2>
                   <p className="text-sm font-medium opacity-40">Our latest creative injections directly from the studio.</p>
                </div>
                <Link href="/portfolio" className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:opacity-100 opacity-60 transition-opacity">Full Archive →</Link>
             </header>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.slice(0, 4).map((project) => (
                  <Link
                    key={project.id}
                    href={`/portfolio/${project.id}`}
                    className="group relative h-[420px] rounded-3xl overflow-hidden shadow-2xl shadow-indigo-600/5 hover:translate-y-[-8px] transition-all duration-700"
                  >
                     <img src={project.thumbnail || "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=60"} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900 tracking-tight flex flex-col justify-end p-8 md:p-12 text-white">
                        <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                           <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[9px] font-black uppercase tracking-widest border border-white/10">{project.category?.name || "Global"}</span>
                           <h3 className="text-3xl font-black leading-none">{project.title}</h3>
                           <p className="text-xs opacity-60 font-medium line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity delay-100">{project.description}</p>
                        </div>
                     </div>
                  </Link>
                ))}
             </div>
          </section>
        </div>

        {/* ── Zone 4: Headless Architecture Callout ── */}
        <section className="mx-auto max-w-7xl px-8 py-32">
           <div className="bg-slate-900 rounded-3xl p-16 md:p-24 relative overflow-hidden flex flex-col md:flex-row items-center gap-16">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/30 blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/20 blur-[80px] pointer-events-none" />
              
              <div className="flex-1 space-y-8 relative z-10 text-center md:text-left">
                 <h2 className="text-4xl md:text-6xl text-white font-black tracking-tighter uppercase leading-tight">100% Headless. <br/><span className="text-indigo-400">Pure Power.</span></h2>
                 <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-xl">
                    Every content fragment, project entry, and site configuration is served through a secure API layer. Use this CMS with Next.js, React, Mobile Apps, or any frontend you love.
                 </p>
                 <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest">REST API Ready</span>
                    <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest">JSON Output</span>
                    <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest">Prisma Engine</span>
                 </div>
              </div>
              <div className="h-64 w-64 md:h-80 md:w-80 rounded-3xl bg-indigo-600 flex items-center justify-center text-7xl shadow-2xl shadow-indigo-500/50 animate-bounce-slow">🚀</div>
           </div>
        </section>
        {/* ── Zone 4.5: Community & Communication ── */}
        <section className="mx-auto max-w-7xl px-8 pb-32">
           <div className="bg-indigo-600/5 border border-indigo-600/10 rounded-3xl p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group transition-all hover:bg-indigo-600/[0.08]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-600/20 transition-all duration-1000" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-400/10 blur-[60px] translate-y-1/2 -translate-x-1/2 group-hover:bg-sky-400/20 transition-all duration-1000" />
              
              <div className="space-y-4 text-center md:text-left relative z-10">
                 <h3 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-[0.9]">Join our <br/><span className="text-indigo-600">Community</span></h3>
                 <p className="text-lg opacity-60 font-medium max-w-md">Connect with our team and other users. Get support and share your ideas on Discord.</p>
              </div>
              
              <a 
                href={config.discordUrl || "https://discord.gg/Meywv7MXJd"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-10 py-5 rounded-2xl bg-[#5865F2] text-white font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-[#5865F2]/40 hover:translate-y-[-4px] hover:shadow-[#5865F2]/60 transition-all flex items-center gap-4 group/btn shrink-0"
              >
                <svg className="w-6 h-6 fill-current group-hover/btn:rotate-[10deg] transition-transform duration-300" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.579.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.006 14.006 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01 10.16 10.16 0 0 0 .372.292.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Join Discord
              </a>
           </div>
        </section>
      </main>

      {/* ── Zone 5: Modern Footer ── */}
      <footer className="py-24 px-8 border-t border-slate-100 flex flex-col items-center gap-16" style={{ backgroundColor: config.footerBgColor }}>
         <div className="flex flex-col items-center gap-6">
            <h4 className="text-2xl font-black tracking-tighter uppercase">{config.siteName}</h4>
            <nav className="flex flex-wrap justify-center gap-x-12 gap-y-4">
              {footerMenu.map(item => (
                <Link key={item.id} href={item.url} className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity" style={{ color: config.footerTextColor }}>
                  {item.label}
                </Link>
              ))}
            </nav>
         </div>
         <div className="flex flex-col items-center gap-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30" style={{ color: config.footerTextColor }}>{config.footerCopyright}</p>
            {config.domain && <span className="text-[9px] font-black uppercase bg-slate-50 px-4 py-1.5 rounded-full opacity-30">{config.domain}</span>}
         </div>
      </footer>

      {/* Embedded Animations CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.95; transform: scale(1.05); }
          50% { opacity: 1; transform: scale(1.06); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-pulse-slow { animation: pulse-slow 10s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
      `}} />
    </div>
  );
}
