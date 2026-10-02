"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import "./AdminLayout.css";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <main className="admin-layout">

      {/* Sidebar */}
      <aside className="admin-sidebar">

        <div className="admin-sidebar-top">

          <div className="admin-sidebar-logo">
            <img
              src="/images/logo-wo-bg.png"
              alt="SWSDC Logo"
            />

            <div>
              <h2>SWSDC</h2>
              <span>Admin Panel</span>
            </div>
          </div>

          <div className="admin-sidebar-divider" />

          <nav className="admin-sidebar-nav">

            {/* Dashboard */}
            <button
              className="admin-nav-item"
              onClick={() =>
                router.push("/admin/dashboard")
              }
            >
              <span className="admin-nav-icon">
                ▦
              </span>

              <span className="admin-nav-text">
                Dashboard
              </span>
            </button>


            {/* Certificates */}
            <div className="admin-nav-section">

              <p className="admin-nav-section-title">
                CERTIFICATES
              </p>

              <button
                className="admin-nav-item"
                onClick={() =>
                  router.push("/admin/upload")
                }
              >
                <span className="admin-nav-icon">
                  ＋
                </span>

                <span className="admin-nav-text">
                  Upload Certificate
                </span>
              </button>

              <button
                className="admin-nav-item"
                onClick={() =>
                  router.push("/admin/certificates")
                }
              >
                <span className="admin-nav-icon">
                  ▤
                </span>

                <span className="admin-nav-text">
                  Manage Certificates
                </span>
              </button>

            </div>


            {/* Courses */}
            <div className="admin-nav-section">

              <p className="admin-nav-section-title">
                COURSES
              </p>

              <button
                className="admin-nav-item"
                onClick={() =>
                  router.push("/admin/add-course")
                }
              >
                <span className="admin-nav-icon">
                  ＋
                </span>

                <span className="admin-nav-text">
                  Upload Course
                </span>
              </button>

              <button
                className="admin-nav-item"
                onClick={() =>
                  router.push("/admin/courses")
                }
              >
                <span className="admin-nav-icon">
                  ▤
                </span>

                <span className="admin-nav-text">
                  Manage Courses
                </span>
              </button>

            </div>


            {/* Blogs */}
            <div className="admin-nav-section">

              <p className="admin-nav-section-title">
                BLOGS
              </p>

              <button
                className="admin-nav-item"
                onClick={() =>
                  router.push("/admin/blogs/create")
                }
              >
                <span className="admin-nav-icon">
                  ＋
                </span>

                <span className="admin-nav-text">
                  Upload Blog
                </span>
              </button>

              <button
                className="admin-nav-item"
                onClick={() =>
                  router.push("/admin/blogs")
                }
              >
                <span className="admin-nav-icon">
                  ▤
                </span>

                <span className="admin-nav-text">
                  Manage Blogs
                </span>
              </button>

            </div>
            {/* Gallery */}
<div className="admin-nav-section">

  <p className="admin-nav-section-title">
    GALLERY
  </p>

  <button
    className="admin-nav-item"
    onClick={() =>
      router.push("/admin/gallery")
    }
  >
    <span className="admin-nav-icon">
      ▧
    </span>

    <span className="admin-nav-text">
      Manage Gallery
    </span>
  </button>

</div>


            {/* Contact Queries */}
            <div className="admin-nav-section">

              <p className="admin-nav-section-title">
                CONTACT
              </p>

              <button
                className="admin-nav-item"
                onClick={() =>
                  router.push("/admin/queries")
                }
              >
                <span className="admin-nav-icon">
                  ✉
                </span>

                <span className="admin-nav-text">
                  Contact Queries
                </span>
              </button>

            </div>


            {/* Website */}
            <div className="admin-nav-section">

              <p className="admin-nav-section-title">
                WEBSITE
              </p>

              <button
                className="admin-nav-item"
                onClick={() =>
                  router.push("/admin/seo-settings")
                }
              >
                <span className="admin-nav-icon">
                  ⚙
                </span>

                <span className="admin-nav-text">
                  SEO Settings
                </span>
              </button>

            </div>

          </nav>
        </div>

      </aside>


      {/* Main Area */}
      <section className="admin-main">

        {/* Topbar */}
        <header className="admin-topbar">

          <div className="admin-topbar-left">
            <p>ADMIN PANEL</p>

            <h1>
              SWSDC Administration
            </h1>
          </div>

          <div className="admin-topbar-right">

            <div className="admin-status">
              <span className="admin-status-dot" />

              <span>
                Admin
              </span>
            </div>

            <button
              className="admin-topbar-logout"
              onClick={handleLogout}
            >
              <span>↪</span>

              <span>
                Logout
              </span>
            </button>

          </div>

        </header>


        {/* Page Content */}
        <div className="admin-page-content">
          {children}
        </div>

      </section>

    </main>
  );
}