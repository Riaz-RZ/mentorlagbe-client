import RoleGuard from "@/components/dashboard/shared/RoleGuard";
import React from 'react';

const TutorDashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return <RoleGuard role="tutor">{children}</RoleGuard>;
};

export default TutorDashboardLayout;