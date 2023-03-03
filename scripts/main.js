mapboxgl.accessToken = 'pk.eyJ1IjoiYXByaWw0MjkiLCJhIjoiY2xhMTdmYW83MDRxajNucWlnajZycXljYiJ9.6lp57MluBmbXVuoSV_FBwA';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style : 'mapbox://styles/april429/clen5lufa000301mkrlqpvs02',
    zoom: 11.5, // starting zoom
    center: [-122.325167, 47.608013], // starting center
    projection: 'albers'
});

async function geojsonFetch() {
    // Load GeoJson asynchronously
    let response, Starbucks;
    response = await fetch('assets/Starbucks_Seattle.geojson');
    Starbucks = await response.json();
    // Add map layers
    map.on('load', function loadingData() {
        map.addSource('Starbucks', {
            type: 'geojson',
            data: Starbucks
        });

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

        map.on('click', (event) => {
            const features = map.queryRenderedFeatures(event.point, {
            layers: ['Starbucks-layer']
            });
            if (!features.length) {
            return;
            }
            const feature = features[0];

            // Create a new html element for the side panel
            const sidebar = document.getElementById('sidebar');
            const sidebarContent = document.querySelector('.sidebar-content');

            sidebarContent.innerHTML = `<h3>${feature.properties.Name}</h3><p>${feature.properties.description}</p>`;

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

            const geocoder = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl,
                placeholder: 'Find a store...'
            });
            document.getElementById('geocoder').appendChild(geocode.onAdd(map));

        geocoder.on('result', (e) => {
            const searchResults = document.getElementById('search-results');
            searchResults.innerHTML = '';
            const feature = e.result;
            const title = feature.place_name.split(',')[0];
            const address = feature.place_name.split(',').slice(1).join(',').trim();
            const resultItem = document.createElement('div');
            resultItem.innerHTML = `<div class="result-title">${title}</div><div class="result-address">${address}</div>`;
            resultItem.addEventListener('click', () => {
            // Fly to the selected location
                map.flyTo({ center: feature.geometry.coordinates, zoom: 15 });
            });
            searchResults.appendChild(resultItem);
            });
                
        });
            
                
                

    });
}

geojsonFetch();