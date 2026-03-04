import { useEffect, useState, useCallback } from "react";
import API from "../services/api";

const OwnerDashboard = () => {
  const [salon, setSalon] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
  totalBookingsToday: 0,
  totalRevenueToday: 0,
  totalRevenueMonth: 0,
  totalCompleted: 0,
  totalCancelled: 0,
});

  const [form, setForm] = useState({
    name: "",
    address: "",
  });

  const [workingHours, setWorkingHours] = useState({
    start: "",
    end: "",
    slotDuration: 30,
  });

  const [offlineForm, setOfflineForm] = useState({
    customerName: "",
    customerPhone: "",
    serviceId: "",
    date: "",
    time: "",
  });

  const [availableSlots, setAvailableSlots] = useState([]);

  // ===============================
  // FETCH SALON
  // ===============================
  const fetchSalon = useCallback(async () => {
    try {
      const res = await API.get("/salons/owner-salon");

      setSalon(res.data);

      setWorkingHours({
        start: res.data.workingHours?.start || "09:00",
        end: res.data.workingHours?.end || "18:00",
        slotDuration: res.data.slotDuration || 30,
      });

      if (res.data.isApproved) {
        fetchBookings();
        fetchServices(res.data._id);
        fetchAnalytics();
      }
    } catch {
      setSalon(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ===============================
  // INITIAL LOAD
  // ===============================
  useEffect(() => {
    fetchSalon();
  }, [fetchSalon]);
useEffect(() => {
  fetchSalon();
}, [fetchSalon]);
  // ===============================
  // FETCH BOOKINGS
  // ===============================
  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/owner-bookings");
      setBookings(res.data);
    } catch (error) {
      console.log("Error fetching bookings");
    }
  };

  // NOTE: the stray block that referenced `res` was removed—logic should
  // live inside fetchSalon after the response is available.

  // ===============================
  // FETCH SERVICES
  // ===============================
  const fetchServices = async (salonId) => {
    try {
      const res = await API.get(`/services/salon/${salonId}`);
      setServices(res.data);
    } catch (error) {
      console.log("Error fetching services");
    }
  };

  // ===============================
  // FETCH ANALYTICS
  // ===============================
  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/bookings/owner-analytics");
      setAnalytics(res.data);
    } catch (error) {
      console.log("Error fetching analytics", error);
    }
  };

  // ===============================
  // FETCH AVAILABLE SLOTS
  // ===============================
