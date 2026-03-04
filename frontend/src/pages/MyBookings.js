import { useEffect, useState, useContext, useCallback } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const MyBookings = () => {
  const { token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await API.get("/bookings/my-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(res.data);
    } catch (error) {
      console.log("Error fetching bookings");
    }
  }, [token]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchBookings();
      setLoading(false);
    };

    loadData();
  }, [fetchBookings]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "confirmed":
        return "text-blue-500";
      case "completed":
        return "text-green-600";
      case "cancelled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded shadow border">
        Loading your bookings...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">
        My Bookings
      </h1>

      {bookings.length === 0 && (
        <div className="bg-white p-6 rounded shadow border">
          You have no bookings yet.
        </div>
      )}

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white border rounded-xl p-6 shadow-sm"
          >
            <h2 className="font-medium text-lg mb-2">
              {booking.salonId?.name}
            </h2>

            <p className="text-gray-500">
              Service: {booking.serviceId?.name}
            </p>

            <p className="text-gray-500">
              Date: {booking.date}
            </p>

            <p className="text-gray-500">
              Time: {booking.time}
            </p>

            <p
              className={`mt-3 font-semibold ${getStatusColor(
                booking.status
              )}`}
            >
              Status: {booking.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;