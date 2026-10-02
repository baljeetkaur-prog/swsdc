import Image from "next/image";
import Link from "next/link";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import "./About.css";

const About = () => {
  return (
    <section className="abouthome-section">
      <div className="abouthome-container">
        {/* Image */}
        <div className="abouthome-image-wrapper">
          <Image
            src="/images/about-img.png"
            alt="Singh Welding and Skills Development Centre"
            width={700}
            height={650}
            className="abouthome-image"
          />
        </div>

        {/* Content */}
        <div className="abouthome-content">
          <span className="abouthome-small-heading">
            ABOUT SWSDC
          </span>

          <h2>
            Building Welding Skills
            <br />
            Since The 1980s.
          </h2>

          <p>
            Singh Welding and Skills Development Centre (SWSDC) has been
            developing practical welding skills since the 1980s. As an
            ISO-IAF certified training centre, SWSDC focuses on 100% practical
            training that prepares learners for real-world welding work and
            opportunities abroad.
          </p>

          <p>
            Our beginner-friendly courses are designed for learners at
            different skill levels, with practical training across ARC / MMA /
            Stick Welding, MIG / MAG / CO2 Welding, Flux Cored Arc Welding,
            TIG / ARGON Welding, and Plasma Arc Cutting.
          </p>

          {/* Address */}
          <div className="abouthome-info">
            <div className="abouthome-info-item">
              <FaMapMarkerAlt className="abouthome-info-icon" />

              <span>
                Hoshiarpur Road, Phagwara, District Kapurthala, Punjab, India
              </span>
            </div>
          </div>

          {/* CTA */}
          <Link href="tel:7973851375" className="abouthome-call-btn">
            <FaPhoneAlt />
            <span>Call Now</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About;