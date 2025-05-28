// Emergency Page JavaScript

let map;
let userLocation;
let markers = [];
let services = [];

// AI Emergency Assistant Data
const aiResponses = {
    'police station': {
        icon: 'fas fa-shield-alt',
        title: 'Police Stations Near You',
        services: [
            { name: 'Dhanmondi Police Station', distance: '0.8 km', phone: '02-9665301', address: 'Dhanmondi, Dhaka 1205' },
            { name: 'Ramna Police Station', distance: '1.2 km', phone: '02-9556133', address: 'Ramna, Dhaka 1000' },
            { name: 'Tejgaon Police Station', distance: '2.1 km', phone: '02-8833084', address: 'Tejgaon, Dhaka 1215' }
        ]
    },
    'hospital': {
        icon: 'fas fa-hospital',
        title: 'Emergency Hospitals',
        services: [
            { name: 'Dhaka Medical College Hospital', distance: '1.5 km', phone: '02-9661064', address: 'Dhaka Medical College, Dhaka 1000' },
            { name: 'Sir Salimullah Medical College', distance: '2.0 km', phone: '02-7316222', address: 'Mitford, Dhaka 1100' },
            { name: 'Holy Family Red Crescent Hospital', distance: '1.8 km', phone: '02-8316071', address: 'Eskaton, Dhaka 1000' }
        ]
    },
    'ambulance': {
        icon: 'fas fa-ambulance',
        title: 'Ambulance Services',
        services: [
            { name: '999 Emergency Ambulance', distance: 'On-demand', phone: '999', address: 'Government Emergency Service' },
            { name: 'Dhaka Ambulance Service', distance: '5-10 min', phone: '01711-123456', address: '24/7 Private Service' },
            { name: 'Red Crescent Ambulance', distance: '10-15 min', phone: '02-9351522', address: 'Bangladesh Red Crescent Society' }
        ]
    },
    'fire station': {
        icon: 'fas fa-fire-extinguisher',
        title: 'Fire Stations',
        services: [
            { name: 'Fire Service Headquarters', distance: '1.0 km', phone: '9555555', address: 'Kakrail, Dhaka 1000' },
            { name: 'Dhanmondi Fire Station', distance: '0.9 km', phone: '02-9665544', address: 'Dhanmondi 27, Dhaka 1209' },
            { name: 'Tejgaon Fire Station', distance: '2.3 km', phone: '02-8833201', address: 'Tejgaon, Dhaka 1215' }
        ]
    }
};

document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    initializeLocationButton();
    initializeFilterButtons();
    initializeAISearch();
    loadSampleServices();
});

// Initialize the map
function initializeMap() {
    // Initialize map centered on Dhaka
    map = L.map('map').setView([23.8103, 90.4125], 12);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add map click event
    map.on('click', function(e) {
        console.log('Map clicked at:', e.latlng);
    });
}

// Initialize location button
function initializeLocationButton() {
    const locationBtn = document.getElementById('getLocationBtn');
    
    locationBtn.addEventListener('click', function() {
        getCurrentLocation();
    });
}

// Get user's current location
function getCurrentLocation() {
    const locationBtn = document.getElementById('getLocationBtn');
    const locationStatus = document.getElementById('locationStatus');
    
    if (!navigator.geolocation) {
        updateLocationStatus('Geolocation is not supported by this browser.', 'error');
        return;
    }

    // Show loading state
    locationBtn.disabled = true;
    locationBtn.innerHTML = '<i class="fas fa-spinner loading"></i> Getting Location...';
    updateLocationStatus('Getting your location...', 'loading');

    navigator.geolocation.getCurrentPosition(
        function(position) {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            // Update map view
            map.setView([userLocation.lat, userLocation.lng], 15);
            
            // Add user location marker
            if (window.userMarker) {
                map.removeLayer(window.userMarker);
            }
            
            window.userMarker = L.marker([userLocation.lat, userLocation.lng], {
                icon: L.divIcon({
                    className: 'user-location-marker',
                    html: '<i class="fas fa-map-marker-alt" style="color: #dc2626; font-size: 24px;"></i>',
                    iconSize: [24, 24],
                    iconAnchor: [12, 24]
                })
            }).addTo(map).bindPopup('Your Location');

            // Load nearby services
            loadNearbyServices(userLocation);
            
            // Reset button
            locationBtn.disabled = false;
            locationBtn.innerHTML = '<i class="fas fa-check"></i> Location Found';
            updateLocationStatus('Location found! Showing nearby emergency services.', 'success');
            
            setTimeout(() => {
                locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Update Location';
            }, 3000);
        },
        function(error) {
            let errorMessage = 'Unable to get your location.';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Location access denied. Please enable location services.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Location request timed out.';
                    break;
            }
            
            updateLocationStatus(errorMessage, 'error');
            
            // Reset button
            locationBtn.disabled = false;
            locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Try Again';
            
            // Use default Dhaka location
            loadNearbyServices({ lat: 23.8103, lng: 90.4125 });
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }
    );
}

