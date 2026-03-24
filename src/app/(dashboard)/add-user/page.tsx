import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AddUser from "@/components/cyber/user/AddUser";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create User | CyberSafe Digital Assets",
  description: "Add a new system user or administrator with specific role-based permissions.",
};

export default function AddUserPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
      <PageBreadcrumb pageTitle="User Registration" />
      
      <div className="max-w-4xl mx-auto">
        <AddUser />
      </div>
    </div>
  );
}
