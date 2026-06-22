import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
        <div className="flex flex-1 overflow-hidden">
           <DashboardSidebar/>
        <div className=" flex-1 overflow-y-auto">
           <DashboardNavbar/>

            <main className="p-5">
                 
                {children}
                </main>
        </div>
        </div>

    </div>
  );
}
