var map;
var service;
var hikeThisTrail = $('#hike-this-trail');

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
  <div>
    <strong>${place.name}</strong>
    <br>
    Address: ${place.formatted_address}
    <br>
    <a href="${googleMapsUrl}" target="_blank">Directions</a>
  </div>
  `;

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

  service.textSearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // Loop through 'results' to get details about nearby hiking locations
      for (const place of results) {
        // console.log(place.name, place.geometry.location, place.rating, place.photos);
        // console.log(place);
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
  // Display the hike-this-trail html section
  // Create div class=trail-details
    // Append to it the trail name, trail rating by #users, trail address and directions
  // Create div class=trail-image
    // Append to it the google image of the trail
  // Create div class=weather
    // Get weather data from an api and display the one-day weather report at the trails location  
} 

function addTrailDetails() {

}

function addWeatherData(weatherData) {
  // Create a weather-data div 
  var weatherDataDiv = $('<div>').addClass('weather-data tile is-child');
  // Construct the inner HTML of weather-data div using Bulma tile classes
  var iconUrl = `https://openweathermap.org/img/w/${weatherData.iconCode}.png`;
  var weatherDataInfo = `
    <h2>Weather at this trail</h2>
    <p>Temperature: ${weatherData.temperature}°F</p>
    <p>Description: ${weatherData.description}</p>
    <p>Humidity: ${weatherData.humidity}</p>
    <p>Wind Speed: ${weatherData.windSpeed} mph</p>
    <p>Feels Like: ${weatherData.feelsLike}°F</p>
    <img src="${iconUrl}" alt="Weather Icon">
    `;
  
  
  weatherDataDiv.append(weatherDataInfo);
  hikeThisTrail.append(weatherDataDiv);
}

function getWeatherData(lat, lon) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=f15b9497c6b6f8a664cbf171c926c169`;

  $.get(apiUrl, function(data) {
      var weatherData = {
        temperature: Math.floor(data.main.temp),
        humidity: data.main.humidity,
        feelsLike: Math.floor(data.main.feels_like),
        windSpeed: data.wind.speed,
        description: data.weather[0].description,
        iconCode: data.weather[0].icon
      }
      
      // console.log(temperature, description, data, iconUrl);

      addWeatherData(weatherData);

      // var weatherData = `
      //     <h2>Weather at this trail</h2>
      //     <p>Temperature: ${weatherData.temperature}°F</p>
      //     <p>Description: ${weatherData.description}</p>
      //     <p>Humidity: ${weatherData.humidity}</p>
      //     <p>Wind Speed: ${weatherData.windSpeed} mph</p>
      //     <p>Feels Like: ${weatherData.feelsLike}°F</p>
      //     <img src="${iconUrl}" alt="Weather Icon">
      // `;

      // $('.weather-data').html(weatherData);
  });
}

getWeatherData(40.602230, -74.689911);