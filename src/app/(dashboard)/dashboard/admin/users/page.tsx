import { Users } from "lucide-react";

import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";
import { Card, CardContent } from "@/components/ui/card";

const UserManagementPage = () => {
    return (
        <div className="space-y-5">
            <DashboardPageHeader
                eyebrow="ADMIN CONTROL CENTER"
                title="User Management"
                description="Review users and manage platform access."
                icon={Users}
            />
            <Card>
                <CardContent className="py-8 text-sm text-muted-foreground">
                    User Management Page
                </CardContent>
            </Card>
        </div>
    );
};

export default UserManagementPage;