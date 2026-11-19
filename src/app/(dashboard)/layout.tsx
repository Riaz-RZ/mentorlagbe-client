import DashboardSidebar from "@/components/dashboard/shared/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";


const DashboardLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="flex">
                <DashboardSidebar />

                {/* pt-16 clears the fixed mobile bar rendered by the sidebar */}
                <div className="min-w-0 flex-1 pt-16 lg:pt-0">
                    <DashboardHeader />

                    <main className="min-w-0 px-4 pb-8 pt-4 lg:px-8 lg:pt-8">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
