import { Navigate, useParams } from "react-router-dom";

import Album from "@/sections/fotogaleria/Album";
import { site } from "@/content";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

export default function FotogaleriaAlbum() {
  const { slug } = useParams();
  const album = site.albums.find((a) => a.slug === slug);

  useDocumentMeta({
    title: album ? `${album.title} — Fotogaléria` : "Fotogaléria",
    description:
      album?.description ||
      "Fotografie zo spoločnej akcie voľného lietania s papagájmi a ich majiteľmi.",
    path: `/fotogaleria/${slug ?? ""}`,
    image: album?.cover || undefined,
  });

  // unknown or since-hidden album: the gallery is the closest useful page
  if (!album) return <Navigate to="/fotogaleria" replace />;
  return <Album album={album} />;
}
