import type { Metadata } from "next";
import About from "./components/About";
import AboutSection from "./components/AboutSection";
import BrandsSection from "./components/BrandsSection";
import CoursesSection from "./components/CoursesSection";
import CtaSection from "./components/CtaSection";
import Figures from "./components/Figures";
import GallerySection from "./components/GallerySection";
import HighlightSection from "./components/HighlightSection";
import ReviewsSection from "./components/ReviewsSection";
import ServicesSection from "./components/ServicesSection";

interface SEOPage {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

async function getHomeSEO(): Promise<SEOPage | null> {
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

    if (!data.success || !data.settings?.home) {
      return null;
    }

    return data.settings.home;
  } catch (error) {
    console.error("Fetch home SEO error:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getHomeSEO();

  return {
    title:
      seo?.metaTitle ||
      "Welding Training & Certification Centre",

    description:
      seo?.metaDescription ||
      "Singh Welding & Skills Development Centre offers professional welding training, practical courses and certification programs for aspiring welders.",

    keywords:
      seo?.keywords?.length
        ? seo.keywords
        : [
            "welding training",
            "welding courses",
            "welding certification",
            "welder training",
            "welding institute Punjab",
            "welding training Phagwara",
            "welding skills development",
            "SWSDC",
          ],
  };
}

export default function Home() {
  return (
    <main>
      <AboutSection />
      <GallerySection />
      <CoursesSection />
      <ServicesSection />
      <BrandsSection />
      <HighlightSection />
      <About />
      <ReviewsSection />
      <CtaSection />
    </main>
  );
}