function Header() {
  return (
    <header className="hero-banner">
      <div className="hero-banner__glow" aria-hidden="true" />
      <div className="hero-banner__inner">
        <div className="hero-banner__brand">
          <h1 className="hero-banner__title">
            Case<span className="hero-banner__accent">Cell</span>Shop
          </h1>
        </div>
        <p className="hero-banner__subtitle">
          As melhores capas para seu celular
        </p>
      </div>
    </header>
  );
}

export default Header;
