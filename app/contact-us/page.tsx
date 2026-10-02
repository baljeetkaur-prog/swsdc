import type { Metadata } from "next";
import ContactPage from "./ContactPage";

interface SEOPage {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

async function getContactSEO(): Promise<SEOPage | null> {
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

    if (!data.success || !data.settings?.contact) {
      return null;
    }

    return data.settings.contact;
  } catch (error) {
    console.error("Fetch contact SEO error:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getContactSEO();

  return {
    title: seo?.metaTitle || "Contact Us",

    description:
      seo?.metaDescription ||
      "Contact Singh Welding & Skills Development Centre for welding courses, professional training, certification programs and other enquiries.",

    keywords:
      seo?.keywords?.length
        ? seo.keywords
        : [
            "contact welding institute",
            "welding training contact",
            "welding courses contact",
            "SWSDC contact",
            "Singh Welding contact",
            "welding training Punjab",
            "welding training Phagwara",
            "welding certification",
          ],
  };
}

export default function Contact() {
  return <ContactPage />;
}