import RoleGuard from "@/components/dashboard/shared/RoleGuard";
import React from "react";

const StudentDashboardLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return <RoleGuard role="student">{children}</RoleGuard>;
};

export default StudentDashboardLayout;
