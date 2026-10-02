import Link from "next/link";
import "./CtaSection.css";
import { FaArrowRight } from "react-icons/fa";

export default function CtaSection() {
  return (
    <section className="cta-section">
      <div className="cta-box">
        <h2>
          Take the next step toward building your skills and your future.
        </h2>

  <Link href="/our-courses" className="cta-button">
  Find a Course
  <FaArrowRight />
</Link>
      </div>
    </section>
  );
}