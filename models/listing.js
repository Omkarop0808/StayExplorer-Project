const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    filename: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "https://unsplash.com/photos/white-wooden-bench-on-green-grass-field-during-daytime-hVKXCpdNnW8",
      set: (v) =>//vitual to set a value 
        v === ""
          ? "https://unsplash.com/photos/night-scene-of-a-busy-street-with-lights-u83VIV39t44"
          : v,
    },
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
    maxLength: 100,
  },
  reviews:[{
    type : Schema.Types.ObjectId,
    ref : "Review",
},
] ,
owner : {
  type : Schema.Types.ObjectId,
  ref : "User",
},
 geometry: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {             //  [lng, lat]
      type: [Number],
      required: true
    }
  },
  category: {
  type: String,
  enum: [
    'Trending', 'Rooms', 'Iconic cities', 'Mountain cities',
    'Castle', 'Amazing pools', 'Campign', 'Farms', 'Artic',
    'Beachfront', 'City Escapes', 'Skiing', 'Island'
  ],
   default: 'Trending',
  required: true
},
subscriber: [{
  type : Schema.Types.ObjectId,
  ref  : "Subscriber"   
}],
});


listingSchema.post("findOneAndDelete",async(listing) =>{
  if(listing){
    await Review.deleteMany({_id : {$in: listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;


