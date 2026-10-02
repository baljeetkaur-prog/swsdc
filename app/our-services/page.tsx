import type { Metadata } from "next";
import ServicesPage from "./ServicesPage";

interface SEOPage {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

async function getServicesSEO(): Promise<SEOPage | null> {
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

    if (!data.success || !data.settings?.services) {
      return null;
    }

    return data.settings.services;
  } catch (error) {
    console.error("Fetch services SEO error:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getServicesSEO();

  return {
    title: seo?.metaTitle || "Welding Services",

    description:
      seo?.metaDescription ||
      "Explore professional welding and fabrication services offered by Singh Welding & Skills Development Centre, with a focus on quality workmanship and industry standards.",

    keywords:
      seo?.keywords?.length
        ? seo.keywords
        : [
            "welding services",
            "welding fabrication",
            "welding work",
            "professional welding services",
            "welding solutions",
            "welder services",
            "welding institute Punjab",
            "welding services Phagwara",
            "SWSDC",
          ],
  };
}

export default function Page() {
  return <ServicesPage />;
}