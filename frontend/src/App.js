import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SalonDetails from "./pages/SalonDetails";
import BookingPage from "./pages/BookingPage";
import MyBookings from "./pages/MyBookings";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>

          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/salon/:id" element={<SalonDetails />} />
          <Route path="/book/:salonId/:serviceId" element={<BookingPage />} />

          {/* User */}
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute role="user">
                <MyBookings />
              </ProtectedRoute>
            }
          />

          {/* Owner */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute role="owner">
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

        </Routes>
      </Layout>
    </Router>
  );
}

export default App;