import Image from "next/image";
import "./BrandsSection.css";

const brands = [
  "/images/logo1.png",
  "/images/logo2.png",
];

export default function BrandsSection() {
  return (
    <section className="brands-section">
      <div className="brands-container">

        <div className="brands-title">
          <span className="brands-label">BRANDS WE TRUST</span>
          <h2>TOP MACHINE BRANDS</h2>
        </div>

        <div className="brands-logos">
          {brands.map((brand, index) => (
            <div className="brand-logo" key={index}>
              <Image
                src={brand}
                alt={`Machine brand ${index + 1}`}
                width={180}
                height={80}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
