import UpdateProfileForm from "@/components/dashboard/shared/UpdateProfileForm";
import { CircleUserRound } from "lucide-react";
import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";

const UpdateProfilePage = () => {
    return (
        <div className="space-y-5">
            <DashboardPageHeader
                eyebrow="STUDENT ACCOUNT"
                title="Update your profile"
                description="Keep your personal details and profile photo up to date."
                icon={CircleUserRound}
            />

            <UpdateProfileForm />
        </div>
    );
};

export default UpdateProfilePage;
