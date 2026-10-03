import type { StatCardData } from "@/types/dashboard";
import StatCard from "./StatCard";

export default function StatGrid({ stats }: { stats: StatCardData[] }) {
  return (
    <div className="row g-3 mb-4">
      {stats.map((stat) => (
        <div key={stat.label} className="col-sm-6 col-xl-3">
          <StatCard {...stat} />
        </div>
      ))}
    </div>
  );
}
