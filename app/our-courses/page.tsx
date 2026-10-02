import type { Metadata } from "next";
import OurCourses from "./OurCourses";

interface SEOPage {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

async function getCoursesSEO(): Promise<SEOPage | null> {
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

    if (!data.success || !data.settings?.courses) {
      return null;
    }

    return data.settings.courses;
  } catch (error) {
    console.error("Fetch courses SEO error:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getCoursesSEO();

  return {
    title: seo?.metaTitle || "Welding Courses",

    description:
      seo?.metaDescription ||
      "Explore professional welding courses and practical training programs at Singh Welding & Skills Development Centre. Build practical welding skills with industry-focused training.",

    keywords:
      seo?.keywords?.length
        ? seo.keywords
        : [
            "welding courses",
            "welding training",
            "welder training",
            "welding certification courses",
            "welding institute",
            "welding training Punjab",
            "welding training Phagwara",
            "welding skills",
            "SWSDC courses",
          ],
  };
}

export default function Page() {
  return <OurCourses />;
}