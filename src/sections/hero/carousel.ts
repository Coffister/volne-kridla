import carouselItem1 from "@/assets/carousel/volnekridlafoto.webp";
import carouselItem2 from "@/assets/carousel/frankapapagaje.webp";
import carouselItem3 from "@/assets/carousel/frankatrening.webp";
import carouselItem4 from "@/assets/carousel/franka.webp";
import carouselItem5 from "@/assets/carousel/rudy.webp";


export interface CarouselImage {
    id: string;
    src: string;
    alt: string;
}

export const heroCarouselImages: CarouselImage[] = [
    {
        id: "papagaj-1",
        src: carouselItem1,
        alt: "Modro-žltá ara na pleci muža v tričku Voľné krídla na poli",
    },
    {
        id: "papagaj-2",
        src: carouselItem2,
        alt: "Franka kŕmi červenú aru, ďalšia ara jej sedí na pleci",
    },
    {
        id: "papagaj-3",
        src: carouselItem3,
        alt: "Franka s pestrofarebnou arou na ruke počas tréningu",
    },
        {
        id: "papagaj-4",
        src: carouselItem4,
        alt: "Ara prilieta k Franke na ruku pri voľnom lete",
    },
        {
        id: "papagaj-5",
        src: carouselItem5,
        alt: "Červená ara zblízka na pozadí modrej oblohy",
    },
];
