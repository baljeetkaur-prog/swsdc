"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import "./Blogs.css";

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

type DateFilter =
  | "all"
  | "today"
  | "7days"
  | "30days"
  | "year"
  | "custom";

export default function BlogsPage() {
  const router = useRouter();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================================
  // SEARCH
  // ================================

  const [search, setSearch] = useState("");

  // ================================
  // FILTERS
  // ================================

  const [categoryFilter, setCategoryFilter] =
    useState("all");

  const [dateFilter, setDateFilter] =
    useState<DateFilter>("all");

  const [customFromDate, setCustomFromDate] =
    useState("");

  const [customToDate, setCustomToDate] =
    useState("");

  // ================================
  // SORTING
  // ================================

  const [sortOrder, setSortOrder] =
    useState<"latest" | "oldest">("latest");

  // ================================
  // PAGINATION
  // ================================

  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(10);

  // ================================
  // FETCH BLOGS
  // ================================

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/blogs", {
        credentials: "include",
      });

      const data = await response.json();

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch blogs"
        );
      }

      setBlogs(data.blogs || []);
    } catch (error) {
      console.error(
        "Fetch blogs error:",
        error
      );

      setError("Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  }

  // ================================
  // DELETE BLOG
  // ================================

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token =
        localStorage.getItem("adminToken");

      const response = await fetch(
        `/api/blogs/id/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete blog"
        );
      }

      setBlogs((prevBlogs) =>
        prevBlogs.filter(
          (blog) => blog._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete blog error:",
        error
      );

      alert("Failed to delete blog.");
    }
  }

  // ================================
  // UNIQUE CATEGORIES
  // ================================

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        blogs
          .map(
            (blog) =>
              blog.category
          )
          .filter(Boolean)
      )
    ).sort();
  }, [blogs]);

  // ================================
  // SEARCH + FILTER + SORT
  // ================================

  const filteredBlogs = useMemo(() => {
    let result = [...blogs];

    // ----------------
    // Search
    // ----------------

    const searchValue =
      search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter(
        (blog) => {
          const blogName =
            blog.blogName
              ?.toLowerCase() || "";

          const category =
            blog.category
              ?.toLowerCase() || "";

          const slug =
            blog.slug
              ?.toLowerCase() || "";

          const shortDescription =
            blog.shortDescription
              ?.toLowerCase() || "";

          return (
            blogName.includes(
              searchValue
            ) ||
            category.includes(
              searchValue
            ) ||
            slug.includes(
              searchValue
            ) ||
            shortDescription.includes(
              searchValue
            )
          );
        }
      );
    }

    // ----------------
    // Category Filter
    // ----------------

    if (categoryFilter !== "all") {
      result = result.filter(
        (blog) =>
          blog.category ===
          categoryFilter
      );
    }

    // ----------------
    // Date Filter
    // ----------------

    if (dateFilter !== "all") {
      const now = new Date();

      if (dateFilter === "today") {
        const startOfToday =
          new Date(now);

        startOfToday.setHours(
          0,
          0,
          0,
          0
        );

        const endOfToday =
          new Date(now);

        endOfToday.setHours(
          23,
          59,
          59,
          999
        );

        result = result.filter(
          (blog) => {
            const blogDate =
              new Date(blog.date);

            return (
              blogDate >=
                startOfToday &&
              blogDate <=
                endOfToday
            );
          }
        );
      }

      if (dateFilter === "7days") {
        const startDate =
          new Date(now);

        startDate.setDate(
          startDate.getDate() - 7
        );

        startDate.setHours(
          0,
          0,
          0,
          0
        );

        result = result.filter(
          (blog) =>
            new Date(blog.date) >=
            startDate
        );
      }

      if (dateFilter === "30days") {
        const startDate =
          new Date(now);

        startDate.setDate(
          startDate.getDate() - 30
        );

        startDate.setHours(
          0,
          0,
          0,
          0
        );

        result = result.filter(
          (blog) =>
            new Date(blog.date) >=
            startDate
        );
      }

      if (dateFilter === "year") {
        const startOfYear =
          new Date(
            now.getFullYear(),
            0,
            1
          );

        result = result.filter(
          (blog) =>
            new Date(blog.date) >=
            startOfYear
        );
      }

      if (dateFilter === "custom") {
        if (customFromDate) {
          const fromDate =
            new Date(
              `${customFromDate}T00:00:00`
            );

          result = result.filter(
            (blog) =>
              new Date(blog.date) >=
              fromDate
          );
        }

        if (customToDate) {
          const toDate =
            new Date(
              `${customToDate}T23:59:59`
            );

          result = result.filter(
            (blog) =>
              new Date(blog.date) <=
              toDate
          );
        }
      }
    }

    // ----------------
    // Sort
    // ----------------

    result.sort((a, b) => {
      const dateA = new Date(
        a.date
      ).getTime();

      const dateB = new Date(
        b.date
      ).getTime();

      if (sortOrder === "latest") {
        return dateB - dateA;
      }

      return dateA - dateB;
    });

    return result;
  }, [
    blogs,
    search,
    categoryFilter,
    dateFilter,
    customFromDate,
    customToDate,
    sortOrder,
  ]);

  // ================================
  // RESET PAGE WHEN FILTERS CHANGE
  // ================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    categoryFilter,
    dateFilter,
    customFromDate,
    customToDate,
    sortOrder,
    itemsPerPage,
  ]);

  // ================================
  // PAGINATION
  // ================================

  const totalPages = Math.ceil(
    filteredBlogs.length /
      itemsPerPage
  );

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const endIndex =
    startIndex + itemsPerPage;

  const paginatedBlogs =
    filteredBlogs.slice(
      startIndex,
      endIndex
    );

  // ================================
  // KEEP PAGE VALID
  // ================================

  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }

    if (
      totalPages === 0 &&
      currentPage !== 1
    ) {
      setCurrentPage(1);
    }
  }, [
    totalPages,
    currentPage,
  ]);

  // ================================
  // CLEAR FILTERS
  // ================================

  function clearFilters() {
    setSearch("");
    setCategoryFilter("all");
    setDateFilter("all");
    setCustomFromDate("");
    setCustomToDate("");
    setSortOrder("latest");
    setCurrentPage(1);
  }

  const hasActiveFilters =
    search.trim() !== "" ||
    categoryFilter !== "all" ||
    dateFilter !== "all" ||
    customFromDate !== "" ||
    customToDate !== "";

  // ================================
  // PAGINATION NUMBERS
  // ================================

  function getPaginationPages() {
    const pages: (
      number | string
    )[] = [];

    if (totalPages <= 7) {
      for (
        let i = 1;
        i <= totalPages;
        i++
      ) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    const start = Math.max(
      2,
      currentPage - 1
    );

    const end = Math.min(
      totalPages - 1,
      currentPage + 1
    );

    for (
      let i = start;
      i <= end;
      i++
    ) {
      pages.push(i);
    }

    if (
      currentPage <
      totalPages - 3
    ) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  }

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <main className="admin-blogs">
        <div className="admin-blogs-loading">
          Loading blogs...
        </div>
      </main>
    );
  }

  // ================================
  // PAGE
  // ================================

  return (
    <main className="admin-blogs">

      {/* ================================
          HEADER
      ================================= */}

      <div className="admin-blogs-header">
        <div>
          <p className="admin-blogs-label">
            ADMIN PANEL
          </p>

          <h1>Blogs</h1>

          <p className="admin-blogs-subtitle">
            Manage your website blogs
            from here.
          </p>
        </div>

        <button
          type="button"
          className="admin-add-blog-btn"
          onClick={() =>
            router.push(
              "/admin/blogs/create"
            )
          }
        >
          + Add New Blog
        </button>
      </div>

      {/* ================================
          MAIN CONTAINER
      ================================= */}

      <div className="admin-blogs-container">

        {error ? (
          <div className="admin-blogs-message admin-blogs-error">
            {error}
          </div>
        ) : blogs.length === 0 ? (

          /* Empty */

          <div className="admin-blogs-message">
            <h3>
              No blogs found
            </h3>

            <p>
              You have not added any
              blogs yet.
            </p>

            <button
              type="button"
              className="admin-add-blog-btn"
              onClick={() =>
                router.push(
                  "/admin/blogs/create"
                )
              }
            >
              + Add Your First Blog
            </button>
          </div>

        ) : (
          <>
            {/* ================================
                SEARCH + FILTERS
            ================================= */}

            <div className="blogs-filters">

              {/* Search */}

              <div className="blog-search">
                <label>
                  Search Blog
                </label>

                <div className="blog-search-input">
                  <span>⌕</span>

                  <input
                    type="text"
                    placeholder="Search by blog name, category, slug or description..."
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                  />

                  {search && (
                    <button
                      type="button"
                      className="clear-blog-search-btn"
                      onClick={() =>
                        setSearch("")
                      }
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Category */}

              <div className="blog-filter">
                <label>
                  Category
                </label>

                <select
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(
                      e.target.value
                    )
                  }
                >
                  <option value="all">
                    All Categories
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Date */}

              <div className="blog-filter">
                <label>
                  Date
                </label>

                <select
                  value={dateFilter}
                  onChange={(e) =>
                    setDateFilter(
                      e.target.value as DateFilter
                    )
                  }
                >
                  <option value="all">
                    All Dates
                  </option>

                  <option value="today">
                    Today
                  </option>

                  <option value="7days">
                    Last 7 Days
                  </option>

                  <option value="30days">
                    Last 30 Days
                  </option>

                  <option value="year">
                    This Year
                  </option>

                  <option value="custom">
                    Custom Range
                  </option>
                </select>
              </div>

              {/* Sort */}

              <div className="blog-filter">
                <label>
                  Sort By
                </label>

                <select
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(
                      e.target.value as
                        | "latest"
                        | "oldest"
                    )
                  }
                >
                  <option value="latest">
                    Latest First
                  </option>

                  <option value="oldest">
                    Oldest First
                  </option>
                </select>
              </div>

              {/* Clear */}

              {hasActiveFilters && (
                <button
                  type="button"
                  className="clear-blog-filters-btn"
                  onClick={
                    clearFilters
                  }
                >
                  Clear Filters
                </button>
              )}

              {/* Custom Date */}

              {dateFilter === "custom" && (
                <div className="custom-blog-date-filters">

                  <div>
                    <label>
                      From
                    </label>

                    <input
                      type="date"
                      value={
                        customFromDate
                      }
                      onChange={(e) =>
                        setCustomFromDate(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      To
                    </label>

                    <input
                      type="date"
                      value={
                        customToDate
                      }
                      onChange={(e) =>
                        setCustomToDate(
                          e.target.value
                        )
                      }
                    />
                  </div>

                </div>
              )}
            </div>

            {/* ================================
                RESULTS BAR
            ================================= */}

            <div className="blogs-results-bar">

              <div>
                {filteredBlogs.length >
                0 ? (
                  <>
                    Showing{" "}
                    <strong>
                      {startIndex + 1}
                    </strong>
                    {" - "}
                    <strong>
                      {Math.min(
                        endIndex,
                        filteredBlogs.length
                      )}
                    </strong>{" "}
                    of{" "}
                    <strong>
                      {
                        filteredBlogs.length
                      }
                    </strong>{" "}
                    blogs
                  </>
                ) : (
                  <>
                    No blogs found
                  </>
                )}
              </div>

              <div className="blogs-total">
                Total:{" "}
                <strong>
                  {blogs.length}
                </strong>
              </div>

            </div>

            {/* ================================
                NO RESULTS
            ================================= */}

            {filteredBlogs.length ===
            0 ? (
              <div className="admin-blogs-no-results">
                <h3>
                  No blogs found
                </h3>

                <p>
                  No blogs match your
                  current search or
                  filters.
                </p>

                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* ================================
                    TABLE
                ================================= */}

                <div className="admin-blog-table-wrapper">

                  <table className="admin-blog-table">

                    <thead>
                      <tr>
                        <th>
                          Blog
                        </th>

                        <th>
                          Category
                        </th>

                        <th>
                          Date
                        </th>

                        <th>
                          Slug
                        </th>

                        <th>
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {paginatedBlogs.map(
                        (blog) => (
                          <tr
                            key={
                              blog._id
                            }
                          >
                            <td>
                              <div className="admin-blog-info">

                                <img
                                  src={
                                    blog.image
                                  }
                                  alt={
                                    blog.blogName
                                  }
                                  className="admin-blog-image"
                                />

                                <div>
                                  <h3>
                                    {
                                      blog.blogName
                                    }
                                  </h3>

                                  <p>
                                    {
                                      blog.shortDescription
                                    }
                                  </p>
                                </div>

                              </div>
                            </td>

                            <td>
                              <span className="admin-blog-category">
                                {
                                  blog.category
                                }
                              </span>
                            </td>

                            <td>
                              {new Date(
                                blog.date
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </td>

                            <td>
                              <span className="admin-blog-slug">
                                /{blog.slug}
                              </span>
                            </td>

                            <td>
                              <div className="admin-blog-actions">

                                <button
                                  type="button"
                                  className="admin-blog-edit"
                                  onClick={() =>
                                    router.push(
                                      `/admin/blogs/edit/${blog._id}`
                                    )
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  className="admin-blog-delete"
                                  onClick={() =>
                                    handleDelete(
                                      blog._id
                                    )
                                  }
                                >
                                  Delete
                                </button>

                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>

                  </table>

                </div>

                {/* ================================
                    PAGINATION
                ================================= */}

                <div className="blogs-pagination">

                  <div className="pagination-per-page">

                    <span>
                      Per page
                    </span>

                    <select
                      value={
                        itemsPerPage
                      }
                      onChange={(e) =>
                        setItemsPerPage(
                          Number(
                            e.target.value
                          )
                        )
                      }
                    >
                      <option value={10}>
                        10
                      </option>

                      <option value={25}>
                        25
                      </option>

                      <option value={50}>
                        50
                      </option>
                    </select>

                  </div>

                  <div className="pagination-controls">

                    <button
                      type="button"
                      disabled={
                        currentPage ===
                        1
                      }
                      onClick={() =>
                        setCurrentPage(
                          (page) =>
                            Math.max(
                              1,
                              page - 1
                            )
                        )
                      }
                    >
                      ←
                    </button>

                    {getPaginationPages().map(
                      (
                        page,
                        index
                      ) =>
                        page ===
                        "..." ? (
                          <span
                            key={`dots-${index}`}
                            className="pagination-dots"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            type="button"
                            key={page}
                            className={
                              currentPage ===
                              page
                                ? "active"
                                : ""
                            }
                            onClick={() =>
                              setCurrentPage(
                                Number(
                                  page
                                )
                              )
                            }
                          >
                            {page}
                          </button>
                        )
                    )}

                    <button
                      type="button"
                      disabled={
                        totalPages ===
                          0 ||
                        currentPage ===
                          totalPages
                      }
                      onClick={() =>
                        setCurrentPage(
                          (page) =>
                            Math.min(
                              totalPages,
                              page + 1
                            )
                        )
                      }
                    >
                      →
                    </button>

                  </div>

                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}