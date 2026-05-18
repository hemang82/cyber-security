"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiShield,
  FiArrowRight,
  FiMenu,
  FiX,
  FiPlayCircle,
  FiLogIn,
  FiUserPlus
} from "react-icons/fi";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-outfit selection:bg-brand-500 selection:text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-400/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px]" />
      </div>

      {/* Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200 py-3" : "bg-transparent py-6"
          }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="inline-block relative z-10 shrink-0">
            <Image
              width={200}
              height={45}
              src="/images/logo/logo.png"
              alt="CyberSafe Logo"
              className="object-contain hover:opacity-90 transition-opacity"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#modules" className="text-slate-600 hover:text-brand-600 transition-colors text-base font-semibold">Platform</Link>
            <Link href="/#trust" className="text-slate-600 hover:text-brand-600 transition-colors text-base font-semibold">Why Us</Link>
            <Link href="/#pricing" className="text-slate-600 hover:text-brand-600 transition-colors text-base font-semibold">Pricing</Link>
            <Link href="/#contact" className="text-slate-600 hover:text-brand-600 transition-colors text-base font-semibold">Contact Us</Link>

            <div className="flex items-center gap-3 ml-4 pl-6 border-l border-slate-300">
              <Link href="/demo-request" className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-brand-200 text-brand-600 hover:bg-brand-50 transition-all text-base font-bold shadow-sm hover:shadow-md">
                <FiPlayCircle className="text-lg" /> Demo
              </Link>
              <Link href="/signin" className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all text-base font-bold shadow-sm hover:shadow-md">
                <FiLogIn className="text-lg" /> Login
              </Link>
              <Link href="/signup" className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white transition-all text-base font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5">
                <FiUserPlus className="text-lg" /> Sign Up
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-700 hover:text-brand-600 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-b border-slate-200 flex flex-col py-4 px-6 space-y-4">
            <Link href="/#modules" className="text-slate-700 hover:text-brand-600 py-2 font-medium" onClick={() => setMobileMenuOpen(false)}>Platform</Link>
            <Link href="/#trust" className="text-slate-700 hover:text-brand-600 py-2 font-medium" onClick={() => setMobileMenuOpen(false)}>Why Us</Link>
            <Link href="/#pricing" className="text-slate-700 hover:text-brand-600 py-2 font-medium" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            <Link href="/#contact" className="text-slate-700 hover:text-brand-600 py-2 font-medium" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>

            <div className="h-px w-full bg-slate-200 my-2"></div>

            <Link href="/demo-request" className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-brand-200 text-brand-600 hover:bg-brand-50 hover:border-brand-300 transition-colors font-bold mt-2" onClick={() => setMobileMenuOpen(false)}>
              <FiPlayCircle className="text-lg" /> Demo
            </Link>
            <Link href="/signin" className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors font-bold mt-2" onClick={() => setMobileMenuOpen(false)}>
              <FiLogIn className="text-lg" /> Login
            </Link>
            <Link href="/signup" className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-bold mt-2 shadow-sm" onClick={() => setMobileMenuOpen(false)}>
              <FiUserPlus className="text-lg" /> Sign Up
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white pt-20 pb-10 px-6 border-t border-slate-200">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            <div className="md:col-span-5">
              <Link href="/" className="inline-block mb-8">
                <Image
                  width={220}
                  height={50}
                  src="/images/logo/logo.png"
                  alt="CyberSafe Logo"
                  className="object-contain hover:opacity-90 transition-opacity"
                />
              </Link>
              <p className="text-lg text-slate-500 max-w-md font-medium leading-relaxed mb-8">
                India's #1 Advanced Cybersecurity Platform. Protecting modern enterprises with next-generation vulnerability intelligence and real-time asset monitoring.
              </p>

            </div>

            <div className="md:col-span-2">
              <h4 className="text-slate-900 font-bold mb-6 text-lg">Solutions</h4>
              <ul className="space-y-4 text-slate-500 font-medium">
                <li><Link href="/#modules" className="hover:text-brand-600 transition-colors">Vulnerability Scan</Link></li>
                <li><Link href="/#modules" className="hover:text-brand-600 transition-colors">Asset Mapping</Link></li>
                <li><Link href="/#modules" className="hover:text-brand-600 transition-colors">Compliance Audit</Link></li>
                <li><Link href="/#modules" className="hover:text-brand-600 transition-colors">Threat Intel</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-slate-900 font-bold mb-6 text-lg">Company</h4>
              <ul className="space-y-4 text-slate-500 font-medium">
                <li><Link href="/#trust" className="hover:text-brand-600 transition-colors">About Us</Link></li>
                <li><Link href="/#pricing" className="hover:text-brand-600 transition-colors">Pricing Plans</Link></li>
                <li><Link href="/demo-request" className="hover:text-brand-600 transition-colors">Try Demo</Link></li>
                <li><Link href="/#contact" className="hover:text-brand-600 transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-slate-900 font-bold mb-6 text-lg">Stay Protected</h4>
              <p className="text-slate-500 text-base mb-6">Join 500+ security teams receiving our weekly zero-day intelligence.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Please enter your email"
                  className="bg-slate-50 border border-slate-200 text-slate-900 px-4 py-2.5 rounded-lg text-base w-full focus:outline-none focus:border-brand-500 transition-colors"
                />
                <button className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 rounded-lg font-bold text-base transition-all shadow-lg hover:shadow-brand-500/20">
                  Join
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 text-sm font-semibold text-slate-400 uppercase tracking-widest">
            <p>© {new Date().getFullYear()} CyberSafe Technologies India Pvt Ltd. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="/privacy" className="hover:text-slate-900 transition-colors text-brand-600">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
