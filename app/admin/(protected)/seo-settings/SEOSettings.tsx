"use client";

import { useEffect, useState } from "react";
import "./SEOSettings.css";

interface SEOPage {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

interface SEOData {
  home: SEOPage;
  about: SEOPage;
  services: SEOPage;
  courses: SEOPage;
  gallery: SEOPage;
  blogs: SEOPage;
  contact: SEOPage;
  verifyCertificate: SEOPage;
}

const emptyPage: SEOPage = {
  metaTitle: "",
  metaDescription: "",
  keywords: [],
};

const defaultSEO: SEOData = {
  home: { ...emptyPage },
  about: { ...emptyPage },
  services: { ...emptyPage },
  courses: { ...emptyPage },
  gallery: { ...emptyPage },
  blogs: { ...emptyPage },
  contact: { ...emptyPage },
  verifyCertificate: { ...emptyPage },
};

const pageNames: {
  key: keyof SEOData;
  label: string;
}[] = [
  {
    key: "home",
    label: "Home Page",
  },
  {
    key: "about",
    label: "About Us",
  },
  {
    key: "services",
    label: "Services",
  },
  {
    key: "courses",
    label: "Courses",
  },
  {
    key: "gallery",
    label: "Gallery",
  },
  {
    key: "blogs",
    label: "Blogs",
  },
  {
    key: "contact",
    label: "Contact Us",
  },
  {
    key: "verifyCertificate",
    label: "Verify Certificate",
  },
];

export default function SEOSettings() {
  const [seoData, setSeoData] = useState<SEOData>(defaultSEO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSEOSettings();
  }, []);

  async function fetchSEOSettings() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/seo-settings");

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch SEO settings"
        );
      }

      if (data.settings) {
        setSeoData({
          ...defaultSEO,
          ...data.settings,
        });
      }
    } catch (error) {
      console.error("Fetch SEO settings error:", error);
      setError("Failed to load SEO settings.");
    } finally {
      setLoading(false);
    }
  }

  function updateField(
    page: keyof SEOData,
    field: "metaTitle" | "metaDescription",
    value: string
  ) {
    setSeoData((previous) => ({
      ...previous,
      [page]: {
        ...previous[page],
        [field]: value,
      },
    }));
  }

  function updateKeywords(
    page: keyof SEOData,
    value: string
  ) {
    const keywords = value
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean);

    setSeoData((previous) => ({
      ...previous,
      [page]: {
        ...previous[page],
        keywords,
      },
    }));
  }

  function keywordsToString(keywords: string[]) {
    return keywords.join(", ");
  }

async function handleSave() {
  try {
    setSaving(true);
    setMessage("");
    setError("");

    const response = await fetch("/api/seo-settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(seoData),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Failed to save SEO settings"
      );
    }

    if (data.settings) {
      setSeoData({
        ...defaultSEO,
        ...data.settings,
      });
    }

    setMessage("SEO settings saved successfully.");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } catch (error) {
    console.error("Save SEO settings error:", error);
    setError("Failed to save SEO settings.");
  } finally {
    setSaving(false);
  }
}
  if (loading) {
    return (
      <main className="seo-settings-page">
        <section className="seo-settings-section">
          <div className="seo-settings-container">
            <div className="seo-settings-loading">
              Loading SEO settings...
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="seo-settings-page">
      <section className="seo-settings-section">
        <div className="seo-settings-container">

          {/* Header */}
          <div className="seo-settings-header">
            <div>
              <span className="seo-settings-small-title">
                Website Management
              </span>

              <h1>SEO Settings</h1>

              <p>
                Manage meta titles, descriptions and keywords
                for your website pages.
              </p>
            </div>

            <button
              type="button"
              className="seo-save-button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Messages */}
          {message && (
            <div className="seo-success-message">
              {message}
            </div>
          )}

          {error && (
            <div className="seo-error-message">
              {error}
            </div>
          )}

          {/* SEO Pages */}
          <div className="seo-settings-list">

            {pageNames.map((page) => {
              const pageData = seoData[page.key];

              return (
                <div
                  className="seo-settings-card"
                  key={page.key}
                >
                  <div className="seo-card-header">
                    <h2>{page.label}</h2>
                  </div>

                  <div className="seo-card-body">

                    {/* Meta Title */}
                    <div className="seo-form-group">
                      <label htmlFor={`${page.key}-title`}>
                        Meta Title
                      </label>

                      <input
                        id={`${page.key}-title`}
                        type="text"
                        value={pageData.metaTitle}
                        onChange={(event) =>
                          updateField(
                            page.key,
                            "metaTitle",
                            event.target.value
                          )
                        }
                        placeholder={`Enter ${page.label} meta title`}
                      />

                      <span className="seo-field-hint">
                        Recommended: around 50–60 characters.
                      </span>
                    </div>

                    {/* Meta Description */}
                    <div className="seo-form-group">
                      <label
                        htmlFor={`${page.key}-description`}
                      >
                        Meta Description
                      </label>

                      <textarea
                        id={`${page.key}-description`}
                        value={pageData.metaDescription}
                        onChange={(event) =>
                          updateField(
                            page.key,
                            "metaDescription",
                            event.target.value
                          )
                        }
                        placeholder={`Enter ${page.label} meta description`}
                        rows={4}
                      />

                      <span className="seo-field-hint">
                        Recommended: around 150–160 characters.
                      </span>
                    </div>

                    {/* Keywords */}
                    <div className="seo-form-group">
                      <label htmlFor={`${page.key}-keywords`}>
                        Keywords
                      </label>

                      <input
                        id={`${page.key}-keywords`}
                        type="text"
                        value={keywordsToString(
                          pageData.keywords
                        )}
                        onChange={(event) =>
                          updateKeywords(
                            page.key,
                            event.target.value
                          )
                        }
                        placeholder="welding training, welding courses, welding institute"
                      />

                      <span className="seo-field-hint">
                        Separate keywords using commas.
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}

          </div>

          {/* Bottom Save */}
          <div className="seo-bottom-actions">
            <button
              type="button"
              className="seo-save-button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </div>
      </section>
    </main>
  );
}