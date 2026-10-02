"use client";

import { useEffect, useState } from "react";
import "./ReviewsSection.css";

interface GoogleReviewData {
  rating: number;
  userRatingCount: number;
  displayName: {
    text: string;
    languageCode: string;
  };
  googleMapsLinks?: {
    reviewsUri?: string;
  };
}

const reviewImages = Array.from(
  { length: 13 },
  (_, index) => `/images/review-${index + 1}.png`
);

export default function ReviewsSection() {
  const [reviewData, setReviewData] =
    useState<GoogleReviewData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/google-reviews");

        if (!response.ok) {
          throw new Error("Failed to fetch Google reviews");
        }

        const data = await response.json();

        setReviewData(data);
      } catch (error) {
        console.error("Error fetching Google reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <section className="reviews-section">
        <div className="reviews-heading">
          <span className="reviews-subtitle">CUSTOMER REVIEWS</span>

          <h2>
            What Our Customers Say
          </h2>

          <div className="reviews-loading">
            Loading reviews...
          </div>
        </div>
      </section>
    );
  }

  if (!reviewData) {
    return null;
  }

  const rating = reviewData.rating || 0;
  const reviewCount = reviewData.userRatingCount || 0;

  return (
    <section className="reviews-section">

      {/* HEADING */}
      <div className="reviews-heading">
        <span className="reviews-subtitle">
          CUSTOMER REVIEWS
        </span>

        <h2>
          What Our <span>Customers</span> Say
        </h2>

        <p>
          See what our customers have to say about{" "}
          {reviewData.displayName?.text}.
        </p>
      </div>

      {/* RATING + BUTTON */}
      <div className="reviews-top-row">

        {/* Rating Box */}
        <div className="reviews-rating-box">

          <img
            src="/images/google-logo.jpg"
            alt="Google"
            className="google-logo"
          />

          <div className="rating-content">

            <div className="rating-number">
              <strong>{rating.toFixed(1)}</strong>
              <span>/ 5</span>
            </div>

            <div className="rating-details">

              <div className="summary-stars">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={index}
                    className={
                      index < Math.round(rating)
                        ? "star active"
                        : "star"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>

              <span className="rating-count">
                Based on {reviewCount}{" "}
                {reviewCount === 1 ? "review" : "reviews"}
              </span>

            </div>

          </div>
        </div>

        {/* View Reviews Button */}
        {reviewData.googleMapsLinks?.reviewsUri && (
          <a
            href={reviewData.googleMapsLinks.reviewsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="reviews-button"
          >
            View All Reviews
          </a>
        )}

      </div>

      {/* REVIEW SCREENSHOTS */}
      <div className="reviews-slider-wrapper">

        <div className="reviews-slider">

          {/* First set */}
          <div className="reviews-track">
            {reviewImages.map((image, index) => (
              <div
                className="review-image"
                key={`first-${index}`}
              >
                <img
                  src={image}
                  alt={`Google review ${index + 1}`}
                />
              </div>
            ))}
          </div>

          {/* Duplicate set for seamless infinite loop */}
          <div
            className="reviews-track"
            aria-hidden="true"
          >
            {reviewImages.map((image, index) => (
              <div
                className="review-image"
                key={`second-${index}`}
              >
                <img
                  src={image}
                  alt=""
                />
              </div>
            ))}
          </div>

        </div>

      </div>

    </section>
  );
}