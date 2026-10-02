import type { Metadata } from "next";
import BlogsPage from "./BlogsPage";

interface SEOPage {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

async function getBlogsSEO(): Promise<SEOPage | null> {
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

    if (!data.success || !data.settings?.blogs) {
      return null;
    }

    return data.settings.blogs;
  } catch (error) {
    console.error("Fetch blogs SEO error:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getBlogsSEO();

  return {
    title: seo?.metaTitle || "Welding Blogs",

    description:
      seo?.metaDescription ||
      "Explore welding tips, training information, career guidance, certification advice and industry insights from Singh Welding & Skills Development Centre.",

    keywords:
      seo?.keywords?.length
        ? seo.keywords
        : [
            "welding blogs",
            "welding tips",
            "welding training",
            "welding career",
            "welding certification",
            "welder career guidance",
            "welding industry insights",
            "welding training Punjab",
            "welding training Phagwara",
            "SWSDC blogs",
          ],
  };
}

export default function Page() {
  return <BlogsPage />;
}