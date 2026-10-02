"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "./GallerySection.css";

type GalleryItem = {
  _id: string;
  type: "photo" | "video";
  src: string;
};

const VISIBLE_SLIDES = 3;
const MAX_VISIBLE_DOTS = 5;

export default function GallerySection() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [currentIndex, setCurrentIndex] =
    useState(VISIBLE_SLIDES);

  const [isTransitioning, setIsTransitioning] =
    useState(true);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await fetch("/api/gallery");

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load gallery."
          );
        }

        const photos = data.gallery.filter(
          (item: GalleryItem) =>
            item.type === "photo"
        );

        setGalleryItems(photos);
      } catch (error) {
        console.error(
          "Fetch homepage gallery error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchGallery();
  }, []);

  const extendedItems =
    galleryItems.length > 0
      ? [
          ...galleryItems.slice(-VISIBLE_SLIDES),
          ...galleryItems,
          ...galleryItems.slice(0, VISIBLE_SLIDES),
        ]
      : [];

  useEffect(() => {
    if (galleryItems.length <= VISIBLE_SLIDES) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [galleryItems.length]);

  const handleTransitionEnd = () => {
    if (
      currentIndex >=
      galleryItems.length + VISIBLE_SLIDES
    ) {
      setIsTransitioning(false);
      setCurrentIndex(VISIBLE_SLIDES);
    }

    if (currentIndex < VISIBLE_SLIDES) {
      setIsTransitioning(false);
      setCurrentIndex(
        galleryItems.length + VISIBLE_SLIDES - 1
      );
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    }
  }, [isTransitioning]);

  const getActiveDot = () => {
    if (galleryItems.length === 0) {
      return 0;
    }

    if (
      currentIndex >=
      galleryItems.length + VISIBLE_SLIDES
    ) {
      return 0;
    }

    if (currentIndex < VISIBLE_SLIDES) {
      return galleryItems.length - 1;
    }

    return currentIndex - VISIBLE_SLIDES;
  };

  const activeDot = getActiveDot();

  const getVisibleDotIndexes = () => {
    const totalItems = galleryItems.length;

    if (totalItems <= MAX_VISIBLE_DOTS) {
      return galleryItems.map((_, index) => index);
    }

    const half = Math.floor(MAX_VISIBLE_DOTS / 2);

    const indexes: number[] = [];

    for (let i = -half; i <= half; i++) {
      indexes.push(
        (activeDot + i + totalItems) % totalItems
      );
    }

    return indexes;
  };

  const visibleDotIndexes =
    getVisibleDotIndexes();

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setCurrentIndex(
      index + VISIBLE_SLIDES
    );
  };

  const goNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const goPrevious = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

if (loading) {
  return (
    <section className="gallery-section">
      <div className="gallery-skeleton-track">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            className="gallery-skeleton-slide"
            key={index}
          >
            <div className="gallery-skeleton-image" />
          </div>
        ))}
      </div>

      <div className="gallery-skeleton-dots">
        {Array.from({ length: 3 }).map((_, index) => (
          <span
            className="gallery-skeleton-dot"
            key={index}
          />
        ))}
      </div>
    </section>
  );
}

  if (galleryItems.length === 0) {
    return null;
  }

  return (
    <section className="gallery-section">

      {/* Previous Button */}

      <button
        type="button"
        className="gallery-arrow gallery-arrow-left"
        onClick={goPrevious}
        aria-label="Previous gallery image"
      >
        <span>‹</span>
      </button>


      {/* Gallery */}

      <div
        className="gallery-track"
        style={{
          transform: `translateX(calc(-${currentIndex} * var(--slide-width)))`,
          transition: isTransitioning
            ? "transform 0.7s ease-in-out"
            : "none",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedItems.map((item, index) => (
          <div
            className="gallery-slide"
            key={`${item._id}-${index}`}
          >
            <div className="gallery-image-wrapper">

              <Image
                src={item.src}
                alt={`SWSDC Gallery ${
                  index + 1
                }`}
                fill
                sizes="(max-width: 600px) 100vw, (max-width: 992px) 50vw, 33.333vw"
                className="gallery-image"
              />

            </div>
          </div>
        ))}
      </div>


      {/* Next Button */}

      <button
        type="button"
        className="gallery-arrow gallery-arrow-right"
        onClick={goNext}
        aria-label="Next gallery image"
      >
        <span>›</span>
      </button>


      {/* Dots */}

      <div className="gallery-dots">
        {visibleDotIndexes.map((index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to gallery image ${
              index + 1
            }`}
            className={`gallery-dot ${
              activeDot === index
                ? "active"
                : ""
            }`}
            onClick={() =>
              goToSlide(index)
            }
          />
        ))}
      </div>

    </section>
  );
}