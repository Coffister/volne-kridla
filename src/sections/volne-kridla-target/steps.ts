// exact copy from https://volnekridla.sk/volne-kridla (Target tréning) — do not paraphrase

export const targetIntro =
  "je jedna zo základných tréningových metód pri výcviku papagájov. Ide o techniku, pri ktorej sa papagáj učí dotýkať sa určitého objektu (zvyčajne target stick – palička s guľôčkou na konci) zobákom alebo nohou na povel. Tento tréning pomáha pri výcviku poslušnosti, budovaní dôvery a neskôr sa dá využiť aj na komplexnejšie triky či navigáciu pri voľnom lietaní.";

export const targetSteps: string[] = [
  "Výber targetu\nNajčastejšie sa používa palička s guľôčkou na konci (napr. aj čínska jedálenská palička alebo drevená špajdľa).",
  "Naučenie základnej asociácie\n• Ak papagáj ešte nerozumie konceptu targetu, začne sa s pozitívnym posilňovaním (napr. pomocou klikera).\n• Držíš target blízko zobáka papagája – ak sa ho dotkne zo zvedavosti, hneď dostane odmenu (napr. obľúbené semienko).\n• Tento krok opakuješ, kým papagáj pochopí, že dotknutie sa targetu znamená odmenu.",
  "Zvyšovanie obtiažnosti\n• Postupne target odďaľuješ a papagáj sa k nemu musí natiahnuť alebo priblížiť.\n• Môžeš ho viesť rôznymi smermi, aby sa pohyboval podľa targetu.\n• Keď papagáj spoľahlivo reaguje, môžeš pridať verbálny povel, napr. “dotkni sa” alebo “target”.",
  "Aplikácia v praxi\n• Môžeš ho využiť na privolanie papagája k ruke, usmernenie pri lietaní alebo vedenie do prepravky.\n• Ak sa papagáj bojí niečoho (napr. novej hračky), môžeš ho cez target tréning postupne zoznámiť s novým predmetom.",
];

export interface TargetBenefit {
  title: string;
  text: string;
}

export const targetBenefits: TargetBenefit[] = [
  {
    title: "Buduje dôveru",
    text: "papagáj sa učí, že tréning je bezpečný a zábavný pretože je pre papagája zaujímavý a tak zabraňuje nude.",
  },
  {
    title: "Pomáha pri výcviku lietania",
    text: "dá sa využiť na trénovanie návratu na ruku alebo na miesto.",
  },
  {
    title: "Zjednodušuje manipuláciu",
    text: "ak potrebuješ papagája presunúť, vieš ho nasmerovať targetom na požadované miesto.",
  },
];
