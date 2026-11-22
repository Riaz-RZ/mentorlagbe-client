import DashboardSidebar from "@/components/dashboard/shared/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";


const DashboardLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="min-h-screen bg-background">
            <SidebarProvider>
                <DashboardSidebar />

                <SidebarInset className="min-w-0 bg-background">
                    <DashboardHeader />

                    <div className="min-w-0 flex-1 px-4 pb-8 pt-4 lg:px-8 lg:pt-8">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
};

export default DashboardLayout;
