"use client";

import Link from "next/link";
import "./ServicesSection.css";

const services = [
  {
    id: 1,
    number: "01",
    title: "Body Maker (Vehicles)",
    description:
      "Vehicle body making and fabrication services for new body structures, modifications, frames, panels, and custom vehicle requirements.",
  },
  {
    id: 2,
    number: "02",
    title: "Gate & Grill",
    description:
      "Custom-made gates, grills, railings, and other metalwork designed for homes, commercial spaces, and industrial properties.",
  },
  {
    id: 3,
    number: "03",
    title: "Stainless Steel Welding",
    description:
      "Quality stainless steel welding and fabrication for railings, frames, structures, fittings, and other stainless steel requirements.",
  },
  {
    id: 4,
    number: "04",
    title: "MIG Welding",
    description:
      "MIG welding services for clean, efficient, and strong welds across different metal components and fabrication projects.",
  },
  {
    id: 5,
    number: "05",
    title: "Stick Welding",
    description:
      "Reliable stick welding services for structural work, heavy-duty fabrication, repairs, and various metal welding applications.",
  },
  {
    id: 6,
    number: "06",
    title: "Industrial Repair",
    description:
      "On-site industrial repair and welding services for machinery, equipment, structures, frames, and other heavy-duty repair requirements.",
  },
];

export default function ServicesSection() {
  return (
    <section className="services-section">
      <div className="services-container">

        {/* Section Intro */}
        <div className="services-intro">
          <span className="services-small-heading">
            WHAT WE OFFER
          </span>

          <h2>Our Services</h2>

          <p>
            We provide professional welding, fabrication, repair, and
            structural services for a wide range of industrial and
            commercial requirements.
          </p>
        </div>

        {/* Services Cards */}
        <div className="services-grid">
          {services.map((service) => (
            <article className="service-card" key={service.id}>

              <div className="service-card-top">
                <span className="service-number">
                  {service.number}
                </span>

                <div className="service-icon">
                  +
                </div>
              </div>

              <div className="service-card-content">
                <h3>{service.title}</h3>

                <p>{service.description}</p>

                <Link
                  href="/contact-us"
                  className="service-contact-btn"
                >
                  Contact Now
                  <span>→</span>
                </Link>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}