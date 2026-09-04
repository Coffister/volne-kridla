import { useEffect } from "react";

import MainLayout from "@/layouts/MainLayout";
import Navbar from "@/features/navigation/Navbar";
import PageTransition from "@/features/navigation/PageTransition";
import CTA from "@/sections/cta";
import Footer from "@/sections/footer";

import { initializeScrollSystem } from "@/lib/scroll";

// shared shell (background, navbar, footer) that stays mounted across route
// changes — only the routed page inside <PageTransition /> swaps, which is what
// makes navigation feel instant instead of a full reload
export default function SiteLayout() {
  useEffect(() => {
    initializeScrollSystem();
  }, []);

  return (
    <MainLayout>
      <Navbar />
      <PageTransition />
      <CTA />
      <Footer />
    </MainLayout>
  );
}
