import Sidebar from "@/components/sidebar.component";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-white p-4 overflow-auto">
        {children}
      </div>
    </div>
  );
}