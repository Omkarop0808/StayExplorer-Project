const {listingSchema,reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const detectCategory = require("../utils/categoryDetect");

module.exports.index = async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings,   activeCat: null   }); 
};

module.exports.renderNewForm=(req,res)=>{
    console.log(req.user);
 
   res.render("listings/new");
}

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({
        path :"reviews",
        populate:{
        path:"author",
    }
}).populate("owner");

    if(!listing){
       req.flash("error","Listing you requested does not exits");
       return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing = async (req, res) => {
  /* 1️⃣  Joi validation */
  const { error } = listingSchema.validate(req.body);
  if (error) throw new ExpressError(400, error);

  /* 2️⃣  Build the doc */
  const listing = new Listing(req.body.listing);
  listing.owner = req.user._id;

  /* 3️⃣  Image (same guard as before) */
  if (req.file) {
    listing.image = { url: req.file.path, filename: req.file.filename };
  } else {
    listing.image = { url: '', filename: '' };   // triggers your setter
  }


  // 4a. Try an exact LOCATION match
  let match = await Listing.findOne({ location: listing.location }).select('geometry');

  // 4b. If none, try a COUNTRY match
  if (!match) {
    match = await Listing.findOne({ country: listing.country }).select('geometry');
  }

  if (match) {
    listing.geometry = match.geometry;   // clone coords from the match
  } else {
    // Fallback coordinates so the map still renders
    listing.geometry = {
      type: 'Point',
      coordinates: [77.5946, 12.9716]  // Bengaluru example
    };
  }

  /* 5️⃣  Save & redirect */
  await listing.save();
  req.flash('success', 'New listing created!');
  res.redirect(`/listings/${listing._id}`);
};

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
     if(!listing){
       req.flash("error","Listing you requested does not exits");
       return res.redirect("/listings");
    }
    // let originalImageUrl = listing.image.url;
    // originalImageUrl= originalImageUrl.replace("/upload","/upload/h_100,w_250");
    res.render("listings/edit",{listing});
}

 module.exports.updateListing =async(req,res) =>{
     let {id} = req.params;
     let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, {
        runValidators: true,
        new: true
       });
       if(typeof req.file!=="undefined"){
       let url = req.file.path;
       let filename = req.file.filename;
       listing.image = {url,filename};
       await listing.save();
       }
       req.flash("success","Listing Updated");
        res.redirect(`/listings/${id}`);
 
 }

 module.exports.destroyListing = async(req,res)=>{
     let {id} = req.params;
     let deleteListing = await Listing.findByIdAndDelete(id);
     console.log(deleteListing);
     
     req.flash("success","listing is deleted successfully!");
     res.redirect("/listings");
 
 }

// working on it 
module.exports.createListing = async (req, res) => {
  const { title, description } = req.body.listing;

  const listing = new Listing(req.body.listing);
  listing.owner = req.user._id;

  const autoCategory = detectCategory(title, description);
  if (autoCategory) {
    listing.category = autoCategory;
  }

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  await listing.save();
  req.flash("success", "New Listing Created!");
  res.redirect(`/listings/${listing._id}`);
};
