import { useEffect, useState } from "react";
import API from "../services/api";

const AdminDashboard = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchSalons = async () => {
    try {
      const res = await API.get("/admin/salons");
      setSalons(res.data);
    } catch (error) {
      console.log("Error fetching salons");
    } finally {
      setLoading(false);
    }
  };

  const approveSalon = async (id) => {
    try {
      await API.put(`/admin/approve/${id}`);
      alert("Salon approved successfully!");
      fetchSalons();
    } catch (error) {
      console.error("Error approving salon:", error);
      alert("Failed to approve salon");
    }
  };

  if (loading) {
    return <div className="p-6">Loading admin panel...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">
        Admin Dashboard
      </h1>

      {salons.length === 0 && (
        <div className="bg-white p-6 rounded shadow">
          No salons registered yet.
        </div>
      )}

      {salons.map((salon) => (
        <div
          key={salon._id}
          className="bg-white p-6 rounded shadow mb-4"
        >
          <h2 className="text-lg font-medium">
            {salon.name}
          </h2>

          <p className="text-gray-600">
            Address: {salon.address}
          </p>

          <p className="text-gray-600">
            Owner: {salon.ownerId?.name} ({salon.ownerId?.phone})
          </p>

          <p className="mt-2 font-semibold">
            Status:{" "}
            {salon.isApproved ? (
              <span className="text-green-600">
                Approved
              </span>
            ) : (
              <span className="text-yellow-600">
                Pending
              </span>
            )}
          </p>

          {!salon.isApproved && (
            <button
              onClick={() => approveSalon(salon._id)}
              className="bg-green-600 text-white px-4 py-2 rounded mt-3"
            >
              Approve Salon
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;