$(document).ready(function() {
//     $.ajax({
//     async: true,
//     crossDomain: true,
//     url: "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCx713Z6MzLSQe5QSC2mtrRE0XIxb1LRns",
//     dataType: 'json',
//     method: "POST",//POST
//     success: function(response) {
// 			console.log(response); 
   var location = {
       
   
		
//       //coordinates
      lat : 49.583,
      lng : 34.567,  
//       lat : "",
//       lng : "",  
       // send ajax request to fetch location data
    	
      
      //returns coordinates
      getCoords: function(){
         var coords=[location.lat, location.lng];
         return coords;
      },
      
      //accepts a coordinates array and sets location.coordinates
      setCoords: function(coords){
        location.lat=coords[0];
        location.lng=coords[1];
      },
      
      //add predictive autocomplete service from google places API to input field
      autocomplete: new google.maps.places.Autocomplete(
         document.getElementById("autocomplete"),
         { types: ["(cities)"] }
      ),
      
      //autocomplete click event handler to get lat lng coords for selected location
      onPlaceChanged: function() {
         var locationObject = location.autocomplete.getPlace();
         var lat = parseFloat(locationObject.geometry.location.lat().toFixed(2));
         var lng = parseFloat(locationObject.geometry.location.lng().toFixed(2));
         var coords = [lat, lng];
         location.setCoords(coords);
         update();
      },
      
      //callback for successful request to google maps geocode API to format and display city,state
      displayCity: function(json) {
         var formattedAddress = json.results[0].formatted_address;
         var arr = formattedAddress.split(",");
         var city = arr[1];
         var state = arr[2];
         state = state.substring(0, 3);
         $(".city").html(city+ ", " +state);
         $("#autocomplete").attr("placeholder", city+ ", " +state);
      },
      
      //getJSON request to google geocode API to reverse geocode lat and lng coords -> called by update function
      callGeocodeAPI: function(){
         var coords=location.getCoords();
         var lat = coords[0];
         var lng = coords[1];
         $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"", function(json){
               location.displayCity(json);
            });
      },
      
      //localWeather click event handler to request coords from geolocation API
      callBrowserGeolocationAPI: function(){
         if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
               location.navGeolocateSuccess,
               location.navGeolocateError /*, options*/
            );
         } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
         }
      },
      
      //handle successful request to geolocation API, update coords and call update function
      navGeolocateSuccess: function(position) {
         var lat = parseFloat(position.coords.latitude.toFixed(2));
         var lng = parseFloat(position.coords.longitude.toFixed(2));
         var coords = [lat, lng];
         location.setCoords(coords);
         update();
      },
      
      //handle unsuccessful request to geolocation API
      navGeolocateError: function() {
         coords.innerHTML = "Unable to retrieve your location";
      }

   };
