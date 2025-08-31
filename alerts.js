// Anika
document.addEventListener('DOMContentLoaded', () => {
    const alertForm = document.getElementById('alertForm');

    /**
     * Handles the form submission for setting an alert rule.
     * Prevents default submission, validates the input, and logs the data.
     */
    function handleAlertFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(alertForm);
        
        // Simple validation check
        const requiredFields = ['alert_name', 'recipients'];
        for (const field of requiredFields) {
            if (!formData.get(field)) {
                alert(`Please fill out the required field: ${field.replace('_', ' ')}.`);
                return;
            }
        }
        
        // Log the alert rule data for a backend service to process
        console.log('--- New Alert Rule Configured ---');
        console.log(`Alert Name: ${formData.get('alert_name')}`);
        
        const tempThreshold = formData.get('temp_threshold');
        const humidityThreshold = formData.get('humidity_threshold');
        const airQualityThreshold = formData.get('air_quality_threshold');
        const areaCoordinates = formData.get('area_coordinates');
        const recipients = formData.get('recipients');
        
        if (tempThreshold) console.log(`Temperature Threshold: > ${tempThreshold}°C`);
        if (humidityThreshold) console.log(`Humidity Threshold: < ${humidityThreshold}%`);
        if (airQualityThreshold) console.log(`Air Quality Threshold: ${airQualityThreshold}`);
        if (areaCoordinates) console.log(`Geographic Area: ${areaCoordinates}`);
        console.log(`Recipients: ${recipients.split(',').map(email => email.trim()).join(', ')}`);
        
        // Simulate a successful API call
        alert('Alert rule has been set successfully!');
        
        // Reset the form after successful submission
        alertForm.reset();
    }

    // Attach the event listener to the form
    alertForm.addEventListener('submit', handleAlertFormSubmit);
});