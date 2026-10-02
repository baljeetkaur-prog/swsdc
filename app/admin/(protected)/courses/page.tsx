"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import "./CoursesAdmin.css";

interface Course {
  _id: string;
  courseName: string;
  category: string;
  duration: string;
  thumbnail: string;
  slug: string;
  createdAt: string;
}

export default function CoursesAdminPage() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ================================
  // SEARCH
  // ================================

  const [search, setSearch] = useState("");

  // ================================
  // FILTERS
  // ================================

  const [categoryFilter, setCategoryFilter] =
    useState("all");

  const [durationFilter, setDurationFilter] =
    useState("all");

  // ================================
  // SORTING
  // ================================

  const [sortOrder, setSortOrder] =
    useState<"latest" | "oldest">("latest");

  // ================================
  // PAGINATION
  // ================================

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(10);

  // ================================
  // FETCH COURSES
  // ================================

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/courses", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        setMessage(
          data.message || "Failed to load courses."
        );
        return;
      }

      setCourses(data.courses || []);
    } catch (error) {
      console.error(
        "Fetch courses error:",
        error
      );

      setMessage("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  }

  // ================================
  // DELETE COURSE
  // ================================

  async function handleDeleteCourse(
    courseId: string
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course? This will also delete its images and video from Cloudinary."
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("Deleting course...");

      const response = await fetch(
        `/api/courses/${courseId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to delete course."
        );
        return;
      }

      setCourses((currentCourses) =>
        currentCourses.filter(
          (course) =>
            course._id !== courseId
        )
      );

      setMessage(
        "Course deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete course error:",
        error
      );

      setMessage("Failed to delete course.");
    }
  }

  // ================================
  // UNIQUE CATEGORIES
  // ================================

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        courses
          .map(
            (course) =>
              course.category
          )
          .filter(Boolean)
      )
    ).sort();
  }, [courses]);

  // ================================
  // UNIQUE DURATIONS
  // ================================

  const durations = useMemo(() => {
    return Array.from(
      new Set(
        courses
          .map(
            (course) =>
              course.duration
          )
          .filter(Boolean)
      )
    ).sort();
  }, [courses]);

  // ================================
  // SEARCH + FILTER + SORT
  // ================================

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // ----------------
    // Search
    // ----------------

    const searchValue =
      search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter(
        (course) => {
          const courseName =
            course.courseName
              ?.toLowerCase() || "";

          const category =
            course.category
              ?.toLowerCase() || "";

          const slug =
            course.slug
              ?.toLowerCase() || "";

          return (
            courseName.includes(
              searchValue
            ) ||
            category.includes(
              searchValue
            ) ||
            slug.includes(
              searchValue
            )
          );
        }
      );
    }

    // ----------------
    // Category
    // ----------------

    if (categoryFilter !== "all") {
      result = result.filter(
        (course) =>
          course.category ===
          categoryFilter
      );
    }

    // ----------------
    // Duration
    // ----------------

    if (durationFilter !== "all") {
      result = result.filter(
        (course) =>
          course.duration ===
          durationFilter
      );
    }

    // ----------------
    // Sort
    // ----------------

    result.sort((a, b) => {
      const dateA = new Date(
        a.createdAt
      ).getTime();

      const dateB = new Date(
        b.createdAt
      ).getTime();

      if (sortOrder === "latest") {
        return dateB - dateA;
      }

      return dateA - dateB;
    });

    return result;
  }, [
    courses,
    search,
    categoryFilter,
    durationFilter,
    sortOrder,
  ]);

  // ================================
  // RESET PAGE ON FILTER CHANGE
  // ================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    categoryFilter,
    durationFilter,
    sortOrder,
    itemsPerPage,
  ]);

  // ================================
  // PAGINATION
  // ================================

  const totalPages = Math.ceil(
    filteredCourses.length /
      itemsPerPage
  );

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const endIndex =
    startIndex + itemsPerPage;

  const paginatedCourses =
    filteredCourses.slice(
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
    setDurationFilter("all");
    setSortOrder("latest");
    setCurrentPage(1);
  }

  const hasActiveFilters =
    search.trim() !== "" ||
    categoryFilter !== "all" ||
    durationFilter !== "all";

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
      <main className="courses-admin">
        <div className="courses-admin-loading">
          Loading courses...
        </div>
      </main>
    );
  }

  // ================================
  // PAGE
  // ================================

  return (
    <main className="courses-admin">
      <div className="courses-admin-container">

        {/* ================================
            HEADER
        ================================= */}

        <div className="courses-admin-header">
          <div>
            <p className="courses-admin-label">
              ADMIN PANEL
            </p>

            <h1>Courses</h1>

            <span>
              Manage all courses available
              on your website.
            </span>
          </div>

          <button
            className="add-course-btn"
            onClick={() =>
              router.push(
                "/admin/add-course"
              )
            }
          >
            + Add Course
          </button>
        </div>

        {/* ================================
            MESSAGE
        ================================= */}

        {message && (
          <div className="courses-admin-message">
            {message}
          </div>
        )}

        {/* ================================
            EMPTY DATABASE
        ================================= */}

        {courses.length === 0 ? (
          <div className="courses-admin-empty">
            <h2>
              No courses added yet
            </h2>

            <p>
              Add your first course to
              start managing courses.
            </p>

            <button
              onClick={() =>
                router.push(
                  "/admin/add-course"
                )
              }
            >
              Add Course
            </button>
          </div>
        ) : (
          <>
            {/* ================================
                SEARCH + FILTERS
            ================================= */}

            <div className="courses-filters">

              {/* Search */}

              <div className="course-search">
                <label>
                  Search Course
                </label>

                <div className="course-search-input">
                  <span>⌕</span>

                  <input
                    type="text"
                    placeholder="Search by course name, category or slug..."
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
                      className="clear-course-search-btn"
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

              <div className="course-filter">
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

              {/* Duration */}

              <div className="course-filter">
                <label>
                  Duration
                </label>

                <select
                  value={durationFilter}
                  onChange={(e) =>
                    setDurationFilter(
                      e.target.value
                    )
                  }
                >
                  <option value="all">
                    All Durations
                  </option>

                  {durations.map(
                    (duration) => (
                      <option
                        key={duration}
                        value={duration}
                      >
                        {duration}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Sort */}

              <div className="course-filter">
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
                  className="clear-course-filters-btn"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* ================================
                RESULTS SUMMARY
            ================================= */}

            <div className="courses-results-bar">

              <div>
                {filteredCourses.length >
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
                        filteredCourses.length
                      )}
                    </strong>{" "}
                    of{" "}
                    <strong>
                      {
                        filteredCourses.length
                      }
                    </strong>{" "}
                    courses
                  </>
                ) : (
                  <>
                    No courses found
                  </>
                )}
              </div>

              <div className="courses-total">
                Total:{" "}
                <strong>
                  {courses.length}
                </strong>
              </div>
            </div>

            {/* ================================
                NO FILTER RESULTS
            ================================= */}

            {filteredCourses.length === 0 ? (
              <div className="courses-admin-empty">
                <h2>
                  No courses found
                </h2>

                <p>
                  No courses match your
                  current search or filters.
                </p>

                <button
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* ================================
                    COURSES GRID
                ================================= */}

                <div className="courses-admin-grid">
                  {paginatedCourses.map(
                    (course) => (
                      <div
                        className="course-admin-card"
                        key={
                          course._id
                        }
                      >

                        {/* Thumbnail */}

                        <div className="course-admin-image">
                          <img
                            src={
                              course.thumbnail
                            }
                            alt={
                              course.courseName
                            }
                          />
                        </div>

                        {/* Information */}

                        <div className="course-admin-info">

                          <span className="course-admin-category">
                            {
                              course.category
                            }
                          </span>

                          <h2>
                            {
                              course.courseName
                            }
                          </h2>

                          <p>
                            {
                              course.duration
                            }
                          </p>

                          {/* Actions */}

                          <div className="course-admin-actions">

                            <button
                              className="course-edit-btn"
                              onClick={() =>
                                router.push(
                                  `/admin/courses/${course._id}/edit`
                                )
                              }
                            >
                              Edit Course
                            </button>

                            <button
                              className="course-delete-btn"
                              onClick={() =>
                                handleDeleteCourse(
                                  course._id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* ================================
                    PAGINATION
                ================================= */}

                <div className="courses-pagination">

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
                      (page, index) =>
                        page === "..." ? (
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
                                Number(page)
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
                        totalPages === 0 ||
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