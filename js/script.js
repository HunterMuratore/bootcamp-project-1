var map;
var service;
var mapSection = $('#map');
var hikeThisTrail = $('#hike-this-trail');
var detailsDiv = $('.details');

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
      Address: ${place.formatted_address}
    </div>
    <button class="hikeBtn">Hike</button>
  </div>`;

  addTrailDetails(place.name, place.rating, place.user_ratings_total, place.formatted_address, googleMapsUrl);

  var infoWindow = new google.maps.InfoWindow({
    content: html
  });

  marker.addListener('click', function() {
    infoWindow.open(map, marker);
  });
}

function getHikingTrails() {
  var request = {
    location: map.getCenter(),
    radius: '5000',
    query: 'hiking trails'
  };

  // REMOVE THIS BEFORE MERGING
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

function hikeThisTrailSection() {
  // Hide the home html
  mapSection.css('display', 'none');
  // Display the hike-this-trail html section
  // Create div class=trail-details
    // Append to it the trail name, trail rating by #users, trail address and directions
  // Create div class=trail-image
    // Append to it the google image of the trail
  // Create div class=weather
    // Get weather data from an api and display the one-day weather report at the   trails location  
} 

function addTrailDetails(name, rating, users, address, directions) {
  // Create a trail-detail div
  var trailDetailsDiv = $('<div>').addClass('trail-details bg-green tile is-child box');
  
  // Construct the inner HTML of trail-detail div
  var trailDetailsInfo =`
    <h2 class="title">${name}</h2>
    <div class="mx-4">
      <p>Trail Rating: ${rating}/5 by ${users} users</p>
      <a href="${directions}">${address}</a>
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

getWeatherData(40.602230, -74.689911);
