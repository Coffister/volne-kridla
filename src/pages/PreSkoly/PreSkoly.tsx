import PreSkolyHero from "@/sections/pre-skoly-hero";
import PreSkolyProgram from "@/sections/pre-skoly-program";
import PreSkolyFilozofia from "@/sections/pre-skoly-filozofia";
import PreSkolyPreKoho from "@/sections/pre-skoly-pre-koho";
import PreSkolyRezervacia from "@/sections/pre-skoly-rezervacia";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

export default function PreSkoly() {
  useDocumentMeta({
    title: "Prezentácie o papagájoch pre školy a organizácie",
    description:
      "Zážitkové a interaktívne prezentácie o papagájoch pre materské, základné a stredné školy, centrá voľného času, domovy seniorov a komunitné centrá. Program prispôsobíme veku aj publiku.",
    path: "/pre-skoly",
  });

  return (
    <>
      <PreSkolyHero />
      <PreSkolyProgram />
      <PreSkolyFilozofia />
      <PreSkolyPreKoho />
      <PreSkolyRezervacia />
    </>
  );
}
