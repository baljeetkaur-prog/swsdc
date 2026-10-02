import Link from "next/link";
import Image from "next/image";
import "./AboutPage.css";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

export default function AboutPage() {
  return (
    <main className="about-page">
      {/* Banner */}
      <section className="about-banner">
        <div className="about-banner-content">
          <h1>About Us</h1>

          <div className="about-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>About Us</span>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="about-content-section">
        <div className="about-content-container">
          <div className="about-image-wrapper">
            <Image
              src="/images/about-image.png"
              alt="Singh Welding and Skills Development Centre"
              width={700}
              height={700}
              className="about-main-image"
            />

            <div className="about-small-logo">
              <Image
                src="/images/logo.png"
                alt="SWSDC Logo"
                width={100}
                height={100}
              />
            </div>
          </div>

          <div className="about-text-content">
            <span className="about-small-heading">WHO WE ARE</span>

            <h2>
              Building Skills, Shaping Futures Through Welding
            </h2>

            <p>
  Singh Welding and Skills Development Centre (SWSDC) carries a legacy
  that began in the 1980s with our father and brother. Over the years,
  we have built our experience in welding, fabrication, Body Maker
  (Vehicles), Gate & Grill, Stainless Steel Welding, MIG Welding,
  Stick Welding, and Industrial Repair.
</p>

<p>
  Today, we continue this legacy through practical training and
  industry-focused welding courses including ARC / MMA / Stick Welding
  (SMAW), MIG / MAG / CO2 Welding (GMAW), FCAW, TIG / ARGON Welding
  (GTAW), and PLASMA ARC CUTTING (PAC), while continuing to deliver
  quality welding and fabrication services.
</p>
<div className="about-phone">
  <div className="about-phone-icon">
    <FaPhoneAlt />
  </div>

  <div>
    <span>Call Us</span>
    <a href="tel:+917973851375">+91 79738-51375</a>
  </div>
</div>


          </div>
        </div>

        {/* Bottom Information */}
        <div className="about-bottom-info">
        <div className="about-location">
  <div className="about-location-heading">
    <FaMapMarkerAlt />
    <span className="about-info-label">OUR LOCATION</span>
  </div>

  <p>
     Hoshiarpur Road, Near Chadha Senetry Store, Phagwara, Punjab 144401
  </p>
</div>

          <div className="about-contact-box">
            <div>
              <span className="about-info-label">HAVE AN ENQUIRY?</span>
              <h3>Let's discuss your requirements.</h3>
            </div>

            <Link href="/contact-us" className="about-contact-button">
              Contact Us
              <span>→</span>
            </Link>
          </div>
        </div>
        
      </section>
      {/* Mission, Vision & Value */}
<section className="about-mvv-section">
  <div className="about-mvv-container">
    <div className="about-mvv-header">
      <span className="about-small-heading">WHAT DRIVES US</span>

      <h2>Our Mission, Vision & Value</h2>
    </div>

    <div className="about-mvv-grid">
      <div className="about-mvv-card">
        <h3>MISSION</h3>
        <p>
          To provide quality welding training and practical skills that
          prepare individuals for real-world opportunities and successful
          careers.
        </p>
      </div>

      <div className="about-mvv-card">
        <h3>VISION</h3>
        <p>
          To become a trusted centre for welding skills and technical
          training, creating skilled professionals ready to meet industry
          requirements.
        </p>
      </div>

      <div className="about-mvv-card">
        <h3>VALUE</h3>
        <p>
          We believe in quality, practical learning, hard work, honesty,
          safety, and continuous improvement in everything we do.
        </p>
      </div>
    </div>
  </div>
</section>
{/* Our Work */}
<section className="about-work-section">
  <div className="about-work-container">
    <div className="about-work-header">
      <span className="about-small-heading">OUR WORK</span>

      <h2>Some of Our Work</h2>
    </div>

    <div className="about-work-grid">
      <div className="about-work-image">
        <Image
          src="/images/img2.jpeg"
          alt="SWSDC Welding Work"
          width={500}
          height={500}
        />
      </div>

      <div className="about-work-image">
        <Image
          src="/images/img9.jpeg"
          alt="SWSDC Welding Work"
          width={500}
          height={500}
        />
      </div>

      <div className="about-work-image">
        <Image
          src="/images/img12.jpeg"
          alt="SWSDC Welding Work"
          width={500}
          height={500}
        />
      </div>

      <div className="about-work-image">
        <Image
          src="/images/img25.jpeg"
          alt="SWSDC Welding Work"
          width={500}
          height={500}
        />
      </div>

      <div className="about-work-image">
        <Image
          src="/images/img27.jpeg"
          alt="SWSDC Welding Work"
          width={500}
          height={500}
        />
      </div>

      <div className="about-work-image">
        <Image
          src="/images/img28.jpeg"
          alt="SWSDC Welding Work"
          width={500}
          height={500}
        />
      </div>

      <div className="about-work-image">
        <Image
          src="/images/img29.jpeg"
          alt="SWSDC Welding Work"
          width={500}
          height={500}
        />
      </div>

      <div className="about-work-image">
        <Image
          src="/images/img22.jpeg"
          alt="SWSDC Welding Work"
          width={500}
          height={500}
        />
      </div>

      <div className="about-work-image">
        <Image
          src="/images/img21.jpeg"
          alt="SWSDC Welding Work"
          width={500}
          height={500}
        />
      </div>
    </div>
  </div>
</section>
{/* ISO Certificate */}
<section className="about-certificate-section">
  <div className="about-certificate-container">
    <div className="about-certificate-image">
      <Image
        src="/images/certificate-new.png"
        alt="ISO IAF Certificate - Singh Welding and Skills Development Centre"
        width={800}
        height={600}
      />
    </div>

    <div className="about-certificate-content">
      <span className="about-small-heading">OUR CERTIFICATION</span>

      <h2>ISO-IAF Certified Organisation</h2>

      <p>
        Singh Welding and Skills Development Centre is proud to hold an
        ISO-IAF certification, reflecting our commitment to maintaining
        quality standards in our training and professional activities.
      </p>

      <p>
        The certification represents our focus on quality, proper processes,
        professional practices, and continuous improvement. It adds to our
        commitment to providing practical welding training and developing
        skills that meet professional and industry expectations.
      </p>

      <div className="about-certificate-points">
        <div className="about-certificate-point">
          <span>✓</span>
          <p>ISO-IAF Certified</p>
        </div>

        <div className="about-certificate-point">
          <span>✓</span>
          <p>Quality-Focused Training</p>
        </div>

        <div className="about-certificate-point">
          <span>✓</span>
          <p>Professional Standards</p>
        </div>

        <div className="about-certificate-point">
          <span>✓</span>
          <p>Commitment to Continuous Improvement</p>
        </div>
      </div>
    </div>
  </div>
</section>

    </main>
  );
}