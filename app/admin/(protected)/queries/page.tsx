"use client";

import { useEffect, useMemo, useState } from "react";
import "./QueriesAdmin.css";

interface Query {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

type DateFilter =
  | "all"
  | "today"
  | "7days"
  | "30days"
  | "year"
  | "custom";

type SortOrder = "latest" | "oldest";

export default function QueriesAdminPage() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================================
  // SEARCH / FILTER STATES
  // ================================

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] =
    useState<DateFilter>("all");
  const [sortOrder, setSortOrder] =
    useState<SortOrder>("latest");

  const [customStartDate, setCustomStartDate] =
    useState("");
  const [customEndDate, setCustomEndDate] =
    useState("");

  // ================================
  // PAGINATION
  // ================================

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ================================
  // FETCH QUERIES
  // ================================

  const fetchQueries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/queries");

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch queries."
        );
      }

      setQueries(data.queries || []);
    } catch (error) {
      console.error(
        "Failed to fetch queries:",
        error
      );

      setError(
        "Unable to load contact queries. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  // ================================
  // FILTER DATE
  // ================================

  const isDateMatch = (queryDate: string) => {
    if (dateFilter === "all") {
      return true;
    }

    const queryDateObj = new Date(queryDate);
    const now = new Date();

    if (Number.isNaN(queryDateObj.getTime())) {
      return false;
    }

    if (dateFilter === "today") {
      return (
        queryDateObj.getFullYear() === now.getFullYear() &&
        queryDateObj.getMonth() === now.getMonth() &&
        queryDateObj.getDate() === now.getDate()
      );
    }

    if (dateFilter === "7days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);

      return queryDateObj >= sevenDaysAgo;
    }

    if (dateFilter === "30days") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);

      return queryDateObj >= thirtyDaysAgo;
    }

    if (dateFilter === "year") {
      return (
        queryDateObj.getFullYear() ===
        now.getFullYear()
      );
    }

    if (dateFilter === "custom") {
      const queryTime = queryDateObj.getTime();

      if (customStartDate) {
        const start = new Date(
          `${customStartDate}T00:00:00`
        ).getTime();

        if (queryTime < start) {
          return false;
        }
      }

      if (customEndDate) {
        const end = new Date(
          `${customEndDate}T23:59:59`
        ).getTime();

        if (queryTime > end) {
          return false;
        }
      }

      return true;
    }

    return true;
  };

  // ================================
  // FILTERED + SORTED QUERIES
  // ================================

  const filteredQueries = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    const filtered = queries.filter((query) => {
      const matchesSearch =
        !searchValue ||
        query.name
          .toLowerCase()
          .includes(searchValue) ||
        query.email
          .toLowerCase()
          .includes(searchValue) ||
        query.phone
          .toLowerCase()
          .includes(searchValue) ||
        query.message
          .toLowerCase()
          .includes(searchValue);

      const matchesDate = isDateMatch(
        query.createdAt
      );

      return matchesSearch && matchesDate;
    });

    return [...filtered].sort((a, b) => {
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
  }, [
    queries,
    search,
    dateFilter,
    sortOrder,
    customStartDate,
    customEndDate,
  ]);

  // ================================
  // PAGINATION CALCULATIONS
  // ================================

  const totalPages = Math.ceil(
    filteredQueries.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const endIndex =
    startIndex + itemsPerPage;

  const paginatedQueries =
    filteredQueries.slice(
      startIndex,
      endIndex
    );

  // ================================
  // RESET PAGE WHEN FILTER CHANGES
  // ================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    dateFilter,
    sortOrder,
    customStartDate,
    customEndDate,
    itemsPerPage,
  ]);

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
  }, [totalPages, currentPage]);

  // ================================
  // PAGINATION BUTTONS
  // ================================

  const getPaginationPages = (): (
    | number
    | "..."
  )[] => {
    if (totalPages <= 7) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    if (currentPage <= 4) {
      return [
        1,
        2,
        3,
        4,
        5,
        "...",
        totalPages,
      ];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  // ================================
  // CLEAR FILTERS
  // ================================

  const clearFilters = () => {
    setSearch("");
    setDateFilter("all");
    setSortOrder("latest");
    setCustomStartDate("");
    setCustomEndDate("");
    setItemsPerPage(10);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    dateFilter !== "all" ||
    sortOrder !== "latest";

  // ================================
  // DATE FORMAT
  // ================================

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ================================
  // RENDER
  // ================================

  return (
    <div className="queries-admin">
      <div className="queries-admin-container">

        {/* ================= HEADER ================= */}

        <div className="queries-admin-header">
          <div>
            <p className="queries-admin-label">
              CONTACT MANAGEMENT
            </p>

            <h1>Contact Queries</h1>

            <span>
              View and manage messages received through
              the website contact form.
            </span>
          </div>

          <button
            className="refresh-queries-btn"
            onClick={fetchQueries}
            disabled={loading}
          >
            {loading
              ? "Refreshing..."
              : "Refresh Queries"}
          </button>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="queries-admin-message queries-error">
            <span>{error}</span>

            <button onClick={fetchQueries}>
              Try Again
            </button>
          </div>
        )}

        {/* ================= SUMMARY ================= */}

        {!loading &&
          !error &&
          queries.length > 0 && (
            <div className="queries-admin-summary">

              <div>
                <span>Total Queries</span>

                <strong>
                  {queries.length}
                </strong>
              </div>

              <div className="queries-summary-text">
                Showing{" "}
                <strong>
                  {filteredQueries.length}
                </strong>{" "}
                matching queries
              </div>

            </div>
          )}

        {/* ================= FILTERS ================= */}

        {!loading &&
          !error &&
          queries.length > 0 && (
            <div className="queries-filters">

              {/* SEARCH */}

              <div className="queries-filter-group queries-search-group">
                <label htmlFor="query-search">
                  Search Queries
                </label>

                <div className="queries-search-box">
                  <span>⌕</span>

                  <input
                    id="query-search"
                    type="text"
                    placeholder="Search name, email, phone or message..."
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>

              {/* DATE FILTER */}

              <div className="queries-filter-group">
                <label htmlFor="query-date">
                  Date
                </label>

                <select
                  id="query-date"
                  value={dateFilter}
                  onChange={(event) =>
                    setDateFilter(
                      event.target.value as DateFilter
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

              {/* SORT */}

              <div className="queries-filter-group">
                <label htmlFor="query-sort">
                  Sort By
                </label>

                <select
                  id="query-sort"
                  value={sortOrder}
                  onChange={(event) =>
                    setSortOrder(
                      event.target.value as SortOrder
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

              {/* ITEMS PER PAGE */}

              <div className="queries-filter-group">
                <label htmlFor="query-per-page">
                  Show
                </label>

                <select
                  id="query-per-page"
                  value={itemsPerPage}
                  onChange={(event) =>
                    setItemsPerPage(
                      Number(event.target.value)
                    )
                  }
                >
                  <option value={10}>
                    10 Queries
                  </option>

                  <option value={25}>
                    25 Queries
                  </option>

                  <option value={50}>
                    50 Queries
                  </option>
                </select>
              </div>

              {/* CUSTOM DATE RANGE */}

              {dateFilter === "custom" && (
                <div className="queries-custom-date-row">

                  <div className="queries-filter-group">
                    <label htmlFor="query-start-date">
                      Start Date
                    </label>

                    <input
                      id="query-start-date"
                      type="date"
                      value={customStartDate}
                      onChange={(event) =>
                        setCustomStartDate(
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="queries-filter-group">
                    <label htmlFor="query-end-date">
                      End Date
                    </label>

                    <input
                      id="query-end-date"
                      type="date"
                      value={customEndDate}
                      onChange={(event) =>
                        setCustomEndDate(
                          event.target.value
                        )
                      }
                    />
                  </div>

                </div>
              )}

              {/* CLEAR FILTERS */}

              <div className="queries-filter-actions">
                <button
                  type="button"
                  className="queries-clear-btn"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                >
                  Clear Filters
                </button>
              </div>

            </div>
          )}

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="queries-admin-empty">
            <div className="queries-loader"></div>

            <h2>Loading Queries</h2>

            <p>
              Please wait while we fetch the contact
              queries.
            </p>
          </div>
        )}

        {/* ================= EMPTY ================= */}

        {!loading &&
          !error &&
          queries.length === 0 && (
            <div className="queries-admin-empty">
              <div className="queries-empty-icon">
                ✉
              </div>

              <h2>No Queries Yet</h2>

              <p>
                Contact form submissions will appear
                here once visitors send you a message.
              </p>
            </div>
          )}

        {/* ================= FILTERED EMPTY ================= */}

        {!loading &&
          !error &&
          queries.length > 0 &&
          filteredQueries.length === 0 && (
            <div className="queries-admin-empty queries-filtered-empty">

              <div className="queries-empty-icon">
                ⌕
              </div>

              <h2>No Matching Queries</h2>

              <p>
                No contact queries match your current
                search or filters.
              </p>

              <button
                type="button"
                className="queries-empty-clear-btn"
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            </div>
          )}

        {/* ================= RESULTS ================= */}

        {!loading &&
          !error &&
          filteredQueries.length > 0 && (
            <>
              <div className="queries-results-bar">
                <span>
                  Showing{" "}
                  <strong>
                    {startIndex + 1}
                  </strong>
                  {" - "}
                  <strong>
                    {Math.min(
                      endIndex,
                      filteredQueries.length
                    )}
                  </strong>
                  {" of "}
                  <strong>
                    {filteredQueries.length}
                  </strong>{" "}
                  queries
                </span>

                {hasActiveFilters && (
                  <span className="queries-filter-active">
                    Filters Applied
                  </span>
                )}
              </div>

              <div className="queries-admin-list">

                {paginatedQueries.map((query) => (
                  <div
                    className="query-admin-card"
                    key={query._id}
                  >

                    {/* QUERY HEADER */}

                    <div className="query-admin-top">

                      <div className="query-admin-person">

                        <div className="query-admin-avatar">
                          {query.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <h2>
                            {query.name}
                          </h2>

                          <span>
                            {formatDate(
                              query.createdAt
                            )}{" "}
                            at{" "}
                            {formatTime(
                              query.createdAt
                            )}
                          </span>
                        </div>

                      </div>

                      <div className="query-admin-badge">
                        Contact Query
                      </div>

                    </div>

                    {/* CONTACT DETAILS */}

                    <div className="query-admin-details">

                      <div className="query-admin-detail">
                        <span>Email</span>

                        <a
                          href={`mailto:${query.email}`}
                        >
                          {query.email}
                        </a>
                      </div>

                      <div className="query-admin-detail">
                        <span>Phone</span>

                        <a
                          href={`tel:${query.phone}`}
                        >
                          {query.phone}
                        </a>
                      </div>

                    </div>

                    {/* MESSAGE */}

                    <div className="query-admin-message-box">

                      <span>Message</span>

                      <p>
                        {query.message}
                      </p>

                    </div>

                  </div>
                ))}

              </div>

              {/* ================= PAGINATION ================= */}

              {totalPages > 1 && (
                <div className="queries-pagination">

                  <button
                    type="button"
                    className="queries-page-arrow"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage(
                        (page) => page - 1
                      )
                    }
                  >
                    ←
                  </button>

                  <div className="queries-page-numbers">

                    {getPaginationPages().map(
                      (page, index) =>
                        page === "..." ? (
                          <span
                            className="queries-page-dots"
                            key={`dots-${index}`}
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            type="button"
                            key={page}
                            className={
                              currentPage === page
                                ? "queries-page-number active"
                                : "queries-page-number"
                            }
                            onClick={() =>
                              setCurrentPage(page)
                            }
                          >
                            {page}
                          </button>
                        )
                    )}

                  </div>

                  <button
                    type="button"
                    className="queries-page-arrow"
                    disabled={
                      currentPage === totalPages
                    }
                    onClick={() =>
                      setCurrentPage(
                        (page) => page + 1
                      )
                    }
                  >
                    →
                  </button>

                </div>
              )}

            </>
          )}

      </div>
    </div>
  );
}
