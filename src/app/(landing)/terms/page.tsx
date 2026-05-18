import React from "react";
import Link from "next/link";
import { FiCheckCircle, FiFileText, FiArrowRight } from "react-icons/fi";

export default function TermsOfService() {
  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-slate-50 font-outfit">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-4 uppercase tracking-wider">
            <FiFileText /> Agreement & Terms
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-slate-500 font-medium text-base">
            Effective Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200">
          <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed">
            <p className="text-base text-slate-600 mb-8 pb-8 border-b border-slate-100">
              Accessing the <strong className="text-slate-900">CyberSafe Security Portal</strong> constituye a legally binding agreement. These terms ensure the security and integrity of our platform for all users.
            </p>

            {[
              {
                title: "1. Acceptance of Terms",
                content: "By creating an account or using our security monitoring tools, you agree to comply with these terms. If you are using our services for a company, you are agreeing to these terms on behalf of that business.",
                items: ["Legal Authority", "Enterprise Agreement"]
              },
              {
                title: "2. Authorized Scanning Only",
                content: "You may only use our platform to scan assets (domains, IPs, cloud infrastructure) that you legally own or have explicit written permission to test. Unauthorized testing is strictly prohibited.",
                items: ["Ownership Verification", "Zero Offensive Policy"]
              },
              {
                title: "3. Service Limitations",
                content: "While our engines are designed for non-disruptive monitoring, you acknowledge that security testing involves system interaction. CyberSafe is not liable for temporary performance changes during authorized scans.",
                items: ["Standardized Testing", "Limited Liability"]
              },
              {
                title: "4. Intellectual Property",
                content: "All components of the CyberSafe Portal, including scripts, dashboards, and reporting logic, are the protected intellectual property of CyberSafe Technologies India Pvt Ltd.",
                items: ["Proprietary Algorithms", "Protected Dashboards"]
              }
            ].map((section, idx) => (
              <section key={idx} className="mb-10 last:mb-0">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 tracking-tight">
                  {section.title}
                </h2>
                <p className="text-slate-500 mb-4 text-base leading-relaxed">
                  {section.content}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {section.items.map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600">
                      <FiCheckCircle className="text-blue-500" /> {item}
                    </span>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
