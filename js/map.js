const OFFSET = 0.05;

export function buildMapUrl({ latitude, longitude }) {
  const bbox = [
    longitude - OFFSET, latitude - OFFSET,
    longitude + OFFSET, latitude + OFFSET,
  ].join(',');
  return `https://www.openstreetmap.org/export/embed.html`
    + `?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;
}