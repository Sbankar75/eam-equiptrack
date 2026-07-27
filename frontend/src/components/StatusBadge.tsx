const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  under_maintenance: "Under Maintenance",
  idle: "Idle",
  retired: "Retired",
};

const STATUS_COLORS: Record<string, string> = {
  active: "var(--color-status-active)",
  under_maintenance: "var(--color-status-maintenance)",
  idle: "var(--color-status-idle)",
  retired: "var(--color-status-retired)",
};

export default function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLORS[status] ?? "var(--color-graphite-500)";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${color}1A`, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
