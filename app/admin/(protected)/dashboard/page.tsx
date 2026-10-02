"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./AdminDashboard.css";

interface DashboardStats {
  certificates: number;
  courses: number;
  blogs: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats>({
    certificates: 0,
    courses: 0,
    blogs: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [certificatesRes, coursesRes, blogsRes] =
          await Promise.all([
            fetch("/api/certificates"),
            fetch("/api/courses"),
            fetch("/api/blogs"),
          ]);

        const certificatesData = await certificatesRes.json();
        const coursesData = await coursesRes.json();
        const blogsData = await blogsRes.json();

        setStats({
          certificates: certificatesData.success
            ? certificatesData.certificates.length
            : 0,

          courses: coursesData.success
            ? coursesData.courses.length
            : 0,

          blogs: blogsData.success
            ? blogsData.blogs.length
            : 0,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="admin-dashboard-content">

      {/* Welcome */}
      <section className="admin-welcome-section">
        <div>
          <p className="admin-section-label">
            WELCOME BACK
          </p>

          <h2>Manage your website</h2>

          <p className="admin-welcome-text">
            Manage certificates, student records and blog
            content from your administration panel.
          </p>
        </div>

        <div className="admin-welcome-decoration">
          <span>SWSDC</span>
        </div>
      </section>


      {/* Statistics */}
      <section className="admin-stats-section">
        <div className="admin-section-heading">
          <div>
            <p className="admin-section-label">
              OVERVIEW
            </p>

            <h2>Website Statistics</h2>
          </div>
        </div>

        <div className="admin-dashboard-cards">

          {/* Certificates */}
          <div className="admin-dashboard-card">
            <div className="admin-card-icon">
              <span>▤</span>
            </div>

            <div className="admin-card-content">
              <p>Total Certificates</p>

              <h2>
                {loading ? "..." : stats.certificates}
              </h2>

              <span className="admin-card-description">
                Certificates in database
              </span>
            </div>
          </div>


          {/* Courses */}
          <div className="admin-dashboard-card">
            <div className="admin-card-icon orange">
              <span>＋</span>
            </div>

            <div className="admin-card-content">
              <p>Total Courses</p>

              <h2>
                {loading ? "..." : stats.courses}
              </h2>

              <span className="admin-card-description">
                Courses available on website
              </span>
            </div>
          </div>


          {/* Blogs */}
          <div className="admin-dashboard-card">
            <div className="admin-card-icon">
              <span>▤</span>
            </div>

            <div className="admin-card-content">
              <p>Total Blogs</p>

              <h2>
                {loading ? "..." : stats.blogs}
              </h2>

              <span className="admin-card-description">
                Published blog posts
              </span>
            </div>
          </div>

        </div>
      </section>


      {/* Quick Actions */}
      <section className="admin-quick-section">

        <div className="admin-section-heading">
          <div>
            <p className="admin-section-label">
              QUICK ACTIONS
            </p>

            <h2>Manage Website</h2>
          </div>
        </div>


        <div className="admin-quick-grid">

          <button
            className="admin-quick-card"
            onClick={() =>
              router.push("/admin/upload")
            }
          >
            <div className="admin-quick-icon">
              ＋
            </div>

            <div>
              <h3>Upload Certificate</h3>

              <p>
                Add a new student certificate to the
                database.
              </p>
            </div>

            <span className="admin-quick-arrow">
              →
            </span>
          </button>


          <button
            className="admin-quick-card"
            onClick={() =>
              router.push("/admin/certificates")
            }
          >
            <div className="admin-quick-icon">
              ▤
            </div>

            <div>
              <h3>View Certificates</h3>

              <p>
                View and manage all uploaded
                certificates.
              </p>
            </div>

            <span className="admin-quick-arrow">
              →
            </span>
          </button>


          <button
            className="admin-quick-card"
            onClick={() =>
              router.push("/admin/blogs")
            }
          >
            <div className="admin-quick-icon">
              ✎
            </div>

            <div>
              <h3>Manage Blogs</h3>

              <p>
                Create, edit and manage website blogs.
              </p>
            </div>

            <span className="admin-quick-arrow">
              →
            </span>
          </button>
          <button
  className="admin-quick-card"
  onClick={() =>
    router.push("/admin/change-password")
  }
>
  <div className="admin-quick-icon">
    🔒
  </div>

  <div>
    <h3>Change Password</h3>

    <p>
      Update the password for your admin account.
    </p>
  </div>

  <span className="admin-quick-arrow">
    →
  </span>
</button>
<button
  className="admin-quick-card"
  onClick={() =>
    router.push("/admin/gallery")
  }
>
  <div className="admin-quick-icon">
    ▧
  </div>

  <div>
    <h3>Manage Gallery</h3>

    <p>
      Upload and manage website photos and
      videos.
    </p>
  </div>

  <span className="admin-quick-arrow">
    →
  </span>
</button>

        </div>
      </section>

    </div>
  );
}