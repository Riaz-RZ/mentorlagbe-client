import RoleGuard from "@/components/dashboard/shared/RoleGuard";
import React from "react";

const AdminDashboardLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return <RoleGuard role="admin">{children}</RoleGuard>;
};

export default AdminDashboardLayout;
