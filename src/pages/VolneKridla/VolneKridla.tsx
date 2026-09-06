import VolneKridlaIntro from "@/sections/volne-kridla-intro";
import VolneKridlaTraining from "@/sections/volne-kridla-training";
import VolneKridlaChat from "@/sections/volne-kridla-chat";
import VolneKridlaFaq from "@/sections/volne-kridla-faq";
import VolneKridlaTarget from "@/sections/volne-kridla-target";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

export default function VolneKridla() {
  useDocumentMeta({
    title: "Kurz a tréning voľného lietania papagájov",
    description:
      "Postupný tréning voľného lietania a target tréningu pre papagáje — bezpečnostné zásady, recall a odpovede na najčastejšie otázky o voľnom lete.",
    path: "/volne-kridla",
  });

  return (
    <>
      <VolneKridlaIntro />
      <VolneKridlaTraining />
      <VolneKridlaChat />
      <VolneKridlaFaq />
      <VolneKridlaTarget />
    </>
  );
}
