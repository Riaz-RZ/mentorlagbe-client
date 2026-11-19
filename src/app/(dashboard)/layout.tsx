import DashboardSidebar from "@/components/dashboard/shared/DashboardSidebar";


const DashboardLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="flex">
                <DashboardSidebar />

                <main className="min-w-0 flex-1 px-4 pb-8 pt-20 lg:px-8 lg:pt-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;