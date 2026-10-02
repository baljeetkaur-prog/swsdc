"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaLayerGroup, FaRegClock, FaCheckCircle } from "react-icons/fa";
import "./CourseDetail.css";

interface Course {
  _id: string;
  courseName: string;
  category: string;
  duration: string;
  keyFeatures: string[];
  description: string;

  curriculum: {
    number: string;
    title: string;
  }[];

  mentor: {
    name: string;
    designation: string;
    about: string;
    image: string;
  };

  thumbnail: string;
  video: string;
  slug: string;
}

interface CourseDetailProps {
  course: Course;
}

export default function CourseDetail({
  course,
}: CourseDetailProps) {
  const router = useRouter();

  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // =========================
  // FETCH RELATED COURSES
  // =========================
  useEffect(() => {
    const fetchRelatedCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        const data = await response.json();

        if (response.ok && data.success) {
          const otherCourses = data.courses.filter(
            (item: Course) => item.slug !== course.slug
          );

          setRelatedCourses(otherCourses);
        }
      } catch (error) {
        console.error("Fetch related courses error:", error);
      }
    };

    fetchRelatedCourses();
  }, [course.slug]);

  // =========================
  // VIDEO
  // =========================
  const openVideo = (video: string) => {
    setActiveVideo(video);
  };

  const closeVideo = () => {
    setActiveVideo(null);
  };

  return (
    <main className="course-detail-page">

      {/* =========================
          BANNER
      ========================= */}
      <section className="course-detail-banner">
        <div className="course-detail-banner-content">

          <h1>{course.courseName}</h1>

          <div className="course-detail-breadcrumb">
            <Link href="/">Home</Link>

            <span>/</span>

            <Link href="/our-courses">
              Courses
            </Link>

            <span>/</span>

            <span>{course.courseName}</span>
          </div>

        </div>
      </section>

      {/* =========================
          COURSE INTRO
      ========================= */}
      <section className="course-detail-section">
        <div className="course-detail-container">

          <div className="course-detail-intro">

            {/* LEFT */}
            <div className="course-detail-info">

              <h2>{course.courseName}</h2>

              <p className="course-detail-description">
                {course.description}
              </p>

              <button
                type="button"
                className="course-admission-btn"
                onClick={() => {
                  const message = encodeURIComponent(
                    "Hi, I would like to enquire about the courses and admission process. Please provide me with more information."
                  );

                  window.open(
                    `https://wa.me/917973851375?text=${message}`,
                    "_blank"
                  );
                }}
              >
                Contact for Admission
                <span>→</span>
              </button>

            </div>

            {/* RIGHT */}
            <div className="course-detail-video-card">

              <Image
                src={course.thumbnail}
                alt={course.courseName}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="course-detail-thumbnail"
              />

              <button
                type="button"
                className="course-detail-play-btn"
                onClick={() => openVideo(course.video)}
                aria-label={`Play ${course.courseName}`}
              >
                <span>▶</span>
              </button>

            </div>

          </div>

          {/* =========================
              CURRICULUM + COURSE INFO
          ========================= */}
          <div className="course-detail-middle">

            {/* Curriculum */}
            <div className="course-curriculum">

              <h2>Course Curriculum</h2>

              <div className="course-curriculum-grid">
                {course.curriculum.map((item, index) => (
                  <div
                    className="curriculum-item"
                    key={`${item.number}-${index}`}
                  >
                    <span className="curriculum-number">
                      {item.number}
                    </span>

                    <span className="curriculum-title">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>

            </div>

            {/* Course Info */}
            <aside className="course-detail-sidebar">

              <div className="course-info-box">
                <span className="course-info-label">
                  Category
                </span>

                <strong>
                  <FaLayerGroup />
                  {course.category}
                </strong>
              </div>

              <div className="course-info-box">
                <span className="course-info-label">
                  Duration
                </span>

                <strong>
                  <FaRegClock />
                  {course.duration}
                </strong>
              </div>

              <div className="course-info-box">
                <span className="course-info-label">
                  Training
                </span>

                <strong>
                  <FaCheckCircle />
                  100% Practical
                </strong>
              </div>

            </aside>

          </div>

          {/* =========================
              MENTOR
          ========================= */}
          <section className="course-mentor-section">

            <div className="course-mentor-image">

              <Image
                src={course.mentor.image}
                alt={course.mentor.name}
                fill
                sizes="(max-width: 700px) 100vw, 350px"
                className="course-mentor-photo"
              />

            </div>

            <div className="course-mentor-content">

              <span className="course-mentor-label">
                Course Mentor
              </span>

              <h2>{course.mentor.name}</h2>

              <h3>{course.mentor.designation}</h3>

              <p>{course.mentor.about}</p>

            </div>

          </section>

          {/* =========================
              RELATED COURSES
          ========================= */}
          {relatedCourses.length > 0 && (
            <section className="related-courses-section">

              <div className="related-courses-heading">

                <h2>Related Courses</h2>

                <Link href="/our-courses">
                  View All Courses →
                </Link>

              </div>

              <div className="related-courses-grid">

                {relatedCourses.slice(0, 3).map((relatedCourse) => (
                  <article
                    className="related-course-card"
                    key={relatedCourse._id}
                  >

                    {/* Thumbnail */}
                    <div className="related-course-thumbnail">

                      <Image
                        src={relatedCourse.thumbnail}
                        alt={relatedCourse.courseName}
                        fill
                        sizes="(max-width: 600px) 100vw, (max-width: 992px) 50vw, 33.333vw"
                        className="related-course-thumbnail-image"
                      />

                      <button
                        type="button"
                        className="related-course-play-btn"
                        onClick={() =>
                          openVideo(relatedCourse.video)
                        }
                        aria-label={`Play ${relatedCourse.courseName}`}
                      >
                        <span className="related-play-icon">
                          ▶
                        </span>
                      </button>

                    </div>

                    {/* Content */}
                    <div className="related-course-content">

                      <h3>{relatedCourse.courseName}</h3>

                      {/* Meta */}
                      <div className="related-course-meta">

                        <div className="related-course-meta-item">
                          <span className="related-meta-icon">
                            ⚙
                          </span>

                          <span>
                            {relatedCourse.category}
                          </span>
                        </div>

                        <div className="related-course-meta-item">
                          <span className="related-meta-icon">
                            ◷
                          </span>

                          <span>
                            {relatedCourse.duration}
                          </span>
                        </div>

                      </div>

                      {/* Practical Training */}
                      <div className="related-practical-training">
                        <span className="related-check-icon">
                          ✓
                        </span>

                        <span>
                          100% Practical Training
                        </span>
                      </div>

                      {/* Includes */}
                      <div className="related-course-includes">
                        It Includes:
                      </div>

                      {/* Features */}
                      <ul className="related-course-points">

                        {relatedCourse.keyFeatures.map(
                          (feature, index) => (
                            <li key={index}>

                              <span className="related-point-icon">
                                ✓
                              </span>

                              <span>
                                {feature}
                              </span>

                            </li>
                          )
                        )}

                      </ul>

                      {/* Button */}
                      <div className="related-course-button-wrapper">

                        <button
                          type="button"
                          className="related-course-start-btn"
                          onClick={() =>
                            router.push(
                              `/our-courses/${relatedCourse.slug}`
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

            </section>
          )}

        </div>
      </section>

      {/* =========================
          VIDEO MODAL
      ========================= */}
      {activeVideo && (
        <div
          className="course-detail-video-modal"
          onClick={closeVideo}
        >

          <div
            className="course-detail-video-modal-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="course-detail-video-close"
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
              className="course-detail-video"
            />

          </div>

        </div>
      )}

    </main>
  );
}