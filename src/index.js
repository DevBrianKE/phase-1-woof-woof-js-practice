// Ensure script runs only after the HTML is fully loaded
document.addEventListener("DOMContentLoaded", async () => {
    console.log("JavaScript loaded!");

    // Get references to HTML elements
    const dogBar = document.getElementById("dog-bar"); // Container where dog names are displayed
    const dogInfo = document.getElementById("dog-info"); // Section to show selected dog's details
    const filterButton = document.getElementById("good-dog-filter"); // Button to filter good dogs

    let allPups = []; // Array to store all fetched dogs
    let filterOn = false; // Track whether the filter is active

    // Function to fetch all dog data from the server
    async function fetchDogs() {
        try {
            const response = await fetch("http://localhost:3000/pups"); // Fetch request to the API
            allPups = await response.json(); // Convert response to JSON format
            displayDogs(allPups); // Display all dogs in the dog bar
        } catch (error) {
            console.error("Error fetching data:", error); // Handle errors if the request fails
        }
    }

    // Function to display dog names in the dog bar
    function displayDogs(pups) {
        dogBar.innerHTML = ""; // Clear existing dogs from the dog bar

        pups.forEach(pup => {
            const span = document.createElement("span"); // Create a <span> for each dog
            span.textContent = pup.name; // Set text to the dog's name
            span.addEventListener("click", () => showDogInfo(pup)); // Add event listener to display details when clicked
            dogBar.appendChild(span); // Append the span to the dog bar
        });
    }

    // Function to display the selected dog's details
    function showDogInfo(pup) {
        // Update the dog-info section with the selected dog's image, name, and status button
        dogInfo.innerHTML = `
            <img src="${pup.image}" alt="${pup.name}">
            <h2>${pup.name}</h2>
            <button id="toggle-goodness">${pup.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
        `;

        // Add event listener to the toggle button to update the dog's status
        document.getElementById("toggle-goodness").addEventListener("click", () => toggleGoodness(pup));
    }

    // Function to toggle the dog's good/bad status
    async function toggleGoodness(pup) {
        try {
            const response = await fetch(`http://localhost:3000/pups/${pup.id}`, {
                method: "PATCH", // Use PATCH to update specific data
                headers: { "Content-Type": "application/json" }, // Set headers to JSON format
                body: JSON.stringify({ isGoodDog: !pup.isGoodDog }) // Send the updated status
            });

            const updatedPup = await response.json(); // Get the updated dog data from the response
            pup.isGoodDog = updatedPup.isGoodDog; // Update the local pup object with the new status
            showDogInfo(pup); // Refresh the displayed dog info
        } catch (error) {
            console.error("Error updating pup:", error); // Handle errors if the request fails
        }
    }

    // Event listener for the filter button
    filterButton.addEventListener("click", () => {
        filterOn = !filterOn; // Toggle filter state (ON/OFF)
        filterButton.textContent = `Filter good dogs: ${filterOn ? "ON" : "OFF"}`; // Update button text

        // If filter is ON, show only good dogs; otherwise, show all dogs
        displayDogs(filterOn ? allPups.filter(pup => pup.isGoodDog) : allPups);
    });

    // Fetch and display dogs when the page loads
    fetchDogs();
});
