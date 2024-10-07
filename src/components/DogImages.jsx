import React, { useState, useEffect } from "react"; // Import von React-Hooks: useState für Statusverwaltung, useEffect für Seiteneffekte
import favoriteImage from "../assets/favorite.svg"; // Import des Favoriten-Icons
import favoriteFillImage from "../assets/favorite_fill.svg"; // Import des gefüllten Favoriten-Icons

// DogImages-Komponente, die Bilder einer Hunderasse oder ihrer Unterrassen anzeigt und Favoriten verwaltet
const DogImages = ({ breed, selectedSubBreeds, favorites, setFavorites }) => {
	const [images, setImages] = useState([]); // Status für die geladenen Bilder
	const [isLoading, setIsLoading] = useState(true); // Status, ob Bilder geladen werden
	const [currentIndex, setCurrentIndex] = useState(0); // Index für das aktuell angezeigte Bild in der Galerie
	const [defaultImage, setDefaultImage] = useState(""); // Status für das Standardbild der Rasse, wenn keine Unterrassen ausgewählt sind

	// useEffect-Hook, der ausgelöst wird, wenn die ausgewählte Rasse oder die Unterrassen geändert werden
	useEffect(() => {
		const fetchImages = async () => {
			try {
				setIsLoading(true); // Ladeanzeige aktivieren, bevor Bilder geholt werden
				let url;

				// Überprüfen, ob die Rasse Unterrassen hat
				const subBreedsResponse = await fetch(
					`https://dog.ceo/api/breed/${breed}/list`,
				);
				const subBreedsResult = await subBreedsResponse.json();
				const hasSubBreeds = subBreedsResult.message.length > 0; // Prüfen, ob Unterrassen vorhanden sind

				// Wenn Unterrassen ausgewählt sind, holt Bilder für jede ausgewählte Unterrasse
				if (selectedSubBreeds.length > 0) {
					const subBreedImages = await Promise.all(
						selectedSubBreeds.map(async (subBreed) => {
							const response = await fetch(
								`https://dog.ceo/api/breed/${breed}/${subBreed}/images/random`,
							);
							const result = await response.json();
							return result.message; // Rückgabe des Bildes der Unterrasse
						}),
					);

					const flatImages = subBreedImages.flat(); // Flache Liste aller Unterrassenbilder
					setImages(flatImages); // Setze die Bilder in den Status
					setDefaultImage(""); // Lösche das Standardbild, wenn Unterrassenbilder geladen sind
				}
				// Wenn keine Unterrassen existieren, wird ein zufälliges Bild der Rasse geholt
				else if (!hasSubBreeds) {
					const response = await fetch(
						`https://dog.ceo/api/breed/${breed}/images/random`,
					);
					const result = await response.json();
					setDefaultImage(result.message); // Setze das Standardbild
					setImages([]); // Leere die Bildliste, da es keine Unterrassenbilder gibt
				}
				// Wenn keine Unterrassen ausgewählt sind, werden keine Bilder angezeigt
				else {
					setImages([]); // Leere die Bildliste
				}
			} catch (error) {
				console.error("Error fetching images:", error); // Fehlerbehandlung bei API-Fehlern
			} finally {
				setIsLoading(false); // Ladeanzeige ausschalten
			}
		};

		fetchImages(); // Funktion wird aufgerufen, wenn sich breed oder selectedSubBreeds ändern
	}, [breed, selectedSubBreeds]); // Abhängigkeiten-Array: Effekt wird ausgeführt, wenn breed oder selectedSubBreeds sich ändern

	// Funktion zum Umschalten des Favoritenstatus eines Bildes
	const toggleFavorite = (image) => {
		if (favorites.includes(image)) {
			// Entferne das Bild aus den Favoriten, wenn es bereits enthalten ist
			setFavorites(favorites.filter((fav) => fav !== image));
		} else {
			// Füge das Bild den Favoriten hinzu
			setFavorites([...favorites, image]);
		}
	};

	// Funktion zum Anzeigen des nächsten Bildes in der Galerie
	const nextImage = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Nächster Index, zyklisch
	};

	// Funktion zum Anzeigen des vorherigen Bildes in der Galerie
	const prevImage = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === 0 ? images.length - 1 : prevIndex - 1,
		);
	};

	// Funktion zur Darstellung des Bildinhalts oder entsprechender Meldungen
	const displayContent = () => {
		if (isLoading) {
			return <div>Loading...</div>; // Ladeanzeige, wenn Bilder noch geladen werden
		}

		// Wenn Bilder vorhanden sind, zeige das aktuelle Bild mit Favoriten-Button
		if (images.length > 0) {
			return (
				<div className="image-container">
					<img
						src={images[currentIndex]} // Zeigt das aktuelle Bild basierend auf currentIndex
						alt={breed} // Alt-Text basierend auf der Rasse
						className="gallery-image"
					/>
					<button
						className="favorite"
						onClick={() => toggleFavorite(images[currentIndex])} // Umschalten des Favoritenstatus für das aktuelle Bild
					>
						{favorites.includes(images[currentIndex]) ? (
							<img src={favoriteFillImage} alt="Favorite" /> // Gefülltes Icon, wenn das Bild favorisiert ist
						) : (
							<img src={favoriteImage} alt="Add to Favorites" /> // Leeres Icon, wenn das Bild nicht favorisiert ist
						)}
					</button>
				</div>
			);
		}
		// Zeige Nachricht, wenn keine Unterrassen ausgewählt sind und kein Standardbild vorhanden ist
		else if (selectedSubBreeds.length === 0 && defaultImage === "") {
			return <div>Bitte wählen Sie mindestens eine Unterrasse aus!</div>;
		}
		// Zeige das Standardbild, wenn keine Unterrassen ausgewählt, aber ein Standardbild vorhanden ist
		else if (defaultImage) {
			return (
				<div className="image-container">
					<img
						src={defaultImage} // Zeige das Standardbild der Rasse
						alt={breed} // Alt-Text basierend auf der Rasse
						className="gallery-image"
					/>
					<button
						className="favorite"
						onClick={() => toggleFavorite(defaultImage)} // Umschalten des Favoritenstatus für das Standardbild
					>
						{favorites.includes(defaultImage) ? (
							<img src={favoriteFillImage} alt="Favorite" /> // Gefülltes Icon, wenn das Standardbild favorisiert ist
						) : (
							<img src={favoriteImage} alt="Add to Favorites" /> // Leeres Icon, wenn das Standardbild nicht favorisiert ist
						)}
					</button>
				</div>
			);
		}

		return null; // Standardmäßig nichts anzeigen, wenn keine Bedingung erfüllt ist
	};

	return (
		<div className="gallery-images">
			{displayContent()}{" "}
			{/* Darstellung des Inhalts, abhängig von den Lade- und Bildzuständen */}
			{images.length > 1 && (
				<div className="navigateimg">
					<button onClick={prevImage}>Vorheriges Bild</button>{" "}
					{/* Button für vorheriges Bild */}
					<button onClick={nextImage}>Nächstes Bild</button>{" "}
					{/* Button für nächstes Bild */}
				</div>
			)}
		</div>
	);
};

export default DogImages;
