import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import SetupForm from './SetupForm';

export const metadata = {
  title: 'Initial Setup — Micro Headless CMS',
  description: 'ตั้งค่าบัญชีผู้ดูแลระบบครั้งแรก',
};

export default async function SetupPage() {
  // Server-side guard: ถ้ามี user แล้ว ห้ามเข้าหน้านี้
  const count = await prisma.user.count();
  if (count > 0) {
    redirect('/login');
  }

  return <SetupForm />;
}
