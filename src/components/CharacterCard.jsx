function CharacterCard({ character }) {
  let statusColor = "unknown";

  if (character.status === "Alive") statusColor = "alive";
  if (character.status === "Dead") statusColor = "dead";

  const status =
    character.status === "unknown" ? "Unknown" : character.status;

  return (
    <article className="character-card">
      <img
        src={character.image}
        alt={character.name}
        className="character-image"
        onError={(e) => {
          console.error(
            "Image load failed:",
            character.name,
            character.image
          );

          e.currentTarget.onerror = null;
          e.currentTarget.src =
            "https://rickandmortyapi.com/api/character/avatar/1.jpeg";
        }}
      />

      <div className="card-info">
        <a
          className="character-name"
          href={character.url}
          target="_blank"
          rel="noreferrer"
        >
          {character.name}
        </a>

        <p className="status">
          <span className={`dot ${statusColor}`} />
          {status} - {character.species}
        </p>

        <p className="label">Last known location:</p>

        <a
          className="value"
          href={character.location.url || undefined}
          target="_blank"
          rel="noreferrer"
        >
          {character.location.name}
        </a>

        <p className="label">First seen in:</p>

        <a
          className="value"
          href={character.episode[0]}
          target="_blank"
          rel="noreferrer"
        >
          {character.firstEpisodeName}
        </a>
      </div>
    </article>
  );
}

export default CharacterCard;