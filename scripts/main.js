mapboxgl.accessToken = 'pk.eyJ1IjoiaGFvY2gwNDIzIiwiYSI6ImNsZTd6ZWprZTAxOXAzdXFnN3J1NTVjZ2YifQ.75kz-3fG_A9SMXdoEZJiHg';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style : 'mapbox://styles/haoch0423/clem0v58v000w01lfrh5gyln9',
    zoom: 11.5, // starting zoom
    center: [-122.325167, 47.608013], // starting center
    projection: 'albers'
});

async function geojsonFetch() {
    // Load GeoJson asynchronously
    let response, starbucks;
    response = await fetch('assets/Starbucks_Seattle.geojson');
    starbucks = await response.json();
    // Add map layers
    map.on('load', function loadingData() {
        map.addSource('starbucks', {
            type: 'geojson',
            data: starbucks
        });

        map.addLayer({
            'id': 'starbucks-layer',
            'type': 'circle',
            'source': 'Starbucks',
            'paint': {
              'circle-radius': 8,
              'circle-stroke-width': 2,
              'circle-color': 'red',
              'circle-stroke-color': 'white'
          }
        });

    })
}

geojsonFetch();