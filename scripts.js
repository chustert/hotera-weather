const api = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // openweathermap API key

const iconImg = document.getElementById('weather-icon');
const loc = document.querySelector('#location');
const tempC = document.querySelector('.c');
const tempF = document.querySelector('.f');
const dateDOM = document.querySelector('.date');
const desc = document.querySelector('.desc');
const humidityDOM = document.querySelector('.humidity');
const windSpeedDOM = document.querySelector('.windSpeed');
const windDirectionDOM = document.querySelector('.windDirection');
const sunriseDOM = document.querySelector('.sunrise');
const sunsetDOM = document.querySelector('.sunset');

window.addEventListener('load', () => {
  let long;
  let lat;
  // Accesing Geolocation of User
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      // Storing Longitude and Latitude in variables
      long = '174.8858'; //position.coords.longitude ----- Raglan: 174.8992
      lat =  '-37.7968'; //position.coords.latitude ----- Raglan: -37.830656
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
	        const date = data.dt;
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
	        const dateGMT = new Date(date * 1000);

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
	        dateDOM.textContent = `${dateGMT.toLocaleDateString('en-NZ',{ day: '2-digit', month: '2-digit', year: '2-digit' })}`;
	        desc.textContent = `${description}`;
	        tempC.textContent = `${temp.toFixed(0)}°C`;
	        tempF.textContent = `${fahrenheit.toFixed(0)}°F`;
	        sunriseDOM.textContent = `${sunriseGMT.toLocaleTimeString('en-NZ', { hour: '2-digit', minute: '2-digit' })}`;
	        sunsetDOM.textContent = `${sunsetGMT.toLocaleTimeString('en-NZ',{ hour: '2-digit', minute: '2-digit' })}`;
	        humidityDOM.textContent = `${humidity}%`;
	        windSpeedDOM.textContent = `${speed} m/s`;
	        windDirectionDOM.textContent = `${windDirection}`;
	    });

        fetch(forecast_base)
        	.then((response) => {
        		return response.json();
        	})
        	.then((data) => {

        		for (var i=1; i <= 4; i++) {
        			// Identify next four days and loop through
        			const dayNameDOM = document.querySelector('.day' + i);
	        		const { dt } = data.daily[i];

	        		const dtGMT = new Date(dt * 1000);
	        		var days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

	        		const dayName = days[dtGMT.getDay()];
	        		
	        		// function getDayName(dt) {
	        		// 	const dtGMT = new Date(dt * 1000);
	        		// 	var days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
	        		// 	return days[dtGMT.getDay()];
	        		// }
	        		// const dayName = getDayName(dt);

	        		dayNameDOM.textContent = `${dayName}`;

	        		// Identify temperature of next four days and loop through
        			const { day } = data.daily[i].temp;
        			const tempCDaily = document.querySelector('.day' + i + '-temp');
        			
        			tempCDaily.textContent = `${day.toFixed(0)}°C`;
        		}
        	});
    });
  }
});
