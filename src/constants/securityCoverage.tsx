import React from "react";
import {
  RiGlobalLine,
  RiSmartphoneLine,
  RiCloudLine,
  RiPulseLine,
  RiLock2Line,
  RiBugLine,
  RiShieldFlashLine,
  RiServerLine,
  RiSpyLine,
  RiEarthLine
} from "react-icons/ri";

export interface SecurityModule {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  hoverBorder: string;
  glow: string;
}

export const SECURITY_COVERAGE_DATA: SecurityModule[] = [
  {
    id: 1,
    title: "WEB APPS",
    description: "Secure and monitor all your web applications against top vulnerabilities and zero-day threats in real time.",
    icon: <RiGlobalLine size={24} />,
    color: "text-blue-600",
    bgColor: "bg-blue-50/80",
    hoverBorder: "hover:border-blue-300",
    glow: "from-blue-50"
  },
  {
    id: 2,
    title: "ANDROID/IOS",
    description: "Comprehensive security assessments for mobile applications to ensure data integrity and user privacy.",
    icon: <RiSmartphoneLine size={24} />,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50/80",
    hoverBorder: "hover:border-emerald-300",
    glow: "from-emerald-50"
  },
  {
    id: 3,
    title: "CLOUD INFRA",
    description: "Continuous monitoring and posture management for AWS, Azure, and Google Cloud environments.",
    icon: <RiCloudLine size={24} />,
    color: "text-sky-600",
    bgColor: "bg-sky-50/80",
    hoverBorder: "hover:border-sky-300",
    glow: "from-sky-50"
  },
  {
    id: 4,
    title: "ACTIVE MONITORING",
    description: "Real-time surveillance and automated discovery of your digital assets to ensure constant visibility.",
    icon: <RiPulseLine size={24} />,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50/80",
    hoverBorder: "hover:border-indigo-300",
    glow: "from-indigo-50"
  },
  {
    id: 5,
    title: "SSL/TLS",
    description: "Track certificate health automatically, monitor expirations, and ensure robust cryptographic standards.",
    icon: <RiLock2Line size={24} />,
    color: "text-amber-600",
    bgColor: "bg-amber-50/80",
    hoverBorder: "hover:border-amber-300",
    glow: "from-amber-50"
  },
  {
    id: 6,
    title: "OWASP 10",
    description: "Active automated defense mechanisms scanning internally for the most critical web application security risks.",
    icon: <RiBugLine size={24} />,
    color: "text-rose-600",
    bgColor: "bg-rose-50/80",
    hoverBorder: "hover:border-rose-300",
    glow: "from-rose-50"
  },
  {
    id: 7,
    title: "PENTESTING",
    description: "Schedule, manage, and analyze deep penetration tests to uncover hidden structural weaknesses.",
    icon: <RiShieldFlashLine size={24} />,
    color: "text-red-500",
    bgColor: "bg-red-50/80",
    hoverBorder: "hover:border-red-300",
    glow: "from-red-50"
  },
  {
    id: 8,
    title: "COMPLIANCE",
    description: "Stay completely aligned with HIPAA, GDPR, SOC2, and ISO standards via automated reporting.",
    icon: <RiServerLine size={24} />,
    color: "text-teal-600",
    bgColor: "bg-teal-50/80",
    hoverBorder: "hover:border-teal-300",
    glow: "from-teal-50"
  },
  {
    id: 9,
    title: "THREAT HUNT",
    description: "Proactive threat intelligence and dark-web monitoring to neutralize risks before they escalate.",
    icon: <RiSpyLine size={24} />,
    color: "text-slate-700",
    bgColor: "bg-slate-100/80",
    hoverBorder: "hover:border-slate-300",
    glow: "from-slate-100"
  }
];
