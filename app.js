"use strict";
(() => {

    // Helper Functions
    const getCountriesData = url => fetch(url).then(res => res.json());

    const renderHTML = (html, target) => {
        document.getElementById(target).innerHTML = html
    }

    // URL Fetch
    const fetchAllCountries = async () => {
        return await getCountriesData(`https://restcountries.com/v3.1/all?fields=name,population,region,currencies`);
    };

    const fetchSearchedCountry = async () => {
        const searchedCountry = document.getElementById('search-bar').value.trim().toLowerCase()

        const result = await getCountriesData(`https://restcountries.com/v3.1/name/${searchedCountry}?fields=name,population,region,currencies`)
        if (result.status === 404) {
            alert('Either you invented a new country, or this country does not exist!')
            throw new Error('country not found')
        }
        return result
    }

    // Generate HTML
    const generateCountriesHTML = countries => {
        const html = countries.map(({ name: { common }, population }) => {
            return `<tr>
                        <td>${common}</td>
                        <td>${population}</td>
                    </tr>`
        }).join('')
        return html
    }

    const generateRegions = countries => {
        return Object.entries(
            countries.reduce((sum, { region }) => {
                sum[region] = (sum[region] || 0) + 1;
                return sum;
            }, {})).map(([region, count]) => `
        <tr>
            <td>${region}</td>
            <td>${count}</td>
        </tr>
    `).join('');
    };

    const generateCurrencies = countries => {
        const currencyCounts = countries.reduce((sum, {
            currencies
        }) => {
            if (currencies) {
                Object.keys(currencies).forEach(currencyCode => {
                    const currencyName = currencies[currencyCode].name;
                    sum[currencyName] = (sum[currencyName] || 0) + 1;
                });
            }
            return sum;
        }, {});

        return Object.entries(currencyCounts).map(([currency, count]) => `
    <tr>
        <td>${currency}</td>
        <td>${count}</td>
    </tr>
`).join('');
    };

    const generateCountriesStatistics = countries => {
        const totalCountries = countries.length
        const totalPopulation = countries.reduce((sum, { population }) => {
            return sum + (population || 0);
        }, 0);
        const averageCountryPopulation = Math.round(totalPopulation / totalCountries)
        if (totalCountries !== 1) return `
            <p>Total countries: ${totalCountries}</p>
            <p>Total population: ${totalPopulation}</p>
            <p>Average population: ${averageCountryPopulation}</p>
            `
        else return `<p>Total countries: ${totalCountries}</p>
            <p>Total population: ${totalPopulation}</p>`;
    };

    // Render To HTML
    const renderCountries = html => {
        renderHTML(html, 'countries-table')
    }

    const renderRegions = html => {
        renderHTML(html, 'regions-table')
    }

    const renderStatistics = html => {
        renderHTML(html, 'countries-statistics')
    }

    const renderCurrencies = html => {
        renderHTML(html, 'currency-table')
    }



    // Event Listeners
    document.getElementById('show-all').addEventListener('click', async event => {
        try {
            //Render Countries
            event.preventDefault();
            const countries = await fetchAllCountries()
            const countriesHTML = generateCountriesHTML(countries)
            renderCountries(countriesHTML)

            //Render Statistics
            const statsHTML = generateCountriesStatistics(countries)
            renderStatistics(statsHTML)

            //Render Regions
            const regionsHTML = generateRegions(countries)
            renderRegions(regionsHTML)

            //Render Currency 
            const currencyHTML = generateCurrencies(countries)
            renderCurrencies(currencyHTML)
        } catch (error) {
            alert('an error occurred, please check console for further information')
            console.error(error)
        }
    })

    document.getElementById('search-button').addEventListener('click', async event => {
        try {
            //Render Countries
            event.preventDefault();
            const searchedCountries = await fetchSearchedCountry()
            const searchedCountriesHTML = generateCountriesHTML(searchedCountries)
            renderCountries(searchedCountriesHTML)

            //Render Statistics
            const statsHTML = generateCountriesStatistics(searchedCountries)
            renderStatistics(statsHTML)

            //Render Regions
            const regionsHTML = generateRegions(searchedCountries)
            renderRegions(regionsHTML)

            //Render Currency 
            const currencyHTML = generateCurrencies(searchedCountries)
            renderCurrencies(currencyHTML)

        } catch (error) {
            console.error(error)
        }
    })

})()