// Eshad part
document.addEventListener('DOMContentLoaded', () => {

    // --- Data Mockup ---
    // In a real application, this data would be fetched from a backend API.
    // The data includes field reports and sensor data with coordinates.
    const mockData = {
        reports: [
            { id: 1, title: 'Trail 5 Maintenance', notes: 'Removed fallen tree from path.', lat: 34.052235, lng: -118.243683, type: 'report', timestamp: '2025-08-10' },
            { id: 2, title: 'Water Quality Check', notes: 'Stream appears clear, no pollutants found.', lat: 34.053, lng: -118.244, type: 'report', timestamp: '2025-08-12' },
        ],
        sensors: [
            { id: 101, device_id: 'sensor_001', lat: 34.0525, lng: -118.243, temperature: 25.5, humidity: 60, type: 'sensor', timestamp: '2025-08-18' },
            { id: 102, device_id: 'sensor_002', lat: 34.0518, lng: -118.245, temperature: 26.1, humidity: 62, type: 'sensor', timestamp: '2025-08-18' },
        ]
    };

    // --- Map Initialization ---
    let map = L.map('map').setView([34.0522, -118.2437], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Icon for Field Reports
    const reportIcon = L.icon({
        iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="%2310B981" width="25" height="25"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2zm-3 5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg>',
        iconSize: [25, 25],
        iconAnchor: [12, 25],
        popupAnchor: [0, -20]
    });

    // Icon for Sensor Data
    const sensorIcon = L.icon({
        iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="%232563EB" width="25" height="25"><path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 10a1 1 0 112 0 1 1 0 01-2 0zm8-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd" /></svg>',
        iconSize: [25, 25],
        iconAnchor: [12, 25],
        popupAnchor: [0, -20]
    });

    // --- Chart Initialization ---
    const countCtx = document.getElementById('countChart').getContext('2d');
    const tempCtx = document.getElementById('tempChart').getContext('2d');
    let countChart, tempChart;

    // --- Functions ---

    /**
     * Updates the map with markers based on the current data filter.
     * @param {string} filter - 'all', 'reports', or 'sensors'.
     */
    function updateMap(filter) {
        // Clear existing markers
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        const data = [...mockData.reports, ...mockData.sensors];

        data.forEach(item => {
            if (filter === 'all' || (filter === 'reports' && item.type === 'report') || (filter === 'sensors' && item.type === 'sensor')) {
                const icon = item.type === 'report' ? reportIcon : sensorIcon;
                const popupContent = item.type === 'report' ?
                    `<b>${item.title}</b><br>${item.notes}<br><i>(${item.timestamp})</i>` :
                    `<b>Sensor Data</b><br>Device ID: ${item.device_id}<br>Temperature: ${item.temperature}°C<br>Humidity: ${item.humidity}%<br><i>(${item.timestamp})</i>`;
                
                L.marker([item.lat, item.lng], { icon: icon }).addTo(map).bindPopup(popupContent);
            }
        });
    }

    /**
     * Updates the dashboard metrics and charts.
     */
    function updateDashboard() {
        const selectedRole = document.getElementById('role-select').value;
        const selectedFilter = document.getElementById('data-filter').value;
        
        const filteredData = [...mockData.reports, ...mockData.sensors].filter(item => {
            if (selectedFilter === 'all') return true;
            return selectedFilter === 'reports' ? item.type === 'report' : item.type === 'sensor';
        });

        // Update counts
        document.getElementById('report-count').textContent = mockData.reports.length;
        document.getElementById('sensor-count').textContent = mockData.sensors.length;
        
        // Calculate average temperature
        const sensorData = filteredData.filter(item => item.type === 'sensor');
        const avgTemp = sensorData.length > 0 ? (sensorData.reduce((sum, item) => sum + item.temperature, 0) / sensorData.length).toFixed(1) : 'N/A';
        document.getElementById('avg-temp').textContent = avgTemp;
        
        updateMap(selectedFilter);
        updateCharts(selectedRole);
    }

    /**
     * Initializes or updates the charts based on the selected role.
     * @param {string} role - 'manager', 'ngo', or 'investor'.
     */
    function updateCharts(role) {
        // Data for the charts
        const chartLabels = ['Field Reports', 'Sensor Data'];
        const chartCounts = [mockData.reports.length, mockData.sensors.length];
        
        // Data for temperature over time
        const tempLabels = mockData.sensors.map(s => s.timestamp);
        const tempValues = mockData.sensors.map(s => s.temperature);

        // Define chart configurations based on role
        let countChartConfig = {};
        let tempChartConfig = {};

        if (role === 'manager' || role === 'ngo') {
            // Managers and NGOs need detailed data
            countChartConfig = {
                type: 'bar',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        label: 'Data Count',
                        data: chartCounts,
                        backgroundColor: ['#10B981', '#2563EB'],
                    }]
                },
                options: { responsive: true, scales: { y: { beginAtZero: true } } }
            };
            tempChartConfig = {
                type: 'line',
                data: {
                    labels: tempLabels,
                    datasets: [{
                        label: 'Average Temperature (°C)',
                        data: tempValues,
                        borderColor: '#DC2626',
                        tension: 0.1
                    }]
                },
                options: { responsive: true, scales: { y: { beginAtZero: false } } }
            };
        } else if (role === 'investor') {
            // Investors need high-level summaries, so use a pie chart for counts
            countChartConfig = {
                type: 'pie',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        data: chartCounts,
                        backgroundColor: ['#10B981', '#2563EB'],
                    }]
                },
                options: { responsive: true }
            };
            // Hide the temperature chart for investors for simplicity
            document.getElementById('tempChart').style.display = 'none';
        }

        // Destroy and re-create charts to apply new configurations
        if (countChart) countChart.destroy();
        if (tempChart) tempChart.destroy();
        
        countChart = new Chart(countCtx, countChartConfig);
        
        if (role !== 'investor') {
            document.getElementById('tempChart').style.display = 'block';
            tempChart = new Chart(tempCtx, tempChartConfig);
        }
    }

    // --- Event Listeners ---
    document.getElementById('role-select').addEventListener('change', updateDashboard);
    document.getElementById('data-filter').addEventListener('change', updateDashboard);

    // Initial load of the dashboard
    updateDashboard();

});