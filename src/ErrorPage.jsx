import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
      const navigate = useNavigate();

     const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#043915] relative overflow-hidden px-4 font-sans">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-[#93BD57] opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#980404] opacity-10 rounded-full blur-3xl"></div>

      <div className="relative z-10 text-center">
        
        {/* Modern 404 Visual */}
        <div className="relative inline-block">
          <h1 className="text-[12rem] md:text-[15rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#93BD57] to-[#043915] opacity-20 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-5xl md:text-7xl font-extrabold text-[#C5D89D] drop-shadow-md tracking-widest uppercase">
              Oops!
            </h2>
          </div>
        </div>

        {/* Text Content */}
        <div className="mt-[-2rem]">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 uppercase tracking-wide">
            Page Not Found
          </h3>
          <p className="text-[#C5D89D] max-w-md mx-auto text-lg leading-relaxed opacity-80">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="group relative px-8 py-4 bg-[#93BD57] text-[#043915] font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:pl-12 shadow-[0_0_20px_rgba(147,189,87,0.3)] active:scale-95"
          >
            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              →
            </span>
            <span className="relative z-10">Back to Home</span>
          </Link>

          <button 
            onClick={handleLogout}
            className="px-8 py-4 border-2 border-[#980404] text-[#980404] font-bold rounded-2xl hover:bg-[#980404] hover:text-white transition-all duration-300 active:scale-95"
          >
            Go Back
          </button>
        </div>

      </div>

      {/* Decorative Bottom Lines */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
        <div className="w-12 h-1 bg-[#93BD57] rounded-full opacity-50"></div>
        <div className="w-4 h-1 bg-[#980404] rounded-full opacity-50"></div>
        <div className="w-4 h-1 bg-[#C5D89D] rounded-full opacity-50"></div>
      </div>
    </div>
  );
};

export default ErrorPage;