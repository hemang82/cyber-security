"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiShield,
  FiArrowRight,
  FiMenu,
  FiX,
  FiCheckCircle,
  FiDatabase,
  FiGlobe,
  FiTarget,
  FiActivity,
  FiUsers,
  FiSmartphone,
  FiCloud,
  FiCode,
  FiFileText,
  FiSearch,
  FiLock,
  FiPlayCircle,
  FiLogIn,
  FiUserPlus,
  FiChevronDown,
  FiChevronUp,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend
} from "react-icons/fi";
import { useForm, FormProvider } from "react-hook-form";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";

import { SECURITY_COVERAGE_DATA } from "@/constants/securityCoverage";
import { CONTACT_INFO } from "@/constants/contact";

const MODULES_DATA = SECURITY_COVERAGE_DATA;


const FAQ_DATA = [
  {
    question: "How often are automated security scans performed?",
    answer: "Scanning frequency depends on your chosen plan. Free users can trigger manual scans, while Basic and Premium users benefit from scheduled daily and weekly automated assessments across all registered assets."
  },
  {
    question: "What compliance standards does the platform cover?",
    answer: "Our engine maps vulnerabilities against global frameworks including OWASP Top 10, NIST, GDPR (Article 32), SOC 2 Type II, and CERT-In guidelines to ensure your infrastructure remains audit-ready."
  },
  {
    question: "Is my enterprise discovery data stored safely?",
    answer: "Absolutely. We employ AES-256 encryption at rest and TLS 1.3 for all data in transit. Your security reports are isolated within a zero-trust architecture, ensuring that only your authorized team members can access sensitive findings."
  },
  {
    question: "Does this platform support mobile application security?",
    answer: "Yes. Beyond web and cloud monitoring, we provide specialized modules for Android and iOS static/dynamic analysis to uncover mobile-specific risks like insecure data storage or weak binary protections."
  },
  {
    question: "In what formats can I export my security reports?",
    answer: "You can export comprehensive compliance and vulnerability reports in PDF (executive summary), JSON (for SIEM integration), and CSV formats directly from your dedicated dashboard."
  }
];

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 md:pt-44 md:pb-32 px-6 overflow-hidden">
        <div className="container mx-auto text-center max-w-4xl relative">


          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-8 leading-tight text-slate-900">
            Next-Gen Security <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-blue-600">All-in-One Monitoring</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Global-standard security infrastructure for modern enterprises. Scan, detect, and remediate vulnerabilities in real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link href="/signup" className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-xl text-base font-bold transition-all transform hover:-translate-y-1 shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 group">
              Start Securing Now <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/demo-request" className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-8 py-4 rounded-xl text-base font-bold transition-all shadow-sm flex items-center justify-center gap-2">
              Explore Live Demo
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center gap-8 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-2"><FiCheckCircle className="text-brand-500 text-lg" /> Automated Scans</div>
            <div className="flex items-center gap-2"><FiCheckCircle className="text-brand-500 text-lg" /> Real-time Analytics</div>
          </div>
        </div>
      </section>

      {/* Project Functionalities (Modules) */}
      <section id="modules" className="relative z-10 py-24 bg-gradient-to-b from-white to-slate-50 border-y border-slate-200 overflow-hidden">

        {/* Abstract Background Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-brand-50 rounded-[100%] blur-[120px] opacity-60 pointer-events-none"></div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight text-slate-900 drop-shadow-sm">
              Comprehensive <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Security Framework</span>
            </h2>
            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">
              Every tool you need to track, scan, and secure your digital landscape is built right in. The absolute pinnacle of cybersecurity technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto">
            {MODULES_DATA.map((module) => (
              <FeatureCard
                key={module.id}
                icon={module.icon}
                title={module.title}
                description={module.description}
                color={module.color}
                bg={module.bgColor}
                hoverBorder={module.hoverBorder}
                glow={module.glow}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Trust Us Section */}
      <section id="trust" className="relative z-10 py-16 md:py-24 px-6 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto max-w-7xl relative z-10">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-8 md:mb-10 text-slate-800 tracking-tight text-left">
            Why Trust Our Security Framework?
          </h2>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white border text-left p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-center">
              <h4 className="text-lg font-extrabold text-slate-800 mb-2">Continuous Monitoring</h4>
              <p className="text-slate-500 font-medium leading-relaxed text-sm lg:text-base">
                Cybersecurity is not a static state. Our engine runs 24/7 to catch new vulnerabilities as they emerge in your infrastructure.
              </p>
            </div>

            <div className="bg-white border text-left p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-center">
              <h4 className="text-lg font-extrabold text-slate-800 mb-2">Zero-Trust Architecture</h4>
              <p className="text-slate-500 font-medium leading-relaxed text-sm lg:text-base">
                We assume every endpoint is a target. Our scans verify every server, port, and code snippet to eliminate hidden backdoors.
              </p>
            </div>

            <div className="bg-white border text-left p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-center">
              <h4 className="text-lg font-extrabold text-slate-800 mb-2">Global Compliance Standards</h4>
              <p className="text-slate-500 font-medium leading-relaxed text-sm lg:text-base">
                We map our findings against SOC2, OWASP, and GDPR standards, helping you stay compliant while staying secure.
              </p>
            </div>

            <div className="bg-white border text-left p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-center">
              <h4 className="text-lg font-extrabold text-slate-800 mb-2">Advanced Asset Mapping</h4>
              <p className="text-slate-500 font-medium leading-relaxed text-sm lg:text-base">
                Whether it's a mobile app, a cloud resource, or a web frontend, we map your entire digital footprint for total visibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-24 px-6 bg-white border-t border-slate-200 overflow-hidden">
        {/* Background glow behind center card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[400px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-slate-900">
              Choose Your Security <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Plan</span>
            </h2>
            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">
              Start for free and upgrade as you grow. No hidden fees or surprise charges—just straightforward, reliable security tools for your business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto items-center">
            {/* Free Plan */}
            <div className="bg-white border text-left p-8 rounded-[2rem] shadow-sm hover:shadow-lg transition-all h-full flex flex-col justify-between">
              <div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">Free</h4>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl lg:text-5xl font-extrabold text-slate-900">₹0</span>
                  <span className="text-base font-medium text-slate-500 mb-1 lg:mb-2">/mo</span>
                </div>
                <p className="text-sm text-slate-500 mb-8 border-b border-slate-100 pb-8">Essential tools for individuals and small teams getting started.</p>

                <ul className="text-left space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-sm font-medium text-slate-600"><FiCheckCircle className="text-brand-500 text-lg shrink-0 mt-0.5" /> 1 Web Domain</li>
                  <li className="flex items-start gap-3 text-sm font-medium text-slate-600"><FiCheckCircle className="text-brand-500 text-lg shrink-0 mt-0.5" /> Basic Vulnerability Scan</li>
                  <li className="flex items-start gap-3 text-sm font-medium text-slate-600"><FiCheckCircle className="text-brand-500 text-lg shrink-0 mt-0.5" /> Community Tech Support</li>
                </ul>
              </div>

              <Link href="/signup" className="w-full block py-3.5 px-6 text-center rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-colors mt-auto">Start For Free</Link>
            </div>

            {/* Basic Plan (Highlighted in Theme) */}
            <div className="bg-brand-50 border-2 border-brand-500 text-left p-8 rounded-[2rem] shadow-xl relative transform lg:scale-105 z-10 flex flex-col justify-between h-full">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">Most Popular</div>

              <div>
                <h4 className="text-xl font-bold text-brand-700 mb-2">Basic</h4>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-3xl lg:text-5xl font-extrabold text-slate-900">₹499</span>
                  <span className="text-base font-medium text-slate-500 mb-1 lg:mb-2">/mo</span>
                </div>
                <p className="text-sm text-slate-600 mb-8 border-b border-brand-200 pb-8">Full-suite protection for scaling startups and mid-market companies.</p>

                <ul className="text-left space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-sm font-medium text-slate-700"><FiCheckCircle className="text-brand-600 text-lg shrink-0 mt-0.5" /> Up to 10 Web Domains</li>
                  <li className="flex items-start gap-3 text-sm font-medium text-slate-700"><FiCheckCircle className="text-brand-600 text-lg shrink-0 mt-0.5" /> Advanced Asset Mapping</li>
                  <li className="flex items-start gap-3 text-sm font-medium text-slate-700"><FiCheckCircle className="text-brand-600 text-lg shrink-0 mt-0.5" /> Standard Compliance Reports</li>
                  <li className="flex items-start gap-3 text-sm font-medium text-slate-700"><FiCheckCircle className="text-brand-600 text-lg shrink-0 mt-0.5" /> Priority Email Support</li>
                </ul>
              </div>

              <Link href="/signup" className="w-full block py-4 px-6 text-center rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors shadow-md mt-auto">Get Started Now</Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-white border text-left p-8 rounded-[2rem] shadow-sm hover:shadow-lg transition-all h-full flex flex-col justify-between">
              <div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">Premium</h4>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-3xl lg:text-5xl font-extrabold text-slate-900">₹999</span>
                  <span className="text-base font-medium text-slate-500 mb-1 lg:mb-2">/mo</span>
                </div>
                <p className="text-sm text-slate-500 mb-8 border-b border-slate-100 pb-8">Tailored architecture and dedicated support for large scale organizations.</p>

                <ul className="text-left space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-sm font-medium text-slate-600"><FiCheckCircle className="text-brand-500 text-lg shrink-0 mt-0.5" /> Unlimited Cloud Integrations</li>
                  <li className="flex items-start gap-3 text-sm font-medium text-slate-600"><FiCheckCircle className="text-brand-500 text-lg shrink-0 mt-0.5" /> Full Zero-Trust Architecture</li>
                  <li className="flex items-start gap-3 text-sm font-medium text-slate-600"><FiCheckCircle className="text-brand-500 text-lg shrink-0 mt-0.5" /> Deep Penetration Testing</li>
                  <li className="flex items-start gap-3 text-sm font-medium text-slate-600"><FiCheckCircle className="text-brand-500 text-lg shrink-0 mt-0.5" /> 24/7 Dedicated Support</li>
                </ul>
              </div>

              <Link href="/signup" className="w-full block py-3.5 px-6 text-center rounded-xl border-2 border-brand-200 text-brand-600 font-bold hover:bg-brand-50 transition-colors mt-auto">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-24 px-6 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight text-slate-900">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Questions</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto">
              Everything you need to know about our next-generation security platform and how it protects your digital assets.
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_DATA.map((item, idx) => (
              <FaqItem key={idx} question={item.question} answer={item.answer} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-600 font-medium">
              Have more questions? <Link href="/#contact" className="text-brand-600 hover:underline font-bold">Contact Us</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6 bg-slate-50/50">
        <div className="container mx-auto relative max-w-5xl rounded-[3rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 bg-white">
          <div className="absolute inset-4 rounded-[2.5rem] border border-dashed border-slate-100 pointer-events-none z-0"></div>

          {/* Light Theme Animated Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-400/20 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none"></div>

          <div className="relative p-12 md:p-20 text-center flex flex-col items-center justify-center">

            <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight text-slate-900 leading-tight">
              Take Total Control of Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Digital Security</span>
            </h3>

            <p className="text-slate-600 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
              Next-generation security platform for modern teams. Built with performance and uncompromising security standards in mind.

            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full z-10">
              <Link href="/signup" className="inline-flex justify-center items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-2xl text-base font-bold transition-all transform hover:-translate-y-0.5 shadow-md shadow-brand-500/20 border border-brand-500">
                Create Free Account <FiArrowRight />
              </Link>
              <Link href="/demo-request" className="inline-flex justify-center items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-8 py-4 rounded-2xl text-base font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                Book a Live Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm({
    mode: "onBlur",
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    console.log("Contact form data:", data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
    methods.reset();
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="relative z-10 py-24 px-6 bg-white border-t border-slate-200 overflow-hidden">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-brand-50 border-2 border-brand-200 rounded-[3rem] p-12 md:p-20 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-200/20 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-brand-500 text-white rounded-2xl flex items-center justify-center text-4xl mx-auto mb-8 shadow-lg shadow-brand-500/20">
                <FiCheckCircle />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Message Sent Successfully!</h2>
              <p className="text-slate-600 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
                Thank you for reaching out. Our security experts will review your request and get back to you within 24 hours.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="bg-white border-2 border-brand-200 text-brand-600 px-10 py-4 rounded-2xl font-extrabold hover:bg-brand-50 hover:border-brand-400 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
              >
                Send Another Message
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="relative z-10 py-24 px-6 bg-white border-t border-slate-200 overflow-hidden">
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-8 tracking-tight text-slate-900 leading-tight">
              Get in Touch with Our <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Security Specialists</span>
            </h2>
            <p className="text-slate-500 text-lg md:text-xl font-medium mb-12 max-w-xl leading-relaxed">
              Have questions about your digital infrastructure? We're here to help you build a safer, more resilient enterprise.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-xl shrink-0 border border-brand-100">
                  <FiMail />
                </div>
                <div>
                  <h4 className="text-slate-900 font-bold text-lg mb-1">Email Us</h4>
                  <p className="text-slate-500 font-medium">{CONTACT_INFO.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-xl shrink-0 border border-brand-100">
                  <FiPhone />
                </div>
                <div>
                  <h4 className="text-slate-900 font-bold text-lg mb-1">Call Us</h4>
                  <p className="text-slate-500 font-medium">{CONTACT_INFO.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-xl shrink-0 border border-brand-100">
                  <FiMapPin />
                </div>
                <div>
                  <h4 className="text-slate-900 font-bold text-lg mb-1">Visit Office</h4>
                  <p className="text-slate-500 font-medium">{CONTACT_INFO.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="mb-2 block text-slate-700 font-bold">Full Name</Label>
                    <Input
                      name="fullName"
                      placeholder="Please enter your name"
                      rules={{ required: "Name is required" }}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block text-slate-700 font-bold">Email Address</Label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Please enter your email"
                      rules={{
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block text-slate-700 font-bold">Subject</Label>
                  <Input
                    name="subject"
                    placeholder="Please enter a subject"
                    rules={{ required: "Subject is required" }}
                  />
                </div>

                <div>
                  <Label className="mb-2 block text-slate-700 font-bold">Message</Label>
                  <TextArea
                    name="message"
                    placeholder="Please enter your message"
                    rows={4}
                    rules={{
                      required: "Message is required",
                      minLength: { value: 10, message: "Message must be at least 10 characters" }
                    }}
                  />
                </div>

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    size="sm"
                    endIcon={<FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-lg" />}
                    className="w-full sm:w-max px-12 py-4 text-base font-bold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-2xl shadow-lg shadow-brand-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                    loading={isLoading}
                  >
                    Send Message
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border rounded-2xl transition-all duration-300 ${isOpen ? "bg-white border-brand-200 shadow-md" : "bg-white/50 border-slate-200 hover:border-slate-300"}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left focus:outline-none"
      >
        <span className={`text-lg font-bold tracking-tight transition-colors ${isOpen ? "text-brand-600" : "text-slate-800"}`}>
          {question}
        </span>
        <div className={`p-1.5 rounded-full transition-all ${isOpen ? "bg-brand-50 text-brand-600 rotate-180" : "bg-slate-100 text-slate-500"}`}>
          <FiChevronDown size={20} />
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-6 pb-6 text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-4">
          {answer}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, color, bg, hoverBorder, glow }: { icon: React.ReactNode; title: string; description: string; color: string; bg: string; hoverBorder: string; glow: string }) {
  return (
    <div className={`relative flex flex-col items-start p-8 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-md ${hoverBorder} transition-all duration-500 hover:-translate-y-2 group overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-5 w-full">
        <div className={`relative z-10 w-16 h-16 shrink-0 rounded-[1.2rem] ${bg} ${color} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500 shadow-sm border border-slate-50`}>
          {icon}
        </div>
        <h3 className={`relative z-10 text-lg md:text-xl font-extrabold tracking-wide text-slate-800 group-hover:${color} transition-colors duration-300`}>
          {title}
        </h3>
      </div>

      <p className="relative z-10 text-slate-500 font-medium leading-relaxed text-base group-hover:text-slate-600 transition-colors duration-300 line-clamp-2">
        {description}
      </p>
    </div>
  );
}
