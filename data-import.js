// Eshad part
const importWeatherBtn = document.getElementById('import-weather-btn');
const importCarbonBtn = document.getElementById('import-carbon-btn');
const importMapBtn = document.getElementById('import-map-btn');
const statusMessage = document.getElementById('status-message');

/**
 * Simulates an API call and updates the UI with a status message.
 * In a real application, this would be a fetch() call to a backend endpoint.
 *
 * @param {string} source - The name of the data source being imported.
 */
async function importData(source) {
    statusMessage.className = "mt-8 text-lg font-bold text-yellow-500";
    statusMessage.textContent = `Importing data from ${source}...`;

    try {
        // Simulate a network request delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        statusMessage.className = "mt-8 text-lg font-bold text-green-500";
        statusMessage.textContent = `Successfully imported data from ${source}!`;

    } catch (error) {
        
        statusMessage.className = "mt-8 text-lg font-bold text-red-500";
        statusMessage.textContent = `Failed to import data from ${source}. Please try again.`;
        console.error('Import error:', error);
    }
}


importWeatherBtn.addEventListener('click', () => importData('OpenWeatherMap API'));
importCarbonBtn.addEventListener('click', () => importData('Carbon Footprint API'));
importMapBtn.addEventListener('click', () => importData('GIS Map API'));