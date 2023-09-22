var map;
var service;
var currentInfoWindow = null;

function generateMapMarkers(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  var latLng = place.geometry.location.lat() + ',' + place.geometry.location.lng();
  var googleMapsUrl = 'https://www.google.com/maps?q=' + encodeURIComponent(latLng);

  var html = `
  <div class="infoWindow">
    <strong>${place.name}</strong>
    Rating: ${place.rating}
    <br>
    <div class="address">
    <strong>Address:</strong> <a href="${googleMapsUrl}" target="_blank">${place.formatted_address}</a>
    </div>
    <br>
    <button class="hikeBtn">Details</button>
    ${ /* <a href="${googleMapsUrl}" target="_blank">Directions</a> */ ''}
    <img class="infoLink" src="${getPhotoUrl(place)}">
  </div>`;

  function getPhotoUrl(place) {
    if (place.photos && place.photos.length > 0) {
      var photo = place.photos[0];
      return photo.getUrl({ maxWidth: 400, maxHeight: 400 });
    } else {
      return './images/nature-placeholder.jpg'; // Replace with a placeholder image URL
    }
  }

  var infoWindow = new google.maps.InfoWindow({
    content: html
  });

  marker.addListener('click', function () {
    // Close the previous info window if it's currently displayed
    if (currentInfoWindow) {
      currentInfoWindow.close()
    }

    // Open new info window
    infoWindow.open(map, marker);
    currentInfoWindow = infoWindow;
  });


}

function getHikingTrails() {
  var request = {
    location: map.getCenter(),
    radius: '5000',
    query: 'hiking trails'
  };

  service.textSearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // Loop through 'results' to get details about nearby hiking locations
      for (const place of results) {
        // console.log(place.name, place.geometry.location, place.rating, place.photos);
        console.log(place);
        // You can extract other details like photos, ratings, etc., from 'place'
      }
    }
  });

  service.textSearch(request, generateMapMarkers);
}

function getLocation(callback) {
  if (navigator) {
    navigator.geolocation.getCurrentPosition(function (data) {
      callback(data.coords.latitude, data.coords.longitude);
    })
  }
}


function initMap() {
  // Set the location (City or Latitude/Longitude)
  getLocation(function (lat, long) {
    var location = { lat: lat, lng: long };

    // Create a new Map instance
    map = new google.maps.Map(document.getElementById('map'), {
      center: location,
      zoom: 12
    });

    // Create a new PlacesService instance
    service = new google.maps.places.PlacesService(map);

    getHikingTrails();
  });
}