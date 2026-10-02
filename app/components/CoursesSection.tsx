"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./CoursesSection.css";

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

export default function CoursesSection() {
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
    <>
      <section className="courses-section">
        <div className="courses-container">

          {/* Section Header */}
          <div className="courses-header">
            <h2>Our Courses</h2>

            <a href="/our-courses" className="courses-view-btn">
              View All Courses
              <span>→</span>
            </a>
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div className="courses-grid">
              {[1, 2, 3, 4, 5].map((item) => (
                <article className="course-card" key={item}>

                  <div className="course-thumbnail">
                    <div className="course-skeleton course-skeleton-thumbnail" />
                  </div>

                  <div className="course-content">
                    <div className="course-skeleton course-skeleton-title" />

                    <div className="course-meta">
                      <div className="course-meta-item">
                        <div className="course-skeleton course-skeleton-meta" />
                      </div>

                      <div className="course-meta-item">
                        <div className="course-skeleton course-skeleton-meta" />
                      </div>
                    </div>

                    <div className="practical-training">
                      <div className="course-skeleton course-skeleton-practical" />
                    </div>

                    <div className="course-skeleton course-skeleton-includes" />

                    <ul className="course-points">
                      {[1, 2, 3].map((point) => (
                        <li key={point}>
                          <div className="course-skeleton course-skeleton-point" />
                        </li>
                      ))}
                    </ul>

                    <div className="course-button-wrapper">
                      <div className="course-skeleton course-skeleton-button" />
                    </div>
                  </div>

                </article>
              ))}
            </div>
          )}

          {/* Courses Grid */}
          {!loading && courses.length > 0 && (
            <div className="courses-grid">
              {courses.slice(0, 5).map((course) => (
                <article className="course-card" key={course._id}>

                  {/* Thumbnail */}
                  <div className="course-thumbnail">
                    <Image
                      src={course.thumbnail}
                      alt={course.courseName}
                      fill
                      sizes="(max-width: 600px) 100vw, (max-width: 992px) 50vw, 33.333vw"
                      className="course-thumbnail-image"
                    />

                    <button
                      type="button"
                      className="course-play-btn"
                      onClick={() => openVideo(course.video)}
                      aria-label={`Play ${course.courseName}`}
                    >
                      <span className="play-icon">▶</span>
                    </button>
                  </div>

                  {/* Course Content */}
                  <div className="course-content">

                    <h3>{course.courseName}</h3>

                    {/* Course Meta */}
                    <div className="course-meta">

                      <div className="course-meta-item">
                        <span className="meta-icon">⚙</span>
                        <span>{course.category}</span>
                      </div>

                      <div className="course-meta-item">
                        <span className="meta-icon">◷</span>
                        <span>{course.duration}</span>
                      </div>

                    </div>

                    {/* Practical Training */}
                    <div className="practical-training">
                      <span className="check-icon">✓</span>
                      <span>100% Practical Training</span>
                    </div>

                    {/* Course Includes */}
                    <div className="course-includes">
                      It Includes:
                    </div>

                    {/* Course Key Features */}
                    <ul className="course-points">
                      {course.keyFeatures.map((feature, index) => (
                        <li key={index}>
                          <span className="point-icon">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Get Started */}
                    <div className="course-button-wrapper">
                      <button
                        type="button"
                        className="course-start-btn"
                        onClick={() =>
                          router.push(`/our-courses/${course.slug}`)
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

          {/* No Courses */}
          {!loading && courses.length === 0 && (
            <div className="courses-empty">
              No courses available at the moment.
            </div>
          )}

        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <div className="video-modal" onClick={closeVideo}>
          <div
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="video-close-btn"
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
              className="course-video"
            />
          </div>
        </div>
      )}
    </>
  );
}