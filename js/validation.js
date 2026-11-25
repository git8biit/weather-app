function parseCoordinate(raw, min, max) {
  const trimmed = String(raw).trim().replace(',', '.');
  if (trimmed === '') return { ok: false, message: 'Введите значение' };
  const value = Number(trimmed);
  if (!Number.isFinite(value)) return { ok: false, message: 'Значение должно быть числом' };
  if (value < min || value > max) {
    return { ok: false, message: `Допустимый диапазон: ${min} … ${max}` };
  }
  return { ok: true, value };
}

export function validateForm(latitudeRaw, longitudeRaw) {
  const latitude = parseCoordinate(latitudeRaw, -90, 90);
  if (!latitude.ok) return latitude;
  const longitude = parseCoordinate(longitudeRaw, -180, 180);
  if (!longitude.ok) return longitude;
  return { ok: true, latitude: latitude.value, longitude: longitude.value };
}