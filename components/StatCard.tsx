import type { LucideIcon } from "lucide-react";

export function StatCard({
  title,
  value,
  icon: Icon
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
}) {
  return (
    <div className="premium-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-black/60">{title}</p>
        <div className="rounded-xl bg-cream p-3 text-mutedgold">
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-4 text-2xl font-black">{value}</p>
    </div>
  );
}
