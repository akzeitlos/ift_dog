import { useState, useEffect } from "react"; // useState für Statusverwaltung, useEffect für Nebenwirkungen
import deleteImage from "./assets/delete.svg"; // Import des Bildes für das Löschen-Icon
import "./App.css"; // Import der CSS-Datei für Styling
import DogBreedDropdown from "./components/DogBreedDropdown.jsx"; // Dropdown-Komponente für Hunderassenauswahl
import DogSubBreeds from "./components/DogSubBreeds.jsx"; // Komponente zur Auswahl von Subrassen
import DogImages from "./components/DogImages.jsx"; // Komponente zum Anzeigen von Hundebildern

function App() {
  // Status für die ausgewählte Hunderasse, initial leer
  const [selectedBreed, setSelectedBreed] = useState("");

  // Status für die ausgewählten Subrassen, initial leer
  const [selectedSubBreeds, setSelectedSubBreeds] = useState([]);

  // Status für Favoriten, beim ersten Rendern werden die Daten aus dem Local Storage geladen
  const [favorites, setFavorites] = useState(() => {
    // Lade Favoriten aus dem Local Storage, wenn vorhanden
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : []; // Parse gespeicherte Favoriten oder initialisiere leeres Array
  });

  // Handler für die Auswahl einer Hunderasse
  const handleBreedSelect = (breed) => {
    setSelectedBreed(breed); // Setze die ausgewählte Rasse
    setSelectedSubBreeds([]); // Leere die Subrassen, wenn eine neue Rasse ausgewählt wird
  };

  // Effekt, der die Favoriten jedes Mal speichert, wenn sie sich ändern
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites)); // Speichert Favoriten als JSON-String im Local Storage
  }, [favorites]); // Dieser Effekt wird jedes Mal ausgeführt, wenn sich die Favoriten ändern

  return (
    <>
      <div>
        {/* Titel der Anwendung */}
        <h1 className="title">Testaufgabe</h1>

        {/* Hunderassenauswahl */}
        <section id="hunderasse">
          <h4>Auswahl Hunderasse</h4>
          <DogBreedDropdown
            selectedBreed={selectedBreed} // Übergibt die ausgewählte Rasse an das Dropdown
            onSelectBreed={handleBreedSelect} // Übergibt den Handler für die Rassenauswahl
          />
        </section>

        {/* Subrassenauswahl, wird nur angezeigt, wenn eine Rasse ausgewählt wurde */}
        {selectedBreed && (
          <section id="gallerie_subrassen" className="mt-100 mb-50">
            <DogSubBreeds
              breed={selectedBreed} // Übergibt die ausgewählte Rasse an die Komponente
              onSelectSubBreeds={setSelectedSubBreeds} // Handler, um die Subrassen auszuwählen
            />
          </section>
        )}

        {/* Hundebildergalerie, wird nur angezeigt, wenn eine Rasse ausgewählt wurde */}
        {selectedBreed && (
          <DogImages
            breed={selectedBreed} // Übergibt die ausgewählte Rasse
            selectedSubBreeds={selectedSubBreeds} // Übergibt die ausgewählten Subrassen
            favorites={favorites} // Übergibt die aktuellen Favoriten
            setFavorites={setFavorites} // Funktion zum Setzen der Favoriten
          />
        )}

        {/* Favoritengalerie, wird nur angezeigt, wenn es Favoriten gibt */}
        {favorites.length > 0 && (
          <section id="favoriten">
            <h4>Gallerie Favoriten</h4>
            <div className="image-grid">
              {favorites.map((favImage) => (
                <div key={favImage} className="image-container">
                  <img src={favImage} alt="Favorite" />{" "}
                  {/* Bild der Favoriten */}
                  {/* Löschbutton, entfernt Bild aus den Favoriten */}
                  <button
                    className="delete"
                    onClick={
                      () =>
                        setFavorites(
                          favorites.filter((fav) => fav !== favImage),
                        ) // Entferne das Bild aus den Favoriten
                    }
                  >
                    <img src={deleteImage} alt="Remove from Favorites" />{" "}
                    {/* Löschen-Icon */}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export default App;
