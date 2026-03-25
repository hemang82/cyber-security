import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AddUser from "@/components/cyber/user/AddUser";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create User | CyberSafe Digital Assets",
  description: "Add a new system user or administrator with specific role-based permissions.",
};

export default function AddUserPage() {
  return (
    <div className="">
      <PageBreadcrumb pageTitle="User Registration" parentName="User Directory" parentPath="/user" />
      <div className="mx-auto">
        <AddUser />
      </div>
    </div>
  );
}
