import DashboardLayout from "@/components/layout/DashboardLayout";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await getCurrentUser("ADMIN");

  return (
    <DashboardLayout role="ADMIN" user={user}>
      {children}
    </DashboardLayout>
  );
}
