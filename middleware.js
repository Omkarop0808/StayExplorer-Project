  const Listing = require("./models/listing");
  const ExpressError = require("./utils/ExpressError.js");
  const {listingSchema,reviewSchema,subscriberSchema} = require("./schema.js");
  const Review = require("./models/review");

  module.exports.isLoggedIn =(req,res,next) =>{
    console.log(req.user);
   if(!req.isAuthenticated()){
    // redirectUrl
   req.session.redirectUrl = req.originalUrl;
    req.flash("error","You must be logged in to create listing");
    return res.redirect("/login");
   }
   next();
};


module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async(req,res,next)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you are not owner of this list");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview =(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message.join(","))
        throw new ExpressError(400,errMsg);
    }else {
        next();
    }
}

module.exports.isReviewAuthor = async(req,res,next)=>{
  let { id ,reviewId} = req.params;
  let listing = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateSubscriber=(req, res, next) => {
  const { error } = subscriberSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(msg, 400);
  }
  next();
}