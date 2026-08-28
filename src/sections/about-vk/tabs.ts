import steps from "@/assets/aboutvk/steps.webp";
import time from "@/assets/aboutvk/clock.webp";
import shield from "@/assets/aboutvk/shield.webp";
import eye from "@/assets/aboutvk/eye.webp";
import love from "@/assets/aboutvk/love.webp";
import treat from "@/assets/aboutvk/treat.webp";

import treningvideo from "@/assets/aboutvk/trening-video.webm";
import treningphoto from "@/assets/aboutvk/treningpapagaja.webp";

export type TabId = "flight" | "training";

export type Benefit = {
  title: string;
  description: string;
  image: string;
};

export type TabConfig = {
  id: TabId;
  label: string;
  tabimage: string;
  imageTitle: string;
  title: string;
  description: string;
  benefits: Benefit[];
  cta: string;
};

export const tabs: TabConfig[] = [
  {
    id: "flight",
    label: "Voľné lietanie",
    tabimage: treningvideo,
    imageTitle: "Tréning nikdy nekončí",
    title: "Prečo učiť papagája lietať?",
    description:
      "Hoci sú papagáje na let stvorené, nevedia ho prirodzene len tak robiť a robiť ho dobre v každom veku. Musia sa to naučiť a správne zvládnuť zručnosti.\n\nLetanie vonku je oveľa odlišné od lietania v interiéri (vietor, rozptyľovanie, dravce, preťaženie podnetmi atď.). A preto je veľmi dôležitý správne vedený tréning.",
    benefits: [
      {
        title: "Začni malými krokmi",
        description: "Najskôr si potrebuje zvyknúť na nové prostredie, traky a základné povely.",
        image: steps,
      },
      {
        title: "Maj trpezlivosť",
        description: "Postupne zvyšuje náročnosť a vzdialenosť.",
        image: time,
      },
      {
        title: "Bezpečie a pokoj",
        description: "Tréning by sa mal vykonávať v tichu a bezpečnej oblasti.",
        image: shield,
      },
    ],
    cta: "Viac o voľnom lete",
  },
  {
    id: "training",
    label: "Tréning",
    tabimage: treningphoto,
    imageTitle: "Tréning pre každého",
    title: "Ako funguje tréning?",
    description:
      "Každý vták potrebuje jasné komunikačné signály, pravidelný rytmus a správne vedenie tréningu. Tým sa zvyšuje jeho sebavedomie a spokojnosť.",
    benefits: [
      {
        title: "Jasné povely",
        description: "Papagáj sa naučí reagovať na jednoduché, opakované signály.",
        image: eye,
      },
      {
        title: "Pravidelnosť",
        description: "Krátke, konzistentné cvičenia prinášajú najlepšie výsledky.",
        image: love,
      },
      {
        title: "Pozitívne posilnenie",
        description: "Nadšenie a istota rastú, keď je tréning príjemný a bezpečný.",
        image: treat,
      },
    ],
    cta: "Zistiť viac o tréningu",
  },
];
