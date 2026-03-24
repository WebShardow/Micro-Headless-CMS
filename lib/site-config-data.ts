import { prisma } from "./prisma";
import type { SiteConfig as SiteConfigModel } from "@prisma/client";

export type SiteConfig = SiteConfigModel & {
  discordUrl: string;
};

const defaults = {
  siteName: "Micro Headless CMS",
  domain: "",
  language: "th",
  timezone: "Asia/Bangkok",
  // Zone 1 - Logo
  logoUrl: "",
  logoAlt: "Logo",
  showLogoText: true,
  // Zone 1 - Navbar
  navStyle: "fixed",
  navBgColor: "#0ea5e9",
  navTextColor: "#ffffff",
  // Zone 1 - Hero
  showHero: true,
  heroStyle: "centered",
  heroHeading: "สวัสดี ฉันคือนักออกแบบ",
  heroSubheading: "ดูผลงานสร้างสรรค์ของฉันด้านล่าง",
  heroBgColor: "#f0f9ff",
  heroTextColor: "#0f172a",
  heroImageUrl: "", // เพิ่มใหม่
  heroBtnLabel: "ดูผลงาน",
  heroBtnColor: "#f59e0b",
  // Zone 2 - Main Content
  primaryColor: "#0ea5e9",
  accentColor: "#f59e0b",
  bgColor: "#f8fafc",
  textColor: "#1e293b",
  fontFamily: "Inter",
  layoutStyle: "grid",
  showSidebar: false,
  sidebarPosition: "left",
  // Zone 3 - Footer
  footerCopyright: "© 2024 My Portfolio",
  footerBgColor: "#1e293b",
  footerTextColor: "#94a3b8",
  // Communication
  discordUrl: "https://discord.gg/Meywv7MXJd",
};

export async function getSiteConfig(): Promise<SiteConfig> {
  let config = await prisma.siteConfig.findUnique({ where: { id: "default" } });
  if (!config) {
    config = await prisma.siteConfig.create({ data: { id: "default", ...defaults } });
  }
  return config;
}

export async function updateSiteConfig(
  data: Partial<Omit<SiteConfig, "id" | "createdAt" | "updatedAt">>
): Promise<SiteConfig> {
  return await prisma.siteConfig.upsert({
    where: { id: "default" },
    update: { ...data, updatedAt: new Date() },
    create: { id: "default", ...defaults, ...data },
  });
}