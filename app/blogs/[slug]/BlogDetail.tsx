"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "./BlogDetail.css";

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

interface BlogDetailProps {
  slug: string;
  initialBlog: Blog;
}

/*
|--------------------------------------------------------------------------
| Blog Detail Skeleton
|--------------------------------------------------------------------------
|
| This is no longer required for the main blog because the blog
| is fetched on the server before this component renders.
|
| We are keeping this function here in case you want to use
| it somewhere else later.
|
*/

function BlogDetailSkeleton() {
  return (
    <>
      {/* Main Article Skeleton */}
      <article className="blog-detail-main blog-detail-skeleton-main">
        {/* Featured Image */}
        <div className="blog-detail-image blog-skeleton-image">
          <div className="blog-skeleton-shimmer" />
        </div>

        {/* Meta */}
        <div className="blog-skeleton-meta">
          <div className="blog-skeleton-shimmer blog-skeleton-category" />
          <div className="blog-skeleton-shimmer blog-skeleton-divider" />
          <div className="blog-skeleton-shimmer blog-skeleton-date" />
        </div>

        {/* Title */}
        <div className="blog-skeleton-shimmer blog-skeleton-title" />

        <div className="blog-skeleton-shimmer blog-skeleton-title blog-skeleton-title-short" />

        {/* Intro */}
        <div className="blog-skeleton-intro">
          <div className="blog-skeleton-shimmer blog-skeleton-intro-line" />
          <div className="blog-skeleton-shimmer blog-skeleton-intro-line" />
          <div className="blog-skeleton-shimmer blog-skeleton-intro-line blog-skeleton-intro-short" />
        </div>

        {/* Content */}
        <div className="blog-skeleton-content">
          <div className="blog-skeleton-shimmer blog-skeleton-content-line" />
          <div className="blog-skeleton-shimmer blog-skeleton-content-line" />
          <div className="blog-skeleton-shimmer blog-skeleton-content-line" />
          <div className="blog-skeleton-shimmer blog-skeleton-content-line blog-skeleton-content-short" />

          <div className="blog-skeleton-shimmer blog-skeleton-content-heading" />

          <div className="blog-skeleton-shimmer blog-skeleton-content-line" />
          <div className="blog-skeleton-shimmer blog-skeleton-content-line" />
          <div className="blog-skeleton-shimmer blog-skeleton-content-line" />
          <div className="blog-skeleton-shimmer blog-skeleton-content-line blog-skeleton-content-short" />
        </div>
      </article>

      {/* Sidebar Skeleton */}
      <aside className="blog-detail-sidebar">
        <div className="blog-detail-sidebar-box">
          <div className="blog-skeleton-shimmer blog-skeleton-sidebar-heading" />

          <div className="blog-detail-recent blog-skeleton-recent">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                className="blog-detail-recent-item"
                key={index}
              >
                <div className="blog-detail-recent-image blog-skeleton-recent-image">
                  <div className="blog-skeleton-shimmer" />
                </div>

                <div className="blog-detail-recent-content">
                  <div className="blog-skeleton-shimmer blog-skeleton-recent-title" />
                  <div className="blog-skeleton-shimmer blog-skeleton-recent-title-short" />
                  <div className="blog-skeleton-shimmer blog-skeleton-recent-date" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Skeleton */}
        <div className="blog-detail-sidebar-box">
          <div className="blog-skeleton-shimmer blog-skeleton-sidebar-heading" />

          <div className="blog-skeleton-shimmer blog-skeleton-category-box" />
        </div>

        {/* Keywords Skeleton */}
        <div className="blog-detail-sidebar-box">
          <div className="blog-skeleton-shimmer blog-skeleton-sidebar-heading" />

          <div className="blog-skeleton-keywords">
            <div className="blog-skeleton-shimmer blog-skeleton-keyword" />
            <div className="blog-skeleton-shimmer blog-skeleton-keyword" />
            <div className="blog-skeleton-shimmer blog-skeleton-keyword-small" />
            <div className="blog-skeleton-shimmer blog-skeleton-keyword" />
          </div>
        </div>
      </aside>
    </>
  );
}

