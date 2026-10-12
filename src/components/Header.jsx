function Header() {
  return (
    <header className="site-header">
      <a
        className="logo-link"
        href="https://rickandmortyapi.com/"
        target="_blank"
        rel="noreferrer"
        aria-label="Rick and Morty API home"
      >
        <img className="site-logo" src="/rick-logo.png" alt="Rick and Morty logo" />
      </a>

      <nav aria-label="Main navigation">
        <a href="https://rickandmortyapi.com/documentation" target="_blank" rel="noreferrer">
          Docs
        </a>
        <a href="https://rickandmortyapi.com/about" target="_blank" rel="noreferrer">
          About
        </a>
        <a
          className="support"
          href="https://github.com/sponsors/afuh"
          target="_blank"
          rel="noreferrer"
        >
          Support Us
        </a>
      </nav>
    </header>
  );
}

export default Header;
