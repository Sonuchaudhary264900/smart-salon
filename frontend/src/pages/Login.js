import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState("details"); // "details" or "otp"
  const [loading, setLoading] = useState(false);

  const [details, setDetails] = useState({
    name: "",
    phone: "",
    role: "user",
  });

  const [otp, setOtp] = useState("");

  const handleDetailsChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  // SEND OTP
  const sendOTP = async () => {
    if (!details.phone) {
      alert("Please enter phone number");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/send-otp", {
        phone: details.phone,
      });

      setStep("otp");
    } catch (error) {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP
  const verifyOTP = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/verify-otp", {
        name: details.name,
        phone: details.phone,
        role: details.role,
        otp: otp,
      });

      login(res.data.token, res.data.user);

      // Redirect based on role
      if (res.data.user.role === "owner") {
        navigate("/owner");
      } else {
        navigate("/");
      }

    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow border">
      
      {step === "details" && (
        <>
          <h2 className="text-2xl font-semibold mb-6">Login</h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            autoComplete="off"
            className="w-full border p-3 rounded mb-4"
            onChange={handleDetailsChange}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            autoComplete="off"
            className="w-full border p-3 rounded mb-4"
            onChange={handleDetailsChange}
          />

          <select
            name="role"
            className="w-full border p-3 rounded mb-4"
            onChange={handleDetailsChange}
          >
            <option value="user">User</option>
            <option value="owner">Owner</option>
          </select>

          <button
            onClick={sendOTP}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </>
      )}

      {step === "otp" && (
        <>
          <h2 className="text-2xl font-semibold mb-6">Enter OTP</h2>

          <input
            type="text"
            placeholder="Enter OTP"
            autoComplete="one-time-code"
            className="w-full border p-3 rounded mb-4"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            onClick={verifyOTP}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}
    </div>
  );
};

export default Login;