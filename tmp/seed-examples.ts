import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 เริ่มการ Seed ข้อมูลตัวอย่าง...');

  // 1. ล้างข้อมูลเก่า (เฉพาะเมนูและหน้าเพจเพื่อไม่ให้ซ้ำ)
  await prisma.menuItem.deleteMany({});
  await prisma.page.deleteMany({});

  // 2. สร้างหน้าเพจตัวอย่าง
  console.log('📄 สร้างหน้าเพจ...');
  await prisma.page.createMany({
    data: [
      { title: 'Services', slug: 'services', content: '<h1>Our Services</h1><p>We provide Web Design, Mobile Apps, and SEO.</p>', isPublished: true },
      { title: 'Contact Us', slug: 'contact', content: '<h1>Contact Us</h1><p>Email: hello@example.com</p>', isPublished: true },
      { title: 'Privacy Policy', slug: 'privacy', content: '<h1>Privacy Policy</h1><p>Your data is safe with us.</p>', isPublished: true },
    ],
  });

  // 3. สร้างเมนู (Navbar, Sidebar, Footer)
  console.log('🧭 สร้างเมนู...');
  const menuData = [
    // Navbar
    { label: 'Home', url: '/', showInNavbar: true, order: 1 },
    { label: 'Portfolio', url: '/portfolio', showInNavbar: true, order: 2 },
    { label: 'Services', url: '/services', showInNavbar: true, order: 3 },
    { label: 'Admin', url: '/admin', showInNavbar: true, order: 4 },
    
    // Sidebar
    { label: 'Web Design', url: '/portfolio?cat=web', showInSidebar: true, order: 1 },
    { label: 'Mobile Apps', url: '/portfolio?cat=mobile', showInSidebar: true, order: 2 },
    { label: 'Graphic Design', url: '/portfolio?cat=graphic', showInSidebar: true, order: 3 },
    { label: 'Help Desk', url: 'https://help.example.com', showInSidebar: true, isExternal: true, order: 4 },

    // Footer
    { label: 'About Us', url: '/about', showInFooter: true, order: 1 },
    { label: 'Privacy Policy', url: '/privacy', showInFooter: true, order: 2 },
    { label: 'Careers', url: '/careers', showInFooter: true, order: 3 },
  ];

  for (const m of menuData) {
    await prisma.menuItem.create({ data: m });
  }

  // 4. อัปเดต Site Config ให้เปิด Sidebar ซ้าย
  console.log('⚙️ ตั้งค่า Site Config...');
  await prisma.siteConfig.upsert({
    where: { id: 'default' },
    update: { 
      showSidebar: true, 
      sidebarPosition: 'left',
      heroHeading: 'Experience Modern CMS Architecture',
      heroSubheading: 'จัดการทุกส่วนของเว็บไซต์ได้จากที่เดียว พร้อมระบบ Sidebar และ Menu Position แบบเจาะจง'
    },
    create: { id: 'default', siteName: 'Micro Headless CMS', showSidebar: true, sidebarPosition: 'left' }
  });

  console.log('✅ Seed ข้อมูลสำเร็จ! ระบบพร้อมสำหรับวิเคราะห์แล้วครับ');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
