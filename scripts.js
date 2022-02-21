// OpenWeatherMap API. Do not share it publicly.
const api = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; //Replace with your API

const iconImg = document.getElementById('weather-icon');
const loc = document.querySelector('#location');
const tempC = document.querySelector('.c');
const tempF = document.querySelector('.f');
const desc = document.querySelector('.desc');
const humidityDOM = document.querySelector('.humidity');
const windSpeedDOM = document.querySelector('.windSpeed');
const windDirectionDOM = document.querySelector('.windDirection');
const sunriseDOM = document.querySelector('.sunrise');
const sunsetDOM = document.querySelector('.sunset');

const dayNameDOM = document.querySelector('.day1');
const tempCDaily = document.querySelector('.day1-temp');

window.addEventListener('load', () => {
  let long;
  let lat;
  // Accesing Geolocation of User
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      // Storing Longitude and Latitude in variables
      long = position.coords.longitude;
      lat = position.coords.latitude;
      const base = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api}&units=metric`;
      const forecast_base = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly,alerts&appid=${api}&units=metric`


      // Using fetch to get data
      fetch(base)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
	        const { temp } = data.main;
	        const place = data.name;
	        const { description, icon } = data.weather[0];
	        const { sunrise, sunset } = data.sys;
	        const { humidity } = data.main;
	        const { speed } = data.wind;
	        const { deg } = data.wind;

	        const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
	        const fahrenheit = (temp * 9) / 5 + 32;

	        // Converting Epoch(Unix) time to GMT
	        const sunriseGMT = new Date(sunrise * 1000);
	        const sunsetGMT = new Date(sunset * 1000);

	        // const windDirection = deg;

	        function degToCompass(deg) {
			    var val = Math.floor((deg / 22.5) + 0.5);
			    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
			    return arr[(val % 16)];
			}

			const windDirection = degToCompass(deg);



	        // Interacting with DOM to show data
	        iconImg.src = iconUrl;
	        loc.textContent = `${place}`;
	        desc.textContent = `${description}`;
	        tempC.textContent = `${temp.toFixed(2)} °C`;
	        tempF.textContent = `${fahrenheit.toFixed(2)} °F`;
	        sunriseDOM.textContent = `${sunriseGMT.toLocaleDateString()}, ${sunriseGMT.toLocaleTimeString()}`;
	        sunsetDOM.textContent = `${sunsetGMT.toLocaleDateString()}, ${sunsetGMT.toLocaleTimeString()}`;
	        humidityDOM.textContent = `${humidity}%`;
	        windSpeedDOM.textContent = `${speed} m/s`;
	        windDirectionDOM.textContent = `${windDirection}`;
	    });

        fetch(forecast_base)
        	.then((response) => {
        		return response.json();
        	})
        	.then((data) => {
        		const { dt } = data.daily[1];
        		const { day } =data.daily[1].temp;

        		function getDayName(dt) {
        			const dtGMT = new Date(dt * 1000);
        			var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        			return days[dtGMT.getDay()];
        		}

        		const dayName = getDayName(dt);

        		dayNameDOM.textContent = `${dayName}`;
        		tempCDaily.textContent = `${day.toFixed(2)} °C`;
        	});
    });
  }
});
