"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import "./CertificatesAdmin.css";

interface Certificate {
  _id: string;
  certificateNumber: string;
  studentName: string;
  courseName?: string;
  grade?: string;
  issueDate: string;
  pdfFileId: string;
  createdAt: string;
}

type DateFilter =
  | "all"
  | "today"
  | "7days"
  | "30days"
  | "year"
  | "custom";

export default function CertificatesAdminPage() {
  const router = useRouter();

  const [certificates, setCertificates] =
    useState<Certificate[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  // Search
  const [search, setSearch] =
    useState("");

  // Filters
  const [dateFilter, setDateFilter] =
    useState<DateFilter>("all");

  const [customFromDate, setCustomFromDate] =
    useState("");

  const [customToDate, setCustomToDate] =
    useState("");

  const [courseFilter, setCourseFilter] =
    useState("all");

  const [gradeFilter, setGradeFilter] =
    useState("all");

  // Sorting
  const [sortOrder, setSortOrder] =
    useState<"latest" | "oldest">("latest");

  // Pagination
  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(10);

  useEffect(() => {
    fetchCertificates();
  }, []);

  async function fetchCertificates() {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        "/api/certificates",
        {
          method: "GET",
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
            "Failed to load certificates."
        );
        return;
      }

      setCertificates(
        data.certificates || []
      );
    } catch (error) {
      console.error(
        "Fetch certificates error:",
        error
      );

      setMessage(
        "Failed to load certificates."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(
    certificateId: string
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this certificate? The PDF will also be permanently deleted."
      );

    if (!confirmed) {
      return;
    }

    try {
      setMessage(
        "Deleting certificate..."
      );

      const response =
        await fetch(
          `/api/certificates/${certificateId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

      const data =
        await response.json();

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to delete certificate."
        );
        return;
      }

      setCertificates(
        (current) =>
          current.filter(
            (certificate) =>
              certificate._id !==
              certificateId
          )
      );

      setMessage(
        "Certificate deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete certificate error:",
        error
      );

      setMessage(
        "Failed to delete certificate."
      );
    }
  }

  function formatDate(date: string) {
    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  /*
   * Get unique courses
   */
  const courses = useMemo(() => {
    return Array.from(
      new Set(
        certificates
          .map(
            (certificate) =>
              certificate.courseName
          )
          .filter(Boolean)
      )
    ).sort();
  }, [certificates]);

  /*
   * Get unique grades
   */
  const grades = useMemo(() => {
    return Array.from(
      new Set(
        certificates
          .map(
            (certificate) =>
              certificate.grade
          )
          .filter(Boolean)
      )
    ).sort();
  }, [certificates]);

  /*
   * Apply search + filters + sorting
   */
  const filteredCertificates = useMemo(() => {
    let result = [...certificates];

    /*
     * Search
     * Certificate number OR student name
     */
    const searchValue =
      search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter(
        (certificate) => {
          const certificateNumber =
            certificate.certificateNumber
              .toLowerCase();

          const studentName =
            certificate.studentName
              .toLowerCase();

          return (
            certificateNumber.includes(
              searchValue
            ) ||
            studentName.includes(
              searchValue
            )
          );
        }
      );
    }

    /*
     * Course filter
     */
    if (courseFilter !== "all") {
      result = result.filter(
        (certificate) =>
          certificate.courseName ===
          courseFilter
      );
    }

    /*
     * Grade filter
     */
    if (gradeFilter !== "all") {
      result = result.filter(
        (certificate) =>
          certificate.grade ===
          gradeFilter
      );
    }

    /*
     * Date filter
     */
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
          (certificate) => {
            const issueDate =
              new Date(
                certificate.issueDate
              );

            return (
              issueDate >=
                startOfToday &&
              issueDate <=
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
          (certificate) =>
            new Date(
              certificate.issueDate
            ) >= startDate
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
          (certificate) =>
            new Date(
              certificate.issueDate
            ) >= startDate
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
          (certificate) =>
            new Date(
              certificate.issueDate
            ) >= startOfYear
        );
      }

      if (dateFilter === "custom") {
        if (customFromDate) {
          const fromDate =
            new Date(
              `${customFromDate}T00:00:00`
            );

          result = result.filter(
            (certificate) =>
              new Date(
                certificate.issueDate
              ) >= fromDate
          );
        }

        if (customToDate) {
          const toDate =
            new Date(
              `${customToDate}T23:59:59`
            );

          result = result.filter(
            (certificate) =>
              new Date(
                certificate.issueDate
              ) <= toDate
          );
        }
      }
    }

    /*
     * Sort
     */
    result.sort((a, b) => {
      const dateA =
        new Date(
          a.issueDate
        ).getTime();

      const dateB =
        new Date(
          b.issueDate
        ).getTime();

      if (sortOrder === "latest") {
        return dateB - dateA;
      }

      return dateA - dateB;
    });

    return result;
  }, [
    certificates,
    search,
    courseFilter,
    gradeFilter,
    dateFilter,
    customFromDate,
    customToDate,
    sortOrder,
  ]);

  /*
   * Reset page whenever filters/search change
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    courseFilter,
    gradeFilter,
    dateFilter,
    customFromDate,
    customToDate,
    sortOrder,
    itemsPerPage,
  ]);

  /*
   * Pagination
   */
  const totalPages =
    Math.ceil(
      filteredCertificates.length /
        itemsPerPage
    );

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const endIndex =
    startIndex + itemsPerPage;

  const paginatedCertificates =
    filteredCertificates.slice(
      startIndex,
      endIndex
    );

  /*
   * Keep current page valid after deletion/filtering
   */
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

  /*
   * Clear all filters
   */
  function clearFilters() {
    setSearch("");
    setDateFilter("all");
    setCustomFromDate("");
    setCustomToDate("");
    setCourseFilter("all");
    setGradeFilter("all");
    setSortOrder("latest");
    setCurrentPage(1);
  }

  const hasActiveFilters =
    search.trim() !== "" ||
    dateFilter !== "all" ||
    courseFilter !== "all" ||
    gradeFilter !== "all" ||
    customFromDate !== "" ||
    customToDate !== "";

  /*
   * Pagination numbers
   */
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

  if (loading) {
    return (
      <main className="certificates-admin">
        <div className="certificates-admin-loading">
          Loading certificates...
        </div>
      </main>
    );
  }

  return (
    <main className="certificates-admin">
      <div className="certificates-admin-container">

        {/* Header */}

        <div className="certificates-admin-header">
          <div>
            <p className="certificates-admin-label">
              ADMIN PANEL
            </p>

            <h1>Certificates</h1>

            <span>
              Manage student certificates
              and verification records.
            </span>
          </div>

          <button
            className="add-certificate-btn"
            onClick={() =>
              router.push(
                "/admin/upload"
              )
            }
          >
            + Upload Certificate
          </button>
        </div>

        {/* Message */}

        {message && (
          <div className="certificates-admin-message">
            {message}
          </div>
        )}

        {/* Search + Filters */}

        {certificates.length > 0 && (
          <div className="certificates-filters">

            {/* Search */}

            <div className="certificate-search">
              <label>
                Search Certificate
              </label>

              <div className="certificate-search-input">
                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Search by certificate number or student name..."
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
                    className="clear-search-btn"
                    onClick={() =>
                      setSearch("")
                    }
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Date */}

            <div className="certificate-filter">
              <label>
                Issue Date
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

            {/* Course */}

            <div className="certificate-filter">
              <label>
                Course
              </label>

              <select
                value={courseFilter}
                onChange={(e) =>
                  setCourseFilter(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All Courses
                </option>

                {courses.map(
                  (course) => (
                    <option
                      key={course}
                      value={course}
                    >
                      {course}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Grade */}

            <div className="certificate-filter">
              <label>
                Grade
              </label>

              <select
                value={gradeFilter}
                onChange={(e) =>
                  setGradeFilter(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All Grades
                </option>

                {grades.map(
                  (grade) => (
                    <option
                      key={grade}
                      value={grade}
                    >
                      {grade}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Sort */}

            <div className="certificate-filter">
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
                className="clear-filters-btn"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}

            {/* Custom Date */}

            {dateFilter === "custom" && (
              <div className="custom-date-filters">

                <div>
                  <label>
                    From
                  </label>

                  <input
                    type="date"
                    value={customFromDate}
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
                    value={customToDate}
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
        )}

        {/* Results Summary */}

        {certificates.length > 0 && (
          <div className="certificates-results-bar">

            <div>
              {filteredCertificates.length >
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
                      filteredCertificates.length
                    )}
                  </strong>{" "}
                  of{" "}
                  <strong>
                    {
                      filteredCertificates.length
                    }
                  </strong>{" "}
                  certificates
                </>
              ) : (
                <>
                  No certificates found
                </>
              )}
            </div>

            <div className="certificates-total">
              Total:{" "}
              <strong>
                {certificates.length}
              </strong>
            </div>

          </div>
        )}

        {/* Empty State */}

        {certificates.length === 0 ? (
          <div className="certificates-admin-empty">
            <h2>
              No certificates added yet
            </h2>

            <p>
              Upload your first
              certificate to start
              managing certificates.
            </p>

            <button
              onClick={() =>
                router.push(
                  "/admin/upload"
                )
              }
            >
              Upload Certificate
            </button>
          </div>
        ) : filteredCertificates.length ===
          0 ? (
          <div className="certificates-admin-empty">

            <h2>
              No certificates found
            </h2>

            <p>
              No certificates match your
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
            {/* Table */}

            <div className="certificates-admin-table-wrapper">
              <table className="certificates-admin-table">

                <thead>
                  <tr>
                    <th>
                      Certificate No.
                    </th>

                    <th>
                      Student
                    </th>

                    <th>
                      Course
                    </th>

                    <th>
                      Grade
                    </th>

                    <th>
                      Issue Date
                    </th>

                    <th>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedCertificates.map(
                    (certificate) => (
                      <tr
                        key={
                          certificate._id
                        }
                      >
                        <td>
                          <strong>
                            {
                              certificate.certificateNumber
                            }
                          </strong>
                        </td>

                        <td>
                          {
                            certificate.studentName
                          }
                        </td>

                     <td>
  {certificate.courseName?.trim()
    ? certificate.courseName
    : "-"}
</td>

                     <td>
  <span className="certificate-grade">
    {certificate.grade?.trim()
      ? certificate.grade
      : "-"}
  </span>
</td>

                        <td>
                          {formatDate(
                            certificate.issueDate
                          )}
                        </td>

                        <td>
                          <div className="certificate-actions">

                            <a
                              className="certificate-view-btn"
                              href={`/api/certificates/file/${certificate.pdfFileId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View PDF
                            </a>

                            <button
                              className="certificate-edit-btn"
                              onClick={() =>
                                router.push(
                                  `/admin/certificates/${certificate._id}/edit`
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="certificate-delete-btn"
                              onClick={() =>
                                handleDelete(
                                  certificate._id
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

            {/* Pagination */}

            <div className="certificates-pagination">

              <div className="pagination-per-page">
                <span>
                  Per page
                </span>

                <select
                  value={itemsPerPage}
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
                    currentPage === 1
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

      </div>
    </main>
  );
}