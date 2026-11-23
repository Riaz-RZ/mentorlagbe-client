import UpdateProfileForm from "@/components/dashboard/shared/UpdateProfileForm";
import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";
import { ShieldCheck } from "lucide-react";

const UpdateProfilePage = () => {
    return (
        <div className="space-y-5">
            <DashboardPageHeader
                eyebrow="ADMIN ACCOUNT"
                title="Update your profile"
                description="Keep your account details and profile photo current."
                icon={ShieldCheck}
            />
            <UpdateProfileForm />
        </div>
    );
};

export default UpdateProfilePage;
