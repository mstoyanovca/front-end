var lat;
var lng;
var url;
var units = "metric";

$(document).ready(function() {
  // get your current location from Google:
  if(navigator.geolocation) {
    $.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCZAjmBTKdOqMGIzdQSYuIfbBAmJ8E8C5I", function(data, status) {
      lat = data.location.lat;
      lng = data.location.lng;
      // call after the location callback returns:
      getWeather();
    });
  } else {
    $("#error").text("Your browser does not support geolocation.").addClass("error");
  }
  
  function getWeather() {
    url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&units=" + units + "&appid=4f9bbd09ecf33ce9ff4c9d3a033bc044";
    // pass your location to the OpenWeatherMap API to get the weather:
    $.getJSON(url, function(json) {
      // document.write(JSON.stringify(json));
      $("#location").text(json.name + ", " + json.sys.country);
      $("#temperature").text(json.main.temp);
      $("#description").text(json.weather[0].main);
      var iconURL = "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png";
      $("#icon").attr("src", iconURL);
    }).fail(function(jqXHR, textStatus, errorThrown) {
      alert(jqXHR.responseText);
    });
  };
  
  // toggle between Celsius and Fahrenheit degrees:
  $("#units").click(function() {
    switch (units) {
      case "metric":
        units = "imperial";
        $("#units").html(" " + '&deg;' + "F");
        getWeather();
        break;
      case "imperial":
        units = "metric";
        $("#units").html(" " + '&deg;' + "C");
        getWeather();
    }
  });
});