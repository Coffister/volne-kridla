import Hero from "@/sections/hero";
import AboutVK from "@/sections/about-vk/AboutVK";
import Testimonials from "@/sections/testimonials";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

export default function Home() {
  useDocumentMeta({
    title: "Voľné krídla — výcvik voľného lietania papagájov",
    description:
      "Voľné krídla — bezpečný výcvik voľného lietania papagájov, konzultácie a kurzy s Frankou. Naučte svojho papagája lietať vonku a vrátiť sa späť k vám.",
    path: "/",
  });

  return (
    <>
      <Hero />
      <AboutVK />
      <Testimonials />
    </>
  );
}
