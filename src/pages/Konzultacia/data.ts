// Ukážkový obsah pre návrh kontaktného toku. Reálne balíky a ceny doplní Franka.

export interface ConsultType {
  id: string;
  title: string;
  desc: string;
}

export interface ConsultPackage {
  id: string;
  title: string;
  price: string;
  badge?: string;
  points: string[];
}

export const CONSULT_TYPES: ConsultType[] = [
  {
    id: "online",
    title: "Online konzultácia",
    desc: "Video hovor. Prejdeme konkrétne problémy a situácie z bežného dňa a nastavíme postup, ktorý viete hneď aplikovať. Vo väčšine prípadov plne postačujúca.",
  },
  {
    id: "osobna",
    title: "Osobná konzultácia",
    desc: "Stretnutie naživo. Papagája priamo pozorujeme a nastavíme postup na mieru. Vhodné pri zložitejších situáciách alebo pred prvým voľným letom.",
  },
];

export const CONSULT_PACKAGES: ConsultPackage[] = [
  {
    id: "jednorazova",
    title: "Jednorazová konzultácia",
    price: "od 45 €",
    points: [
      "1 stretnutie, približne 60 minút",
      "Rozbor jedného konkrétneho problému",
      "2 týždne WhatsApp podpory",
    ],
  },
  {
    id: "mesacny",
    title: "Mesačný balík",
    price: "od 120 €",
    badge: "Najčastejšia voľba",
    points: [
      "Úvodná konzultácia",
      "4 týždne priebežnej WhatsApp podpory",
      "Priebežné úpravy tréningu podľa videí",
    ],
  },
  {
    id: "kurz",
    title: "Kurz voľného lietania",
    price: "podľa dohody",
    points: [
      "Kompletné vedenie od základov po voľný let",
      "Individuálne tempo",
      "Priebežné vyhodnocovanie videí",
    ],
  },
];
