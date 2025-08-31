// Anika + Eshad Worked

// --- Global Variable Declarations ---
// Select all the necessary HTML elements from the DOM
const form = document.getElementById('reportForm');
const getLocationBtn = document.getElementById('getLocationBtn');
const latitudeInput = document.getElementById('latitude');
const longitudeInput = document.getElementById('longitude');

// --- Event Listeners and Functions ---

/**
 * Handles the click event for the "Get My Current Location" button.
 * Uses the browser's Geolocation API to get the user's coordinates.
 */
function handleGetLocationClick() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                latitudeInput.value = latitude.toFixed(6);
                longitudeInput.value = longitude.toFixed(6);
            },
            (error) => {
                alert('Could not get your location. Please enter it manually.');
                console.error('Geolocation Error:', error);
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

/**
 * Handles the form submission event.
 * Prevents default submission, validates fields, and simulates data processing.
 */
function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(form);
    
    // Basic validation check to ensure required fields are not empty
    if (!formData.get('report_title') || !formData.get('report_notes') || !formData.get('latitude') || !formData.get('longitude')) {
        alert('Please fill out all required fields.');
        return;
    }
    
    // Log the form data for debugging purposes
    console.log('--- Manual Field Report Submitted ---');
    for (let [key, value] of formData.entries()) {
        if (key !== 'report_photos') {
            console.log(`${key}: ${value}`);
        }
    }
    const files = document.getElementById('report-photos').files;
    if (files.length > 0) {
        console.log('Photos:', Array.from(files).map(file => file.name));
    }
    
    // Provide user feedback and reset the form
    alert('Report submitted successfully! The data has been logged to the console.');
    form.reset();
}

// --- Attach Listeners to Elements ---
// The two main listeners are attached here, connecting the functions above to their respective events.
getLocationBtn.addEventListener('click', handleGetLocationClick);
form.addEventListener('submit', handleFormSubmit);