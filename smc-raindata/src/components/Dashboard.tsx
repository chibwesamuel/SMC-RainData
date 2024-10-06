import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

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

  // Fetch coordinates and call data APIs
  useEffect(() => {
    const fetchCoordinates = async (city: string) => {
      setLoading(true);
      try {
        const geoResponse = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=68c1fc2bc835277163c924793d614cdd`
        );

        const { lat, lon } = geoResponse.data[0];
        fetchWeatherAndRainData(lat, lon);
      } catch (err) {
        setError('Failed to fetch coordinates');
      }
      setLoading(false);
    };

    if (city) {
      fetchCoordinates(city);
    }
  }, [city]); // `city` is the dependency

  // Handle user input
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
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
        {loading && <p>Loading...</p>}
      </div>
      {error && <p>{error}</p>}
      {weatherData && (
        <div className="card">
          <h2>Weather in {weatherData.name}</h2>
          <img
            src={`images/${weatherData.weather[0].main.toLowerCase()}.png`}
            alt={weatherData.weather[0].main}
            className="weather-icon"
          />
          <h1 className="temp">{Math.round(weatherData.main.temp)}°C</h1>
          <div className="details">
            <div className="col">
              <p className="humidity">{weatherData.main.humidity}%</p>
              <p>Humidity</p>
            </div>
            <div className="col">
              <p className="wind">{Math.round(weatherData.wind.speed)} km/h</p>
              <p>Wind Speed</p>
            </div>
          </div>
          {/* Rainfall Predictions Section */}
          {rainData && (
            <div className="rain-predictions">
              <h3>Rainfall Predictions</h3>
              <div className="rain-row">
                {rainData.time.map((date: string, index: number) => (
                  <div className="rain-col" key={index}>
                    <p>{new Date(date).toLocaleDateString()}</p>
                    <p>{rainData.precipitation_sum[index]} mm</p>
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
