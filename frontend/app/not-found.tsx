import type { Metadata } from "next";
import Link from "next/link";
import EmptyState from "@/components/common/EmptyState";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="container py-5">
      <div className="card mx-auto" style={{ maxWidth: "32rem" }}>
        <div className="card-body">
          <EmptyState
            icon="bi-signpost-split"
            title="Page not found"
            message="The page you're looking for doesn't exist or has moved."
            action={
              <Link href="/" className="btn btn-primary btn-sm">
                Go to home page
              </Link>
            }
          />
        </div>
      </div>
    </main>
  );
}
