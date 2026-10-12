function Footer({ totals, serverOnline }) {
  return (
    <footer>
      {totals ? (
        <div className="footer-counts">
          <p>CHARACTERS: <b>{totals.characters.toLocaleString()}</b></p>
          <p>LOCATIONS: <b>{totals.locations.toLocaleString()}</b></p>
          <p>EPISODES: <b>{totals.episodes.toLocaleString()}</b></p>
        </div>
      ) : (
        <p className="footer-loading">Loading API totals...</p>
      )}

      <p className="server">
        <i className={serverOnline ? "online" : "offline"} />
        API SERVER: {serverOnline ? "ONLINE" : "OFFLINE"}
      </p>

      <div className="footer-links">
        <a href="https://rickandmortyapi.com/" target="_blank" rel="noreferrer">
          Official API
        </a>
        <a href="https://rickandmortyapi.com/documentation" target="_blank" rel="noreferrer">
          Documentation
        </a>
        <a href="https://github.com/afuh/rick-and-morty-api" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>

      <p className="copyright">Data provided by The Rick and Morty API.</p>
    </footer>
  );
}

export default Footer;
