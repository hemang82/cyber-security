import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InventoryDetailsComponent from "@/components/cyber/Inventory/InventoryDetailsComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
    description:
        "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
    // other metadata
};

export default function BasicTables() {

    return (
        <div>
            <PageBreadcrumb pageTitle="Inventory Details" />
            <div className="space-y-6">
                <InventoryDetailsComponent />
            </div>
        </div>
    );
}
