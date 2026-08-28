import img1 from "@/assets/fotogaleria/Frame-29.png";
import img2 from "@/assets/fotogaleria/IMG_0199-2-1.png";
import img3 from "@/assets/fotogaleria/Rectangle-638.webp";
import img4 from "@/assets/fotogaleria/Rectangle-637.png";
import img5 from "@/assets/fotogaleria/Frame-16.png";
import img6 from "@/assets/fotogaleria/obrazok_2025-08-28_124825479.png";
import img7 from "@/assets/fotogaleria/obrazok_2025-08-28_112425928.png";
import img8 from "@/assets/fotogaleria/Obrazok-WhatsApp-2025-10-17-o-11.14.36_15c8d8f1.webp";
import img9 from "@/assets/fotogaleria/obrazok_2025-10-14_232557454.png";
import img10 from "@/assets/fotogaleria/IMG_8043.webp";
import img11 from "@/assets/fotogaleria/33522a32-d2bf-4703-8ebb-40d4f72b2be9.webp";
import img12 from "@/assets/fotogaleria/obrazok_2025-10-09_210924895.png";
import img13 from "@/assets/fotogaleria/IMG_0199-8.webp";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

export const galleryImages: GalleryImage[] = [
  { id: "foto-1", src: img1, alt: "Papagáje voľných krídel" },
  { id: "foto-2", src: img2, alt: "Ara pri voľnom lete" },
  { id: "foto-3", src: img3, alt: "Papagáj na ruke v prírode" },
  { id: "foto-4", src: img4, alt: "Ara ararauna zblízka" },
  { id: "foto-5", src: img5, alt: "Franka s papagájmi" },
  { id: "foto-6", src: img6, alt: "Papagáj počas tréningu" },
  { id: "foto-7", src: img7, alt: "Voľný let papagája nad poľom" },
  { id: "foto-8", src: img8, alt: "Papagáje na stojane vonku" },
  { id: "foto-9", src: img9, alt: "Ara pri pristávaní" },
  { id: "foto-10", src: img10, alt: "Papagáje v záhrade pri voliére" },
  { id: "foto-11", src: img11, alt: "Franka s mladými papagájmi" },
  { id: "foto-12", src: img12, alt: "Dvojica ár na stojane v poli" },
  { id: "foto-13", src: img13, alt: "Papagáj s roztiahnutými krídlami" },
];
