import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AddUser from "@/components/cyber/user/AddUser";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Profile Details | CyberSafe Digital Assets",
  description: "Detailed view of system user profile and permission sets.",
};

export default function UserDetailsPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
      <PageBreadcrumb pageTitle="User Profile" />
      
      <div className="max-w-4xl mx-auto">
        <AddUser />
      </div>
    </div>
  );
}
