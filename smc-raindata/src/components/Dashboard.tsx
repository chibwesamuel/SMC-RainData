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

/**
 * The Dashboard component fetches and displays current weather and rainfall forecast data.
 * It offers specific farming suggestions based on the predicted rainfall patterns.
 */
export const Dashboard = () => {
  const [city, setCity] = useState<string>('');  // User-inputted city name
  const [weatherData, setWeatherData] = useState<any | null>(null);  // Current weather data
  const [rainData, setRainData] = useState<any | null>(null);  // Rainfall forecast data
  const [loading, setLoading] = useState<boolean>(false);  // Loading state for API requests
  const [error, setError] = useState<string | null>(null);  // Error message if API request fails

  /**
   * fetchWeatherAndRainData fetches weather and rain data for the given latitude and longitude.
   * @param lat - Latitude of the city
   * @param lon - Longitude of the city
   */
  const fetchWeatherAndRainData = async (lat: number, lon: number) => {
    try {
      // Fetch current weather data
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=68c1fc2bc835277163c924793d614cdd`
      );
      setWeatherData(weatherResponse.data);

      // Fetch daily rainfall forecast data
      const rainResponse = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum&timezone=auto`
      );
      setRainData(rainResponse.data.daily);
    } catch (err) {
      setError('Failed to fetch data');
    }
  };

  /**
   * handleSearch fetches the latitude and longitude of the city based on the user input,
   * and then fetches weather and rain data for the retrieved coordinates.
   */
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

  /**
   * handleCityChange updates the city name state as the user types in the input field.
   * @param e - Change event from input field
   */
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  /**
   * getWeatherIcon selects the appropriate weather icon based on the main weather condition.
   * @param condition - Primary weather condition (e.g., 'Clear', 'Clouds')
   * @returns Path to the corresponding icon image
   */
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Clear': return clearIcon;
      case 'Clouds': return cloudsIcon;
      case 'Drizzle': return drizzleIcon;
      case 'Mist': return mistIcon;
      case 'Rain': return rainIcon;
      case 'Wind': return windIcon;
      case 'Snow': return snowIcon;
      default: return clearIcon;
    }
  };

  /**
   * generateSuggestions generates specific farming suggestions based on average rainfall
   * and other weather conditions.
   * @returns Array of suggestion strings tailored for farmers
   */
  const generateSuggestions = () => {
    if (!rainData || !weatherData) return [];
    const suggestions = [];
    const avgRainfall = rainData.precipitation_sum.reduce((a: number, b: number) => a + b, 0) / rainData.precipitation_sum.length;

    // Provide farming suggestions based on rainfall data
    if (avgRainfall < 0.5) suggestions.push("Consider irrigation if you've already planted.");
    if (avgRainfall > 0.5 && avgRainfall < 15) suggestions.push("It may be a good time to prepare the soil for planting.");
    if (avgRainfall > 15 && avgRainfall < 30) suggestions.push("Conditions are favorable; planting could be considered.");
    if (avgRainfall > 30) suggestions.push("Excessive rain expected; delay planting to avoid waterlogging.");
    if (weatherData.wind.speed > 20) suggestions.push("High winds forecast; secure any structures.");

    return suggestions;
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

          {rainData && (
            <div className="rain-predictions">
              <h2>Rainfall Predictions</h2>
              <div className="rain-tiles">
                {rainData.time.map((date: string, index: number) => (
                  <div className="rain-tile" key={index}>
                    <p className="rain-day">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                    <p className="rain-date">{new Date(date).toLocaleDateString()}</p>
                    <p className="rain-amount">{rainData.precipitation_sum[index]} mm</p>
                  </div>
                ))}
              </div>
              <div className="suggestions">
                <h2>Farming Suggestions</h2>
                {generateSuggestions().map((suggestion, index) => (
                  <p key={index} className="suggestion">{suggestion}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
