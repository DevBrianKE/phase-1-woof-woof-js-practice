// Ensure script runs only after the HTML is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript loaded!");
  
    // Fetch all dog data and store it
    let allPups = [];
  
    fetch("http://localhost:3000/pups")
      .then(response => response.json())
      .then(data => {
        console.log("Fetched data:", data);
        allPups = data; // Store all fetched pups
        displayDogs(allPups); // Display all dogs initially
      })
      .catch(error => console.error("Error fetching data:", error));
  
    // Get the filter button and add event listener
    const filterButton = document.getElementById("good-dog-filter");
    let filterOn = false; // Track filter state
  
    filterButton.addEventListener("click", () => {
      filterOn = !filterOn; // Toggle filter state
      filterButton.textContent = `Filter good dogs: ${filterOn ? "ON" : "OFF"}`; // Update button text
  
      // Show only good dogs if filter is ON, otherwise show all dogs
      const filteredDogs = filterOn ? allPups.filter(pup => pup.isGoodDog) : allPups;
      displayDogs(filteredDogs);
    });
  });
  
  // Function to display dogs in the dog bar
  function displayDogs(pups) {
    const dogBar = document.getElementById("dog-bar");
    dogBar.innerHTML = ""; // Clear existing dogs
  
    pups.forEach(pup => {
      const span = document.createElement("span");
      span.textContent = pup.name;
      span.addEventListener("click", () => showDogInfo(pup));
      dogBar.appendChild(span);
    });
  }
  
  // Function to display pup details
  function showDogInfo(pup) {
    const dogInfo = document.getElementById("dog-info");
    dogInfo.innerHTML = `
      <img src="${pup.image}" alt="${pup.name}">
      <h2>${pup.name}</h2>
      <button id="toggle-goodness">${pup.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
    `;
  
    const button = document.getElementById("toggle-goodness");
    button.addEventListener("click", () => toggleGoodness(pup, button));
  }
  
  // Function to toggle good/bad dog status
  function toggleGoodness(pup, button) {
    pup.isGoodDog = !pup.isGoodDog;
    button.textContent = pup.isGoodDog ? "Good Dog!" : "Bad Dog!";
  
    fetch(`http://localhost:3000/pups/${pup.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ isGoodDog: pup.isGoodDog })
    })
    .then(response => response.json())
    .then(updatedPup => {
      console.log(`Updated ${updatedPup.name} on server`);
    })
    .catch(error => console.error("Error updating pup:", error));
  }
  