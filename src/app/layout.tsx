import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from 'sonner';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: "CyberSafe | Unified Security Dashboard",
    template: "%s | CyberSafe"
  },
  description: "Advanced Cyber Security Monitoring and Vulnerability Assessment Dashboard. Protecting your digital assets with real-time threat intelligence.",
  keywords: ["CyberSecurity", "Vulnerability Scanner", "Threat Monitoring", "SSL Checker", "DNS Security", "OWASP"],
};

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
        {/* ✅ Toast container */}
        <Toaster
          position="top-center"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}
