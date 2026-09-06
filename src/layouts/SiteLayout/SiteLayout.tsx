import { useEffect } from "react";

import MainLayout from "@/layouts/MainLayout";
import Navbar from "@/features/navigation/Navbar";
import PageTransition from "@/features/navigation/PageTransition";
import Footer from "@/sections/footer";
import JsonLd from "@/lib/JsonLd";

import { initializeScrollSystem } from "@/lib/scroll";

// Organization schema, once for the whole site — instagram handle is the one
// used elsewhere in the site's own copy (e.g. testimonials reference
// "@volne.kridla"); update here if the real profile URL differs.
const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Voľné krídla",
  url: "https://volnekridla.sk",
  logo: "https://volnekridla.sk/android-chrome-512x512.png",
  sameAs: ["https://www.instagram.com/volne.kridla"],
};

// shared shell (background, navbar, footer) that stays mounted across route
// changes — only the routed page inside <PageTransition /> swaps, which is what
// makes navigation feel instant instead of a full reload
export default function SiteLayout() {
  useEffect(() => {
    initializeScrollSystem();
  }, []);

  return (
    <MainLayout>
      <JsonLd data={ORGANIZATION_JSON_LD} />
      <Navbar />
      <PageTransition />
      <Footer />
    </MainLayout>
  );
}
