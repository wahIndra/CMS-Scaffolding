import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminTopNavbar } from "@/components/admin/TopNavbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden bg-muted/20">
      <AdminSidebar userRole={session.user.role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopNavbar user={session.user} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
