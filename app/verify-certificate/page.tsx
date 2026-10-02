import type { Metadata } from "next";
import Verify from "./Verify";

interface SEOPage {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

async function getVerifyCertificateSEO(): Promise<SEOPage | null> {
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

    if (!data.success || !data.settings?.verifyCertificate) {
      return null;
    }

    return data.settings.verifyCertificate;
  } catch (error) {
    console.error("Fetch verify certificate SEO error:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getVerifyCertificateSEO();

  return {
    title: seo?.metaTitle || "Verify Certificate",

    description:
      seo?.metaDescription ||
      "Verify your welding training certificate issued by Singh Welding & Skills Development Centre using your certificate number.",

    keywords:
      seo?.keywords?.length
        ? seo.keywords
        : [
            "verify welding certificate",
            "welding certificate verification",
            "certificate verification",
            "welding certification",
            "SWSDC certificate verification",
            "Singh Welding certificate",
            "welder certificate verification",
            "welding training certificate",
          ],
  };
}

export default function Page() {
  return <Verify />;
}