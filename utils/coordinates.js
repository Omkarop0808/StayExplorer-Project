const axios = require('axios');

async function getCoordinates(location) {
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: location,
        format: "json",
        limit: 1
      },
      headers: {
        "User-Agent": "StayExplorerApp/1.0"
      }
    });

    const place = response.data[0];
    if (!place) {
      return {
        type: "Point",
        coordinates: [0, 0], // Default/fallback
      };
    }

    return {
      type: "Point",
      coordinates: [parseFloat(place.lon), parseFloat(place.lat)]
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return {
      type: "Point",
      coordinates: [0, 0]
    };
  }
}

module.exports = getCoordinates;
