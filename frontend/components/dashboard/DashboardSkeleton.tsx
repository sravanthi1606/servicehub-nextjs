function SkeletonCard({ height }: { height: string }) {
  return (
    <div className="card h-100">
      <div className="card-body placeholder-glow">
        <span className="placeholder col-4 mb-4 d-block" />
        <span className="placeholder w-100 d-block rounded" style={{ height }} />
      </div>
    </div>
  );
}

/** Route-level loading UI for dashboard pages (used by each role's loading.tsx). */
export default function DashboardSkeleton() {
  return (
    <div aria-busy="true">
      <span className="visually-hidden" role="status">
        Loading…
      </span>

      <div aria-hidden="true">
        <div className="page-header placeholder-glow">
          <span className="placeholder col-4 col-md-2" />
          <span className="placeholder col-3 col-md-2" />
        </div>

        <div className="row g-3 mb-4">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="col-sm-6 col-xl-3">
              <div className="card">
                <div className="card-body placeholder-glow">
                  <span className="placeholder col-6 mb-3 d-block" />
                  <span className="placeholder placeholder-lg col-4 d-block" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-3">
          <div className="col-xl-8">
            <SkeletonCard height="16rem" />
          </div>
          <div className="col-xl-4">
            <SkeletonCard height="16rem" />
          </div>
        </div>
      </div>
    </div>
  );
}
