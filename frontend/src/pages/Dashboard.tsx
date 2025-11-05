import DashboardCard from "../components/DashboardCard";
import { BookOpen, Users, BarChart3 } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard title="Total Books" value="1,240" icon={<BookOpen />} />
      <DashboardCard title="Active Students" value="534" icon={<Users />} />
      <DashboardCard title="Borrowed Today" value="73" icon={<BarChart3 />} />
    </div>
  );
}