const fetchOfflineSlots = useCallback(async () => {
    if (!offlineForm.date || !salon) return;

    try {
      const res = await API.get(
        `/bookings/available-slots?salonId=${salon._id}&date=${offlineForm.date}`
      );

      setAvailableSlots(res.data);
    } catch (error) {
      console.log("Error fetching slots");
    }
  }, [offlineForm.date, salon]);

  useEffect(() => {
  fetchOfflineSlots();
}, [fetchOfflineSlots]);

  // ===============================
  // CREATE SALON
  // ===============================
  const handleCreateSalon = async () => {
    if (!form.name || !form.address) {
      alert("Fill all fields");
      return;
    }

    try {
      await API.post("/salons/create", form);
      alert("Salon created successfully! Waiting for admin approval.");
      fetchSalon();
    } catch (error) {
      console.error("Error creating salon:", error);
      alert("Failed to create salon");
    }
  };

  // ===============================
  // UPDATE BOOKING STATUS
  // ===============================
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/bookings/update/${id}`, { status });
      fetchBookings();
      fetchAnalytics();
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Failed to update booking status");
    }
  };

  // ===============================
  // UPDATE WORKING HOURS
  // ===============================
  const updateWorkingHours = async () => {
    try {
      await API.put("/salons/update-hours", workingHours);
      alert("Working hours updated!");
      fetchSalon();
    } catch (error) {
      console.error("Error updating working hours:", error);
      alert("Failed to update working hours");
    }
  };

  // ===============================
  // OFFLINE BOOKING
  // ===============================
  const handleOfflineBooking = async () => {
    if (
      !offlineForm.customerName ||
      !offlineForm.customerPhone ||
      !offlineForm.serviceId ||
      !offlineForm.date ||
      !offlineForm.time
    ) {
      alert("Fill all fields");
      return;
    }

    try {
      await API.post("/bookings/offline", offlineForm);

      alert("Offline booking added!");

      setOfflineForm({
        customerName: "",
        customerPhone: "",
        serviceId: "",
        date: "",
        time: "",
      });

      fetchBookings();
      fetchOfflineSlots();
      fetchAnalytics();
    } catch (error) {
      console.error("Error creating offline booking:", error);
      alert("Failed to add offline booking");
    }
  };

  // ===============================
  // LOADING
  // ===============================
  if (loading) return <div className="p-6">Loading...</div>;

  // ===============================
  // UI
  // ===============================
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">
        Owner Dashboard
      </h1>

      {!salon ? (
        <div className="bg-white p-6 rounded shadow max-w-md">
          <h2 className="text-xl mb-4">Register Your Salon</h2>

          <input
            placeholder="Salon Name"
            className="border p-2 w-full mb-3"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Address"
            className="border p-2 w-full mb-3"
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />

          <button
            onClick={handleCreateSalon}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Create Salon
          </button>
        </div>
      ) : (
        <>
          {/* Salon Info */}
          <div className="bg-white p-6 rounded shadow mb-6">
            <h2 className="text-xl font-medium">
              {salon.name}
            </h2>
            <p>{salon.address}</p>
            <p className="mt-2 font-semibold">
              Status:{" "}
              {salon.isApproved ? (
                <span className="text-green-600">
                  Approved
                </span>
              ) : (
                <span className="text-yellow-600">
                  Pending Approval
                </span>
              )}
            </p>
          </div>

          {!salon.isApproved && (
            <div className="bg-yellow-100 p-6 rounded shadow">
              Waiting for admin approval...
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

  <div className="bg-white p-6 rounded shadow">
    <p className="text-gray-500 text-sm">
      Total Bookings Today
    </p>
    <h2 className="text-2xl font-semibold">
      {analytics.totalBookingsToday}
    </h2>
  </div>

  <div className="bg-white p-6 rounded shadow">
    <p className="text-gray-500 text-sm">
      Revenue Today
    </p>
    <h2 className="text-2xl font-semibold">
      ₹{analytics.totalRevenueToday}
    </h2>
  </div>

  <div className="bg-white p-6 rounded shadow">
    <p className="text-gray-500 text-sm">
      Revenue This Month
    </p>
    <h2 className="text-2xl font-semibold">
      ₹{analytics.totalRevenueMonth}
    </h2>
  </div>

  <div className="bg-white p-6 rounded shadow">
    <p className="text-gray-500 text-sm">
      Completed Bookings
    </p>
    <h2 className="text-2xl font-semibold text-green-600">
      {analytics.totalCompleted}
    </h2>
  </div>

  <div className="bg-white p-6 rounded shadow">
    <p className="text-gray-500 text-sm">
      Cancelled Bookings
    </p>
    <h2 className="text-2xl font-semibold text-red-600">
      {analytics.totalCancelled}
    </h2>
  </div>

</div>

          {salon.isApproved && (
            <>
              {/* Working Hours */}
              <div className="bg-white p-6 rounded shadow mb-6">
                <h2 className="font-semibold mb-4">
                  Working Hours & Slots
                </h2>

                <input
                  type="time"
                  className="border p-2 mr-3"
                  value={workingHours.start}
                  onChange={(e) =>
                    setWorkingHours({
                      ...workingHours,
                      start: e.target.value,
                    })
                  }
                />

                <input
                  type="time"
                  className="border p-2 mr-3"
                  value={workingHours.end}
                  onChange={(e) =>
                    setWorkingHours({
                      ...workingHours,
                      end: e.target.value,
                    })
                  }
                />

                <input
                  type="number"
                  className="border p-2 mr-3"
                  value={workingHours.slotDuration}
                  onChange={(e) =>
                    setWorkingHours({
                      ...workingHours,
                      slotDuration: Number(e.target.value),
                    })
                  }
                />

                <button
                  onClick={updateWorkingHours}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
              <div className="bg-white p-6 rounded shadow mb-6">
  <h2 className="font-semibold mb-4">
    Service Management
  </h2>

  <div className="flex gap-3 mb-4">
    <input
      placeholder="Service Name"
      className="border p-2"
      onChange={(e) =>
        setForm({ ...form, name: e.target.value })
      }
    />

    <input
      type="number"
      placeholder="Price"
      className="border p-2"
      onChange={(e) =>
        setForm({ ...form, price: e.target.value })
      }
    />

    <input
      type="number"
      placeholder="Duration (min)"
      className="border p-2"
      onChange={(e) =>
        setForm({ ...form, duration: e.target.value })
      }
    />

    <button
      onClick={async () => {
        await API.post("/services/add", form);
        fetchServices(salon._id);
      }}
      className="bg-black text-white px-4 py-2 rounded"
    >
      Add
    </button>
  </div>

  {services.map((service) => (
    <div
      key={service._id}
      className="border p-3 mb-2 flex justify-between"
    >
      <span>
        {service.name} — ₹{service.price} — {service.duration}min
      </span>

      <button
        onClick={async () => {
          await API.delete(`/services/delete/${service._id}`);
          fetchServices(salon._id);
        }}
        className="text-red-600"
      >
        Delete
      </button>
    </div>
  ))}
</div>

              {/* Booking Management */}
              <div className="bg-white p-6 rounded shadow mb-6">
                <h2 className="font-semibold mb-4">
                  Booking Management
                </h2>

                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="border p-4 mb-3 rounded"
                  >
                    <p>
                      {booking.customerName ||
                        booking.userId?.name}
                    </p>
                    <p>{booking.serviceId?.name}</p>
                    <p>
                      {booking.date} - {booking.time}
                    </p>
                    <p>Status: {booking.status}</p>

                    <button
                      onClick={() =>
                        updateStatus(booking._id, "confirmed")
                      }
                      className="bg-blue-500 text-white px-2 py-1 mr-2 rounded"
                    >
                      Confirm
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(booking._id, "completed")
                      }
                      className="bg-green-600 text-white px-2 py-1 mr-2 rounded"
                    >
                      Complete
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(booking._id, "cancelled")
                      }
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>

              {/* Offline Booking */}
              <div className="bg-white p-6 rounded shadow">
                <h2 className="font-semibold mb-4">
                  Add Offline Booking
                </h2>

                <input
                  placeholder="Customer Name"
                  className="border p-2 w-full mb-2"
                  value={offlineForm.customerName}
                  onChange={(e) =>
                    setOfflineForm({
                      ...offlineForm,
                      customerName: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Customer Phone"
                  className="border p-2 w-full mb-2"
                  value={offlineForm.customerPhone}
                  onChange={(e) =>
                    setOfflineForm({
                      ...offlineForm,
                      customerPhone: e.target.value,
                    })
                  }
                />

                <select
                  className="border p-2 w-full mb-2"
                  value={offlineForm.serviceId}
                  onChange={(e) =>
                    setOfflineForm({
                      ...offlineForm,
                      serviceId: e.target.value,
                    })
                  }
                >
                  <option value="">Select Service</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  className="border p-2 w-full mb-2"
                  value={offlineForm.date}
                  onChange={(e) =>
                    setOfflineForm({
                      ...offlineForm,
                      date: e.target.value,
                    })
                  }
                />

                <div className="grid grid-cols-3 gap-2 mb-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() =>
                        setOfflineForm({
                          ...offlineForm,
                          time: slot,
                        })
                      }
                      className={`border p-2 rounded ${
                        offlineForm.time === slot
                          ? "bg-black text-white"
                          : ""
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleOfflineBooking}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Add Booking
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default OwnerDashboard;