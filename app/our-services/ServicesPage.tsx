"use client";

import Link from "next/link";
import "./ServicesPage.css";
import {
  FaCar,
  FaDoorOpen,
  FaCogs,
  FaFire,
  FaTools,
  FaIndustry,
} from "react-icons/fa";
import Figures from "../components/Figures";

export default function ServicesPage() {
  return (
    <main className="servicespg-page">

      {/* ================================
          BANNER
      ================================= */}

      <section className="servicespg-banner">
        <div className="servicespg-banner-content">

          <h1>Our Services</h1>

          <div className="servicespg-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Services</span>
          </div>

        </div>
      </section>


      {/* ================================
          SERVICES INTRO
      ================================= */}

      <section className="servicespg-intro">
        <div className="servicespg-container">

          <div className="servicespg-intro-content">

            <span className="servicespg-small-title">
              OUR SERVICES
            </span>

            <h2>Welding &amp; Fabrication Solutions</h2>

            <p>
              We provide professional welding, fabrication and structural
              work for residential, commercial and industrial requirements.
              Our services focus on strong construction, quality workmanship
              and reliable results.
            </p>

          </div>

        </div>
      </section>
      {/* ================================
    DETAILED SERVICES
================================ */}

{/* ================================
    DETAILED SERVICES
================================ */}
{/* ================================
    DETAILED SERVICES
================================ */}

<section className="servicespg-services">
  <div className="servicespg-container">

    <div className="servicespg-services-grid">

      {/* BODY MAKER */}
      <article className="servicespg-service-card">
        <div className="servicespg-service-icon">
          <FaCar />
        </div>

        <div className="servicespg-service-content">
          <h3>Body Maker (Vehicles)</h3>

          <p>
            Our vehicle body fabrication work covers the construction,
            modification and repair of metal body structures for different
            types of vehicles. This includes body frames, panels,
            reinforcements and customised metal components.
          </p>

          <p>
            We focus on accurate fabrication, proper joining and strong
            structural support according to the vehicle and its intended use.
          </p>
        </div>
      </article>


      {/* GATE & GRILL */}
      <article className="servicespg-service-card">
        <div className="servicespg-service-icon">
          <FaDoorOpen />
        </div>

        <div className="servicespg-service-content">
          <h3>Gate &amp; Grill Fabrication</h3>

          <p>
            We fabricate metal gates, window grills, safety grills,
            partitions and related metalwork for residential, commercial
            and other property requirements.
          </p>

          <p>
            Designs can be produced according to required dimensions,
            layout and functional requirements while maintaining a strong
            and durable structure.
          </p>
        </div>
      </article>


      {/* STAINLESS STEEL */}
      <article className="servicespg-service-card">
        <div className="servicespg-service-icon">
          <FaCogs />
        </div>

        <div className="servicespg-service-content">
          <h3>Stainless Steel Welding</h3>

          <p>
            Stainless steel welding and fabrication is available for
            railings, frames, supports, fittings, structures and other
            stainless steel applications.
          </p>

          <p>
            The work is carried out with attention to clean joints,
            accurate fabrication and a suitable finish for the intended
            application.
          </p>
        </div>
      </article>


      {/* MIG WELDING */}
      <article className="servicespg-service-card">
        <div className="servicespg-service-icon">
          <FaFire />
        </div>

        <div className="servicespg-service-content">
          <h3>MIG Welding</h3>

          <p>
            MIG welding is suitable for a wide range of fabrication jobs
            where efficient and consistent welding is required. It can be
            used for frames, metal components, structures and general
            fabrication work.
          </p>

          <p>
            Welding parameters and techniques are selected according to
            the material, thickness and requirements of the project.
          </p>
        </div>
      </article>


      {/* STICK WELDING */}
      <article className="servicespg-service-card">
        <div className="servicespg-service-icon">
          <FaTools />
        </div>

        <div className="servicespg-service-content">
          <h3>Stick Welding</h3>

          <p>
            Stick welding is used for structural fabrication, heavy-duty
            metalwork, repair jobs and applications where dependable
            welded joints are required.
          </p>

          <p>
            It is suitable for different site and workshop applications,
            including structural components, supports and repair work.
          </p>
        </div>
      </article>


      {/* INDUSTRIAL REPAIR */}
      <article className="servicespg-service-card">
        <div className="servicespg-service-icon">
          <FaIndustry />
        </div>

        <div className="servicespg-service-content">
          <h3>Industrial Repair</h3>

          <p>
            Our industrial repair services cover welding and fabrication
            work for machinery, equipment, frames, supports and other
            metal components that require repair or reinforcement.
          </p>

          <p>
            Repair requirements are assessed based on the condition of the
            component and the type of work needed to restore its function
            and structural strength.
          </p>
        </div>
      </article>

    </div>

  </div>
</section>
{/* ================================
    SERVICES HIGHLIGHT
================================= */}

<section className="servicespg-highlight">
  <div className="servicespg-container">

    <div className="servicespg-highlight-grid">

      {/* IMAGE */}
      <div className="servicespg-highlight-image">
        <img
          src="/images/services-img.jpg"
          alt="Welding and fabrication services"
        />
      </div>

      {/* CONTENT */}
      <div className="servicespg-highlight-content">

        <span className="servicespg-small-title">
          QUALITY WORKMANSHIP
        </span>

        <h2>Reliable Welding &amp; Fabrication Services</h2>

        <p>
          Our work is focused on delivering strong, practical and
          reliable solutions for different welding and fabrication
          requirements. We pay attention to the quality of materials,
          welding techniques and finishing throughout the project.
        </p>

     <ul className="servicespg-highlight-list">
  <li>Skilled welding and fabrication work</li>
  <li>
    Solutions for residential, commercial and industrial needs
  </li>
  <li>Strong and durable metal structures</li>
  <li>Custom fabrication according to project requirements</li>
  <li>Attention to accurate measurements and proper finishing</li>
  <li>Repair and maintenance support for metal components</li>
</ul>

      </div>

    </div>

  </div>
</section>
      <section className="about-why-section">
  <div className="about-why-container">
    <div className="about-why-content">
      <span className="about-small-heading">WHY CHOOSE US</span>

      <h2>
        Learn Practical Skills. Build Your Future.
      </h2>

      <p>
        At Singh Welding and Skills Development Centre, we focus on
        practical training, industry-relevant skills, and hands-on
        experience. Our aim is to prepare learners with the confidence
        and technical knowledge needed for real-world welding work.
      </p>

      <div className="about-why-buttons">
        <Link href="/our-courses" className="about-why-primary-btn">
          Explore Courses
          <span>→</span>
        </Link>

        <Link href="/contact-us" className="about-why-secondary-btn">
          Contact Us
          <span>→</span>
        </Link>
      </div>
    </div>

    <div className="about-why-list">
      <div className="about-why-item">
        <div className="about-why-number">01</div>
        <div>
          <h3>Practical Training</h3>
          <p>
            Learn through hands-on welding practice and real working
            techniques.
          </p>
        </div>
      </div>

      <div className="about-why-item">
        <div className="about-why-number">02</div>
        <div>
          <h3>Industry-Focused Skills</h3>
          <p>
            Training is focused on skills and techniques used in actual
            welding and fabrication work.
          </p>
        </div>
      </div>

      <div className="about-why-item">
        <div className="about-why-number">03</div>
        <div>
          <h3>Experienced Knowledge</h3>
          <p>
            Benefit from years of experience in welding, fabrication,
            repair, and related work.
          </p>
        </div>
      </div>

      <div className="about-why-item">
        <div className="about-why-number">04</div>
        <div>
          <h3>Career-Ready Learning</h3>
          <p>
            Build practical knowledge and confidence for future
            opportunities in the welding field.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

    </main>
  );
}