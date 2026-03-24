import AdminSidebar from './AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
      {/* Sidebar - Fixed width, no shrinking */}
      <AdminSidebar />

      {/* Main Content Area - Taking remaining space and scrollable */}
      <div className="relative flex flex-1 flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
