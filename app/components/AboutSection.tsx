import Link from "next/link";
import Image from "next/image";
import "./AboutSection.css";

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        <div className="about-content">
       <span className="about-small-heading">
  WELDING & SKILL DEVELOPMENT
</span>

<h2>
  Empowering Skills.
  <br />
  Building Better Careers.
</h2>

          <p>
  Singh Welding and Skills Development Centre (SWSDC) provides practical
  welding training designed to prepare learners for real-world industrial
  environments. Our programs focus on developing strong technical skills,
  workplace confidence, and industry-ready expertise.
</p>

<p>
  With experienced trainers, hands-on learning, and a strong focus on
  practical techniques, SWSDC creates a learning environment where students
  can develop valuable welding skills and take the next step toward a
  successful career.
</p>

          <div className="about-buttons">
            <Link href="/our-courses" className="about-btn primary-btn">
              Explore Courses
            </Link>

            <Link href="/contact-us" className="about-btn secondary-btn">
              Get In Touch
            </Link>
          </div>
        </div>

        <div className="about-image-wrapper">
          <Image
            src="/images/about-sec-img.png"
            alt="Singh Welding and Skills Development Centre"
            width={700}
            height={600}
            className="about-image"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;