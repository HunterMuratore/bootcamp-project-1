var map;
var service;
var placeData;
var mapSection = $('#map');
var hikeThisTrail = $('#hike-this-trail');
var detailsDiv = $('.details');
var trailImgDiv = $('.trail-image');

function generateMapMarkers(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  // Create a market for the current place
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  // Get the google maps url for the place to be used in the directions link
  var latLng = place.geometry.location.lat() + ',' + place.geometry.location.lng();
  var googleMapsUrl = 'https://www.google.com/maps?q=' + encodeURIComponent(latLng);

  // Construct the html for the info window
  var infoDiv = $('<div>').addClass('infoWindow').html(`
    <strong>${place.name}</strong>
    Rating: ${place.rating}
    <br>
    <div class="address">
      Address: ${place.formatted_address}
    </div>
    <br>
    <a href=${googleMapsUrl} target="_blank">Directions</a>
    <br>
    <button class="hikeBtn">Hike</button>
  `);

  // Add the html to the info window
  var infoWindow = new google.maps.InfoWindow({
    content: infoDiv.html()
  });

  // Open the info window on marker click
  marker.addListener('click', function() {
    infoWindow.open(map, marker);
    placeData = place;
  });
}

function getHikingTrails() {
  var request = {
    location: map.getCenter(),
    radius: '5000',
    query: 'hiking trails'
  };

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

function hikeThisTrailSection() { 
  getWeatherData(placeData.geometry.location.lat(), placeData.geometry.location.lng());
  addTrailDetails(placeData.name, placeData.rating, placeData.user_ratings_total, placeData.formatted_address);
} 

function addTrailDetails(name, rating, users, address) {
  // Create a trail-detail div
  var trailDetailsDiv = $('<div>').addClass('trail-details bg-green tile is-child box');
  
  // Construct the inner HTML of trail-detail div
  var trailDetailsInfo = `
    <h2 class="title">${name}</h2>
    <div class="mx-4">
      <p>${address}</p>
      <p>Trail Rating: ${rating}/5 by ${users} users</p>
    </div>
  `;

  trailDetailsDiv.append(trailDetailsInfo);
  detailsDiv.append(trailDetailsDiv);
}

function addWeatherData(weatherData) {
  // Create a weather-data div 
  var weatherDataDiv = $('<div>').addClass('weather-data bg-yellow tile is-child box');
  // Construct the inner HTML of weather-data div
  var iconUrl = `https://openweathermap.org/img/w/${weatherData.iconCode}.png`;
  var weatherDataInfo = `
    <h2 class="title">Weather at this trail</h2>
    <div class="columns">
      <div class="column mx-4">
        <p>Temperature: ${weatherData.temperature}°F</p>
        <p>Conditions: ${weatherData.condition}</p>
        <p>Humidity: ${weatherData.humidity}</p>
        <p>Wind Speed: ${weatherData.windSpeed} mph</p>
      </div>
      <div class="column mx-4">
        <p>Feels Like: ${weatherData.feelsLike}°F<img src="${iconUrl}" alt="Weather Icon"></p>
      </div>
    </div>
    `;
  
  weatherDataDiv.append(weatherDataInfo);
  detailsDiv.append(weatherDataDiv);
}

function getWeatherData(lat, lon) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=f15b9497c6b6f8a664cbf171c926c169`;

  // Get all of the weather data for their location and put it in an object to be sent to addWeatherData()
  $.get(apiUrl, function(data) {
      var weatherData = {
        temperature: Math.floor(data.main.temp),
        humidity: data.main.humidity,
        feelsLike: Math.floor(data.main.feels_like),
        windSpeed: data.wind.speed,
        condition: data.weather[0].description,
        iconCode: data.weather[0].icon
      }

  addWeatherData(weatherData);
  });
}

$(document.body).on('click', '.hikeBtn', hikeThisTrailSection);