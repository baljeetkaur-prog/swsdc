"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "./Gallery.css";

type GalleryItem = {
  _id: string;
  type: "photo" | "video";
  src: string;
};

const tabs = ["All", "Photos", "Videos"] as const;

type Tab = (typeof tabs)[number];

export default function Gallery() {
  const [activeTab, setActiveTab] =
    useState<Tab>("All");

  const [galleryItems, setGalleryItems] =
    useState<GalleryItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await fetch(
          "/api/gallery"
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to load gallery."
          );
        }

        setGalleryItems(data.gallery);
      } catch (error) {
        console.error(
          "Fetch gallery error:",
          error
        );

        setError(
          "Unable to load gallery right now."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchGallery();
  }, []);

  const filteredItems =
    activeTab === "All"
      ? galleryItems
      : galleryItems.filter((item) =>
          activeTab === "Photos"
            ? item.type === "photo"
            : item.type === "video"
        );

  return (
    <main className="gallery-page">

      {/* Banner */}

      <section className="gallery-banner">
        <div className="gallery-banner-content">
          <h1>Gallery</h1>

          <div className="gallery-breadcrumb">
            <Link href="/">Home</Link>

            <span>/</span>

            <span>Gallery</span>
          </div>
        </div>
      </section>


      {/* Gallery */}

      <section className="gallery-section">
        <div className="gallery-container">

          {/* Tabs */}

          <div className="gallery-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`gallery-tab ${
                  activeTab === tab
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveTab(tab)
                }
              >
                {tab}
              </button>
            ))}
          </div>


          {/* Loading Skeleton */}

          {loading && (
            <div className="gallery-skeleton-grid">
              {Array.from({ length: 6 }).map(
                (_, index) => (
                  <div
                    className="gallery-skeleton-item"
                    key={index}
                  >
                    <div className="gallery-skeleton-image" />
                  </div>
                )
              )}
            </div>
          )}


          {/* Error */}

          {!loading && error && (
            <div className="gallery-status">
              {error}
            </div>
          )}


          {/* Empty */}

          {!loading &&
            !error &&
            filteredItems.length === 0 && (
              <div className="gallery-status">
                No gallery items available.
              </div>
            )}


          {/* Gallery Grid */}

          {!loading &&
            !error &&
            filteredItems.length > 0 && (
              <div className="gallery-grid">
                {filteredItems.map(
                  (item, index) => (
                    <div
                      className="gallery-item"
                      key={item._id}
                    >
                      {item.type === "photo" ? (
                        <Image
                          src={item.src}
                          alt={`SWSDC Gallery ${
                            index + 1
                          }`}
                          width={600}
                          height={500}
                        />
                      ) : (
                        <video
                          src={item.src}
                          controls
                          preload="metadata"
                          playsInline
                        />
                      )}
                    </div>
                  )
                )}
              </div>
            )}

        </div>
      </section>
    </main>
  );
}