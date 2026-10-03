import type { Metadata } from "next";
import ComingSoon from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Coming soon" };

// Catch-all for Customer pages planned in later phases. Real routes take precedence.
export default async function CustomerComingSoonPage({ params }: PageProps<"/customer/[...slug]">) {
  const { slug } = await params;
  return <ComingSoon role="CUSTOMER" slug={slug} />;
}
