import Link from "next/link";
import "./HighlightSection.css";

const highlights = [
  {
    title: "Expert Welding Solutions",
    description:
      "SWSDC delivers professional welding services with a focus on quality workmanship, reliable techniques, and practical solutions for different welding requirements.",
  },
  {
    title: "Skills That Build Careers",
    description:
      "Our welding training programs focus on practical learning, technical skills, and hands-on experience to prepare learners for real-world work environments.",
  },
  {
    title: "Built, Repaired & Customized",
    description:
      "From repairing damaged metalwork to creating custom-fabricated structures, SWSDC provides practical solutions designed around specific project requirements.",
  },
];

const HighlightSection = () => {
  return (
    <section className="highlight-section">
      <div className="highlight-container">

        <div className="highlight-top">
          <div className="highlight-heading">
            <span className="highlight-small-heading">
              WHAT WE DO
            </span>

            <h2>
              Skills, Services &
              <br />
              Practical Solutions.
            </h2>

            <p>
              At Singh Welding and Skills Development Centre, we combine
              technical expertise, practical training, and quality
              workmanship to deliver valuable solutions.
            </p>
          </div>

          <div className="highlight-cta">
            <Link href="/contact-us" className="highlight-btn">
              Get In Touch
            </Link>
          </div>
        </div>

        <div className="highlight-grid">
          {highlights.map((item) => (
            <div className="highlight-card" key={item.title}>
              <h3>{item.title}</h3>

              <p>{item.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HighlightSection;