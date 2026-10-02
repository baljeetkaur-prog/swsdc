import type { Metadata } from "next";
import CourseDetail from "./CourseDetail";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface Course {
  _id: string;
  courseName: string;
  category: string;
  duration: string;
  keyFeatures: string[];
  description: string;

  curriculum: {
    number: string;
    title: string;
  }[];

  mentor: {
    name: string;
    designation: string;
    about: string;
    image: string;
  };

  thumbnail: string;
  video: string;
  slug: string;
}

async function getCourse(slug: string): Promise<Course | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const response = await fetch(
      `${baseUrl}/api/courses/slug/${encodeURIComponent(slug)}`,
      {
        next: {
          revalidate: 60,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data.success || !data.course) {
      return null;
    }

    return data.course;
  } catch (error) {
    console.error("Fetch course error:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const course = await getCourse(slug);

  if (!course) {
    return {
      title: "Course Not Found",
      description:
        "The requested welding course could not be found at Singh Welding & Skills Development Centre.",
    };
  }

  const title = `${course.courseName} - Welding Course`;

  const description =
    course.description ||
    `Learn ${course.courseName} at Singh Welding & Skills Development Centre with practical, industry-focused welding training.`;

  return {
    title,
    description,

    keywords: [
      course.courseName,
      `${course.courseName} course`,
      `${course.courseName} training`,
      "welding course",
      "welding training",
      "welder training",
      "welding certification",
      "welding training Punjab",
      "welding training Phagwara",
      course.category,
      "SWSDC",
    ],

    openGraph: {
      title,
      description,
      type: "website",
      images: course.thumbnail
        ? [
            {
              url: course.thumbnail,
              alt: course.courseName,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: course.thumbnail ? [course.thumbnail] : [],
    },
  };
}

export default async function CourseDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const course = await getCourse(slug);

  if (!course) {
    return null;
  }

  return <CourseDetail course={course} />;
}