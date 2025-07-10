const Listing = require("../models/listing");
const getCoordinates = require("../utils/coordinates");

// Create Listing
module.exports.createListing = async (req, res) => {
  const listingData = req.body.listing;
  const coords = await getCoordinates(listingData.location);  // Add this line

  const newListing = new Listing(listingData);
  newListing.geometry = coords;
  newListing.owner = req.user._id;

  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await newListing.save();
  req.flash("success", "Listing Created Successfully!");
  res.redirect(`/listings/${newListing._id}`);
};

// Update Listing
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listingData = req.body.listing;

  const listing = await Listing.findByIdAndUpdate(id, listingData, { new: true });

  // Recalculate coordinates if location was updated
  if (req.body.listing.location) {
    const coords = await getCoordinates(req.body.listing.location);
    listing.geometry = coords;
  }

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();
  req.flash("success", "Listing Updated Successfully!");
  res.redirect(`/listings/${listing._id}`);
};
