"use client";

import Link from "next/link";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./Verify.css";

interface Certificate {
  certificateNumber: string;
  studentName: string;

  fatherName?: string;
  motherName?: string;
  dateOfBirth?: string;
  address?: string;

  courseName?: string;
  specialisation?: string;

  grade?: string;

  duration?: {
    from?: string;
    to?: string;
  };

  issueDate: string;

  profileImage?: string;

  pdfFileId: string;
}

export default function Verify() {
  const [
    certificateNumber,
    setCertificateNumber,
  ] = useState("");

  const [certificate, setCertificate] =
    useState<Certificate | null>(null);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSearch() {
    if (!certificateNumber.trim()) {
      setMessage(
        "Please enter a certificate number."
      );

      setCertificate(null);

      return;
    }

    setLoading(true);
    setMessage("");
    setCertificate(null);

    try {
      const response =
        await fetch(
          `/api/certificates/search?certificateNumber=${encodeURIComponent(
            certificateNumber.trim()
          )}`
        );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Certificate not found."
        );

        return;
      }

      setCertificate(
        data.certificate
      );

      setCertificateNumber("");
    } catch (error) {
      console.error(error);

      setMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

function formatDate(date?: string) {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
}

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <main className="verify-page">

      {/* ================================
          BANNER
      ================================= */}

      <section className="verify-banner">
        <div className="verify-banner-content">

          <h1>
            Verify Certificate
          </h1>

          <div className="verify-breadcrumb">

            <Link href="/">
              Home
            </Link>

            <span>/</span>

            <span>
              Verify Certificate
            </span>

          </div>

        </div>
      </section>

      {/* ================================
          VERIFY SECTION
      ================================= */}

      <section className="verify-section">

        <div className="verify-container">

          <div className="verify-content">

            <div className="verify-small-heading">

              <FaSearch />

              <span>
                CERTIFICATE VERIFICATION
              </span>

            </div>

            <h2>
              Verify Your Certificate
            </h2>

            <p>
              Enter your certificate number
              below to verify the authenticity
              of your certificate and view the
              certificate details.
            </p>

            {/* ================================
                SEARCH
            ================================= */}

            <div className="verify-search-wrapper">

              <input
                type="text"
                placeholder="Enter Certificate Number"
                aria-label="Certificate Number"
                value={
                  certificateNumber
                }
                onChange={(e) =>
                  setCertificateNumber(
                    e.target.value
                  )
                }
                onKeyDown={
                  handleKeyDown
                }
              />

              <button
                type="button"
                className="verify-search-btn"
                onClick={
                  handleSearch
                }
                disabled={loading}
              >
                <FaSearch />

                <span>
                  {loading
                    ? "Searching..."
                    : "Search"}
                </span>
              </button>

            </div>

            {/* ================================
                MESSAGE
            ================================= */}

            {message && (
              <div className="verify-message">
                {message}
              </div>
            )}

            {/* ================================
                RESULT
            ================================= */}

            {certificate && (
              <div className="verify-result">

                <h3>
                  Certificate Details
                </h3>

                {/* ================================
                    PROFILE
                ================================= */}

                <div className="verify-profile">

                  {certificate.profileImage && (
                    <img
                      src={
                        certificate.profileImage
                      }
                      alt={
                        certificate.studentName
                      }
                      className="verify-profile-image"
                    />
                  )}

                  <div className="verify-profile-info">

                    <h4>
                      {
                        certificate.studentName
                      }
                    </h4>

                    <span>
                      Certificate No.{" "}
                      {
                        certificate.certificateNumber
                      }
                    </span>

                  </div>

                </div>

                {/* ================================
                    PERSONAL INFORMATION
                ================================= */}

                <div className="verify-table-wrapper">

                  <table className="verify-table">

                    <tbody>

                      <tr>
                        <th>
                          Certificate Number
                        </th>

                        <td>
                          {
                            certificate.certificateNumber
                          }
                        </td>
                      </tr>

                      <tr>
                        <th>
                          Student Name
                        </th>

                        <td>
                          {
                            certificate.studentName
                          }
                        </td>
                      </tr>

                      <tr>
                        <th>
                          Father's Name
                        </th>

                    <td>
  {certificate.fatherName?.trim()
    ? certificate.fatherName
    : "-"}
</td>
                      </tr>

                      <tr>
                        <th>
                          Mother's Name
                        </th>

                    <td>
  {certificate.motherName?.trim()
    ? certificate.motherName
    : "-"}
</td>
                      </tr>

                      <tr>
                        <th>
                          Date of Birth
                        </th>
<td>
  {formatDate(
    certificate.dateOfBirth
  )}
</td>
                      </tr>

                      <tr>
                        <th>
                          Address
                        </th>

                      <td>
  {certificate.address?.trim()
    ? certificate.address
    : "-"}
</td>
                      </tr>

                      {/* ================================
                          COURSE INFORMATION
                      ================================= */}

                      <tr>
                        <th>
                          Course Name
                        </th>

                   <td>
  {certificate.courseName?.trim()
    ? certificate.courseName
    : "-"}
</td>
                      </tr>

                      <tr>
                        <th>
                          Specialisation
                        </th>

                    <td>
  {certificate.specialisation?.trim()
    ? certificate.specialisation
    : "-"}
</td>
                      </tr>

                      <tr>
                        <th>
                          Grade
                        </th>

                    <td>
  {certificate.grade?.trim()
    ? certificate.grade
    : "-"}
</td>
                      </tr>

                      <tr>
                        <th>
                          Course Duration
                        </th>

                      <td>
  {certificate.duration?.from ||
  certificate.duration?.to ? (
    <>
      {formatDate(
        certificate.duration?.from
      )}{" "}
      –{" "}
      {formatDate(
        certificate.duration?.to
      )}
    </>
  ) : (
    "-"
  )}
</td>
                      </tr>

                      <tr>
                        <th>
                          Issue Date
                        </th>

                        <td>
                          {formatDate(
                            certificate.issueDate
                          )}
                        </td>
                      </tr>

                      {/* ================================
                          PDF
                      ================================= */}

                      <tr>
                        <th>
                          Certificate
                        </th>

                        <td>

                          <a
                            href={`/api/certificates/download/${certificate.pdfFileId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="verify-view-btn"
                          >
                            View Certificate
                          </a>

                        </td>
                      </tr>

                    </tbody>

                  </table>

                </div>

              </div>
            )}

          </div>

        </div>

      </section>

    </main>
  );
}