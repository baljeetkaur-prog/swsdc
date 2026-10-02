import type { Metadata } from "next";
import Gallery from "./Gallery";

interface SEOPage {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

async function getGallerySEO(): Promise<SEOPage | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/seo-settings`, {
      next: {
        revalidate: 60,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data.success || !data.settings?.gallery) {
      return null;
    }

    return data.settings.gallery;
  } catch (error) {
    console.error("Fetch gallery SEO error:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getGallerySEO();

  return {
    title: seo?.metaTitle || "Gallery",

    description:
      seo?.metaDescription ||
      "Explore photos and videos from Singh Welding & Skills Development Centre, featuring welding training, practical sessions, workshops and student activities.",

    keywords:
      seo?.keywords?.length
        ? seo.keywords
        : [
            "welding gallery",
            "welding training photos",
            "welding training videos",
            "welding institute gallery",
            "welding workshop photos",
            "welding students",
            "SWSDC gallery",
            "Singh Welding gallery",
          ],
  };
}

export default function GalleryPage() {
  return <Gallery />;
}