// Create map variable and set coordinates
var myMap = L.map("map", {
    center: [36.7783, -119.4179],
    zoom: 4
});

// Create the tile layer that will be the background of the map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
}).addTo(myMap);

// Query GeoJSON data and create GET request
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
d3.json(queryUrl, function(data) {
  // Pull and store data for functions
  createFeatures(data.features);
});

// Define function to run for each necessary marker
function createFeatures(earthquakeData) {

  // Define path to pull to display on marker
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p><b>Magnitude:</b> " + feature.properties.mag + "</p>");
  }

  // Assign a color to the marker according to the magnitude
  function getcolor(magnitude){
      switch (true) {
          case magnitude>5:
              return "red";
          case magnitude>=4:
              return "orangered";
          case magnitude>=3:
              return "orange";
          case magnitude>=2:
              return "yellow";
          case magnitude>=1:
              return "greenyellow";
          default:
              return "green";
      }
  }

  // Establish the radius according to the magnitude
  function getradius(magnitude){
      return magnitude*5;
  }
  
  // Run the onEachFeature function once for each piece of data in the array
  L.geoJSON(earthquakeData, {
               
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
              var magnitude = feature.properties.mag;
              return new L.circleMarker(latlng, {
          color: "Black",
          weight: 1,
          fillColor: getcolor(magnitude),
          radius: getradius(magnitude),
          fillOpacity: 1
      });
    }
  }).addTo(myMap);

  // Create and style the legend
  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#008000",
      "#adff2f",
      "#FFFF00",
      "#FFA500",
      "#FF4500",
      "#ff0000"
    ];

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  legend.addTo(myMap);
};