import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const BookingPage = () => {
  const { salonId, serviceId } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch available slots when date changes
  useEffect(() => {
    if (!date) return;

    fetchSlots();
  }, [date]);

  const fetchSlots = async () => {
    try {
      setLoadingSlots(true);

      const res = await API.get(
        `/bookings/available-slots?salonId=${salonId}&date=${date}`
      );

      setAvailableSlots(res.data);
    } catch (error) {
      console.log("Error fetching slots");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot) {
      alert("Please select a slot");
      return;
    }

    try {
      setBookingLoading(true);

      await API.post("/bookings/create", {
        salonId,
        serviceId,
        date,
        time: selectedSlot,
      });

      alert("Booking successful!");
      navigate("/my-bookings");

    } catch (error) {
      alert("Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow border">
      <h2 className="text-2xl font-semibold mb-6">
        Book Appointment
      </h2>

      {/* Date Picker */}
      <label className="block mb-2 text-sm font-medium">
        Select Date
      </label>

      <input
        type="date"
        className="w-full border p-3 rounded mb-6"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
          setSelectedSlot("");
        }}
      />

      {/* Slots */}
      {loadingSlots && <p>Loading available slots...</p>}

      {date && !loadingSlots && (
        <>
          <h3 className="mb-3 font-medium">
            Available Slots
          </h3>

          {availableSlots.length === 0 && (
            <p>No slots available.</p>
          )}

          <div className="grid grid-cols-3 gap-2 mb-6">
            {availableSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`border p-2 rounded text-sm ${
                  selectedSlot === slot
                    ? "bg-black text-white"
                    : "bg-white"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </>
      )}

      <button
        onClick={handleBooking}
        disabled={bookingLoading}
        className="w-full bg-black text-white py-3 rounded"
      >
        {bookingLoading ? "Processing..." : "Confirm Booking"}
      </button>
    </div>
  );
};

export default BookingPage;