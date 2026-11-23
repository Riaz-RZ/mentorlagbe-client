import UpdateProfileForm from "@/components/dashboard/shared/UpdateProfileForm";
import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";
import { UserRound } from "lucide-react";

const UpdateProfilePage = () => {
    return (
        <div className="space-y-5">
            <DashboardPageHeader
                eyebrow="TUTOR ACCOUNT"
                title="Update your profile"
                description="Keep your personal details and profile photo up to date."
                icon={UserRound}
            />
            <UpdateProfileForm />
        </div>
    );
};

export default UpdateProfilePage;
