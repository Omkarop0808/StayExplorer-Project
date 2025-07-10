const categories = {
  "Beachfront": ["beach", "ocean", "shore", "sea", "waves", "sand", "coast"],
  "Skiing": ["ski", "snow", "ice", "slope", "cold", "frozen"],
  "Mountain cities": ["mountain", "peak", "hill", "trek", "altitude"],
  "Artic": ["arctic", "ice", "cold", "frozen", "snow"],
  "Iconic cities": ["city", "metro", "urban", "skyline", "downtown"],
  "Farms": ["farm", "field", "countryside", "tractor", "barn"],
  "Campign": ["camp", "tent", "fire", "outdoor", "nature"],
  "Castle": ["castle", "royal", "medieval", "fort", "palace"],
  "Island": ["island", "tropical", "coast", "beach"],
  "City Escapes": ["escape", "quiet", "peaceful", "calm", "getaway"],
  "Rooms": ["room", "stay", "bed", "hostel"],
  "Amazing pools": ["pool", "swim", "water", "diving", "float"]
};

function detectCategory(title, description) {
  const text = `${title} ${description}`.toLowerCase();

  for (const [categoryName, keywords] of Object.entries(categories)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        return categoryName;
      }
    }
  }

  // If nothing matched, return undefined → Mongoose will apply default 'Trending'
  return undefined;
}

module.exports = detectCategory;
