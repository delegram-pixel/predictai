import Sidebar from "@/components/layout/Sidebar";
import { MeshBackground } from "@/components/ui/primitives";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden relative z-10">
      <MeshBackground />
      <Sidebar />
      {children}
    </div>
  );
}
