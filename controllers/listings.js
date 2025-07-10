const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const detectCategory = require("../utils/categoryDetect.js");
const getCoordinates = require("../utils/getCoordinates.js"); // Make sure this exists

// Index
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings, activeCat: null });
};

// New Form
module.exports.renderNewForm = (req, res) => {
  console.log(req.user);
  res.render("listings/new");
};

// Show
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }

  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

// ✅ Final CREATE Listing
module.exports.createListing = async (req, res) => {
  // 1️⃣ Joi validation
  const { error } = listingSchema.validate(req.body);
  if (error) throw new ExpressError(400, error);

  const { title, description, location } = req.body.listing;

  // 2️⃣ Build new listing
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  // 3️⃣ Auto Category
  const autoCategory = detectCategory(title, description);
  if (autoCategory) {
    newListing.category = autoCategory;
  }

  // 4️⃣ Coordinates using your utility
  const coords = await getCoordinates(location);
  newListing.geometry = coords || {
    type: "Point",
    coordinates: [77.5946, 12.9716], // fallback
  };

  // 5️⃣ Image
  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  } else {
    newListing.image = { url: "", filename: "" };
  }

  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect(`/listings/${newListing._id}`);
};

// Render Edit
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/edit", { listing });
};

// ✅ Final UPDATE Listing
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listingData = req.body.listing;

  const listing = await Listing.findByIdAndUpdate(id, listingData, {
    runValidators: true,
    new: true,
  });

  // Recalculate coordinates if location changed
  if (req.body.listing.location) {
    const coords = await getCoordinates(req.body.listing.location);
    if (coords) listing.geometry = coords;
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

// Delete
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);

  req.flash("success", "Listing is deleted successfully!");
  res.redirect("/listings");
};