export default function BlogDetail({
  slug,
  initialBlog,
}: BlogDetailProps) {
  /*
   * Blog is already fetched on the server.
   *
   * So there is NO loading state for the main blog
   * and NO second API request for the blog.
   */
  const [blog] = useState<Blog>(initialBlog);

  /*
   * Recent blogs are still fetched separately because
   * they are sidebar content and don't need to block
   * the main blog from rendering.
   */
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetchRecentBlogs();
  }, [slug]);

  /*
  |--------------------------------------------------------------------------
  | Fetch Recent Blogs
  |--------------------------------------------------------------------------
  */

  async function fetchRecentBlogs() {
    try {
      const response = await fetch("/api/blogs");

      const data = await response.json();

      if (!response.ok) {
        return;
      }

      const blogs: Blog[] = data.blogs || [];

      const filtered = blogs
        .filter((item) => item.slug !== slug)
        .sort(
          (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
        )
        .slice(0, 5);

      setRecentBlogs(filtered);
    } catch (error) {
      console.error(
        "Fetch recent blogs error:",
        error
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Format Date
  |--------------------------------------------------------------------------
  */

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Blog Detail
  |--------------------------------------------------------------------------
  */

  return (
    <main className="blog-detail-page">

      {/* =========================
          BANNER
      ========================= */}

      <section className="blog-detail-banner">
        <div className="blog-detail-banner-content">

          <h1>Blog Details</h1>

          <div className="blog-detail-breadcrumb">

            <Link href="/">
              Home
            </Link>

            <span>/</span>

            <Link href="/blogs">
              Blogs
            </Link>

            <span>/</span>

            <span>
              {blog.blogName}
            </span>

          </div>

        </div>
      </section>

      {/* =========================
          BLOG DETAIL
      ========================= */}

      <section className="blog-detail-section">

        <div className="blog-detail-container">

          <div className="blog-detail-layout">

            {/* =========================
                MAIN ARTICLE
            ========================= */}

            <article className="blog-detail-main">

              {/* Featured Image */}

              <div className="blog-detail-image">

                <Image
                  src={blog.image}
                  alt={blog.blogName}
                  width={1000}
                  height={600}
                  priority
                />

              </div>

              {/* Meta */}

              <div className="blog-detail-meta">

                <span className="blog-detail-category">
                  {blog.category}
                </span>

                <span className="blog-detail-divider">
                  •
                </span>

                <span>
                  {formatDate(blog.date)}
                </span>

              </div>

              {/* Title */}

              <h2 className="blog-detail-title">
                {blog.blogName}
              </h2>

              {/* Short Description */}

              <p className="blog-detail-intro">
                {blog.shortDescription}
              </p>

              {/* Content */}

              <div
                className="blog-detail-content"
                dangerouslySetInnerHTML={{
                  __html: blog.content,
                }}
              />

              {/* Tags */}

              {blog.tags.length > 0 && (
                <div className="blog-detail-tags-section">

                  <h3>
                    Tags
                  </h3>

                  <div className="blog-detail-tags">

                    {blog.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blogs?search=${encodeURIComponent(
                          tag
                        )}`}
                      >
                        {tag}
                      </Link>
                    ))}

                  </div>

                </div>
              )}

            </article>

            {/* =========================
                SIDEBAR
            ========================= */}

            <aside className="blog-detail-sidebar">

              {/* =========================
                  Recent Blogs
              ========================= */}

              <div className="blog-detail-sidebar-box">

                <h3>
                  Recent Blogs
                </h3>

                <div className="blog-detail-recent">

                  {recentBlogs.map((recentBlog) => (

                    <Link
                      key={recentBlog._id}
                      href={`/blogs/${recentBlog.slug}`}
                      className="blog-detail-recent-item"
                    >

                      <div className="blog-detail-recent-image">

                        <Image
                          src={recentBlog.image}
                          alt={recentBlog.blogName}
                          width={150}
                          height={100}
                        />

                      </div>

                      <div className="blog-detail-recent-content">

                        <h4>
                          {recentBlog.blogName}
                        </h4>

                        <span>
                          {formatDate(
                            recentBlog.date
                          )}
                        </span>

                      </div>

                    </Link>

                  ))}

                  {recentBlogs.length === 0 && (
                    <p className="blog-detail-empty">
                      No recent blogs.
                    </p>
                  )}

                </div>

              </div>

              {/* =========================
                  Category
              ========================= */}

              <div className="blog-detail-sidebar-box">

                <h3>
                  Category
                </h3>

                <Link
                  href={`/blogs?category=${encodeURIComponent(
                    blog.category
                  )}`}
                  className="blog-detail-category-link"
                >
                  {blog.category}
                </Link>

              </div>

              {/* =========================
                  Keywords
              ========================= */}

              {blog.keywords.length > 0 && (
                <div className="blog-detail-sidebar-box">

                  <h3>
                    Keywords
                  </h3>

                  <div className="blog-detail-keywords">

                    {blog.keywords.map((keyword) => (
                      <span key={keyword}>
                        {keyword}
                      </span>
                    ))}

                  </div>

                </div>
              )}

            </aside>

          </div>

        </div>

      </section>

    </main>
  );
}