// Update location status message
function updateLocationStatus(message, type) {
    const statusEl = document.getElementById('locationStatus');
    statusEl.innerHTML = `<i class="fas ${getStatusIcon(type)}"></i> ${message}`;
    statusEl.className = `location-status ${type}`;
}

function getStatusIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'loading': return 'fa-spinner loading';
        default: return 'fa-info-circle';
    }
}

// Initialize filter buttons
function initializeFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter services
            const filter = this.dataset.filter;
            filterServices(filter);
        });
    });
}

// Filter services on map
function filterServices(filter) {
    markers.forEach(marker => {
        if (filter === 'all' || marker.serviceType === filter) {
            marker.marker.addTo(map);
        } else {
            map.removeLayer(marker.marker);
        }
    });
    
    // Also filter the services list
    updateServicesList(filter);
}

// Load sample nearby services (in real app, this would call an API)
function loadSampleServices() {
    const dhakaLocation = { lat: 23.8103, lng: 90.4125 };
    loadNearbyServices(dhakaLocation);
}

function loadNearbyServices(location) {
    // Clear existing markers
    markers.forEach(marker => {
        map.removeLayer(marker.marker);
    });
    markers = [];
    
    // Sample emergency services data (in real app, this would come from an API)
    const sampleServices = [
        {
            id: 1,
            name: 'Dhaka Medical College Hospital',
            type: 'hospital',
            lat: location.lat + 0.01,
            lng: location.lng + 0.01,
            address: 'Bakshibazar, Dhaka 1000',
            phone: '+88029661064',
            distance: '1.2 km'
        },
        {
            id: 2,
            name: 'Ramna Police Station',
            type: 'police',
            lat: location.lat - 0.005,
            lng: location.lng + 0.005,
            address: 'Ramna, Dhaka 1000',
            phone: '+88029334091',
            distance: '0.8 km'
        },
        {
            id: 3,
            name: 'Popular Pharmacy',
            type: 'pharmacy',
            lat: location.lat + 0.005,
            lng: location.lng - 0.01,
            address: 'Dhanmondi, Dhaka 1205',
            phone: '+8801711123456',
            distance: '0.5 km'
        },
        {
            id: 4,
            name: 'Square Hospital',
            type: 'hospital',
            lat: location.lat - 0.01,
            lng: location.lng - 0.005,
            address: 'West Panthapath, Dhaka 1205',
            phone: '+88028144400',
            distance: '1.5 km'
        },
        {
            id: 5,
            name: 'Wari Police Station',
            type: 'police',
            lat: location.lat + 0.015,
            lng: location.lng + 0.015,
            address: 'Wari, Dhaka 1203',
            phone: '+88027316245',
            distance: '2.1 km'
        }
    ];
    
    services = sampleServices;
    
    // Add markers to map
    services.forEach(service => {
        const marker = createServiceMarker(service);
        markers.push({
            marker: marker,
            serviceType: service.type,
            service: service
        });
    });
    
    // Update services list
    updateServicesList('all');
}

