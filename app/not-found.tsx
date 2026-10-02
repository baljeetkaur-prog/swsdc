import Link from "next/link";
import "./not-found.css";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <section className="not-found-section">
        <div className="not-found-container">
          
          <div className="not-found-number">
            404
          </div>

          <h1>Page Not Found</h1>

          <p>
            Sorry, the page you are looking for does not exist,
            has been moved, or may have been removed.
          </p>

          <Link
            href="/"
            className="not-found-button"
          >
            Back to Home
          </Link>

        </div>
      </section>
    </main>
  );
}