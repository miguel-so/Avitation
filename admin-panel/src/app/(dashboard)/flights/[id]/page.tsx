import { Protected } from "@/components/common/protected";
import { FlightDetail } from "@/components/flights/flight-detail";

interface FlightDetailPageProps {
  params: { id: string };
  searchParams: { view?: string };
}

export default function FlightDetailPage({
  params,
  searchParams,
}: FlightDetailPageProps) {
  return (
    <Protected>
      <FlightDetail flightId={params.id} initialTab={searchParams.view} />
    </Protected>
  );
}

