const mongoose = require("mongoose");

const RatingAndReview = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  rating: {
    type: Number,
    required: true,
  },
  reviews: {
    type: String,
    reqired: true,
  },
});
module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema);
