"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/src/services/bookingService";

export type GalleryImage = {
  id: string;
  image: string;
  description: string | null;
  category: string;
};

export function useGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/gallery`);
        const data = await res.json();
        setImages(data.images || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { images, loading };
}