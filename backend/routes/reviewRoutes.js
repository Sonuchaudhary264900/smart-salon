const express = require("express");
const router = express.Router();

const Review = require("../models/Review");
const Salon = require("../models/Salon");
const requireAuth = require("../middleware/requireAuth");


// ADD REVIEW
router.post("/add", requireAuth, async (req, res) => {

  try {

    const { salonId, rating, comment } = req.body;

    const review = await Review.create({
      salonId,
      userId: req.user._id,
      rating,
      comment
    });

    // update salon rating

    const reviews = await Review.find({ salonId });

    const totalReviews = reviews.length;

    const avg =
      reviews.reduce((sum, r) => sum + r.rating, 0) /
      totalReviews;

    await Salon.findByIdAndUpdate(salonId, {
      averageRating: avg,
      totalReviews: totalReviews
    });

    res.json(review);

  } catch (error) {
    res.status(500).json({ message: "Review error" });
  }
});


// GET REVIEWS OF SALON
router.get("/salon/:salonId", async (req, res) => {

  try {

    const reviews = await Review.find({
      salonId: req.params.salonId
    }).populate("userId", "name");

    res.json(reviews);

  } catch (error) {
    res.status(500).json({ message: "Fetch error" });
  }
});

module.exports = router;