// Obsah pre návrh kontaktného toku.
//
//  [WEB]   = doslovný text z aktuálnej volnekridla.sk
//  [NÁVRH] = doplnil Claude, treba potvrdiť s Frankou (na webe chýba)

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
  note?: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

/* ---- úvod sekcie ------------------------------------------------------ [WEB] */

export const INTRO_HEADING = "Posledný krok k slobode";

export const INTRO_PARAGRAPHS = [
  "Nejde o to, že vám počas pár minút nadiktujem, čo máte robiť. Spolu si vysvetlíme, prečo veci fungujú tak, ako fungujú, aby ste tomu naozaj porozumeli.",
  "Každému papagájovi aj človeku sa venujem individuálne, pretože mi záleží na tom, aby sa veci naozaj posunuli a aby ste videli skutočnú zmenu.",
  "Konzultáciou to však nekončí — súčasťou balíka je aj priebežná WhatsApp podpora, aby sme mohli sledovať, či papagáj napreduje a či pri tréningu nevznikajú kontraproduktívne chyby.",
];

/* ---- vetvy (prepínač na webe) --------------------------------------- [WEB] */

export const TRACKS = [
  { id: "konzultacia", label: "Konzultácia" },
  { id: "kurz", label: "Kurz voľného lietania" },
] as const;
export type TrackId = (typeof TRACKS)[number]["id"];

/* ---- krok 1: spôsob konzultácie ----------------------------------- [WEB] */

export const CONSULT_TYPES: ConsultType[] = [
  {
    id: "online",
    title: "Online konzultácia",
    desc: "Riešenie správania a tréningu cez video hovor. Spoločne prejdeme konkrétne problémy a situácie z bežného dňa a nastavíme postup, ktorý viete okamžite aplikovať. Online forma je plnohodnotná a vo väčšine prípadov postačujúca.",
  },
  {
    id: "osobna",
    title: "Osobná konzultácia",
    desc: "Riešenie správania a tréningu na osobnom stretnutí. Papagája priamo pozorujeme a nastavíme postup, ktorý budete aplikovať pri jeho tréningu.",
  },
];

/* ---- krok 2: balíky --------------------------------------------------------- */
// Názvy Basic/Premium sú z webu; ich obsah tam chýba — nižšie je [NÁVRH].

export const PACKAGES: Record<TrackId, ConsultPackage[]> = {
  konzultacia: [
    {
      id: "basic",
      title: "Basic", // [WEB] názov
      price: "cena podľa dohody",
      points: [
        "Jedna konzultácia (online alebo osobne)",
        "Rozbor jednej konkrétnej témy — správanie, strava, výcvik alebo lietanie",
        "Zhrnutie s konkrétnymi krokmi po stretnutí",
        "1 týždeň WhatsApp podpory na doladenie",
      ],
      note: "[NÁVRH obsahu — potvrdiť]",
    },
    {
      id: "premium",
      title: "Premium", // [WEB] názov
      badge: "Najčastejšia voľba",
      price: "cena podľa dohody",
      points: [
        "Úvodná konzultácia (online alebo osobne)",
        "Kompletné nastavenie — režim dňa, strava, dôvera, tréning",
        "Mesiac priebežnej WhatsApp podpory",
        "Vyhodnocovanie vašich videí a úpravy tréningu za pochodu",
      ],
      note: "[NÁVRH obsahu — potvrdiť]",
    },
  ],
  kurz: [
    {
      id: "kurz",
      title: "Kurz voľného lietania",
      price: "cena podľa dohody",
      points: [
        "Vedenie od základov po prvý voľný let",
        "Režim, strava a budovanie dôvery ako pevný základ",
        "Nácvik trakov a recallu (privolania) krok za krokom",
        "Bezpečný výber miesta a času letu",
        "Priebežné vyhodnocovanie videí počas celého kurzu",
      ],
      note: "[NÁVRH obsahu — potvrdiť]",
    },
  ],
};

/* ---- krok 3: údaje o papagájovi --------------------------------- [WEB] */

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

export const CONSENT_LABEL =
  "Súhlasím so spracovaním osobných údajov za účelom kontaktovania a realizácie konzultácie.";

export const GDPR_TEXT =
  "Odoslaním formulára beriete na vedomie, že poskytnuté osobné údaje (meno, kontaktné údaje a informácie uvedené v dotazníku) budú spracované výlučne za účelom kontaktovania, prípravy a realizácie individuálnej konzultácie. Údaje nie sú poskytované tretím stranám a sú uchovávané len po dobu nevyhnutnú na realizáciu konzultácie a následnej komunikácie. Máte právo na prístup k svojim údajom, ich úpravu alebo vymazanie.";

/* ---- FAQ na koniec toku -------------- [WEB] skrátené z /volne-kridla ------ */

export const FAQ: FaqItem[] = [
  {
    q: "Je voľné lietanie bezpečné?",
    a: "Riziká (počasie, prekážky, dravce, únikový reflex) existujú, ale samy nezmiznú — správnym a postupným tréningom ich výrazne znížime. V kurze vysvetľujem postupy aj riziká, učím recall a bezpečný výber miest a časov letu.",
  },
  {
    q: "Dá sa trénovať aj papagáj, ktorý nie je zvyknutý na traky?",
    a: "Áno. Tréning s trakmi považujem za najbezpečnejší, no dá sa aj bez nich — je o niečo náročnejší a stojí na silnom pute medzi vami a papagájom.",
  },
  {
    q: "V akom veku je najlepšie začať?",
    a: "Na veku až tak nezáleží, učiť sa vie papagáj v každom veku. U mláďat je to prirodzenejšie, u starších často najprv odstraňujeme zlozvyky, takže to môže trvať dlhšie. Podmienkou je, že si nechá nasadiť traky.",
  },
];
