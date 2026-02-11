import VerifyForm from "@/components/auth/VerifyForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Two Step Verification | Cyber Admin",
    description: "Two Step Verification Page",
};

export default function TwoStepVerification() {
    return <VerifyForm />;
}
