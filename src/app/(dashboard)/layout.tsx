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

                    <div className="min-w-0 flex-1 px-4 pb-8 pt-4 transition-colors lg:px-8 lg:pt-8 **:data-[slot=card]:border-primary/20 **:data-[slot=card]:bg-linear-to-br **:data-[slot=card]:from-card **:data-[slot=card]:via-card **:data-[slot=card]:to-primary/5 **:data-[slot=card]:shadow-lg **:data-[slot=card]:shadow-primary/5 **:data-[slot=card]:transition-[transform,box-shadow] **:data-[slot=card]:duration-300 [&_[data-slot=card]:hover]:transform-[perspective(1200px)_rotateX(1deg)_translateY(-2px)] [&_[data-slot=card]:hover]:shadow-xl **:data-[slot=button]:shadow-sm **:data-[slot=button]:transition-[transform,box-shadow] [&_[data-slot=button]:hover]:-translate-y-0.5 [&_[data-slot=button]:hover]:shadow-md **:data-[slot=table-row]:transition-colors [&_[data-slot=table-row]:hover]:bg-primary/5">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
};

export default DashboardLayout;
