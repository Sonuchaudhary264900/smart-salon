import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <Link to="/" className="text-xl font-semibold">
          SmartSalon
        </Link>

        <div className="flex items-center gap-6 text-sm">

          {/* ADMIN */}
          {user?.role === "admin" && (
            <Link to="/admin" className="hover:text-black text-gray-600">
              Admin Panel
            </Link>
          )}

          {/* OWNER */}
          {user?.role === "owner" && (
            <Link to="/owner" className="hover:text-black text-gray-600">
              Owner Dashboard
            </Link>
          )}

          {/* USER */}
          {user?.role === "user" && (
            <Link to="/my-bookings" className="hover:text-black text-gray-600">
              My Bookings
            </Link>
          )}

          {!user ? (
            <Link
              to="/login"
              className="bg-black text-white px-4 py-2 rounded-md"
            >
              Login
            </Link>
          ) : (
            <>
              <span className="text-gray-600">
                {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;