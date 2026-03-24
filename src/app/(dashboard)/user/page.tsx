import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserComponent from "@/components/cyber/user/UserComponent";
import UserFilter from "@/components/cyber/user/UserFilter";
import { getUserList } from "@/lib/server/ServerApiCall";
import { Metadata } from "next";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/common/Skeleton";

export const metadata: Metadata = {
  title: "User Management | CyberSafe Digital Assets",
  description: "Manage system users, roles, and security access controls.",
};

export const dynamic = "force-dynamic";

async function UserContent({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  const page = params?.page || "1";
  const pageSize = params?.page_size || "10";
  const search = params?.search || "";
  const role = params?.role || "";
  const status = params?.status || "";

  // ✅ Fetch user list with filters (server-side)
  const userData = await getUserList({
    page,
    page_size: pageSize,
    search,
    role,
    status
  });

  return <UserComponent userData={userData} />;
}

export default function UserPage({ searchParams }: any) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
      <PageBreadcrumb pageTitle="User Management" />

      <div className="grid gap-8">
        <ComponentCard
          title="User Directory"
          // description="View and manage all system administrators and users."
          buttonName="Add User"
          navigation="/add-user"
          excel={false}
        >
          <UserFilter />
          <Suspense fallback={<TableSkeleton />}>
            <UserContent searchParams={searchParams} />
          </Suspense>
        </ComponentCard>
      </div>
    </div>
  );
}
