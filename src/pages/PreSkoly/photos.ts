// PLACEHOLDER fotky — budú vymenené za finálne (s overeným súhlasom na
// zverejnenie detí). Pri výmene stačí prepísať importy nižšie.
import prednaska from "@/assets/pre-skoly/prednaska.webp";
import triedaSkupina from "@/assets/pre-skoly/trieda-skupina.webp";
import frankaAra from "@/assets/pre-skoly/franka-ara.webp";
import materskaSkola from "@/assets/pre-skoly/materska-skola.webp";

export interface PreSkolyPhoto {
  id: string;
  src: string;
  alt: string;
}

export const preSkolyPhotos = {
  frankaAra: {
    id: "franka-ara",
    src: frankaAra,
    alt: "Franka s papagájom ara počas prezentácie v triede",
  },
  prednaska: {
    id: "prednaska",
    src: prednaska,
    alt: "Prednáška o riadenej strave papagájov pre dospelé publikum",
  },
  triedaSkupina: {
    id: "trieda-skupina",
    src: triedaSkupina,
    alt: "Skupina školákov s papagájom ara po prezentácii",
  },
  materskaSkola: {
    id: "materska-skola",
    src: materskaSkola,
    alt: "Papagáj roztiahne krídla pred deťmi v materskej škole",
  },
} satisfies Record<string, PreSkolyPhoto>;
