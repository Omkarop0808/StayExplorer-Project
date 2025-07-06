const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner, validateListing} = require("../middleware.js");
const multer  = require("multer");
const {storage} = require("../cloudconfig.js");
const upload = multer({  storage });



const listingsController = require("../controllers/listings.js")



//New Route
router.get("/new",isLoggedIn,listingsController.renderNewForm);


// Index & Create Route
router
.route("/")
.get(wrapAsync(listingsController.index))
.post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingsController.createListing ));




// Search Routes
router.get("/search", async (req, res) => {
  const { q } = req.query;               // /listings/search?q=malibu
  if (!q) return res.redirect('/listings');

  const pattern = new RegExp(q, 'i');    // case-insensitive

  const listings = await Listing.find({
    $or: [
      { location: pattern },
      { country:  pattern },
      { title:    pattern },
    ]
  });

  res.render('listings/index.ejs', { allListings: listings ,  activeCat: null  });
});



// -----category route
router.get("/category/:catname", wrapAsync(async (req, res) => {
  const { catname } = req.params;
  const categoryNames = {
    trending:        "Trending",
    rooms:           "Rooms",
    iconiccities:    "Iconic cities",
    mountaincities:  "Mountain cities",
    castle:          "Castle",
    amazingpools:    "Amazing pools",
    campign:         "Campign",
    farms:           "Farms",
    artic:           "Artic",
    beachfront:      "Beachfront",
    cityescape:      "City Escapes",
    skiing:          "Skiing",
    island:          "Island"
  };

  const catDisplay = categoryNames[catname.toLowerCase()];
  if (!catDisplay) {
    return res.status(404).send("Category not found");
  }

  const regex = new RegExp(`^${catDisplay}$`, 'i');
  const listings = await Listing.find({ category: regex });

  res.render("listings/index.ejs", {
    allListings: listings,
    activeCat: catDisplay  // This is what your EJS is checking
  });
}));

//Edit Route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingsController.renderEditForm));


// Show ,Update,Delete Route
router
.route("/:id")
.get(wrapAsync(listingsController.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingsController.updateListing))
.delete(
      isLoggedIn,
       isOwner,
       wrapAsync(listingsController.destroyListing));





module.exports = router;
