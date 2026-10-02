"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./OurCourses.css";

interface Course {
  _id: string;
  courseName: string;
  category: string;
  duration: string;
  keyFeatures: string[];
  thumbnail: string;
  video: string;
  slug: string;
}

export default function OurCourses() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");

        const data = await response.json();

        if (response.ok && data.success) {
          setCourses(data.courses);
        }
      } catch (error) {
        console.error("Fetch courses error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const openVideo = (video: string) => {
    setActiveVideo(video);
  };

  const closeVideo = () => {
    setActiveVideo(null);
  };

  return (
    <main className="ourcourses-page">

      {/* ================================
          BANNER
      ================================= */}

      <section className="ourcourses-banner">
        <div className="ourcourses-banner-content">
          <h1>Our Courses</h1>

          <div className="ourcourses-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Our Courses</span>
          </div>
        </div>
      </section>


      {/* ================================
          COURSES INTRO
      ================================= */}

      <section className="ourcourses-intro">
        <div className="ourcourses-container">

          <div className="ourcourses-intro-content">

            <span className="ourcourses-small-title">
              OUR COURSES
            </span>

            <h2>Professional Welding Courses</h2>

            <p>
              Learn practical welding skills through industry-focused
              training designed to build strong technical knowledge and
              hands-on experience. Our courses cover different welding
              processes and practical applications.
            </p>

          </div>

        </div>
      </section>


      {/* ================================
          COURSES
      ================================= */}

      <section className="ourcourses-courses">
        <div className="ourcourses-container">

          {/* ================================
              LOADING SKELETON
          ================================= */}

          {loading && (
            <div className="ourcourses-grid">

              {[1, 2, 3, 4, 5].map((item) => (
                <article
                  className="ourcourses-card"
                  key={item}
                >

                  {/* Thumbnail Skeleton */}

                  <div className="ourcourses-thumbnail">

                    <div className="ourcourses-skeleton ourcourses-skeleton-thumbnail" />

                  </div>


                  {/* Content Skeleton */}

                  <div className="ourcourses-content">

                    <div className="ourcourses-skeleton ourcourses-skeleton-title" />


                    {/* Meta */}

                    <div className="ourcourses-meta">

                      <div className="ourcourses-meta-item">
                        <div className="ourcourses-skeleton ourcourses-skeleton-meta" />
                      </div>

                      <div className="ourcourses-meta-item">
                        <div className="ourcourses-skeleton ourcourses-skeleton-meta" />
                      </div>

                    </div>


                    {/* Practical */}

                    <div className="ourcourses-practical">

                      <div className="ourcourses-skeleton ourcourses-skeleton-practical" />

                    </div>


                    {/* Includes */}

                    <div className="ourcourses-skeleton ourcourses-skeleton-includes" />


                    {/* Points */}

                    <ul className="ourcourses-points">

                      {[1, 2, 3].map((point) => (
                        <li key={point}>

                          <div className="ourcourses-skeleton ourcourses-skeleton-point" />

                        </li>
                      ))}

                    </ul>


                    {/* Button */}

                    <div className="ourcourses-button-wrapper">

                      <div className="ourcourses-skeleton ourcourses-skeleton-button" />

                    </div>

                  </div>

                </article>
              ))}

            </div>
          )}


          {/* ================================
              COURSES GRID
          ================================= */}

          {!loading && courses.length > 0 && (
            <div className="ourcourses-grid">

              {courses.map((course) => (
                <article
                  className="ourcourses-card"
                  key={course._id}
                >

                  {/* Thumbnail */}

                  <div className="ourcourses-thumbnail">

                    <Image
                      src={course.thumbnail}
                      alt={course.courseName}
                      fill
                      sizes="(max-width: 600px) 100vw, (max-width: 992px) 50vw, 33.333vw"
                      className="ourcourses-thumbnail-image"
                    />

                    <button
                      type="button"
                      className="ourcourses-play-btn"
                      onClick={() => openVideo(course.video)}
                      aria-label={`Play ${course.courseName}`}
                    >
                      <span className="ourcourses-play-icon">
                        ▶
                      </span>
                    </button>

                  </div>


                  {/* Course Content */}

                  <div className="ourcourses-content">

                    <h3>{course.courseName}</h3>


                    {/* Course Meta */}

                    <div className="ourcourses-meta">

                      <div className="ourcourses-meta-item">

                        <span className="ourcourses-meta-icon">
                          ⚙
                        </span>

                        <span>{course.category}</span>

                      </div>


                      <div className="ourcourses-meta-item">

                        <span className="ourcourses-meta-icon">
                          ◷
                        </span>

                        <span>{course.duration}</span>

                      </div>

                    </div>


                    {/* Practical Training */}

                    <div className="ourcourses-practical">

                      <span className="ourcourses-check-icon">
                        ✓
                      </span>

                      <span>100% Practical Training</span>

                    </div>


                    {/* Course Includes */}

                    <div className="ourcourses-includes">
                      It Includes:
                    </div>


                    {/* Course Features */}

                    <ul className="ourcourses-points">

                      {course.keyFeatures.map((feature, index) => (
                        <li key={index}>

                          <span className="ourcourses-point-icon">
                            ✓
                          </span>

                          <span>{feature}</span>

                        </li>
                      ))}

                    </ul>


                    {/* Get Started */}

                    <div className="ourcourses-button-wrapper">

                      <button
                        type="button"
                        className="ourcourses-start-btn"
                        onClick={() =>
                          router.push(
                            `/our-courses/${course.slug}`
                          )
                        }
                      >
                        Get Started
                      </button>

                    </div>

                  </div>

                </article>
              ))}

            </div>
          )}


          {/* ================================
              NO COURSES
          ================================= */}

          {!loading && courses.length === 0 && (
            <div className="ourcourses-empty">
              No courses available at the moment.
            </div>
          )}

        </div>
      </section>


      {/* ================================
          VIDEO MODAL
      ================================= */}

      {activeVideo && (
        <div
          className="ourcourses-video-modal"
          onClick={closeVideo}
        >

          <div
            className="ourcourses-video-modal-content"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              type="button"
              className="ourcourses-video-close-btn"
              onClick={closeVideo}
              aria-label="Close video"
            >
              ×
            </button>

            <video
              src={activeVideo}
              controls
              autoPlay
              playsInline
              className="ourcourses-video"
            />

          </div>

        </div>
      )}

    </main>
  );
}