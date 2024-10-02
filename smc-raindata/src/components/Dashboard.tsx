import React, { useState } from 'react';
import axios from 'axios';

// Define the type for the forecast data
interface Forecast {
  dt_txt: string;
  main: {
    temp: number;
  };
  rain?: {
    '3h'?: number;
  };
}

interface OpenWeatherResponse {
  list: Forecast[];
}

export const Dashboard = () => {
  const [city, setCity] = useState('');
  const [rainData, setRainData] = useState<OpenWeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiKey = '68c1fc2bc835277163c924793d614cdd';

  // Function to handle the search when a city is entered
  const fetchRainData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get<OpenWeatherResponse>(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      const forecastData = response.data;
      // Set the forecast data to the state
      setRainData(forecastData);
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
    <div>
      <h2>Rainfall Prediction Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          required
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 ml-2">
          Get Forecast
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {rainData && (
        <div>
          <h3>Rainfall Forecast for {city}</h3>
          <ul>
            {rainData.list.slice(0, 5).map((forecast, index) => (
              <li key={index}>
                <strong>{forecast.dt_txt}:</strong> {forecast.main.temp}°C, Rain: {forecast.rain?.['3h'] || 0} mm
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
