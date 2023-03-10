mapboxgl.accessToken = 'pk.eyJ1IjoiYXByaWw0MjkiLCJhIjoiY2xhMTdmYW83MDRxajNucWlnajZycXljYiJ9.6lp57MluBmbXVuoSV_FBwA';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style : 'mapbox://styles/april429/clen5lufa000301mkrlqpvs02',
    zoom: 11.5, // starting zoom
    center: [-122.325167, 47.608013], // starting center
    projection: 'albers'
});

function getDistance(point1, point2) {
    const R = 3958.8;
    const lat1 = point1[1];
    const lon1 = point1[0];
    const lat2 = point2[1];
    const lon2 = point2[0];
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) + 
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

async function geojsonFetch() {
    // Load GeoJson asynchronously
    let response, Starbucks, driveThru, both;
    response = await fetch('assets/Starbucks_Seattle.geojson');
    Starbucks = await response.json();

    response = await fetch('assets/in_store.geojson');
    inStore = await response.json();

    response = await fetch('assets/drive_thru.geojson');
    driveThru = await response.json();

    response = await fetch('assets/both.geojson');
    both = await response.json();
    // Add map layers
    map.on('load', function loadingData() {
        map.addSource('Starbucks', {
            type: 'geojson',
            data: Starbucks
        });

        map.addSource('inStore', {
            type: 'geojson',
            data: inStore
        });

        map.addSource('driveThru', {
            type: 'geojson',
            data: driveThru
        });

        map.addSource('both', {
            type: 'geojson',
            data: both
        });

        map.addControl(
            new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl,
                container: 'geocoder-container',
                placeholder: 'Find a store...',
                proximity: {
                    longitude: -122.3321,
                    latitude: 47.6062
                },
                countries: 'us',
                types: 'poi'
            }),
            'top-left'
        );

        map.addControl(new mapboxgl.NavigationControl())

        Starbucks.features.forEach(function(store) {
            var el = document.createElement('div');
            el.className = 'marker';
            new mapboxgl.Marker(el)
                .setLngLat(store.geometry.coordinates)
                .setPopup(new mapboxgl.Popup({offset: [0, -25]})
                .setHTML('<h3>' + store.properties.Name + '</h3><p>' + store.properties.description + '</p>'))
                .addTo(map);
        })

        
        map.addLayer({
            'id': 'Starbucks-layer',
            'type': 'circle',
            'source': 'Starbucks',
            'paint': {
              'circle-radius': 5,
              'circle-stroke-width': 2,
              'circle-color': 'green',
              'circle-stroke-color': 'white'
          }
        });

        map.addLayer({
            'id': 'inStore-layer',
            'type': 'circle',
            'source': 'inStore',
            'paint': {
              'circle-radius': 5,
              'circle-stroke-width': 2,
              'circle-color': 'green',
              'circle-stroke-color': 'white'
          }
        });

        map.addLayer({
            'id': 'driveThru-layer',
            'type': 'circle',
            'source': 'driveThru',
            'paint': {
              'circle-radius': 5,
              'circle-stroke-width': 2,
              'circle-color': 'green',
              'circle-stroke-color': 'white'
          }
        });

        map.addLayer({
            'id': 'both-layer',
            'type': 'circle',
            'source': 'both',
            'paint': {
              'circle-radius': 5,
              'circle-stroke-width': 2,
              'circle-color': 'green',
              'circle-stroke-color': 'white'
          }
        });

        map.on('click', (event) => {
            const features = map.queryRenderedFeatures(event.point, {
            layers: ['Starbucks-layer', 'inStore-layer', 'driveThru-layer', 'both-layer']
            });
            if (!features.length) {
            return;
            }
            const feature = features[0];
            const sourceData = map.getSource('Starbucks')._data;
            
            // Find the selected feature in the GeoJSON data
            const selectedFeature = sourceData.features.find(f => f.properties.id === feature.properties.id);
            
            // Calculate the distance between the selected location and each location in the GeoJSON data
            const distances = sourceData.features.map(f => {
              const distance = getDistance(selectedFeature.geometry.coordinates, f.geometry.coordinates);
              return { id: f.properties.id, distance: distance };
            });
            
            // Sort the locations by distance
            distances.sort((a, b) => a.distance - b.distance);
            
            // Create a HTML list of the locations with their distance from the selected location
            // Loop through all the features in the GeoJSON data
            let locationList = '<ul>';
            sourceData.features.forEach(feature => {
            // Get the name and address of the Starbucks location
            const Name = feature.properties.Name;
            const description = feature.properties.description;

            // Add the name and address to the HTML list
            locationList += `<li><strong>${Name}</strong><br>${description}</li>`;
            });
            distances.forEach(d => {
                const location = sourceData.features.find(f => f.properties.id === d.id);
                locationList += `<li><strong>${location.properties.Name}</strong> (${d.distance.toFixed(2)} miles)</li>`;
              });
            locationList += '</ul>';

            // Display the HTML list on the page
            document.getElementById('location-list').innerHTML = locationList;
            
            // Create a new html element for the side panel
            const sidebar = document.getElementById('sidebar');
            const sidebarContent = document.querySelector('.sidebar-content');
            
            sidebarContent.innerHTML = `<h3>${selectedFeature.properties.Name}</h3><p>${selectedFeature.properties.description}</p>${locationList}`;
            
            sidebar.classList.add('open');
            
            // Create the close button and add it to the sidebar
            const closeButton = document.createElement('button');
            closeButton.innerHTML = 'Close';
            closeButton.classList.add('sidebar-close');
            sidebar.appendChild(closeButton);
            
            // Add an event listener to the close button
            closeButton.addEventListener('click', () => {
              // Remove the "open" class from the sidebar element
              sidebar.classList.remove('open');
            });
            

            const popup = new mapboxgl.Popup({ offset: [0, -15] })
            .setLngLat(feature.geometry.coordinates)
            .setHTML(
            `<h3>${feature.properties.Name}</h3><p>${feature.properties.description}</p>`
            )
            .addTo(map);
            });

        // Get the layer selector buttons by their ids
        const allStoreSelector = document.getElementById('all-store-selector');
        const inStoreSelector = document.getElementById('in-store-selector');
        const driveThruSelector = document.getElementById('drive-thru-selector');
        const driveThruInStoreSelector = document.getElementById('drive-thru-in-store-selector');

        // Add click event listeners to the layer selector buttons
        allStoreSelector.addEventListener('click', function() {
            toggleLayerVisibility('Starbucks-layer');
            toggleSelectorActiveState(allStoreSelector);
        });

        inStoreSelector.addEventListener('click', function() {
            toggleLayerVisibility('inStore-layer');
            toggleSelectorActiveState(inStoreSelector);
        });

        driveThruSelector.addEventListener('click', function() {
            toggleLayerVisibility('driveThru-layer');
            toggleSelectorActiveState(driveThruSelector);
        });

        driveThruInStoreSelector.addEventListener('click', function() {
            toggleLayerVisibility('both-layer');
            toggleSelectorActiveState(driveThruInStoreSelector);
        });

        // Function to toggle the visibility of a layer
        function toggleLayerVisibility(layerId) {
            const visibility = map.getLayoutProperty(layerId, 'visibility');
            if (visibility === 'visible') {
                map.setLayoutProperty(layerId, 'visibility', 'none');
            } else {
                map.setLayoutProperty(layerId, 'visibility', 'visible');
            }
        }

        // Function to toggle the active state of a selector button
        function toggleSelectorActiveState(selector) {
            const isActive = selector.classList.contains('active');
            if (isActive) {
                selector.classList.remove('active');
            } else {
                // Remove "active" class from all selector buttons
                const selectors = document.querySelectorAll('.layer-selector');
                selectors.forEach(function(selector) {
                    selector.classList.remove('active');
                });
    
                // Add "active" class to clicked selector button
                selector.classList.add('active');
            }
        }
    });
}

geojsonFetch();