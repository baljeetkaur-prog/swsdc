import type { Metadata } from "next";
import AboutPage from "./AboutPage";

interface SEOPage {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

async function getAboutSEO(): Promise<SEOPage | null> {
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

    if (!data.success || !data.settings?.about) {
      return null;
    }

    return data.settings.about;
  } catch (error) {
    console.error("Fetch about SEO error:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getAboutSEO();

  return {
    title:
      seo?.metaTitle ||
      "About Us",

    description:
      seo?.metaDescription ||
      "Learn about Singh Welding & Skills Development Centre, our welding training programs, experienced instructors and commitment to developing skilled welding professionals.",

    keywords:
      seo?.keywords?.length
        ? seo.keywords
        : [
            "about Singh Welding",
            "SWSDC",
            "welding training centre",
            "welding institute",
            "welding training Punjab",
            "welding training Phagwara",
            "welder training",
            "welding skills development",
          ],
  };
}

export default function AboutUsPage() {
  return <AboutPage />;
}