import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your CyberSafe Account | Security Monitoring Registration",
  description: "Join CyberSafe to start monitoring your digital infrastructure for vulnerabilities and security threats.",
  keywords: ["Security Registration", "Cyber Monitoring Account", "Sign up for Security Scanning"],
};

export default function SignUp() {
  return <SignUpForm />;
}
