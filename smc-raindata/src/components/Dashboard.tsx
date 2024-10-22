import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

// Importing icons for weather conditions
import clearIcon from '../assets/clear.png';
import cloudsIcon from '../assets/clouds.png';
import drizzleIcon from '../assets/drizzle.png';
import mistIcon from '../assets/mist.png';
import rainIcon from '../assets/rain.png';
import windIcon from '../assets/wind.png';
import snowIcon from '../assets/snow.png';
import humidityIcon from '../assets/humidity.png';

export const Dashboard = () => {
  const [city, setCity] = useState<string>(''); // User input city
  const [weatherData, setWeatherData] = useState<any | null>(null); // Weather data state
  const [rainData, setRainData] = useState<any | null>(null); // Rainfall data state
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Function to fetch rainfall and weather data
  const fetchWeatherAndRainData = async (lat: number, lon: number) => {
    try {
      // Fetch Weather data from OpenWeatherMap
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=68c1fc2bc835277163c924793d614cdd`
      );
      setWeatherData(weatherResponse.data);

      // Fetch Rainfall data
      const rainResponse = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum&timezone=auto`
      );
      setRainData(rainResponse.data.daily);
    } catch (err) {
      setError('Failed to fetch data');
    }
  };

  // Fetch coordinates when the user clicks the search button
  const handleSearch = async () => {
    setLoading(true);
    try {
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=68c1fc2bc835277163c924793d614cdd`
      );

      const { lat, lon } = geoResponse.data[0];
      await fetchWeatherAndRainData(lat, lon);
    } catch (err) {
      setError('Failed to fetch coordinates');
    }
    setLoading(false);
  };

  // Handle user input
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Clear':
        return clearIcon;
      case 'Clouds':
        return cloudsIcon;
      case 'Drizzle':
        return drizzleIcon;
      case 'Mist':
        return mistIcon;
      case 'Rain':
        return rainIcon;
      case 'Wind':
        return windIcon;
      case 'Snow':
        return snowIcon;
      default:
        return clearIcon; // Default icon if no condition matches
    }
  };

  return (
    <div className="container">
      <div className="search">
        <input
          type="text"
          value={city}
          onChange={handleCityChange}
          placeholder="Enter a city"
        />
        <button onClick={handleSearch}>Search</button>
        {loading && <p>Searching...</p>}
      </div>
      {error && <p>{error}</p>}
      {weatherData && (
        <div className="card">
          <h2>Weather in {weatherData.name}</h2>
          <img
            src={getWeatherIcon(weatherData.weather[0].main)}
            alt={weatherData.weather[0].description}
            className="weather-icon"
          />
          <h1 className="temp">{Math.round(weatherData.main.temp)}°C</h1>
          <div className="details">
            <div className="col">
              <img src={humidityIcon} alt="Humidity" className="icon" />
              <p className="humidity">{weatherData.main.humidity}%</p>
              <p>Humidity</p>
            </div>
            <div className="col">
              <img src={windIcon} alt="Wind Speed" className="icon" />
              <p className="wind">{Math.round(weatherData.wind.speed)} km/h</p>
              <p>Wind Speed</p>
            </div>
          </div>
          {/* Rainfall Predictions Section */}
          {rainData && (
            <div className="rain-predictions">
            <h2>Rainfall Predictions</h2>
            <div className="rain-tiles">
              {rainData.time.map((date: string, index: number) => (
                <div className="rain-tile" key={index}>
                  <p className="rain-day">
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <p className="rain-date">
                    {new Date(date).toLocaleDateString()}
                  </p>
                  <p className="rain-amount">
                    {rainData.precipitation_sum[index]} mm
                  </p>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>
      )}
    </div>
  );
};
