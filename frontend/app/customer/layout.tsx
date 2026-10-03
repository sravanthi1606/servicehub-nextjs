import DashboardLayout from "@/components/layout/DashboardLayout";
import { getCurrentUser } from "@/lib/auth";

export default async function CustomerLayout({ children }: LayoutProps<"/customer">) {
  const user = await getCurrentUser("CUSTOMER");

  return (
    <DashboardLayout role="CUSTOMER" user={user}>
      {children}
    </DashboardLayout>
  );
}
