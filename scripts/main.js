mapboxgl.accessToken = 'pk.eyJ1IjoiaGFvY2gwNDIzIiwiYSI6ImNsZTd6ZWprZTAxOXAzdXFnN3J1NTVjZ2YifQ.75kz-3fG_A9SMXdoEZJiHg';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style : 'mapbox://styles/haoch0423/clem0v58v000w01lfrh5gyln9',
    zoom: 11, // starting zoom
    center: [-122.385167, 47.608013], // starting center
    projection: 'albers'
});

async function geojsonFetch() {
    let response = await fetch('assets/Starbucks.json');
    let covidRates = await response.json();

    map.on('load', function loadingData() {
        map.addSource('Starbucks.json', {
            type: 'geojson',
            data: covidRates
        });

        map.addLayer({
            'id': 'Starbucks.json',
            'type': 'fill',
            'source': 'Starbucks.json',
            'paint': {
                'fill-color': '#FFEDA0',
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7,
            }
        });

    })
}

geojsonFetch();