"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import "./Navbar.css";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about-us" },
  { name: "Courses", href: "/our-courses" },
  { name: "Services", href: "/our-services" },
  { name: "Gallery", href: "/gallery" },
  { name: "Blogs", href: "/blogs" },
  { name: "Contact Us", href: "/contact-us" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar-wrapper">

      {/* =========================
          TOP CONTACT BAR
      ========================= */}

      <div className="navbar-contact-section">
        <div className="navbar-contact-container">

          {/* Left Side */}
          <div className="contact-details">

            <a
              href="tel:+917973851375"
              className="contact-item"
            >
              <FaPhoneAlt />
              <span>+91 79738-51375</span>
            </a>

            <a
              href="mailto:singhweldingwork@gmail.com"
              className="contact-item"
            >
              <FaEnvelope />
              <span>singhweldingwork@gmail.com</span>
            </a>

          </div>

          {/* Right Side */}
          <div className="social-icons">

            <a
              href="https://www.facebook.com/share/1CzstoWQx5/"
              aria-label="Facebook"
              className="social-icon"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.instagram.com/welding_traning_centre?igsi=MTk0bW8xdmtocjRmZg=="
              aria-label="Instagram"
              className="social-icon"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.youtube.com/@singhweldingswsdc"
              aria-label="YouTube"
              className="social-icon"
            >
              <FaYoutube />
            </a>

          </div>

        </div>
      </div>


      {/* =========================
          MAIN HEADER
      ========================= */}

      <div className="navbar-top-section">

        <div className="navbar-top-container">

          {/* Logo + Brand */}
          <Link
            href="/"
            className="navbar-brand"
            onClick={closeMenu}
          >

            <Image
              src="/images/logo.png"
              alt="SWSDC Logo"
              width={250}
              height={160}
              priority
              className="navbar-logo-image"
            />

            <div className="brand-name">
              <span>SINGH WELDING AND SKILLS</span>
              <span>DEVELOPMENT CENTRE (SWSDC)</span>
            </div>

          </Link>


          {/* Desktop Verify Button */}
          <Link
            href="/verify-certificate"
            className="verify-btn desktop-verify"
          >
            Verify Certificate
          </Link>


          {/* Mobile Hamburger */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <FaBars />
          </button>

        </div>

      </div>


      {/* =========================
          DESKTOP NAVIGATION
      ========================= */}

      <div className="navbar-menu-section">

        <nav className="navbar-menu">

          {navItems.map((item) => (
  <Link
    key={item.name}
    href={item.href}
    className={pathname === item.href ? "active" : ""}
  >
    {item.name}
  </Link>
))}

        </nav>

      </div>


      {/* =========================
          MOBILE OVERLAY
      ========================= */}

      <div
        className={`mobile-menu-overlay ${
          menuOpen ? "active" : ""
        }`}
        onClick={closeMenu}
      />


      {/* =========================
          MOBILE SIDEBAR
      ========================= */}

      <aside
        className={`mobile-sidebar ${
          menuOpen ? "open" : ""
        }`}
      >

        {/* Sidebar Header */}
        <div className="mobile-sidebar-header">

          <span>Menu</span>

          <button
            type="button"
            className="mobile-close-btn"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>

        </div>


        {/* Sidebar Navigation */}
        <nav className="mobile-sidebar-nav">

          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={closeMenu}
            >
              {item.name}
            </Link>
          ))}

        </nav>


        {/* Sidebar Verify Button */}
        <div className="mobile-sidebar-footer">

          <Link
            href="/verify-certificate"
            className="mobile-verify-btn"
            onClick={closeMenu}
          >
            Verify Certificate
          </Link>

        </div>

      </aside>

    </header>
  );
}