import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css'; // Import the CSS file

// Define the type for the forecast data
interface RainData {
  date: string[];
  temperature2mMax: number[];
}

export const Dashboard = () => {
  const [city, setCity] = useState('');
  const [rainData, setRainData] = useState<RainData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to get latitude and longitude based on city name
  const getLatLongFromCity = async (cityName: string) => {
    // You would normally use a geocoding API to get lat/long for a city
    // For simplicity, we return static values for now (Berlin as an example)
    return {
      latitude: 52.52, // Replace with actual latitude
      longitude: 13.41, // Replace with actual longitude
    };
  };

  // Function to handle the search when a city is entered
  const fetchRainData = async () => {
    setLoading(true);
    setError('');
    try {
      // Get latitude and longitude from the city
      const { latitude, longitude } = await getLatLongFromCity(city);

      // Make the request to Open-Meteo's Seasonal API
      const params = {
        latitude: latitude,
        longitude: longitude,
        daily: 'precipitation_sum', // Getting rainfall data
      };
      const url = 'https://seasonal-api.open-meteo.com/v1/seasonal';
      const response = await axios.get(url, { params });

      const daily = response.data.daily;

      // Ensure that `daily.time` is an array of timestamps
      const weatherData = {
        date: daily.time.map((t: number) => new Date(t * 1000).toISOString().slice(0, 10)), // Dates as strings
        temperature2mMax: daily.temperature_2m_max,
      };

      setRainData(weatherData);
    } catch (err) {
      setError('Could not fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchRainData();
  };

  return (
    <div className="dashboard-container">
      <h2>Seasonal Rainfall Prediction Dashboard</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          required
          className="input-field"
        />
        <button type="submit" className="submit-btn">
          Get Forecast
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {rainData && rainData.date instanceof Array && (
        <div>
          <h3>Seasonal Rainfall Forecast for {city}</h3>
          <ul className="forecast-list">
            {rainData.date.map((date, index) => (
              <li key={index} className="forecast-item">
                <strong>{date}</strong>
                <div className="weather-details">
                  <span>Max Temperature: {rainData.temperature2mMax[index]}°C</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
