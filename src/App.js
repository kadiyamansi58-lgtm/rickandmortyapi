import { useEffect, useState } from "react";
import Header from "./components/Header";
import CharacterCard from "./components/CharacterCard";
import Footer from "./components/Footer";
import "./App.css";

const API = "https://rickandmortyapi.com/api";

function App() {
  const [characters, setCharacters] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totals, setTotals] = useState(null);
  const [serverOnline, setServerOnline] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Load characters from API
  useEffect(() => {
    const controller = new AbortController();

    async function loadCharacters() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API}/character?page=${currentPage}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Unable to load characters.");
        }

        const data = await response.json();

        // Keep the original image URL supplied by the API.
        const charactersWithEpisodes = await Promise.all(
          data.results.map(async (character) => {
            let firstEpisodeName = "Unknown episode";

            try {
              const episodeResponse = await fetch(
                character.episode[0],
                { signal: controller.signal }
              );

              if (episodeResponse.ok) {
                const episodeData = await episodeResponse.json();
                firstEpisodeName =
                  episodeData.name || "Unknown episode";
              }
            } catch (episodeError) {
              if (episodeError.name === "AbortError") {
                throw episodeError;
              }
            }

            return {
              ...character,
              firstEpisodeName,
            };
          })
        );

        if (!controller.signal.aborted) {
          setCharacters(charactersWithEpisodes);
          setPageInfo(data.info);
          setServerOnline(true);

          console.log(
            "Character image URLs:",
            charactersWithEpisodes.map((character) => ({
              name: character.name,
              image: character.image,
            }))
          );
        }
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(
            "Characters load nahi ho rahe. Internet check karein aur Try Again dabayein."
          );

          setCharacters([]);
          setPageInfo(null);
          setServerOnline(false);

          console.error("API Error:", requestError);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCharacters();

    return () => {
      controller.abort();
    };
  }, [currentPage, retryCount]);

  // Load API totals
  useEffect(() => {
    const controller = new AbortController();

    async function loadTotals() {
      try {
        const endpoints = [
          "character",
          "location",
          "episode",
        ];

        const responses = await Promise.all(
          endpoints.map((endpoint) =>
            fetch(`${API}/${endpoint}`, {
              signal: controller.signal,
            })
          )
        );

        if (responses.some((response) => !response.ok)) {
          throw new Error("Unable to load totals.");
        }

        const results = await Promise.all(
          responses.map((response) => response.json())
        );

        if (!controller.signal.aborted) {
          setTotals({
            characters: results[0].info.count,
            locations: results[1].info.count,
            episodes: results[2].info.count,
          });

          setServerOnline(true);
        }
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          console.error("Totals API error:", requestError);
          setServerOnline(false);
        }
      }
    }

    loadTotals();

    return () => {
      controller.abort();
    };
  }, []);

  // Change page
  function goToPage(pageNumber) {
    if (!pageInfo) return;

    if (pageNumber < 1 || pageNumber > pageInfo.pages) {
      return;
    }

    setCurrentPage(pageNumber);

    document
      .querySelector(".character-section")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  // Retry loading
  function retryLoading() {
    setRetryCount((count) => count + 1);
  }

  return (
    <div className="app">
      <Header />

      {/* Hero Section */}
      <section className="hero">
        {characters.length > 0 && (
          <img
            className="hero-silhouette"
            src={characters[0].image}
            alt=""
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        )}

        <h1>The Rick and Morty API</h1>
      </section>

      {/* Characters Section */}
      <main className="character-section">
        {loading && (
          <p className="state">
            Loading characters from the multiverse...
          </p>
        )}

        {!loading && error && (
          <div className="state error">
            <p>{error}</p>

            <button onClick={retryLoading}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid">
              {characters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                />
              ))}
            </div>

            {pageInfo && (
              <div className="pagination">
                <button
                  disabled={!pageInfo.prev || loading}
                  onClick={() => goToPage(currentPage - 1)}
                >
                  ‹ Previous
                </button>

                <span>
                  Page {currentPage} of {pageInfo.pages}
                </span>

                <button
                  disabled={!pageInfo.next || loading}
                  onClick={() => goToPage(currentPage + 1)}
                >
                  Next ›
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        totals={totals}
        serverOnline={serverOnline}
      />
    </div>
  );
}

export default App;