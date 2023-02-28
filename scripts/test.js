mapboxgl.accessToken = 'pk.eyJ1IjoiaGFvY2gwNDIzIiwiYSI6ImNsZTd6ZWprZTAxOXAzdXFnN3J1NTVjZ2YifQ.75kz-3fG_A9SMXdoEZJiHg';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style : 'mapbox://styles/haoch0423/clem0v58v000w01lfrh5gyln9',
    zoom: 11.5, // starting zoom
    center: [-122.325167, 47.608013], // starting center
    projection: 'albers'
});


    // Add map layers

map.on('load', () => {
    map.addSource('starbucks', {
        type: 'geojson',
        data: 'assets/Starbucks.geojson'
    });
    map.addLayer({
        'id': 'starbucks-layer',
        'type': 'circle',
        'source': 'starbucks',
        'paint': {
            'circle-radius': 8,
            'circle-stroke-width': 2,
            'circle-color': 'red',
            'circle-stroke-color': 'white'
        }
    }
);

    map.on('click', 'starbucks', (event) => {
        new mapboxgl.Popup()
            .setLngLat(event.features[0].geometry.coordinates)
            .setHTML(`<strong>cases:</strong> ${event.features[0].properties.postalCode}`)
            .addTo(map);
    });
});
// create legend
const legend = document.getElementById('legend');
//set up legend grades and labels
var labels = ['<strong>cases</strong>'],
    vbreak;
//iterate through grades and create a scaled circle and label for each
for (var i = 0; i < grades.length; i++) {
    vbreak = grades[i];
    // you need to manually adjust the radius of each dot on the legend 
    // in order to make sure the legend can be properly referred to the dot on the map.
    dot_radii = 2 * radii[i];
    labels.push(
        '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
        'px; height: ' +
        dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
        '</span></p>');
}
const source =
    '<p style="text-align: right; font-size:10pt">Source: <a href="https://earthquake.usgs.gov/earthquakes/">USGS</a></p>';
legend.innerHTML = labels.join('') + source;