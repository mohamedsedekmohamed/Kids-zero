import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { GiTeacher } from "react-icons/gi";

const LoginSuper = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fakeToken = "fake-jwt-token-123456";
      localStorage.setItem("token", fakeToken);
      localStorage.setItem("role", "super");

      toast.success("login successfully!");
      navigate("/super");
    } catch (err) {
     toast.error("Login failed. Invalid email or password.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Floating shapes */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-one/40 rounded-full animate-bounce-slow mix-blend-multiply"></div>
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-one/20 rounded-full animate-pulse-slow mix-blend-multiply"></div>
      <div className="absolute top-10 left-0 w-40 h-40 bg-one/20 rounded-full animate-bounce-slow mix-blend-multiply"></div>
      <div className="absolute bottom-50 right-10 w-60 h-60 bg-one/40 rounded-full animate-pulse-slow mix-blend-multiply"></div>

      {/* Toaster */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Login box */}
      <div className="relative z-10 bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col items-center">
        <h2 className="text-3xl font-bold text-one mb-6 text-center">
          Super Login
        </h2>

        {/* Optional top image */}
        <GiTeacher 
          className="w-24 h-24 mb-4 text-one rounded-full shadow-lg animate-float"
        />

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-one outline-none transition-all"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-semibold">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-one outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-one text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }

          .animate-bounce-slow {
            animation: bounce 7s infinite alternate;
          }
          .animate-pulse-slow {
            animation: pulse 6s infinite alternate;
          }

          @keyframes bounce {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-30px) scale(1.1); }
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.2); opacity: 0.3; }
          }
        `}
      </style>
    </div>
  );
};


export default LoginSuper