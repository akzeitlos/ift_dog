import React, { useState, useEffect } from "react";

// Component to display and handle selection of sub-breeds
const DogSubBreeds = ({ breed, onSelectSubBreeds }) => {
	const [subBreeds, setSubBreeds] = useState([]); // Stores the list of sub-breeds
	const [isLoading, setIsLoading] = useState(true); // Loading state for fetch operation
	const [checkedSubBreeds, setCheckedSubBreeds] = useState([]); // Tracks the checked sub-breeds

	// useEffect to fetch sub-breeds whenever the 'breed' prop changes
	useEffect(() => {
		const fetchSubBreeds = async () => {
			if (breed) {
				// Ensure a breed is selected before fetching sub-breeds
				try {
					// Fetch the sub-breeds for the selected breed
					const response = await fetch(
						`https://dog.ceo/api/breed/${breed}/list`,
					);
					const result = await response.json();
					setSubBreeds(result.message); // Update the list of sub-breeds

					// Automatically check the first sub-breed if there are any sub-breeds
					if (result.message.length > 0) {
						const initialChecked = [result.message[0]]; // Select the first sub-breed by default
						setCheckedSubBreeds(initialChecked);
						onSelectSubBreeds(initialChecked); // Pass the selected sub-breeds to the parent component
					}
				} catch (error) {
					console.error("Error fetching sub-breeds:", error);
				} finally {
					setIsLoading(false); // Stop the loading state once data is fetched
				}
			}
		};

		fetchSubBreeds(); // Trigger fetch when the component mounts or 'breed' changes
	}, [breed]); // Dependency array ensures the effect runs when 'breed' prop changes

	// Function to handle the checkbox toggle for each sub-breed
	const handleCheckboxChange = (subBreed) => {
		// Update the list of checked sub-breeds
		setCheckedSubBreeds((prevChecked) => {
			const newChecked = prevChecked.includes(subBreed)
				? prevChecked.filter((item) => item !== subBreed) // Uncheck if it's already selected
				: [...prevChecked, subBreed]; // Check it if it's not selected yet

			onSelectSubBreeds(newChecked); // Notify parent of the updated selected sub-breeds
			return newChecked; // Update the local state
		});
	};

	// Render loading state
	if (isLoading) {
		return <div>Loading...</div>;
	}

	// If no sub-breeds are available, render nothing
	if (subBreeds.length === 0) {
		return <div></div>; // This could be modified to show a message like "No sub-breeds available"
	}

	return (
		<div>
			<h4>Gallerie Subrassen</h4>
			{/* Map over sub-breeds and render a checkbox for each */}
			{subBreeds.map((subBreed) => (
				<label className="checkcontainer" key={subBreed}>
					<input
						type="checkbox"
						value={subBreed}
						name={subBreed}
						checked={checkedSubBreeds.includes(subBreed)} // Check if sub-breed is already selected
						onChange={() => handleCheckboxChange(subBreed)} // Handle toggle action
					/>
					<span className="label-for-check">
						{subBreed.charAt(0).toUpperCase() + subBreed.slice(1)}{" "}
						{/* Capitalize the first letter */}
					</span>
					<span className="checkmark"></span>{" "}
					{/* Custom styling for checkbox */}
				</label>
			))}
		</div>
	);
};

export default DogSubBreeds;
