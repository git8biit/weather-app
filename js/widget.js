import { validateForm } from './validation.js';
import { fetchWeather } from './api.js';
import { describeWeather } from './weather-codes.js';
import { buildMapUrl } from './map.js';

export function createWidget(container) {
  const template = document.getElementById('widget-template');
  const widget = template.content.firstElementChild.cloneNode(true);
  container.appendChild(widget);
  widget.querySelector('[data-role="submit"]')
    .addEventListener('click', () => handleWeatherRequest(widget));
  return widget;
}

async function handleWeatherRequest(widget) {
  const submitButton = widget.querySelector('[data-role="submit"]');
  hideError(widget);
  const coordinates = readCoordinates(widget);
  const validation = validateForm(coordinates.latitude, coordinates.longitude);
  if (!validation.ok) { showError(widget, validation.message); return; }
  submitButton.disabled = true;
  try {
    const weather = await fetchWeather(validation);
    renderWeather(widget, weather);
  } catch (error) {
    showError(widget, 'Не удалось получить данные о погоде. Попробуйте позже.');
  } finally {
    submitButton.disabled = false;
  }
}

function renderWeather(widget, weather) {
  const condition = describeWeather(weather.weatherCode);
  widget.querySelector('[data-role="icon"]').textContent = condition.icon;
  widget.querySelector('[data-role="temperature"]').textContent = `${weather.temperature}°`;
  widget.querySelector('[data-role="description"]').textContent = condition.description;
  renderDetails(widget.querySelector('[data-role="details"]'), weather);
  widget.querySelector('[data-role="map"]').src = buildMapUrl(weather.location);
  widget.querySelector('[data-role="result"]').hidden = false;
}

function renderDetails(list, weather) {
  const items = [
    ['Ветер', `${weather.windSpeed} км/ч`],
    ['Ощущается как', `${weather.feelsLike}°`],
    ['Влажность', `${weather.humidity}%`],
    ['Местное время', weather.localTime.slice(11, 16)],
    ['Часовой пояс', weather.timezone],
  ];
  list.innerHTML = items.map(([name, value]) =>
    `<li>${name}: <span class="detail__value">${value}</span></li>`).join('');
}

function readCoordinates(widget) {
  return {
    latitude: widget.querySelector('[data-role="latitude"]').value,
    longitude: widget.querySelector('[data-role="longitude"]').value,
  };
}

function showError(widget, message) {
  const error = widget.querySelector('[data-role="error"]');
  error.textContent = message;
  error.hidden = false;
}

function hideError(widget) {
  widget.querySelector('[data-role="error"]').hidden = true;
}