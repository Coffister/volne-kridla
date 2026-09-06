import FotogaleriaSection from "@/sections/fotogaleria";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

export default function Fotogaleria() {
  useDocumentMeta({
    title: "Fotogaléria",
    description:
      "Fotografie z tréningov voľného lietania a spoločných zážitkov s papagájmi a ich majiteľmi.",
    path: "/fotogaleria",
  });

  return <FotogaleriaSection />;
}
