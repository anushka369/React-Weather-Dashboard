import React, { useState } from "react";
import "./WeatherApp.css";

function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city name.");
      return;
    }

    if (!API_KEY) {
      setError("API key is missing. Please check your environment variables.");
      return;
    }

    setError("");
    setWeather(null);
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=yes`
      );

      if (!response.ok) {
        throw new Error("City not found or invalid request.");
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Weather App</h1>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchWeather} disabled={loading}>
        {loading ? "Loading..." : "Get Weather"}
      </button>
      {error && <p className="error">{error}</p>}
      {weather && (
        <div className="weather-result">
          <h2>
            {weather.location.name}, {weather.location.country}
          </h2>
          <p> 🌡️ Temperature: {weather.current.temp_c}°C</p>
          <p> 🌥️ Condition: {weather.current.condition.text}</p>
          <p> 🌬️ Wind: {weather.current.wind_kph} kph</p>
          <p> 💧 Humidity: {weather.current.humidity}%</p>
          <p> 🌪️ Pressure: {weather.current.pressure_mb} hPa</p>
          <p> 🫁 Air Quality Index: {weather.current.air_quality["pm2_5"]}</p>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;