//       },
//     }).fail(function() {
//       $('.border').append('<p>Error: Could not load weather data!</p>');
//     });
   //object literal containing methods for initializing and updating the map
   var map = {
      
      //initialize map -> called by the start function
      initMap: function() {
         var coords=location.getCoords();
         var lat=coords[0];
         var lng=coords[1];
         var mapDiv = document.getElementById("map");
         map.myMap = new google.maps.Map(mapDiv, {
            center: { lat: lat, lng: lng },
            zoom: 10
         });
         map.setMapHeight();
      },
      
      //set the center of the map -> called by the update function
      updateMap: function(){
        var coords=location.getCoords();
        var lat=coords[0];
        var lng=coords[1];
        map.myMap.setCenter({lat:lat, lng:lng})
        ; 
         map.setMapHeight();
      },
      //window resize callback function to maintain aspect ratio
      setMapHeight:function(){
          var mapWidth = parseInt($("#map").width());
          $("#map").css("height",mapWidth);
      }
   };
   
   //object literal containing methods for formatting and displaying time and date  
   var time = {
      //create a new instance of the date object from constructor and return array of formatted time and date
      monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
      dayNames: ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"],
      
      //add 0 in front of single digit minutes
      setMinute: function(){
         var minute = time.minute;
         if (minute < 10) {
           minute = "0" + minute;
         }
         return minute.toString();
       },
      
      //convert hour to to a 12 hour clock
       setHour: function(index){
          var hour=time.hour;
          if (hour == 0) {
             hour = 12;
          } else if (hour > 12) {
             hour = hour - 12;
          } 
          return hour.toString();
       },
      
      //set meridiem period
       setAMPM: function(){
          var ampm;
          var hour=time.hour;
          if (hour == 0) {
            ampm="am";
          } else if (hour > 12) {
            ampm="pm";
          } else {
            ampm="am";
          }
          return ampm;
       },
       
      //returns combined weekday, month, and date
       formatDate: function(date){
          var dayOfMonth = date.getDate();
          var dayOfWeek = date.getDay();
          time.dayOfWeek=dayOfWeek;
          var month = date.getMonth();
          month = time.monthNames[month];
          dayOfWeek = time.dayNames[dayOfWeek];
          var formattedDate = dayOfWeek + ", " + month + " " + dayOfMonth;
          return formattedDate;
       },
      
      //returns combined hour, minute, and meridiem period
       formatTime: function(date){
          var hour = date.getHours();
          time.hour=hour;
          var minute = date.getMinutes();
          time.minute=minute;
          var ampm = "am";
          var formattedTime = time.setHour()+":"+time.setMinute()+time.setAMPM();
          return formattedTime;
       },
      
      //returns updated date and time
       updateDateAndTime: function() {
          var date = new Date();
          time.date=date;
          var formattedDate = time.formatDate(date);
          var formattedTime = time.formatTime(date);
          var DateAndTime = [formattedDate, formattedTime];
          return DateAndTime;
       },
      
       //update and display time and date
       setTime: function() {
          var DateAndTime = time.updateDateAndTime();
          $(".dayMonth").html(DateAndTime[0]);
          $(".time").html(DateAndTime[1]);
       },
      
      //accepts parameter representing the current value of the forecastTemplate forloop index and returns corresponding hour value
       setForecastHour: function(index){
          var hour=time.hour;
          if ((hour + index) > 12 && (hour + index) < 24) {
            hour = (hour + index) - 12 + "pm";
          } else if ((hour + index) == 12){
            hour = (hour + index) + "pm";
          } else if ((hour + index) == 0 || (hour + index) ==24){
            hour = 12 +  "am";
          } else if( (hour + index) > 24){
            hour = (hour + index) - 24 + "am"
          } else {
            hour = (hour + index) + "am";
          }
          return hour.toString();
       },
      
      //accepts parameter representing the current value of the forecastTemplate forloop index and return corresponding day of the week
       setForecastDay: function(index){
          var day=time.dayOfWeek;
          if (day + index > 6) {
             day = day + index - 7;
          } else {
             day = day + index;
          }
          day = time.dayNames[day];
          return(day);
       }
   };
   
   //object literal containing methods for requesting, formatting, and displaying weather data
   var weather = {
      
      currentForecastType:"hourly",
      currentForecastValue: "",
      //switch statement to display appropriate "Weather Icons" icon based on data from the weather API
      setIcon: function(icon) {
         switch (icon) {
            case "clear-day":
               icon = '<div class = "wi wi-day-sunny"></div>';
               break;
            case "clear-night":
               icon = '<div class = "wi wi-night-clear"></div>';
               break;
            case "rain":
               icon = '<div class = "wi wi-rain"></div>';
               break;
            case "snow":
               icon = '<div class = "wi wi-snow"></div>';
               break;
            case "sleet":
               icon = '<div class = "wi wi-sleet"></div>';
               break;
            case "wind":
               icon = '<div class = "wi wi-strong-wind"></div>';
               break;
            case "fog":
               icon = '<div class = "wi wi-fog"></div>';
               break;
            case "cloudy":
               icon = '<div class = "wi wi-cloudy"></div>';
               break;
            case "partly-cloudy-day":
               icon = '<div class = "wi wi-day-cloudy-high"></div>';
               break;
            case "partly-cloudy-night":
               icon = '<div class = "wi wi-night-partly-cloudy"></div>';
               break;
            default:
               icon = "<div>See Chance of Precipitation</div>";
               break;
         }
         return icon;
      },
      
      //display current weather summary
      displayCurrentWeather: function() {
         $(".summary").html(weather.currentSummary);
         $(".icon").html(weather.currentIcon);
         $(".temp").html(weather.currentTemp);
         $(".tempUnit").html("&deg"+weather.currentTempUnit);
      },
      
      //use data from the weather API to set properties of the weather object
      setWeatherData: function(json){
         weather.currentTempUnit = "F";
         weather.darkSkyLng = json.longitude.toFixed(2);
         weather.darkSkyLat = json.latitude.toFixed(2);
         weather.currentSummary = json.currently.summary;
         weather.currentIcon = weather.setIcon(json.currently.icon);
         weather.currentTemp = json.currently.temperature.toFixed();
         weather.forecastHours = [];
         weather.hourlyIcon = [];
         weather.hourlyTemp = [];
         weather.hourlyCloudCover = [];
         weather.hourlyPrecipProbability = [];
         weather.hourlyPrecipIntensity = [];
         weather.hourlyHumidity = [];
         weather.hourlyWindSpeed = [];
         weather.hourlyPressure = [];
         weather.hourlyOzone = [];
         weather.hourlyVisibility = [];
         weather.forecastDays = [];
         weather.dailyIcon= [];
         weather.dailyHigh= [];
         weather.dailyLow= [];
         weather.dailyCloudCover = [];
         weather.dailyPrecipProbability = [];
         weather.dailyPrecipIntensity = [];
         weather.dailyHumidity = [];
         weather.dailyWindSpeed = [];
         weather.dailyPressure = [];
         weather.dailyOzone = [];
         weather.dailyVisibility = [];
         for (var i = 0; i < 5; i++) {
            var hourlyVisibility;
            if(json.hourly.data[i].visibility==undefined){
              hourlyVisibility = 0 + " mi";
            } else if(json.hourly.data[i].visibility!=undefined){
               hourlyVisibility = json.hourly.data[i].visibility + " mi";
            }
            
            var dailyVisibility;
            if(json.daily.data[i].visibility==undefined){
              dailyVisibility = 0 + " mi"
            } else if(json.daily.data[i].visibility!=undefined){
               dailyVisibility = json.daily.data[i].visibility + " mi";
            }
            
            weather.forecastHours.push(time.setForecastHour(i));
            weather.hourlyIcon.push(weather.setIcon(json.hourly.data[i].icon));
            weather.hourlyTemp.push(Math.floor(json.hourly.data[i].temperature));
            weather.hourlyCloudCover.push((json.hourly.data[i].cloudCover* 100).toFixed(0));
            weather.hourlyPrecipProbability.push((json.hourly.data[i].precipProbability*100).toFixed());
            weather.hourlyPrecipIntensity.push(json.hourly.data[i].precipIntensity.toFixed(2));
            weather.hourlyHumidity.push((json.hourly.data[i].humidity*100).toFixed());
            weather.hourlyWindSpeed.push(json.hourly.data[i].windSpeed.toFixed());
            weather.hourlyPressure.push(json.hourly.data[i].pressure.toFixed());
            weather.hourlyOzone.push(json.hourly.data[i].ozone.toFixed());
            weather.hourlyVisibility.push(parseFloat(hourlyVisibility));
            weather.forecastDays.push(time.setForecastDay(i));
            weather.dailyIcon.push(weather.setIcon(json.daily.data[i].icon));
            weather.dailyHigh.push(Math.floor(json.daily.data[i].temperatureHigh));
            weather.dailyLow.push(Math.floor(json.daily.data[i].temperatureLow));
            weather.dailyCloudCover.push((json.daily.data[i].cloudCover* 100).toFixed());
            weather.dailyPrecipProbability.push(((json.daily.data[i].precipProbability)*100).toFixed());
            weather.dailyPrecipIntensity.push(json.daily.data[i].precipIntensity.toFixed(2));
            weather.dailyHumidity.push((json.daily.data[i].humidity*100).toFixed());
            weather.dailyWindSpeed.push(json.daily.data[i].windSpeed.toFixed());
            weather.dailyPressure.push(json.daily.data[i].pressure.toFixed());
            weather.dailyOzone.push(json.daily.data[i].ozone.toFixed());
            weather.dailyVisibility.push(parseFloat(dailyVisibility));
         }
      },
      
      //populate forecast templates with weather data
      createForecastTemplates: function(){
         var hourlySummaries = "";
         var hourlyDetails = "";
         var dailySummaries = "";
         var dailyDetails = "";
         
         for (var i = 0; i < 5; i++) {
            var hourSummaryTemplate = '<div class="hour"><div class="hourlyTime">'+time.setForecastHour(i)+'</div><div class="hourlyIcon">'+weather.hourlyIcon[i]+'</div></div>';
            
            var hourDetailsTemplate = '<div class="hourDetails"><div class="hourDetailData">'+weather.hourlyCloudCover[i]+'%</div><div class="hourDetailData">'+weather.hourlyPrecipProbability[i]+'%</div><div class="hourDetailData">'+weather.hourlyPrecipIntensity[i]+'"</div><div class="hourDetailData">'+weather.hourlyHumidity[i]+'%</div><div class="hourDetailData">'+weather.hourlyWindSpeed[i]+' mph</div><div class="hourDetailData">'+weather.hourlyVisibility[i]+' mi</div><div class="hourDetailData">'+weather.hourlyPressure[i]+' mb</div><div class="hourDetailData">'+weather.hourlyOzone[i]+' du</div></div>';
           
            var daySummaryTemplate ='<div class="day"><div class="dailyDay">'+time.setForecastDay(i)+'</div><div class="dailyIcon">'+weather.dailyIcon[i]+'</div></div>';
            var dayDetailsTemplate = '<div class="dayDetails"><div class="dayDetailData">'+weather.dailyCloudCover[i]+'%</div><div class="dayDetailData">'+weather.dailyPrecipProbability[i]+'%</div><div class="dayDetailData">'+weather.dailyPrecipIntensity[i]+'"</div><div class="dayDetailData">'+weather.dailyHumidity[i]+'%</div><div class="dayDetailData">'+weather.dailyWindSpeed[i]+' mph</div><div class="dayDetailData">'+weather.dailyVisibility[i]+' mi</div><div class="dayDetailData">'+weather.dailyPressure[i]+' mb</div><div class="dayDetailData">'+weather.dailyOzone[i]+' du</div></div>';
            hourlySummaries += hourSummaryTemplate;
            hourlyDetails += hourDetailsTemplate;
            dailySummaries += daySummaryTemplate;
            dailyDetails += dayDetailsTemplate;
         };
         
         var hourlyTitleTemplate = '<div class="title">Hourly</div>';
         var hourlySummariesTemplate = '<div class="summaries">'+hourlySummaries+'</div>';
         var hourlyDetailsTemplate = '<div class="details">'+hourlyDetails+'</div>';
         
         var dailyTitleTemplate = '<div class="title">Daily</div>';
         var dailySummariesTemplate = '<div class="summaries">'+dailySummaries+'</div>';
         var dailyDetailsTemplate = '<div class="details">'+dailyDetails+'</div>';
         
         var hourly = hourlyTitleTemplate+hourlySummariesTemplate+hourlyDetailsTemplate;
         var daily = dailyTitleTemplate+dailySummariesTemplate+dailyDetailsTemplate;
         weather.forecasts =[hourly,  daily];
      },
      //toggle the value of weather.currentForecast between "hourly" and "daily"
      setCurrentForecastType: function(){
         if(weather.currentForecastType == "hourly"){
           weather.currentForecastType = "daily";
         } else if (weather.currentForecastType == "daily"){
           weather.currentForecastType = "hourly";
         }
         weather.setCurrentForecastValue()
      },
      //set weather.currentForecastValue equal to appropriate forecast type
      setCurrentForecastValue: function(){
         if(weather.currentForecastType == "hourly"){
           weather.currentForecastValue = weather.forecasts[0];
         } else if (weather.currentForecastType == "daily"){
           weather.currentForecastValue = weather.forecasts[1];
         }
         weather.updateForecastDisplay();
      },
      //display the correct forcast and details on initial page load and when location is updated
      updateForecastDisplay: function(){
         $("#currentSlide").html(weather.currentForecastValue);
         if(!$(".detailChart").hasClass("hide")){
            $(".details").addClass("hide");
         }
      },
      //update templates and display forecast
      displayForecast: function(){
         weather.createForecastTemplates();
         weather.setCurrentForecastValue();
      },
      //make getJSON request to darksky API and update data, templates, forecast display and charts 
      callDarkSkyAPI: function() {
         var coords=location.getCoords();
         var lat = coords[0];
         var lng = coords[1];
         console.log(coords)
         
         
//          var galleryFeed4 = feed.getFeed();// var feed = {getFeed(): function(js){$.axax}}
//          var c = new String(Math.round(weather.currentTemp));
//          console.log(c.toString(Math.round(weather.currentTemp)));
        /*
         $.getJSON("https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/7353c4ca1f3017f3868f78fac0070c3e/"+lat+","+lng, 
         function(json){
               weather.setWeatherData(json);
               weather.displayCurrentWeather();
               weather.displayForecast();
              charts.updateChart();
            });
            */
        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/7353c4ca1f3017f3868f78fac0070c3e/"+lat+","+lng,
            format: 'json',
            success : function(json){
               console.log(json);
               weather.setWeatherData(json);
               weather.displayCurrentWeather();
               weather.displayForecast();
               charts.updateChart();
               //callInstaAPI: function(){
             
	   var c = new String(Math.round(weather.currentTemp));
          console.log(c.toString(Math.round(weather.currentTemp)));
      var galleryFeed4 = new Instafeed({
  get: "user",
  userId: 6715816580,
  accessToken: "6715816580.1677ed0.2e945d7bd1ae403cbdcca139dbc1b450",
  resolution: "standard_resolution",
  useHttp: "true",
  limit: 3,
  template: '<div class="col-xs-12 col-sm-6 col-md-4"><a href="{{image}}"><div class="img-featured-container"><div class="img-backdrop"></div><div class="description-container"><p class="caption">{{caption}}</p><span class="likes">&hearts;{{likes}}</span></div><img src="{{image}}" class="img-responsive"></div></a></div>',
  target: "instafeed-gallery-feed4",
  success: function() {
        foundImages = 0;
        maxImages = 60;
    },
          //window.setTimeout(function() {
    filter: function(image) {

      console.log(image);
      if(( f == '86') && (image.tags.indexOf('86') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
	    
       
         else if(( f == '85') && (image.tags.indexOf('85') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if(( f == '84') && (image.tags.indexOf('84') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
               else if(( f == '83') && (image.tags.indexOf('83') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if(( f == '82') && (image.tags.indexOf('82') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
               else if(( f == '81') && (image.tags.indexOf('81') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if((f == '80') && (image.tags.indexOf('80') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if(( f == '79') && (image.tags.indexOf('79') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if(( f == '78') && (image.tags.indexOf('78') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }  
               else if((f == '77') && (image.tags.indexOf('77') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if(( f == '6') && (image.tags.indexOf('76') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
               else if(( f == '75') && (image.tags.indexOf('75') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if(( f == '74') && (image.tags.indexOf('74') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
               else if(( f == '73') && (image.tags.indexOf('73') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if(( f == '72') && (image.tags.indexOf('72') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
               else if(( f == '71') && (image.tags.indexOf('71') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if(( f == '70') && (image.tags.indexOf('70') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if(( f == '69') && (image.tags.indexOf('69') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if(( f == '68') && (image.tags.indexOf('68') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }  
               else if((f == '67') && (image.tags.indexOf('67') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if(( f == '66') && (image.tags.indexOf('66') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
               else if(( f == '65') && (image.tags.indexOf('65') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if(( f == '64') && (image.tags.indexOf('64') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
               else if(( f == '63') && (image.tags.indexOf('63') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if(( f == '62') && (image.tags.indexOf('62') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
               else if(( f == '61') && (image.tags.indexOf('61') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if(( f == '60') && (image.tags.indexOf('60') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if(( f == '59') && (image.tags.indexOf('59') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if(( f == '58') && (image.tags.indexOf('58') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }  
               else if((f == '57') && (image.tags.indexOf('57') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if(( f == '56') && (image.tags.indexOf('56') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
               else if(( f == '55') && (image.tags.indexOf('55') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if(( f == '54') && (image.tags.indexOf('54') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
               else if(( f == '53') && (image.tags.indexOf('53') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if(( f == '52') && (image.tags.indexOf('52') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
               else if(( f == '51') && (image.tags.indexOf('51') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if(( f == '50') && (image.tags.indexOf('50') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if(( f == '49') && (image.tags.indexOf('49') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if(( f == '48') && (image.tags.indexOf('48') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }  
               else if((f == '47') && (image.tags.indexOf('47') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if(( f == '46') && (image.tags.indexOf('46') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
               else if(( f == '45') && (image.tags.indexOf('45') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if(( f == '44') && (image.tags.indexOf('44') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
               else if(( f == '43') && (image.tags.indexOf('43') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if(( f == '42') && (image.tags.indexOf('42') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
               else if(( f == '41') && (image.tags.indexOf('41') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if((c == '40'|| f == '40') && (image.tags.indexOf('40') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if((c == '39'|| f == '39') && (image.tags.indexOf('39') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if((c == '38'|| f == '38') && (image.tags.indexOf('38') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }  
               else if((c == '37'|| f == '27') && (image.tags.indexOf('37') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if((c == '36'|| f == '36') && (image.tags.indexOf('36') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
               else if((c == '35'|| f == '35') && (image.tags.indexOf('35') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if((c == '34'|| f == '34') && (image.tags.indexOf('34') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
               else if((c == '33'|| f == '33') && (image.tags.indexOf('33') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if((c == '32'|| f == '32') && (image.tags.indexOf('32') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
          else if((c == '31'|| f == '31') && (image.tags.indexOf('31') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if ((c == '30'|| f == '30') && (image.tags.indexOf('30') >= 0 && foundImages < maxImages)) {//++++
            foundImages = foundImages + 1;
            return true;
         }
         else if((c == '29'|| f == '29') && (image.tags.indexOf('29') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if((c == '28'|| f == '28') && (image.tags.indexOf('28') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }  
               else if((c == '27'|| f == '27') && (image.tags.indexOf('27') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if((c == '26'|| f == '26') && (image.tags.indexOf('26') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
               else if((c == '25'|| f == '25') && (image.tags.indexOf('25') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if((c == '24'|| f == '24') && (image.tags.indexOf('24') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
               else if((c == '23'|| f == '23') && (image.tags.indexOf('23') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if((c == '22'|| f == '22') && (image.tags.indexOf('22') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
               else if((c == '21'|| f == '21') && (image.tags.indexOf('21') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if((c == '20'|| f == '20') && (image.tags.indexOf('20') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
      else if((c == '19'|| f == '19') && (image.tags.indexOf('19') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if((c == '18'|| f == '18') && (image.tags.indexOf('18') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }  
               else if((c == '17'|| f == '17') && (image.tags.indexOf('17') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if((c == '16'|| f == '16') && (image.tags.indexOf('16') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
               else if((c == '15'|| f == '15') && (image.tags.indexOf('15') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if((c == '14'|| f == '14') && (image.tags.indexOf('14') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
               else if((c == '13'|| f == '13') && (image.tags.indexOf('13') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if((c == '12'|| f == '12') && (image.tags.indexOf('12') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
               else if((c == '11'|| f == '11') && (image.tags.indexOf('11') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if((c == '10'|| f == '10') && (image.tags.indexOf('10') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
      else if((c == '9'|| f == '9') && (image.tags.indexOf('9') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if((c == '8'|| f == '8') && (image.tags.indexOf('8') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }  
               else if((c == '7'|| f == '7') && (image.tags.indexOf('7') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if((c == '6'|| f == '6') && (image.tags.indexOf('6') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
               else if((c == '5'|| f == '5') && (image.tags.indexOf('5') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if((c == '4'|| f == '4') && (image.tags.indexOf('4') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
               else if((c == '3'|| f == '3') && (image.tags.indexOf('3') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if((c == '2'|| f == '2') && (image.tags.indexOf('2') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         } 
               else if((c == '1'|| f == '1') && (image.tags.indexOf('1') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
         else if((c == '0'|| f == '0') && (image.tags.indexOf('0') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-1'|| f == '-1') && (image.tags.indexOf('01') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-2'|| f == '-2') && (image.tags.indexOf('02') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-3'|| f == '-3') && (image.tags.indexOf('03') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-4'|| f == '-4') && (image.tags.indexOf('04') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-5'|| f == '-5') && (image.tags.indexOf('05') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-6'|| f == '-6') && (image.tags.indexOf('06') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-7'|| f == '-7') && (image.tags.indexOf('07') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-8'|| f == '-8') && (image.tags.indexOf('08') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-9'|| f == '-9') && (image.tags.indexOf('09') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-10'|| f == '-10') && (image.tags.indexOf('010') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-11'|| f == '-11') && (image.tags.indexOf('011') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-12'|| f == '-12') && (image.tags.indexOf('012') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-13'|| f == '-13') && (image.tags.indexOf('013') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-14'|| f == '-14') && (image.tags.indexOf('014') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-15'|| f == '-15') && (image.tags.indexOf('015') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-16'|| f == '-16') && (image.tags.indexOf('016') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-17'|| f == '-17') && (image.tags.indexOf('017') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-18'|| f == '-18') && (image.tags.indexOf('018') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-19'|| f == '-19') && (image.tags.indexOf('019') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-20'|| f == '-20') && (image.tags.indexOf('020') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-21'|| f == '-21') && (image.tags.indexOf('021') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-22'|| f == '-22') && (image.tags.indexOf('022') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-23'|| f == '-23') && (image.tags.indexOf('023') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-24'|| f == '-24') && (image.tags.indexOf('024') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-25'|| f == '-25') && (image.tags.indexOf('025') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-26'|| f == '-26') && (image.tags.indexOf('026') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-27'|| f == '-27') && (image.tags.indexOf('027') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-28'|| f == '-28') && (image.tags.indexOf('028') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((c == '-29'|| f == '-29') && (image.tags.indexOf('029') >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
      else if((true) && ((((image.tags.indexOf('f') && image.tags.indexOf('fffffff')) && image.tags.indexOf('i')) && ((image.tags.indexOf('cart') && image.tags.indexOf('would'))) && image.tags.indexOf('map')) >= 0 && foundImages < maxImages)) {
            foundImages = foundImages + 1;
            return true;
         }
        return false;
     
 },	  
  after: function() {
    // disable button if no more results to load
    if (!this.hasNext()) {
      btnInstafeedLoad4.setAttribute('disabled', 'disabled');
    }
  },
});
               
galleryFeed4.run();

var btnInstafeedLoad4 = document.getElementById("btn-instafeed-load4");
btnInstafeedLoad4.addEventListener("click", function() {
  galleryFeed4.next()
}); 
	      
	  
      
            },
            origin : '*'
         });
      },
     
      //toggles temperature between Fahrenheit and Celsius
      setTemp: function() {
         if (weather.currentTempUnit=="F") {
            weather.currentTempUnit="C";
            weather.currentTemp=weather.convertFromFtoC(weather.currentTemp);
            for(var i=0; i<weather.hourlyTemp.length; i++){
               weather.hourlyTemp[i]=weather.convertFromFtoC(weather.hourlyTemp[i]);
               weather.dailyHigh[i]=weather.convertFromFtoC(weather.dailyHigh[i]);
               weather.dailyLow[i]=weather.convertFromFtoC(weather.dailyLow[i]);
            }
            
         } else if (weather.currentTempUnit=="C"){
            weather.currentTempUnit="F";
            weather.currentTemp=weather.convertFromCtoF(weather.currentTemp);
            for(var i=0; i<weather.hourlyTemp.length; i++){
               weather.hourlyTemp[i]=weather.convertFromCtoF(weather.hourlyTemp[i]);
               weather.dailyHigh[i]=weather.convertFromCtoF(weather.dailyHigh[i]);
               weather.dailyLow[i]=weather.convertFromCtoF(weather.dailyLow[i]);
            }
         }
         weather.updateTemp();
      },
      updateTemp: function(){
          weather.displayCurrentWeather();
          charts.updateChart();
      },
      convertFromFtoC: function(num){
         num = Math.round(((num - 32) / 1.8 + 0.00001) * 100 / 100).toFixed();
         return num;
      },
      convertFromCtoF: function(num){
         num = (num * (9 / 5) + 32).toFixed();
         return num;
      }
   };
   
  //object literal containing data and property for toggling forecast details dropdown section
  var forecast = {
     dropdownIsExtended: "false",
     //caretDown click event handler to extend and retract forecast detail dropdown section
     setDropdownIsExtended: function(){
        if(forecast.dropdownIsExtended == "false"){
           forecast.dropdownIsExtended = "true";
        } else if(forecast.dropdownIsExtended == "true"){
           forecast.dropdownIsExtended = "false";
        }
        forecast.updateForecastDropdown();
     },
     updateForecastDropdown: function(){
        if(forecast.dropdownIsExtended == "false"){
           forecast.retractDropDown();
        } else if(forecast.dropdownIsExtended == "true"){
           forecast.extendDropDown();
        }
     },
     extendDropDown: function(){
        $(".caretDown").addClass("caretUpMargin");
        $(".forecast").animate({height: "310px"});
        $(".caretDown").html('<i class="fa fa-caret-up"></i>');
     },
     retractDropDown: function(){
        $(".caretDown").removeClass("caretUpMargin")
        $(".forecast").animate({height: "130px"});
        $(".caretDown").html('<i class="fa fa-caret-down"></i>');
     },
     
   //mouseOver handler for detail icons to display detail icon names
   detailIconMouseOver: function(){
      var html;
      var id = $(this).attr("id");
      switch(id){
             case "CloudCover":
             html = "<div class='hoverLabel'>% Cloud Cover</div>";
             break;
            case "PrecipProbability":
             html = "<div class='hoverLabel'>Chance of Rain</div>";
             break;
            case "PrecipIntensity":
             html = "<div class='hoverLabel'>Precipitation(in/hr)</div>";
             break;
            case "Humidity":
             html = "<div class='hoverLabel'>% Humidity</div>";
             break;
            case "WindSpeed":
             html = "<div class='hoverLabel'>Wind Speed(mph)</div>";
             break;
            case "Visibility":
             html = "<div class='hoverLabel'>Visibility(miles)</div>";
             break;
            case "Pressure":
             html = "<div class='hoverLabel'>Atm Pressure(mb)</div>";
             break;
            case "Ozone":
            html="<div class='hoverLabel'>Ozone(du)</div>"
             break;
             }
      $(this).append(html);
   },
   
   detailIconMouseLeave: function (){
     $(".hoverLabel").remove();
   },
  };
    
  var charts ={
  //configure and instantiate temperature chart
  myTempChart : new Chart(document.getElementById("myTempChart").getContext('2d'), {
       type: 'line',
       data: {
           labels: ["hour1", "hour2", "hour3", "hour4", "hour5"],//x-axis labels
           datasets: [{ 
               tension: 0, // disables bezier curves
               fill:0, //fills in to dataset at this index
               label: 'Temp', //label for the dataset
               data: weather.hourlyTemp,//values for datapoints to be displayed
               backgroundColor: [//fill color under the line
                   'rgba(0, 0, 0, 0.1)',
               ],
               borderColor: [//color of the line
                   'rgba(2,99,132,1)',
               ],
               borderWidth: 1//width of the line
           }],
       },
       options: {
         showDatapoints:true, //include showDatapoints plugin
         maintainAspectRatio: false,
          tooltips:{
            enabled:false,
            opacity:1,
            displayColors:false
         },
         layout:{
           padding:{
              top:20,
              right:35,
              bottom:5,
              left:35
           }
         },
         legend:{
           display:false
         },
         animation:{
           duration:1000,
           easing:'easeInQuad',
         },
         scales: {
           yAxes: [{
             display:false,
             position:"right",//where the axes label will be displayed
             gridLines:{
               display:false//visibility of gridlines horizontal to this axes
             },
             ticks: {
               //min:0,
               //max:100
             }
           }],
           xAxes:[{
             display:false,
             position:"top",
             gridLines:{
               display:false
             },
             ticks: {
             }
           }]
         }
       },
       plugins: [{
        id:"showDatapoints",
        afterDatasetsDraw: function(chartInstance, easing) {
            var ctx = chartInstance.chart.ctx;
            var fontSize = 12;
            var fontStyle = "normal";
            var fontFamily = "Roboto";
            ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
            ctx.fillStyle = "rgba(0, 0, 0, .8)";
            ctx.textBaseline = "bottom";
            ctx.textAlign = "center";
            chartInstance.data.datasets.forEach(function (dataset, i) {
                var meta = chartInstance.getDatasetMeta(i);
                if (!meta.hidden) {
                    meta.data.forEach(function(element, index) {
                       var dataString = dataset.data[index].toString();
                       var position = element.tooltipPosition();
                       var x = position.x;
                       var y = position.y-2;
                       var min = charts.findMin();
                       var max = charts.findMax();
                       var fiveDayDiff = max-min;
                       var singleDayDiff;
                       ctx.textAlign ="center";
                       if(chartInstance.data.datasets.length>1&&i==0){
                           singleDayDiff=chartInstance.data.datasets[0].data[index]-chartInstance.data.datasets[1].data[index];
                           if(singleDayDiff<(fiveDayDiff*.6)){
                              ctx.textAlign = "left";
                           }
                        } else if(chartInstance.data.datasets.length>1&&i==1){
                           singleDayDiff=chartInstance.data.datasets[0].data[index]-chartInstance.data.datasets[1].data[index];
                           if(singleDayDiff<(fiveDayDiff*.6)){
                              ctx.textAlign = "right";
                              y=y+3;
                           }
                        }; 
                        ctx.fillText(dataString+"°", x, y);
                    });
                }
            });
        }
   }]          
   }),
   
   //configure and instantiate detail chart
    myDetailChart : new Chart(document.getElementById("myDetailChart").getContext('2d'), {
       type: 'line',
       data: {
           labels: ["hour1", "hour2", "hour3", "hour4", "hour5"],//x-axes labels
           datasets: [{
               tension: 0, // disables bezier curves
               fill:0, //fills from this data to specified dataset or origin.
               label: 'Temp', //label for the dataset
               data: weather.hourlyTemp,//dailyHigh temperatures
               backgroundColor: [//fill color under the line
                   'rgba(0, 0, 0, 0.1)',
               ],
               borderColor: [//color of the line
                   'rgba(2,99,132,1)',
               ],
               borderWidth: 1//width of the line
           }],
       },
       options: {
         //defaultFontColor:"black",
         maintainAspectRatio: false,
          plugins:{
             showDatapoints:false
          },
          tooltips:{
            enabled:true,
            opacity:1,
            displayColors:false,
         },
         layout:{
           padding:{
              top:0,
              right:15,
              bottom:0,
              left:15
           }
         },
         legend:{
           display:false,
         },
         animation:{
           duration:800,
           easing:'easeInQuad',
         },
         scales: {
            
           yAxes: [{
             scaleLabel:{
                display:true,
                labelString:"% Cloud Cover",
                fontColor:"black",
             },
             ticks: {
               beginAtZero:true,
                fontColor:"black",
               fontSize:10
             }
           }],
           xAxes:[{
             scaleLabel:{
                display:true,
                labelString:"Time",
                fontColor:"black",
             },
             ticks: {
               beginAtZero:true,
                fontColor:"black",
             }
           }]
         }
       }
   }),
   
   //updates chart datasets and axis labels when location is changed -> called from callDarkSkyAPI function
   updateChart: function(){
      var id = charts.myDetailChart.options.title.text;
      var timeUnit = charts.getCurrentTimeUnit();
      if(timeUnit=="hourly"){
         charts.myDetailChart.data.datasets[0].data = weather[timeUnit+id];
         charts.myDetailChart.data.labels = weather.forecastHours;
         charts.myTempChart.data.labels = weather.forecastHours;
         charts.myTempChart.data.datasets[0].data = weather.hourlyTemp;
      }else if (timeUnit=="daily"){
         charts.myDetailChart.data.datasets[0].data = weather[timeUnit+id];
         charts.myDetailChart.data.labels = weather.forecastDays;
         charts.myTempChart.data.labels = weather.forecastDays;
        charts. myTempChart.data.datasets[0].data = weather.dailyHigh;
         charts.myTempChart.data.datasets[1].data = weather.dailyLow;
      }
         charts.myTempChart.options.scales.yAxes[0].ticks.min =charts.findMin();
         charts.myTempChart.options.scales.yAxes[0].ticks.max =charts.findMax();
         charts.myTempChart.update();
         charts.myDetailChart.update();
   },
   
   //returns the lowest datapoint from tempChart's datasets
   findMin: function (){
      var min=[];
      for(var i =0; i<charts.myTempChart.data.datasets.length; i++){
         min.push(Math.min.apply(null,charts.myTempChart.data.datasets[i].data))
      }
      var smallestVal = Math.min.apply(null, min);
      return smallestVal-1;
   },

   //returns the highest datapoint from tempChart's datasets
   findMax: function (){
      var max=[];
      for(var i =0; i<charts.myTempChart.data.datasets.length; i++){
         max.push(Math.max.apply(null, charts.myTempChart.data.datasets[i].data))
      }
      var largestVal = Math.max.apply(null, max);
      return largestVal+1;
   },
   
   //toggle tempChart between hourly and daily datasets
   changeTempChartTime: function (){
      var timeUnit = charts.getCurrentTimeUnit();
      if(timeUnit=="hourly"){
         charts.myTempChart.data.labels = weather.forecastDays;
         charts.myTempChart.data.datasets[0].label = "daily high";
         charts.myTempChart.data.datasets[0].data = weather.dailyHigh;
         charts.myTempChart.data.datasets.push({
               tension: 0, //disable bezier curves
               fill:false, //fills to this dataset
               label: "daily low", //label for the dataset
               data: weather.dailyLow,//dailyLow temperatures
               borderColor: [//color of the line
                   'rgba(2,99,132,1)',
               ],
               borderWidth: 1//width of the line
           })
      } else if(timeUnit=="daily"){
         charts.myTempChart.data.labels = weather.forecastHours;
         charts.myTempChart.data.datasets.pop();
         charts.myTempChart.data.datasets[0].fill=0;
        charts. myTempChart.data.datasets[0].label = "Temp";
         charts.myTempChart.data.datasets[0].data=weather.hourlyTemp;
      }
      charts.myTempChart.options.scales.yAxes[0].ticks.min =charts.findMin();
      charts.myTempChart.options.scales.yAxes[0].ticks.max =charts.findMax();
      charts.myTempChart.update();
   },
   
   //returns string describing the currently displayed forecast
   getCurrentTimeUnit: function (){
      if(charts.myTempChart.data.datasets.length == 1){
         return "hourly";
      } else if(charts.myTempChart.data.datasets.length == 2){
         return "daily";
      }
   },
   
   //updates detail chart's x-axis title and x-axis unit labels when forecast is toggled between hourly and daily
   setDetailChartTimeLabels: function (timeUnit){
      if(timeUnit=="hourly"){
         charts.myDetailChart.data.labels = weather.forecastHours;
         charts.myDetailChart.options.scales.xAxes[0].scaleLabel.labelString="Time";
      } else if(timeUnit=="daily"){
         charts.myDetailChart.data.labels = weather.forecastDays;
         charts.myDetailChart.options.scales.xAxes[0].scaleLabel.labelString="Day";
      }
   },
   
   //toggle detail section of forecast between chart and text
   toggleDetailChart: function (timeUnit, category, elem){
      //only called by detCat and caret
      if($(elem).hasClass("detCat")){
         if($(".detailChart").hasClass("hide")){
            $(".detailChart").removeClass("hide");
            $(".details").addClass("hide");
         } else if(!$(".detailChart").hasClass("hide") && charts.myDetailChart.data.datasets[0].data == weather[timeUnit+category]){
            $(".detailChart").addClass("hide");
            $(".details").removeClass("hide");
         } 
      } else if(($(elem).hasClass("caret") || $(elem).hasClass("forecast")) && !$(".detailChart").hasClass("hide")){
         $(".details").addClass("hide");
      }
   },
   
   //update detail chart's dataset
   setDetailChartData: function (timeUnit, category){
      charts.myDetailChart.data.datasets[0].data = weather[timeUnit+category];
   },
   
   //accepts a reference to the DOM node that updateDetailChart was fired from and returns the an id used to update the detail chart's dataset
   getCategory: function (elem){
      var id;
      if($(elem).hasClass("detCat")){
         id = $(elem).attr("id");
      }else{
         id = charts.myDetailChart.options.title.text;
      }
      return id;
   },
   
   //sets the detail chart's y-axis title and tooltip label
   setDetailChartDatasetLabels: function (category){
        charts.myDetailChart.options.title.text = category;
        switch (category) {
            case "CloudCover":
               charts.myDetailChart.data.datasets[0].label = "% Cloud Cover";
               charts.myDetailChart.options.scales.yAxes[0].scaleLabel.labelString = "% Cloud Cover";
               break;
            case "PrecipProbability":
               charts.myDetailChart.data.datasets[0].label = "% Chance of Rain";
               charts.myDetailChart.options.scales.yAxes[0].scaleLabel.labelString = "% Chance of Rain";
               break;
            case "PrecipIntensity":
               charts.myDetailChart.data.datasets[0].label = "Precipitation (in/Hr)";
               charts.myDetailChart.options.scales.yAxes[0].scaleLabel.labelString = "Precipitation (in/Hr)";
               break;
            case "Humidity":
               charts.myDetailChart.data.datasets[0].label = "% Humidity";
               charts.myDetailChart.options.scales.yAxes[0].scaleLabel.labelString = "% Humidity";
               break;
            case "WindSpeed":
               charts.myDetailChart.data.datasets[0].label = "Wind Speed (mph)";
               charts.myDetailChart.options.scales.yAxes[0].scaleLabel.labelString = "Wind Speed (mph)";
               break;
            case "Visibility":
               charts.myDetailChart.data.datasets[0].label = "Visibility (miles)";
              charts. myDetailChart.options.scales.yAxes[0].scaleLabel.labelString = "Visibility (miles)";
               break;
            case "Pressure":
               charts.myDetailChart.data.datasets[0].label = "Atmospheric Pressure (mB)";
               charts.myDetailChart.options.scales.yAxes[0].scaleLabel.labelString = "Atmospheric Pressure (mB)";
               break;
            case "Ozone":
               charts.myDetailChart.data.datasets[0].label = "Ozone (DU)";
               charts.myDetailChart.options.scales.yAxes[0].scaleLabel.labelString = "Ozone (DU)";
               break;
            default:
               charts.myDetailChart.data.datasets[0].data = [1, 2, 3, 4, 5];
               charts.myDetailChart.data.datasets[0].label = "No Info";
               charts.myDetailChart.options.scales.yAxes[0].scaleLabel.labelString = "No Info";
               break;
         }
   },  
   
   setDetailChartLabels: function (timeUnit, category){
      charts.setDetailChartTimeLabels(timeUnit);
      charts.setDetailChartDatasetLabels(category);
   },
   
   setDetailChart: function (timeUnit, category){
      charts.setDetailChartLabels(timeUnit, category);
      charts.setDetailChartData(timeUnit, category);
   },
   
   //handler for swipe event on forecast and click event on left+right caret and detail Icons, updates detail chart dataset and labels
   updateDetailChart: function (){
       var self = this;
       var category = charts.getCategory(self);
       var timeUnit =charts.getCurrentTimeUnit();
       charts.toggleDetailChart(timeUnit, category, self);
       charts.setDetailChart(timeUnit, category)
       charts.myDetailChart.update();
   },
   
  };
  
   var feed = {//getJSON request to google geocode API to reverse geocode lat and lng coords -> called by update function
      
         
   },
  //display content in shape of mobile device and center in view
   function centerBorder(){
      var width = parseInt($("body").width());
      if(width>450){
         var margin=($("body").width()-450)/2;
         $(".border").css("margin-left",margin)
      }
   };
   
   //bind event handlers to DOM
   function addEventHandlers(){
     location.autocomplete.addListener("place_changed", location.onPlaceChanged);
     $("#forecast").bind("swiperight", weather.setCurrentForecastType).bind("swiperight", charts.changeTempChartTime).bind("swiperight", charts.updateDetailChart).bind("swipeleft", weather.setCurrentForecastType).bind("swipeleft", charts.changeTempChartTime).bind("swipeleft", charts.updateDetailChart);
     $("#showWeather").on("click", location.callBrowserGeolocationAPI);
     $(".tempUnit").on("click", weather.setTemp);
     $(".caretDown").on("click", forecast.setDropdownIsExtended);
     $("#caretRight").bind("click", weather.setCurrentForecastType).bind("click", charts.changeTempChartTime).bind("click", charts.updateDetailChart);
     $("#caretLeft").bind("click", weather.setCurrentForecastType).bind("click", charts.changeTempChartTime).bind("click", charts.updateDetailChart);
     $(".detCat").bind("click", charts.updateDetailChart).bind("mouseover", forecast.detailIconMouseOver).bind("mouseleave", forecast.detailIconMouseLeave);
     $(window).bind("resize", map.setMapHeight).bind("resize", centerBorder);
     $.mobile.loading().hide();
  };
   
  //use Google Maps API to update map, use Google Maps Geocode API to reverse geocode coordinates, use DarkSky API to retrieve weather data
  function update(){
     location.callGeocodeAPI();
     map.updateMap();
     weather.callDarkSkyAPI();
     weather.galleryFeed4.callInstaAPI();//getWeatherInfo
  };
   
  //
  function start() {
     time.setTime();
     setInterval(time.setTime, 1000);
     location.callGeocodeAPI();
     map.initMap();
     weather.callDarkSkyAPI();
     weather.galleryFeed4.callInstaAPI();//getWeatherInfo
     addEventHandlers();
     centerBorder()
  };
   
   
   
  start();
});
