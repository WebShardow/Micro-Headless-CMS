import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectById } from "@/lib/project-data";
import { getSiteConfig } from "@/lib/site-config-data";

export const dynamic = "force-dynamic";

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project, config] = await Promise.all([
    getProjectById(id),
    getSiteConfig(),
  ]);

  if (!project) notFound();

  return (
    <div className="min-h-screen" style={{ backgroundColor: config.bgColor, color: config.textColor, fontFamily: config.fontFamily }}>
      
      {/* Navbar Minimal */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/30 border-b border-black/5">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href="/portfolio" className="text-sm font-black flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity" style={{ color: config.textColor }}>
            ← BACK TO LIST
          </Link>
          <div className="flex items-center gap-2">
            {config.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={config.logoUrl} alt="Logo" className="h-6 w-auto grayscale" />
            )}
            {config.showLogoText && <span className="text-sm font-black tracking-tighter opacity-40">{config.siteName}</span>}
          </div>
        </div>
      </header>

      <div className="h-24 md:h-32" />

      <main className="mx-auto max-w-4xl px-6 pb-20">
        {/* Project Thumbnail / Hero */}
        {project.thumbnail && (
          <div className="relative mb-12 aspect-[16/10] w-full overflow-hidden rounded-[2.5rem] shadow-2xl ring-1 ring-black/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.thumbnail} alt={project.title} className="h-full w-full object-cover" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12">
          
          {/* Main Info */}
          <section className="space-y-8">
            <div>
                <p className="text-xs font-black uppercase tracking-widest mb-3 opacity-40 px-2 flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.primaryColor }} />
                   {project.category?.name || "Uncategorized"}
                </p>
                <h1 className="text-5xl font-black leading-tight tracking-tight mb-6">{project.title}</h1>
            </div>
            
            <div className="prose max-w-none leading-relaxed text-lg opacity-80" style={{ color: config.textColor }}>
              {project.description}
            </div>
          </section>

          {/* Sidebar Info */}
          <aside className="space-y-10">
             <div className="p-6 rounded-3xl border border-black/5 space-y-6" style={{ backgroundColor: config.primaryColor + "08" }}>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-1.5">DATE</p>
                   <p className="text-sm font-bold">{new Date(project.date).toLocaleDateString("th-TH", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                {project.projectUrl && (
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-1.5">WEBSITE</p>
                        <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-black hover:underline underline-offset-4" style={{ color: config.primaryColor }}>
                            {project.projectUrl.replace("https://", "").replace("http://", "")} ↗
                        </a>
                    </div>
                )}
                {/* Back Link */}
                <div className="pt-6 border-t border-black/5">
                   <Link href="/portfolio" className="inline-block rounded-full px-6 py-2.5 text-xs font-black text-white shadow-xl shadow-sky-100 hover:scale-105 transition-all" style={{ backgroundColor: config.primaryColor }}>
                      DISCOVER MORE
                   </Link>
                </div>
             </div>
          </aside>
        </div>
      </main>

      <footer className="py-12 text-center" style={{ backgroundColor: config.footerBgColor }}>
        <p className="text-sm" style={{ color: config.footerTextColor }}>{config.footerCopyright}</p>
      </footer>
    </div>
  );
}
