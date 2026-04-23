import logoUrl from "../../assets/haibazo-logo.png";
import heroBooksUrl from "../../assets/hero-books.png";

export function Hero() {
  return (
    <header className="hero">
      <div className="hero-copy">
        <img className="hero-logo" src={logoUrl} alt="HAIBAZO" />
        <div className="hero-title-row">
          <div className="vertical-mark" />
          <h1>
            Manage books.
            <br />
            Inspire readers.
          </h1>
        </div>
        <p>A clean admin dashboard for authors, books, and reviews.</p>
        <a href="#workspace" className="primary-cta">
          Get started <span>→</span>
        </a>
      </div>
      <img className="hero-books" src={heroBooksUrl} alt="" aria-hidden="true" />
    </header>
  );
}
