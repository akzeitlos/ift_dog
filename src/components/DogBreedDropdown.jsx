import React, { useState, useEffect } from "react"; // Import von React-Hooks: useState für Statusverwaltung, useEffect für Seiteneffekte
import arrow from "../assets/arrow_down.svg"; // Import des Pfeil-Icons für den Dropdown-Button

// DogBreedDropdown-Komponente, die eine Dropdown-Liste zur Auswahl einer Hunderasse darstellt
const DogBreedDropdown = ({ selectedBreed, onSelectBreed }) => {
	// Status für die Liste der Hunderassen
	const [breeds, setBreeds] = useState([]);

	// Status zur Verwaltung des aktiven Links (ausgewählte Rasse)
	const [activeLink, setActiveLink] = useState("");

	// Status, ob das Dropdown-Menü geöffnet oder geschlossen ist
	const [isOpen, setIsOpen] = useState(false);

	// useEffect-Hook, um die Hunderassen beim ersten Laden der Komponente aus der API zu holen
	useEffect(() => {
		const fetchBreeds = async () => {
			try {
				// Anfrage an die Dog API, um die Liste der Hunderassen zu erhalten
				const response = await fetch(
					"https://dog.ceo/api/breeds/list/all",
				);
				const result = await response.json();
				const breedList = Object.keys(result.message); // Extrahiere die Rassen aus der API-Antwort
				setBreeds(breedList); // Setze die Liste der Hunderassen in den Status
			} catch (error) {
				console.error("Error fetching breeds:", error); // Fehlerbehandlung bei fehlgeschlagener API-Anfrage
			}
		};

		fetchBreeds(); // API-Aufruf wird beim Mounten der Komponente ausgeführt
	}, []); // Abhängigkeiten-Array leer, sodass der Effekt nur einmal ausgeführt wird

	// Funktion, die ausgeführt wird, wenn eine Hunderasse ausgewählt wird
	const handleClick = (breed) => {
		setActiveLink(breed); // Setze die ausgewählte Rasse als aktiven Link (Hervorhebung)
		onSelectBreed(breed); // Übergibt die ausgewählte Rasse an die übergebene onSelectBreed Funktion (Parent-Komponente)
		setIsOpen(false); // Schließt das Dropdown-Menü nach der Auswahl
	};

	return (
		<div>
			{/* Button, der das Dropdown-Menü öffnet oder schließt */}
			<button className="btn" onClick={() => setIsOpen((prev) => !prev)}>
				{/* Anzeige der ausgewählten Rasse oder Standardtext, falls keine Rasse ausgewählt wurde */}
				{selectedBreed
					? selectedBreed.charAt(0).toUpperCase() +
						selectedBreed.slice(1) // Erster Buchstabe groß
					: "Alle Hunderassen"}{" "}
				{/* Standardtext, wenn keine Rasse ausgewählt wurde */}
				<img
					src={arrow} // Pfeil-Icon, das den Dropdown-Status anzeigt (offen/geschlossen)
					alt="Arrow down"
					className={`arrow ${isOpen ? "arrow-rotated" : ""}`} // Rotiert den Pfeil, wenn das Dropdown geöffnet ist
				/>
			</button>

			{/* Dropdown-Menü, das geöffnet wird, wenn isOpen true ist */}
			{isOpen && (
				<div className={`dropdown ${isOpen ? "open" : "closed"}`}>
					{/* Liste aller Hunderassen, die von der API geladen wurden */}
					{breeds.map((breed) => (
						<a
							key={breed} // Jede Rasse braucht einen eindeutigen Schlüssel
							href="#" // Leerer Link, da der Klick bereits durch onClick verarbeitet wird
							className={activeLink === breed ? "active" : ""} // Markiert den aktiven Link (die ausgewählte Rasse)
							onClick={() => handleClick(breed)} // Aufruf der handleClick-Funktion beim Klick auf eine Rasse
						>
							{breed.charAt(0).toUpperCase() + breed.slice(1)}{" "}
							{/* Zeigt die Rasse mit großem Anfangsbuchstaben */}
						</a>
					))}
				</div>
			)}
		</div>
	);
};

export default DogBreedDropdown;
