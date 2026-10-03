import DashboardLayout from "@/components/layout/DashboardLayout";
import { getCurrentUser } from "@/lib/auth";

export default async function ProviderLayout({ children }: LayoutProps<"/provider">) {
  const user = await getCurrentUser("PROVIDER");

  return (
    <DashboardLayout role="PROVIDER" user={user}>
      {children}
    </DashboardLayout>
  );
}
