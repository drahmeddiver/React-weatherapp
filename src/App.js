import React, { useState } from 'react';
import { IconContext } from 'react-icons';
import { FaSun, FaCloud, FaCloudSun, FaCloudMoon, FaCloudShowersHeavy, FaSnowflake, FaBolt, FaSmog } from 'react-icons/fa';
import "./App.css"
import "./index.css"
const App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const API_KEY = '89a6f12e3d63c00fd3e7d7e6ba26bdeb';
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setWeatherData(data))
      .catch((error) => console.error(error));
  };

  const getWeatherIcon = (weatherCode, isDaytime) => {
    switch (Math.floor(weatherCode / 100)) {
      case 2:
        return <FaBolt />;
      case 3:
      case 5:
        return <FaCloudShowersHeavy />;
      case 6:
        return <FaSnowflake />;
      case 7:
        return <FaSmog />;
      case 8:
        return isDaytime ? <FaSun /> : <FaCloudMoon />;
      default:
        return <FaCloud />;
    }
  };

  const getBackgroundColor = () => {
    if (!weatherData || !weatherData.sys) {
      return 'background-day';
    }

    const sunriseTime = new Date(weatherData.sys.sunrise * 1000);
    const sunsetTime = new Date(weatherData.sys.sunset * 1000);
    const now = new Date();

    if (now >= sunriseTime && now <= sunsetTime) {
      return 'background-day';
    } else {
      return 'background-night';
    }
  };

  return (
    <div className={getBackgroundColor()}>
      <div className="search-box">
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Enter city name" value={city} onChange={handleInputChange} />
          <button type="submit">Search</button>
        </form>
      </div>

      {weatherData && (
        <div className="weather-details">
          <h2>{weatherData.name}, {weatherData.sys.country}</h2>
          <div className="weather-icon">
            <IconContext.Provider value={{ className: 'weather-status-icon' }}>
              {getWeatherIcon(weatherData.weather[0].id, getBackgroundColor() === 'background-day')}
            </IconContext.Provider>
            <p>{weatherData.weather[0].description}</p>
          </div>
          <p className="temperature">{Math.round(weatherData.main.temp)}&deg;C</p>
          <p>Feels like {Math.round(weatherData.main.feels_like)}&deg;C</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
        </div>
      )}
    </div>
  );
};

export default App;
