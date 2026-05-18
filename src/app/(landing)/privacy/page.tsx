import React from "react";
import { FiShield, FiCheckCircle } from "react-icons/fi";

export default function PrivacyPolicy() {
  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-slate-50 font-outfit">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12">
          <div className="flex items-center gap-2 text-brand-600 font-bold text-sm mb-4 uppercase tracking-wider">
            <FiShield /> Compliance & Privacy
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-500 font-medium text-base">
            Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200">
          <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed">
            <p className="text-base text-slate-600 mb-8 pb-8 border-b border-slate-100">
              Welcome to <strong className="text-slate-900">CyberSafe Security Portal</strong>. We are committed to protecting your personal data and your digital assets with uncompromising security standards. 
            </p>

            {[
              {
                title: "1. Data We Collect",
                content: "To provide our high-level security services, we collect account information (name, email), asset data (authorized domains/IPs for scanning), and platform usage telemetry to improve performance.",
                items: ["Account Identification", "Infrastructure Metadata", "Vulnerability Discovery Logs"]
              },
              {
                title: "2. How We Use Data",
                content: "Our data processing is strictly limited to performing security assessments, generating threat intelligence reports, and ensuring your assets remain protected against emerging vulnerabilities.",
                items: ["Scheduled Vulnerability Scanning", "Real-time Threat Advisories", "Compliance Reporting"]
              },
              {
                title: "3. Data Security",
                content: "All data is encrypted both in transit and at rest using industry-standard protocols. We follow a strict zero-trust internal architecture to ensure no unauthorized access to your reports.",
                items: ["AES-256 Storage Encryption", "TLS 1.3 Transmission", "HSM-based Key Management"]
              },
              {
                title: "4. Information Sharing",
                content: "We do not sell your personal or security data. Information is only shared with vetted infrastructure providers who help run the service, and only under strict confidentiality agreements.",
                items: ["No Third-Party Marketing", "Strict Data Processing Agreements"]
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
                      <FiCheckCircle className="text-brand-500" /> {item}
                    </span>
                  ))}
                </div>
              </section>
            ))}

            <div className="mt-12 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm mb-6">
                For any privacy-related inquiries, please contact our compliance desk.
              </p>
              <a href="mailto:privacy@cybersafe.in" className="text-brand-600 font-bold hover:underline">
                privacy@cybersafe.in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
