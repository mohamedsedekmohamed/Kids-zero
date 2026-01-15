import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#043915] relative overflow-hidden px-4 font-sans">
      
      {/* Decorative Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-[#980404] opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#93BD57] opacity-10 rounded-full blur-3xl"></div>

      <div className="relative z-10 text-center">
        
        {/* Error Code Visual */}
        <div className="relative inline-block">
          {/* Main 403 Background Text */}
          <h1 className="text-[12rem] md:text-[15rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#980404] to-[#043915] opacity-30 select-none">
            403
          </h1>
          {/* Overlay Icon or Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-[#980404] p-4 rounded-full shadow-2xl animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m11-3V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2v-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Message Content */}
        <div className="mt-[-1rem]">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Access Denied
          </h2>
          <p className="text-[#C5D89D] max-w-sm mx-auto text-lg leading-relaxed opacity-90">
            You don't have permission to view this area. Please contact your administrator if you think this is a mistake.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/admin"
            className="px-10 py-4 bg-[#93BD57] text-[#043915] font-bold rounded-2xl hover:bg-[#C5D89D] transition-all duration-300 shadow-xl active:scale-95 flex items-center gap-2"
          >
            <span>Return to Dashboard</span>
          </Link>

          <button 
            onClick={() => window.history.back()}
            className="px-10 py-4 border-2 border-[#C5D89D] text-[#C5D89D] font-semibold rounded-2xl hover:bg-white/10 transition-all duration-300 active:scale-95"
          >
            Go Back
          </button>
        </div>
      </div>

      {/* Modern Footer Detail */}
      <div className="absolute bottom-8 text-[#C5D89D]/30 text-xs tracking-[0.2em] uppercase">
        Security Protocol Alpha-403
      </div>
    </div>
  );
};

export default Unauthorized;