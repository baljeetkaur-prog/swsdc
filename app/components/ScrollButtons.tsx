"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp, FaArrowUp } from "react-icons/fa";
import "./ScrollButtons.css";

export default function ScrollButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        documentHeight > 0
          ? (scrollTop / documentHeight) * 360
          : 0;

      setScrollProgress(Math.min(progress, 360));
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="floating-buttons">
      {/* WhatsApp */}
      <a
        href="https://wa.me/917973851375"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-button whatsapp-button"
        aria-label="Chat with us on WhatsApp"
      >
        <FaWhatsapp />
      </a>

      {/* Scroll To Top */}
      {showScrollTop && (
        <button
          type="button"
          className="floating-button scroll-top-button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          style={
            {
              "--scroll-progress": `${scrollProgress}deg`,
            } as React.CSSProperties
          }
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
}