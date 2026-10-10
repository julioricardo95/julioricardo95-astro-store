export function getUTMWGS84() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("La geolocalización no está soportada por tu navegador."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const utm = latLonToUTM(lat, lon);
        resolve({
          lat,
          lon,
          utmString: `Zona \({utm.zone}\){utm.hemisphere} Easting: \({utm.easting.toFixed(2)}m, Northing:\){utm.northing.toFixed(2)}m`,
          utmData: utm
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

function latLonToUTM(lat, lon) {
  const a = 6378137.0; // Semieje mayor WGS84
  const f = 1 / 298.257223563; // Aplanamiento
  const k0 = 0.9996;

  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;

  let zone = Math.floor((lon + 180) / 6) + 1;
  if (lat >= 56.0 && lat < 64.0 && lon >= 3.0 && lon < 12.0) zone = 32;

  const lon0 = ((zone - 1) * 6 - 180 + 3) * (Math.PI / 180);

  const e2 = 2 * f - f * f;
  const ePrime2 = e2 / (1 - e2);
  const N = a / Math.sqrt(1 - e2 * Math.sin(latRad) * Math.sin(latRad));
  const T = Math.tan(latRad) * Math.tan(latRad);
  const C = ePrime2 * Math.cos(latRad) * Math.cos(latRad);
  const A = (lonRad - lon0) * Math.cos(latRad);

  const M =
    a *
    ((1 - e2 / 4 - (3 * e2 * e2) / 64 - (5 * Math.pow(e2, 3)) / 256) * latRad -
      ((3 * e2) / 8 + (3 * e2 * e2) / 32 + (45 * Math.pow(e2, 3)) / 1024) * Math.sin(2 * latRad) +
      ((15 * e2 * e2) / 256 + (45 * Math.pow(e2, 3)) / 1024) * Math.sin(4 * latRad) -
      ((35 * Math.pow(e2, 3)) / 3072) * Math.sin(6 * latRad));

  const easting =
    k0 *
      N *
      (A +
        ((1 - T + C) * Math.pow(A, 3)) / 6 +
        ((5 - 18 * T + T * T + 72 * C - 58 * ePrime2) * Math.pow(A, 5)) / 120) +
    500000;

  let northing =
    k0 *
    (M +
      N *
        Math.tan(latRad) *
        (Math.pow(A, 2) / 2 +
          ((5 - T + 9 * C + 4 * C * C) * Math.pow(A, 4)) / 24 +
          ((61 - 58 * T + T * T + 600 * C - 330 * ePrime2) * Math.pow(A, 6)) / 720));

  if (lat < 0) northing += 10000000; // Offset Hemisferio Sur

  return {
    zone,
    hemisphere: lat >= 0 ? 'N' : 'S',
    easting,
    northing
  };
}