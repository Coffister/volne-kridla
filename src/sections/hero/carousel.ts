import carouselItem2 from "@/assets/carousel/frankapapagaje.webp";


export interface CarouselImage {
    id: string;
    src: string;
    alt: string;
}

export const heroCarouselImages: CarouselImage[] = [
    {
        id: "papagaj-2",
        src: carouselItem2,
        alt: "Franka kŕmi červenú aru, ďalšia ara jej sedí na pleci",
    },
];
