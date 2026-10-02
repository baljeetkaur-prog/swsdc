"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "./BlogsPage.css";

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
}
function BlogSkeleton() {
  return (
    <div className="blogs-grid blogs-skeleton-grid">
      {Array.from({ length: 4 }).map((_, index) => (
        <article className="blog-card blog-skeleton-card" key={index}>
          {/* Image Skeleton */}
          <div className="blog-card-image blog-skeleton-image">
            <div className="skeleton-shimmer" />
          </div>

          {/* Content Skeleton */}
          <div className="blog-card-content">
            <div className="blog-skeleton-meta">
              <div className="skeleton-shimmer skeleton-meta-line" />
              <div className="skeleton-shimmer skeleton-meta-small" />
            </div>

            <div className="skeleton-shimmer skeleton-title-line" />
            <div className="skeleton-shimmer skeleton-title-line skeleton-title-short" />

            <div className="blog-skeleton-description">
              <div className="skeleton-shimmer skeleton-description-line" />
              <div className="skeleton-shimmer skeleton-description-line" />
              <div className="skeleton-shimmer skeleton-description-short" />
            </div>

            <div className="skeleton-shimmer skeleton-read-more" />
          </div>
        </article>
      ))}
    </div>
  );
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/blogs");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch blogs"
        );
      }

      setBlogs(data.blogs || []);
    } catch (error) {
      console.error("Fetch blogs error:", error);
      setError("Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  }

  // Get unique categories
  const categories = useMemo(() => {
    const categorySet = new Set(
      blogs.map((blog) => blog.category.trim())
    );

    return Array.from(categorySet).sort();
  }, [blogs]);

  // Get recent blogs
  const recentBlogs = useMemo(() => {
    return [...blogs]
      .sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
      )
      .slice(0, 5);
  }, [blogs]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();

    blogs.forEach((blog) => {
      blog.tags.forEach((tag) => {
        if (tag.trim()) {
          tagSet.add(tag.trim());
        }
      });
    });

    return Array.from(tagSet);
  }, [blogs]);

  // Filter blogs
  const filteredBlogs = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return blogs.filter((blog) => {
      const matchesCategory =
        selectedCategory === "All" ||
        blog.category.toLowerCase() ===
          selectedCategory.toLowerCase();

      const matchesSearch =
        !searchValue ||
        blog.blogName.toLowerCase().includes(searchValue) ||
        blog.shortDescription
          .toLowerCase()
          .includes(searchValue) ||
        blog.category.toLowerCase().includes(searchValue) ||
        blog.tags.some((tag) =>
          tag.toLowerCase().includes(searchValue)
        );

      return matchesCategory && matchesSearch;
    });
  }, [blogs, search, selectedCategory]);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <main className="blogs-page">
      {/* =========================
          BANNER
      ========================= */}

      <section className="blogs-banner">
        <div className="blogs-banner-content">
          <h1>Blogs</h1>

          <div className="blogs-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Blogs</span>
          </div>
        </div>
      </section>

      {/* =========================
          BLOG SECTION
      ========================= */}

      <section className="blogs-section">
        <div className="blogs-container">
          <div className="blogs-layout">

            {/* =========================
                LEFT - BLOGS
            ========================= */}

            <div className="blogs-main">

            {loading ? (
  <BlogSkeleton />
) : error ? (
                <div className="blogs-message blogs-error">
                  {error}
                </div>
              ) : filteredBlogs.length === 0 ? (
                <div className="blogs-message">
                  <h3>No blogs found</h3>

                  <p>
                    {search || selectedCategory !== "All"
                      ? "Try changing your search or category."
                      : "No blogs have been published yet."}
                  </p>
                </div>
              ) : (
                <div className="blogs-grid">
                  {filteredBlogs.map((blog) => (
                    <article
                      className="blog-card"
                      key={blog._id}
                    >
                      {/* Image */}

                      <Link
                        href={`/blogs/${blog.slug}`}
                        className="blog-card-image-link"
                      >
                        <div className="blog-card-image">
                          <Image
                            src={blog.image}
                            alt={blog.blogName}
                            width={700}
                            height={450}
                          />
                        </div>
                      </Link>

                      {/* Content */}

                      <div className="blog-card-content">

                        <div className="blog-card-meta">
                          <span>
                            {blog.category}
                          </span>

                          <span className="blog-meta-divider">
                            •
                          </span>

                          <span>
                            {formatDate(blog.date)}
                          </span>
                        </div>

                        <h2>
                          <Link
                            href={`/blogs/${blog.slug}`}
                          >
                            {blog.blogName}
                          </Link>
                        </h2>

                        <p>
                          {blog.shortDescription}
                        </p>

                        <Link
                          href={`/blogs/${blog.slug}`}
                          className="blog-read-more"
                        >
                          Read More
                          <span>→</span>
                        </Link>

                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* =========================
                RIGHT - SIDEBAR
            ========================= */}

            <aside className="blogs-sidebar">

              {/* Search */}

              <div className="blog-sidebar-box">
                <h3>Search</h3>

                <div className="blog-search">
                  <input
                    type="text"
                    placeholder="Search blogs..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                  />

                  <span className="blog-search-icon">
                    ⌕
                  </span>
                </div>
              </div>

              {/* Categories */}

              <div className="blog-sidebar-box">
                <h3>Categories</h3>

                <div className="blog-categories">

                  <button
                    type="button"
                    className={
                      selectedCategory === "All"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setSelectedCategory("All")
                    }
                  >
                    <span>All</span>
                    <span>{blogs.length}</span>
                  </button>

                  {categories.map((category) => {
                    const count = blogs.filter(
                      (blog) =>
                        blog.category.toLowerCase() ===
                        category.toLowerCase()
                    ).length;

                    return (
                      <button
                        type="button"
                        key={category}
                        className={
                          selectedCategory === category
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          setSelectedCategory(category)
                        }
                      >
                        <span>{category}</span>
                        <span>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recent Blogs */}

              <div className="blog-sidebar-box">
                <h3>Recent Blogs</h3>

                <div className="recent-blogs">

                  {recentBlogs.map((blog) => (
                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="recent-blog"
                      key={blog._id}
                    >
                      <div className="recent-blog-image">
                        <Image
                          src={blog.image}
                          alt={blog.blogName}
                          width={150}
                          height={100}
                        />
                      </div>

                      <div className="recent-blog-content">
                        <h4>{blog.blogName}</h4>

                        <span>
                          {formatDate(blog.date)}
                        </span>
                      </div>
                    </Link>
                  ))}

                  {recentBlogs.length === 0 && (
                    <p className="sidebar-empty">
                      No recent blogs.
                    </p>
                  )}

                </div>
              </div>

              {/* Tags */}

              <div className="blog-sidebar-box">
                <h3>Tags</h3>

                <div className="blog-tags">

                  {allTags.length > 0 ? (
                    allTags.map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() =>
                          setSearch(tag)
                        }
                      >
                        {tag}
                      </button>
                    ))
                  ) : (
                    <p className="sidebar-empty">
                      No tags available.
                    </p>
                  )}

                </div>
              </div>

            </aside>

          </div>
        </div>
      </section>
    </main>
  );
}