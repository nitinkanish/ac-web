import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WelcomeDialog from "@/components/WelcomeDialog";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://arunchandan.com"),
  title: { default: "Dr Arun Chandan", template: "%s · Dr Arun Chandan" },
  description: "Ayurveda, medicinal plants, consultations, learning, and livelihoods from Dr Arun Chandan.",
};

export const viewport = { themeColor: "#10384f" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" data-theme="bayer" data-scroll-behavior="smooth">
      <head>
        <link rel="stylesheet" href="/styles/bayer.css" />
      </head>
      <body className="prod-mode bg-white font-regular text-text">
        <a className="skip" href="#content">
          Skip to content
        </a>
        <Header />
        <main id="content" className="pb-32">
          {children}
        </main>
        <Footer />
        <WelcomeDialog />
      </body>
    </html>
  );
}
