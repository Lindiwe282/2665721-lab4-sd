// Event listener for the "search-btn" button
document.getElementById("search-btn").addEventListener("click", () => {
    const countryName = document.getElementById("country-input").value.trim(); // Get user input and remove spaces

    if (countryName === "") {
        alert("Please enter a country name."); // Alert if input is empty
        return;
    }

    // Fetch country data from API
    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then(response => {
            if (!response.ok) throw new Error("Country not found"); // Handle errors if country is not found
            return response.json();
        })
        .then(data => displayCountryInfo(data[0])) // Show country info on success
        .catch(error => {
            // Display error message and clear any existing data
            document.getElementById("country-info").innerHTML = `<p style="color:red;">${error.message}</p>`;
            document.getElementById("bordering-countries").innerHTML = "";
        });
});

// Function to display country information
function displayCountryInfo(country) {
    const { name, capital, population, region, flags, borders } = country; // Extract country details

    document.getElementById("country-info").innerHTML = `
        <h2>${name.common}</h2>
        <p><strong>Capital:</strong> ${capital ? capital[0] : "N/A"}</p>
        <p><strong>Population:</strong> ${population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${region}</p>
        <img src="${flags.svg}" alt="Flag of ${name.common}" class="country-flag">
    `; // Display country info

    // Handle if the country has no borders
    if (!borders || borders.length === 0) {
        document.getElementById("bordering-countries").innerHTML = "<p>No bordering countries.</p>";
        return;
    }

    // Fetch bordering countries' data
    fetch(`https://restcountries.com/v3.1/alpha?codes=${borders.join(",")}`)
        .then(response => response.json())
        .then(borderCountries => {
            // Create HTML structure for  bordering countries 
            const borderHTML = borderCountries.map(border => `
                <p><strong>${border.name.common}</strong></p>
                <img src="${border.flags.svg}" alt="Flag of ${border.name.common}" class="country-flag">
            `).join("");

            document.getElementById("bordering-countries").innerHTML = `<h3>Bordering Countries:</h3>${borderHTML}`;
        })
        .catch(() => {
            // Handle errors in fetching bordering countries
            document.getElementById("bordering-countries").innerHTML = "<p>Error fetching bordering countries.</p>";
        });
}
