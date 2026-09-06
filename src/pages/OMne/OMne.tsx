import OMneIntro from "@/sections/o-mne-intro";
import OMneFreedom from "@/sections/o-mne-freedom";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

export default function OMne() {
  useDocumentMeta({
    title: "O mne — Franka",
    description:
      "Spoznaj Franku, lektorku výcviku voľného lietania papagájov — jej príbeh, prístup a to, prečo verí slobode pre operencov.",
    path: "/o-mne",
  });

  return (
    <>
      <OMneIntro />
      <OMneFreedom />
    </>
  );
}
