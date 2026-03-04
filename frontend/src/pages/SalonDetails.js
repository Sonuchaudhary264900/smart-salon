import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const SalonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSalonData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch salon details (optional if backend supports)
      const salonRes = await API.get(`/salons/${id}`);
      setSalon(salonRes.data);

      // Fetch services for this salon
      const serviceRes = await API.get(`/services/salon/${id}`);
      setServices(serviceRes.data);

    } catch (error) {
      console.error("Error loading salon:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSalonData();
  }, [fetchSalonData]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded shadow border">
        Loading salon details...
      </div>
    );
  }

  return (
    <div>
      {/* Salon Info */}
      {salon && (
        <div className="bg-white border rounded-xl p-6 shadow-sm mb-8">
          <h1 className="text-3xl font-semibold mb-2">
            {salon.name}
          </h1>

          <p className="text-gray-500 mb-2">
            {salon.address}
          </p>

          <p className="text-sm text-gray-400">
            {salon.isApproved ? "Approved Salon" : "Pending Approval"}
          </p>
        </div>
      )}

      {/* Services */}
      <h2 className="text-2xl font-semibold mb-6">
        Available Services
      </h2>

      {services.length === 0 && (
        <div className="bg-white p-6 rounded shadow border">
          No services available.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-lg font-medium mb-2">
              {service.name}
            </h3>

            <p className="text-gray-500 mb-2">
              ₹{service.price}
            </p>

            <p className="text-gray-400 mb-4">
              {service.duration} mins
            </p>

            <button
              onClick={() =>
                navigate(`/book/${id}/${service._id}`)
              }
              className="w-full bg-black text-white py-2 rounded-md"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalonDetails;