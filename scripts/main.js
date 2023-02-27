mapboxgl.accessToken = 'pk.eyJ1IjoiaGFvY2gwNDIzIiwiYSI6ImNsZTd6ZWprZTAxOXAzdXFnN3J1NTVjZ2YifQ.75kz-3fG_A9SMXdoEZJiHg';

  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style : 'mapbox://styles/haoch0423/clem0v58v000w01lfrh5gyln9',
    zoom: 11, // starting zoom
    center: [-122.335167, 47.608013], // starting center
})
