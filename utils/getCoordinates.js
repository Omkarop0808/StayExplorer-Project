// utils/getCoordinates.js
const coordinates = require("./coordinates");
const axios = require("axios");

async function getCoordinates(location) {
  const local = coordinates[location];
  if (local) {
    return {
      type: "Point",
      coordinates: local,
    };
  }

  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: { q: location, format: "json", limit: 1 },
      headers: { "User-Agent": "StayExplorerApp/1.0" }
    });

    const place = response.data[0];
    if (!place) {
      return {
        type: "Point",
        coordinates: [0, 0],
      };
    }

    return {
      type: "Point",
      coordinates: [parseFloat(place.lon), parseFloat(place.lat)],
    };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error("Geocoding error:", error);
    }
    return {
      type: "Point",
      coordinates: [0, 0],
    };
  }
}

module.exports = getCoordinates;
