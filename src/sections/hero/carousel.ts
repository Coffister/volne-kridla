import carouselItem1 from "@/assets/carousel/volnekridlafoto.webp";
import carouselItem2 from "@/assets/carousel/frankapapagaje.webp";
import carouselItem3 from "@/assets/carousel/frankatrening.webp";
import carouselItem4 from "@/assets/carousel/franka.webp";
import carouselItem5 from "@/assets/carousel/rudy.jpg";


export interface CarouselImage {
    id: string;
    src: string;
    alt: string;
}

// no real photography assets yet, reuse the sky placeholder for every slide
export const heroCarouselImages: CarouselImage[] = [
    {
        id: "papagaj-1",
        src: carouselItem1,
        alt: "Placeholder fotografie papagája 1",
    },
    {
        id: "papagaj-2",
        src: carouselItem2,
        alt: "Placeholder fotografie papagája 2",
    },
    {
        id: "papagaj-3",
        src: carouselItem3,
        alt: "Placeholder fotografie papagája 3",
    },
        {
        id: "papagaj-4",
        src: carouselItem4,
        alt: "Placeholder fotografie papagája 4",
    },
        {
        id: "papagaj-5",
        src: carouselItem5,
        alt: "Placeholder fotografie papagája 5",
    },
];
