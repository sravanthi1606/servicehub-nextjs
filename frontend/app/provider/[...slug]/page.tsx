import type { Metadata } from "next";
import ComingSoon from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Coming soon" };

// Catch-all for Provider pages planned in later phases. Real routes take precedence.
export default async function ProviderComingSoonPage({ params }: PageProps<"/provider/[...slug]">) {
  const { slug } = await params;
  return <ComingSoon role="PROVIDER" slug={slug} />;
}
