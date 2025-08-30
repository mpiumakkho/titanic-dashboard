import dynamic from "next/dynamic";

const TitanicDashboard = dynamic(() => import("@/components/TitanicDashboard"), { ssr: false });

export default function Home() {
  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <TitanicDashboard />
    </div>
  );
}


