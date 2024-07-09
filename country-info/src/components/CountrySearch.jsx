// src/components/CountrySearch.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const CountrySearch = () => {
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    if (query.length === 0) {
      setCountries([]);
      return;
    }

    axios
      .get(`https://restcountries.com/v3.1/name/${query}`)
      .then(response => {
        setCountries(response.data);
        if (response.data.length === 1) {
          setSelectedCountry(response.data[0]);
        } else {
          setSelectedCountry(null);
        }
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
        setCountries([]);
        setSelectedCountry(null);
      });
  }, [query]);

  const handleShowCountry = (country) => {
    setSelectedCountry(country);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="find countries"
      />
      {countries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : selectedCountry ? (
        <CountryDetail country={selectedCountry} />
      ) : (
        countries.map(country => (
          <div key={country.cca3}>
            {country.name.common}
            <button onClick={() => handleShowCountry(country)}>show</button>
          </div>
        ))
      )}
    </div>
  );
};

const CountryDetail = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const capital = country.capital[0];

  useEffect(() => {
    if (!apiKey) {
      console.error('Weather API key is not set.');
      return;
    }

    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`)
      .then(response => {
        setWeather(response.data);
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
  }, [apiKey, capital]);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map((lang, index) => (
          <li key={index}>{lang}</li>
        ))}
      </ul>
      <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} width="100" />
      {weather && (
        <div>
          <h3>Weather in {capital}</h3>
          <p>Temperature: {weather.main.temp} °C</p>
          <p>Weather: {weather.weather[0].description}</p>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt={weather.weather[0].description} />
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default CountrySearch;