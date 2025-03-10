document.getElementById("search-btn").addEventListener("click", () => {
    const countryName = document.getElementById("country-input").value.trim();
    if (countryName === "") {
        alert("Please enter a country name.");
        return;
    }
    
    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then(response => {
            if (!response.ok) throw new Error("Country not found");
            return response.json();
        })
        .then(data => displayCountryInfo(data[0]))
        .catch(error => {
            document.getElementById("country-info").innerHTML = `<p style="color:red;">${error.message}</p>`;
            document.getElementById("bordering-countries").innerHTML = "";
        });
});

function displayCountryInfo(country) {
    const { name, capital, population, region, flags, borders } = country;
    document.getElementById("country-info").innerHTML = `
        <h2>${name.common}</h2>
        <p><strong>Capital:</strong> ${capital ? capital[0] : "N/A"}</p>
        <p><strong>Population:</strong> ${population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${region}</p>
        <img src="${flags.svg}" alt="Flag of ${name.common}" class="country-flag">
    `;

    if (!borders || borders.length === 0) {
        document.getElementById("bordering-countries").innerHTML = "<p>No bordering countries.</p>";
        return;
    }

    fetch(`https://restcountries.com/v3.1/alpha?codes=${borders.join(",")}`)
        .then(response => response.json())
        .then(borderCountries => {
            const borderHTML = borderCountries.map(border => `
                <div>
                    <p><strong>${border.name.common}</strong></p>
                    <img src="${border.flags.svg}" alt="Flag of ${border.name.common}" class="country-flag">
                </div>
            `).join("");

            document.getElementById("bordering-countries").innerHTML = `<h3>Bordering Countries:</h3>${borderHTML}`;
        })
        .catch(() => document.getElementById("bordering-countries").innerHTML = "<p>Error fetching bordering countries.</p>");
}

