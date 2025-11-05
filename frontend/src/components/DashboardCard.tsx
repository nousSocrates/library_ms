import type { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
}

export default function DashboardCard({
  title,
  value,
  icon,
}: DashboardCardProps) {
  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-5 flex items-center justify-between hover:shadow-md transition-all">
      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className="text-brand bg-blue-50 p-3 rounded-xl">{icon}</div>
    </div>
  );
}
