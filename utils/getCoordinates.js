// utils/getCoordinates.js
const coordinates = require("./coordinates");

function getCoordinates(location) {
  const coords = coordinates[location.toLowerCase()];
  if (!coords) {
    return {
      type: "Point",
      coordinates: [77.5946, 12.9716], // fallback to Bengaluru
    };
  }

  return {
    type: "Point",
    coordinates: coords,
  };
}

module.exports = getCoordinates;
