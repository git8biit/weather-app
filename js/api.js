const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeather(coordinates) {
  const params = new URLSearchParams({
    latitude: String(coordinates.latitude),
    longitude: String(coordinates.longitude),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code',
    timezone: 'auto',
  });
  const response = await fetch(`${BASE_URL}?${params}`);
  if (!response.ok) throw new Error(`Ошибка API: ${response.status}`);
  const data = await response.json();
  return normalizeWeather(data, coordinates);
}

function normalizeWeather(data, coordinates) {
  const current = data.current;
  return {
    temperature: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    weatherCode: current.weather_code,
    localTime: current.time,
    timezone: data.timezone,
    location: coordinates,
  };
}