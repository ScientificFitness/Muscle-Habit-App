import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Muscle Habit",
    short_name: "Muscle Habit",
    description: "Adaptive fitness coaching for busy professionals.",
    start_url: "/planner/dashboard",
    display: "standalone",
    background_color: "#F3F6F9",
    theme_color: "#2B3B4C",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
