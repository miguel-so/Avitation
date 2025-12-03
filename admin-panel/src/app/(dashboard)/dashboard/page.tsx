import { Protected } from "@/components/common/protected";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export default function DashboardPage() {
  return (
    <Protected>
      <DashboardOverview />
    </Protected>
  );
}

