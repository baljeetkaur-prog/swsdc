import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import "./Footer.css";

const weldingCourses = [
  {
    title: "ARC / MMA / Stick Welding (SMAW)",
    href: "/our-courses/arc-mma-stick-welding-smaw/",
  },
  {
    title: "MIG / MAG / CO2 Welding (GMAW)",
    href: "/our-courses/mig-mag-co2-welding-gmaw/",
  },
  {
    title: "Flux Cored Arc Welding (FCAW)",
    href: "/our-courses/flux-cored-arc-welding-fcaw/",
  },
  {
    title: "TIG / ARGON Welding (GTAW)",
    href: "/our-courses/tig-argon-welding-gtaw/",
  },
  {
    title: "PLASMA ARC CUTTING (PAC)",
    href: "/our-courses/plasma-arc-cutting-pac/",
  },
];

const services = [
  "Body Maker (Vehicles)",
  "Gate & Grill",
  "Stainless Steel Welding",
  "MIG Welding",
  "Stick Welding",
  "Industrial Repair",
];
const quickLinks = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about-us" },
  { title: "Services", href: "/our-services" },
  { title: "Courses", href: "/our-courses" },
  { title: "Gallery", href: "/gallery" },
  { title: "Blogs", href: "/blogs" },
  { title: "Contact Us", href: "/contact-us" },
];

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* =========================
            ABOUT
        ========================= */}

        <div className="footer-about">

       <div className="footer-logo">
  <Link href="/">
    <Image
      src="/images/logo.png"
      alt="Singh Welding and Skills Development Centre"
      width={90}
      height={90}
    />
  </Link>

  <Link href="/" className="footer-brand-name">
    SINGH WELDING AND SKILLS
    <br />
    DEVELOPMENT CENTRE (SWSDC)
  </Link>
</div>

          <p>
            Singh Welding and Skills Development Centre (SWSDC) provides
            practical welding training and professional fabrication services.
            Our focus is on developing industry-ready skills through
            hands-on training and quality workmanship.
          </p>

        </div>
<div className="footer-column">

  <h3>Quick Links</h3>

  <ul className="footer-links">

    {quickLinks.map((link) => (
      <li key={link.title}>
        <Link href={link.href}>
          <FaArrowRight />
          <span>{link.title}</span>
        </Link>
      </li>
    ))}

  </ul>

</div>

        {/* =========================
            WELDING COURSES
        ========================= */}

        <div className="footer-column">

          <h3>Welding Courses</h3>

          <ul className="footer-links">

            {weldingCourses.map((course) => (
              <li key={course.title}>
                <Link href={course.href}>
                  <FaArrowRight />
                  <span>{course.title}</span>
                </Link>
              </li>
            ))}

          </ul>

        </div>


        {/* =========================
            SERVICES
        ========================= */}

        <div className="footer-column">

          <h3>Our Services</h3>

          <ul className="footer-links">

            {services.map((service) => (
              <li key={service}>
                <Link href="/our-services">
                  <FaArrowRight />
                  <span>{service}</span>
                </Link>
              </li>
            ))}

          </ul>

        </div>

      </div>


      {/* =========================
          BOTTOM FOOTER
      ========================= */}

      <div className="footer-bottom">

        <div className="footer-bottom-container">

          <p>
          © Copyright {new Date().getFullYear()} |{" "}
            <Link href="/">
              Singh Welding And Skills Development Centre (SWSDC)
            </Link>{" "}
            | Designed &amp; Developed by{" "}
            <a
              href="https://socialsimba.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Social Simba
            </a>
          </p>

        </div>

      </div>

    </footer>
  );
}