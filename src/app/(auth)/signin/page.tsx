import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Login | CyberSafe Security Portal",
  description: "Access your CyberSafe security dashboard through our encrypted authentication gateway for secure asset management.",
  keywords: ["Security Login", "Cyber Dashboard Access", "Secure Admin Sign-in"],
};

export default function SignIn() {
  return <SignInForm />;
}
