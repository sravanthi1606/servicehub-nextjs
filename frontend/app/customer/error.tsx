"use client";

import { useEffect } from "react";
import ErrorState from "@/components/common/ErrorState";

export default function CustomerError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="card">
      <div className="card-body">
        <ErrorState message="We couldn't load this page. Please try again." onRetry={reset} />
      </div>
    </div>
  );
}
