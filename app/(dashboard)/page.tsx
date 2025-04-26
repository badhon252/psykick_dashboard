import Dashboard from "@/components/_dashboard/dashboard";
import ProtectedRoute from "@/components/common/ProtectedRouts";

export default function Home() {
  return (
    <div className="">
      <ProtectedRoute>

     
      <Dashboard/>
      </ProtectedRoute>
    </div>
  );
}
