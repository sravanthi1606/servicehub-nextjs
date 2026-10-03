import type { Metadata } from "next";
import ComingSoon from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Coming soon" };

// Catch-all for Admin pages planned in later phases. Real routes take precedence.
export default async function AdminComingSoonPage({ params }: PageProps<"/admin/[...slug]">) {
  const { slug } = await params;
  return <ComingSoon role="ADMIN" slug={slug} />;
}
