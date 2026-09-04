// Obsah konzultačného modalu.
//
//  [WEB] = prevzaté doslovne alebo parafrázované z volnekridla.sk
//
// Ceny balíkov "Základná konzultácia" (60 €) a "Komplexná podpora" (90 €)
// zatiaľ nie sú na živom webe uvedené číselne — prevzaté z dodanej vizuálnej
// makety modalu. Cena kurzu (340 €) je priamo z volnekridla.sk.

export interface ConsultType {
  id: string;
  title: string;
  desc: string;
}

export interface ConsultPackage {
  id: string;
  title: string;
  subtitle?: string;
  price: string;
  badge?: string;
  points: string[];
}

/* ---- vetvy (Pre svojho papagája hľadám) ------------------------------ [WEB] */

export const TRACKS = [
  { id: "konzultacia", label: "Konzultácie" },
  { id: "kurz", label: "Kurz voľného lietania" },
] as const;
export type TrackId = (typeof TRACKS)[number]["id"];

/* ---- Mám záujem o ----------------------------------------------------- [WEB] */

export const CONSULT_TYPES: ConsultType[] = [
  {
    id: "online",
    title: "Online konzultácia",
    desc: "Riešenie správania a tréningu cez video hovor. Spoločne prejdeme konkrétne problémy a situácie z bežného dňa a nastavíme postup, ktorý viete okamžite aplikovať.",
  },
  {
    id: "osobna",
    title: "Osobná konzultácia",
    desc: "Riešenie správania a tréningu na osobnom stretnutí. Papagája priamo pozorujeme a nastavíme postup, ktorý budete aplikovať pri jeho tréningu.",
  },
];

/* ---- Vyberám si balíček ------------------------------------------------------ */

export const PACKAGES: Record<TrackId, ConsultPackage[]> = {
  konzultacia: [
    {
      id: "basic",
      title: "Základná konzultácia",
      subtitle: "Základný balík",
      price: "60 €",
      points: [
        "1x osobné stretnutie",
        "WhatsApp podpora na 1 mesiac",
        "Osobné pozorovanie papagája",
        "Práca priamo v praxi",
        "Vysvetlenie správania naživo",
        "Odporúčania pre domáci tréning",
      ],
    },
    {
      id: "premium",
      title: "Komplexná podpora",
      subtitle: "Rozšírený balík",
      badge: "Najčastejšia voľba",
      price: "90 €",
      points: [
        "2x osobné stretnutie",
        "WhatsApp podpora na 2 mesiace",
        "Individuálna práca s papagájom",
        "Sledovanie pokroku",
        "Úprava tréningu podľa reakcií",
        "Detailnejšie vedenie človeka",
      ],
    },
  ],
  kurz: [
    {
      id: "kurz",
      title: "Kurz voľného lietania",
      price: "340 €", // [WEB]
      points: [
        "Vedenie od základov po prvý voľný let",
        "Vysvetlenie myslenia papagája", // [WEB]
        "Budovanie spoľahlivého privolania (recall)", // [WEB]
        "Príprava papagája na rôzne situácie", // [WEB]
        "Mesačná WhatsApp podpora počas tréningu", // [WEB]
      ],
    },
  ],
};

/* ---- krok 2: údaje o papagájovi --------------------------------- [WEB] */

export const PARROT_SPECIES = [
  "Ara",
  "Žako",
  "Kakadu",
  "Aratinga",
  "Amazoňan",
  "Iné",
];

export const PARROT_TOPICS = [
  "Výcvik",
  "Správanie",
  "Lietanie",
  "Strava",
  "Iné",
];

/* ---- GDPR ------------------------------------------------------------ [WEB] */

// split so the middle phrase can be rendered as an accent-colored link that
// reveals GDPR_TEXT, instead of a separate "show/hide" toggle button
export const CONSENT_PREFIX = "Súhlasím so ";
export const CONSENT_LINK_TEXT = "spracovaním osobných údajov";
export const CONSENT_SUFFIX =
  " za účelom kontaktovania a realizácie konzultácie.";

export const GDPR_TEXT =
  "Odoslaním formulára beriete na vedomie, že poskytnuté osobné údaje (meno, kontaktné údaje a informácie uvedené v dotazníku) budú spracované výlučne za účelom kontaktovania, prípravy a realizácie individuálnej konzultácie. Údaje nie sú poskytované tretím stranám a sú uchovávané len po dobu nevyhnutnú na realizáciu konzultácie a následnej komunikácie. Máte právo na prístup k svojim údajom, ich úpravu alebo vymazanie.";
