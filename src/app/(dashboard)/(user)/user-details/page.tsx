import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserDetailsComponent from "@/components/cyber/user/UserDetailsComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Details | CyberSafe Digital Assets",
  description: "Detailed view of system user profile, security roles, and asset quotas.",
};

export default function UserDetailsPage() {
  return (
    <div className="my-4">
      <PageBreadcrumb
        pageTitle="User Details"
        parentName="User Directory"
        parentPath="/user"
      />
      <div className="mx-auto">
        <UserDetailsComponent />
      </div>
    </div>
  );
}
