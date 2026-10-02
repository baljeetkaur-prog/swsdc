import type { Metadata } from "next";
import BlogDetail from "./BlogDetail";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface Blog {
  _id: string;
  blogName: string;
  slug: string;

  image: string;
  imagePublicId: string;

  metaTitle: string;
  metaDescription: string;

  keywords: string[];

  shortDescription: string;

  date: string;

  category: string;
  tags: string[];

  content: string;

  createdAt: string;
  updatedAt: string;
}

/*
|--------------------------------------------------------------------------
| Fetch Blog
|--------------------------------------------------------------------------
*/

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const response = await fetch(
      `${baseUrl}/api/blogs/${encodeURIComponent(slug)}`,
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

    if (!data.success || !data.blog) {
      return null;
    }

    return data.blog;
  } catch (error) {
    console.error("Fetch blog error:", error);
    return null;
  }
}

/*
|--------------------------------------------------------------------------
| Metadata
|--------------------------------------------------------------------------
*/

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
      description:
        "The requested blog could not be found at Singh Welding & Skills Development Centre.",
    };
  }

  const title = blog.metaTitle || blog.blogName;

  const description =
    blog.metaDescription ||
    blog.shortDescription ||
    `Read ${blog.blogName} from Singh Welding & Skills Development Centre.`;

  return {
    title,
    description,

    keywords: blog.keywords || [],

    openGraph: {
      title,
      description,
      type: "article",
      images: blog.image
        ? [
            {
              url: blog.image,
              alt: blog.blogName,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: blog.image ? [blog.image] : [],
    },
  };
}

/*
|--------------------------------------------------------------------------
| Blog Detail Page
|--------------------------------------------------------------------------
*/

export default async function BlogDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;

  /*
   * Fetch blog BEFORE rendering the detail page.
   */
  const blog = await getBlog(slug);

  /*
   * If blog does not exist, show Next.js 404 page.
   */
  if (!blog) {
    notFound();
  }

  /*
   * Pass already-fetched blog data to the client component.
   *
   * This means BlogDetail does NOT need to fetch the
   * main blog again on the client.
   */
  return <BlogDetail slug={slug} initialBlog={blog} />;
}