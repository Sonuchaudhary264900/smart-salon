import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

const SalonDetails = () => {

  const { id } = useParams();

  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");



  // ===============================
  // FETCH SALON
  // ===============================

  const fetchSalon = useCallback(async () => {

    try {

      const res = await API.get(`/salons/${id}`);
      setSalon(res.data);

    } catch (error) {

      console.log("Error loading salon");

    }

  }, [id]);



  // ===============================
  // FETCH SERVICES
  // ===============================

  const fetchServices = useCallback(async () => {

    try {

      const res = await API.get(`/services/salon/${id}`);
      setServices(res.data);

    } catch (error) {

      console.log("Error loading services");

    }

  }, [id]);



  // ===============================
  // FETCH REVIEWS
  // ===============================

  const fetchReviews = useCallback(async () => {

    try {

      const res = await API.get(`/reviews/salon/${id}`);
      setReviews(res.data);

    } catch (error) {

      console.log("Error loading reviews");

    }

  }, [id]);



  // ===============================
  // SUBMIT REVIEW
  // ===============================

  const submitReview = async () => {

    if (!rating) {
      alert("Please select rating");
      return;
    }

    try {

      await API.post("/reviews/add", {
        salonId: id,
        rating,
        comment
      });

      alert("Review submitted");

      setRating(0);
      setComment("");

      fetchReviews();

    } catch (error) {

      alert("Error submitting review");

    }

  };



  // ===============================
  // PAGE LOAD
  // ===============================

  useEffect(() => {

    fetchSalon();
    fetchServices();
    fetchReviews();

  }, [fetchSalon, fetchServices, fetchReviews]);



  if (!salon) {

    return <div className="p-6">Loading salon...</div>;

  }



  return (

    <div className="p-6 max-w-4xl mx-auto">


      {/* SALON INFO */}

      <div className="bg-white p-6 rounded shadow mb-6">

        <h1 className="text-2xl font-semibold mb-2">
          {salon.name}
        </h1>

        <p className="text-gray-600">
          {salon.address}
        </p>

        <p className="mt-2">

          ⭐ {salon.averageRating?.toFixed(1) || "0"} 
          ({salon.totalReviews || 0} reviews)

        </p>

      </div>



      {/* SERVICES */}

      <div className="bg-white p-6 rounded shadow mb-6">

        <h2 className="text-lg font-semibold mb-4">
          Services
        </h2>

        {services.length === 0 && (
          <p>No services available</p>
        )}

        {services.map((service) => (

          <div
            key={service._id}
            className="border p-3 mb-3 rounded flex justify-between"
          >

            <span>
              {service.name} — ₹{service.price} — {service.duration} min
            </span>

            <button
              className="bg-black text-white px-3 py-1 rounded"
            >
              Book
            </button>

          </div>

        ))}

      </div>



      {/* REVIEW FORM */}

      <div className="bg-white p-6 rounded shadow mb-6">

        <h2 className="text-lg font-semibold mb-4">
          Leave a Review
        </h2>

        <div className="flex gap-2 mb-4">

          {[1,2,3,4,5].map((star) => (

            <span
              key={star}
              onClick={() => setRating(star)}
              className={`cursor-pointer text-2xl ${
                rating >= star
                  ? "text-yellow-500"
                  : "text-gray-400"
              }`}
            >

              ★

            </span>

          ))}

        </div>

        <textarea
          placeholder="Write your review..."
          className="border p-2 w-full mb-3"
          value={comment}
          onChange={(e)=>setComment(e.target.value)}
        />

        <button
          onClick={submitReview}
          className="bg-black text-white px-4 py-2 rounded"
        >

          Submit Review

        </button>

      </div>



      {/* REVIEWS LIST */}

      <div className="bg-white p-6 rounded shadow">

        <h2 className="text-lg font-semibold mb-4">
          Customer Reviews
        </h2>

        {reviews.length === 0 && (
          <p>No reviews yet.</p>
        )}

        {reviews.map((review) => (

          <div
            key={review._id}
            className="border p-3 mb-3 rounded"
          >

            <p className="font-semibold">
              {review.userId?.name}
            </p>

            <p className="text-yellow-500">
              {"★".repeat(review.rating)}
            </p>

            <p>
              {review.comment}
            </p>

          </div>

        ))}

      </div>

    </div>

  );

};

export default SalonDetails;