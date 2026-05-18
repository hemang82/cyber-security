import DemoRequestForm from "@/components/auth/DemoRequestForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request Demo | CyberSafe Security Portal",
  description: "Request a personalized demo of India's #1 advanced cybersecurity platform. Explore our vulnerability intelligence and asset monitoring capabilities.",
  keywords: ["Security Demo Request", "Cybersecurity Platform Demo", "Enterprise Security Walkthrough"],
};

export default function DemoRequest() {
  return <DemoRequestForm />;
}
