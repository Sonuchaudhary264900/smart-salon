import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Home = () => {
  const navigate = useNavigate();

  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchSalons = async () => {
    try {
      setLoading(true);

      // Static fallback location (Chandigarh example)
      const lat = 30.7333;
      const lng = 76.7794;

      const res = await API.get(
        `/salons/nearby?lat=${lat}&lng=${lng}`
      );

      setSalons(res.data);
      setError(null);

    } catch (err) {
      console.error("Salon fetch error:", err);
      setError("Failed to load salons.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">
        Nearby Salons
      </h1>

      {/* Loading State */}
      {loading && (
        <div className="bg-white p-6 rounded shadow-sm border">
          Loading salons...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 text-red-600 p-6 rounded">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && salons.length === 0 && (
        <div className="bg-white p-6 rounded shadow-sm border">
          No salons found nearby.
        </div>
      )}

      {/* Salon Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {salons.map((salon) => (
          <div
            key={salon._id}
            className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-lg font-medium mb-2">
              {salon.name}
            </h3>

            <p className="text-sm text-gray-500 mb-4">
              {salon.address}
            </p>

            <button
              onClick={() => navigate(`/salon/${salon._id}`)}
              className="w-full bg-black text-white py-2 rounded-md text-sm"
            >
              View Services
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;