// Create marker for service
function createServiceMarker(service) {
    const iconConfig = getServiceIconConfig(service.type);
    
    const marker = L.marker([service.lat, service.lng], {
        icon: L.divIcon({
            className: 'service-marker',
            html: `<div class="service-marker-icon ${service.type}">
                     <i class="${iconConfig.icon}"></i>
                   </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        })
    }).addTo(map);
    
    const popupContent = `
        <div class="service-popup">
            <h3>${service.name}</h3>
            <p><i class="fas fa-map-marker-alt"></i> ${service.address}</p>
            <p><i class="fas fa-phone"></i> ${service.phone}</p>
            <p><i class="fas fa-route"></i> ${service.distance}</p>
            <div class="popup-actions">
                <a href="tel:${service.phone}" class="popup-btn call">
                    <i class="fas fa-phone"></i> Call
                </a>
                <button onclick="getDirections(${service.lat}, ${service.lng})" class="popup-btn directions">
                    <i class="fas fa-directions"></i> Directions
                </button>
            </div>
        </div>
    `;
    
    marker.bindPopup(popupContent);
    
    return marker;
}

// Get service icon configuration
function getServiceIconConfig(type) {
    const configs = {
        'police': { icon: 'fas fa-shield-alt', color: '#1e40af' },
        'hospital': { icon: 'fas fa-plus-circle', color: '#dc2626' },
        'pharmacy': { icon: 'fas fa-pills', color: '#059669' }
    };
    
    return configs[type] || { icon: 'fas fa-map-marker-alt', color: '#666' };
}

// Update services list
function updateServicesList(filter) {
    const servicesList = document.getElementById('servicesList');
    const filteredServices = filter === 'all' ? services : services.filter(s => s.type === filter);
    
    if (filteredServices.length === 0) {
        servicesList.innerHTML = `
            <div style="text-align: center; color: #666; padding: 3rem;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No services found in this category.</p>
            </div>
        `;
        return;
    }
    
    servicesList.innerHTML = filteredServices.map(service => createServiceHTML(service)).join('');
}

// Create HTML for service card
function createServiceHTML(service) {
    const iconConfig = getServiceIconConfig(service.type);
    
    return `
        <div class="service-card">
            <div class="service-header">
                <div class="service-icon ${service.type}">
                    <i class="${iconConfig.icon}"></i>
                </div>
                <div class="service-info">
                    <h3>${service.name}</h3>
                    <p>${service.type.charAt(0).toUpperCase() + service.type.slice(1)}</p>
                </div>
            </div>
            <div class="service-details">
                <p><i class="fas fa-map-marker-alt"></i> ${service.address}</p>
                <p><i class="fas fa-phone"></i> ${service.phone}</p>
                <p><i class="fas fa-route"></i> Distance: ${service.distance}</p>
            </div>
            <div class="service-actions">
                <a href="tel:${service.phone}" class="action-btn call">
                    <i class="fas fa-phone"></i> Call Now
                </a>
                <button onclick="getDirections(${service.lat}, ${service.lng})" class="action-btn directions">
                    <i class="fas fa-directions"></i> Directions
                </button>
            </div>
        </div>
    `;
}

// Initialize AI Search functionality
function initializeAISearch() {
    const searchInput = document.getElementById('emergencySearch');
    const searchBtn = document.getElementById('searchBtn');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');
    const aiResponse = document.getElementById('aiResponse');

    // Handle search button click
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            performAISearch(query);
        }
    });

    // Handle Enter key in search input
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                performAISearch(query);
            }
        }
    });

    // Handle suggestion chip clicks
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.dataset.query;
            searchInput.value = query;
            performAISearch(query);
        });
    });
}

// Perform AI search with mock responses
function performAISearch(query) {
    const aiResponse = document.getElementById('aiResponse');
    const responseContent = document.getElementById('responseContent');
    
    // Show loading state
    aiResponse.style.display = 'block';
    responseContent.innerHTML = `
        <div class="ai-loading">
            <div class="loading-spinner"></div>
            <p>AI is analyzing your request...</p>
        </div>
    `;

    // Simulate AI processing delay
    setTimeout(() => {
        const response = getAIResponse(query);
        displayAIResponse(response);
    }, 1500);
}

// Get AI response based on query
function getAIResponse(query) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('police')) {
        return aiResponses['police station'];
    } else if (lowerQuery.includes('hospital') || lowerQuery.includes('medical')) {
        return aiResponses['hospital'];
    } else if (lowerQuery.includes('ambulance')) {
        return aiResponses['ambulance'];
    } else if (lowerQuery.includes('fire')) {
        return aiResponses['fire station'];
    } else {
        // Default response for unrecognized queries
        return {
            icon: 'fas fa-info-circle',
            title: 'Emergency Services',
            message: `I found several emergency services for "${query}". Here are the most relevant options:`,
            services: [
                { name: 'Emergency Hotline', distance: 'Immediate', phone: '999', address: 'National Emergency Service' },
                { name: 'Dhaka Metropolitan Police', distance: 'As needed', phone: '02-9556133', address: 'Various locations' },
                { name: 'Emergency Medical Services', distance: '5-15 min', phone: '199', address: 'Government Health Service' }
            ]
        };
    }
}

// Display AI response
function displayAIResponse(response) {
    const responseContent = document.getElementById('responseContent');
    
    let html = `
        <div class="ai-response-header">
            <i class="${response.icon}"></i>
            <h3>${response.title}</h3>
        </div>
    `;

    if (response.message) {
        html += `<p class="ai-message">${response.message}</p>`;
    }

    html += '<div class="emergency-services-list">';
    
    response.services.forEach(service => {
        html += `
            <div class="emergency-service-item">
                <div class="service-info">
                    <h4>${service.name}</h4>
                    <p><i class="fas fa-map-marker-alt"></i> ${service.distance} • ${service.address}</p>
                </div>
                <div class="service-actions">
                    <a href="tel:${service.phone}" class="call-btn">
                        <i class="fas fa-phone"></i>
                        ${service.phone}
                    </a>
                    <button class="direction-btn" onclick="getDirections('${service.name}')">
                        <i class="fas fa-directions"></i>
                        Directions
                    </button>
                </div>
            </div>
        `;
    });

    html += '</div>';
    
    // Add helpful tips
    html += `
        <div class="ai-tips">
            <h4><i class="fas fa-lightbulb"></i> Helpful Tips:</h4>
            <ul>
                <li>Save important numbers in your phone for quick access</li>
                <li>Share your location with emergency services when calling</li>
                <li>Stay calm and provide clear information about your emergency</li>
                <li>Keep your phone charged for emergency situations</li>
            </ul>
        </div>
    `;

    responseContent.innerHTML = html;
}

// Get directions to a service (placeholder function)
function getDirections(serviceName) {
    alert(`Getting directions to ${serviceName}. In a real app, this would open your maps application.`);
}

// Add CSS styles for markers
const markerStyles = `
    <style>
        .service-marker-icon {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        
        .service-marker-icon.police {
            background: #1e40af;
        }
        
        .service-marker-icon.hospital {
            background: #dc2626;
        }
        
        .service-marker-icon.pharmacy {
            background: #059669;
        }
        
        .service-popup {
            max-width: 250px;
        }
        
        .service-popup h3 {
            margin: 0 0 10px 0;
            color: #333;
            font-size: 16px;
        }
        
        .service-popup p {
            margin: 5px 0;
            color: #666;
            font-size: 14px;
        }
        
        .service-popup i {
            color: #2c5aa0;
            margin-right: 8px;
            width: 16px;
        }
        
        .popup-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        
        .popup-btn {
            flex: 1;
            padding: 8px 12px;
            border-radius: 15px;
            text-decoration: none;
            text-align: center;
            font-size: 12px;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .popup-btn.call {
            background: #059669;
            color: white;
        }
        
        .popup-btn.directions {
            background: #2c5aa0;
            color: white;
        }
        
        .popup-btn:hover {
            transform: translateY(-1px);
        }
        
        .user-location-marker {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* AI Response Styles */
        .ai-response-header {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .ai-response-header i {
            font-size: 24px;
            color: #2c5aa0;
            margin-right: 10px;
        }
        
        .ai-response-header h3 {
            margin: 0;
            font-size: 18px;
            color: #333;
        }
        
        .ai-message {
            margin: 10px 0;
            font-size: 14px;
            color: #666;
        }
        
        .emergency-services-list {
            margin-top: 10px;
        }
        
        .emergency-service-item {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            margin-bottom: 10px;
            background: #fff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .service-info {
            flex: 1;
            margin-right: 10px;
        }
        
        .service-info h4 {
            margin: 0 0 5px 0;
            font-size: 16px;
            color: #333;
        }
        
        .service-info p {
            margin: 2px 0;
            font-size: 14px;
            color: #666;
        }
        
        .service-actions {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .call-btn, .direction-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 8px 12px;
            border-radius: 15px;
            text-decoration: none;
            text-align: center;
            font-size: 14px;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 5px;
        }
        
        .call-btn {
            background: #059669;
            color: white;
        }
        
        .direction-btn {
            background: #2c5aa0;
            color: white;
        }
        
        .call-btn:hover, .direction-btn:hover {
            transform: translateY(-1px);
        }
        
        .ai-tips {
            margin-top: 15px;
            padding: 10px;
            background: #f9f9f9;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
        }
        
        .ai-tips h4 {
            margin: 0 0 10px 0;
            font-size: 16px;
            color: #333;
        }
        
        .ai-tips ul {
            padding-left: 20px;
            margin: 0;
            list-style-type: disc;
        }
        
        .ai-tips li {
            margin: 5px 0;
            font-size: 14px;
            color: #666;
        }
    </style>
`;

// Add styles to head
document.head.insertAdjacentHTML('beforeend', markerStyles);
