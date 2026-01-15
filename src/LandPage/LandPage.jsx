import React from 'react';
import { IoBusOutline, IoLocationOutline, IoShieldCheckmarkOutline, IoStatsChartOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const BusManagementLanding = () => {
  const navigate = useNavigate();

  // Color Palette Constants
  const colors = {
    one: "#93BD57",   // Primary Green
    two: "#C5D89D",   // Light Green
    three: "#980404", // Red Alert
    four: "#043915"   // Deep Dark Green
  };

  const heroBg = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=2069";

  return (
    <div className="max-w-screen overflow-x-hidden font-sans text-left" dir="ltr">
      
      {/* Section 1: Hero Section */}
      <section 
        className="relative h-screen w-full flex items-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#043915]/90 to-transparent z-0" />

        {/* Navbar */}
        <nav 
          className="w-full h-[80px] absolute top-0 z-20 px-5 md:px-12 flex justify-between items-center backdrop-blur-md border-b border-white/10"
          style={{ backgroundColor: `${colors.four}CC` }} // Four with transparency
        >
          <div className="flex items-center gap-2">
            <IoBusOutline className="text-3xl" style={{ color: colors.one }} />
            <span className="text-xl font-bold tracking-wider text-white">
              Kid<span style={{ color: colors.one }}>Sero</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-8 mr-6 text-white/90">
              <a href="#features" className="hover:text-[#93BD57] transition-colors">Features</a>
              <a href="#tracking" className="hover:text-[#93BD57] transition-colors">Live Tracking</a>
              <a className="hover:text-[#93BD57] transition-colors">Home</a>
            </div>
            <button 
              className="text-white px-8 py-2 rounded-lg font-bold transition-all hover:brightness-110 shadow-lg"
              style={{ backgroundColor: colors.one }}
              onClick={() => navigate("/login")}
            >
              Control Panel
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 px-5 md:px-20 w-full text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Smart Management <br/> & <span style={{ color: colors.one }}>Bus Tracking</span> System
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-2xl text-gray-200 leading-relaxed">
            Monitor your fleet in real-time, manage routes efficiently, and ensure passenger safety through a comprehensive GPS-enabled control platform.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              className="px-10 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-xl text-white"
              style={{ backgroundColor: colors.one }}
            >
              Start Tracking Now
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 px-10 py-4 rounded-xl font-bold text-lg transition-all">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: Features */}
      <section id="features" className="py-20 text-gray-900" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.four }}>Why Choose Our Management Platform?</h2>
            <div className="w-20 h-1 mx-auto" style={{ backgroundColor: colors.one }}></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<IoLocationOutline className="text-4xl" style={{ color: colors.one }} />}
              title="Live GPS Tracking"
              desc="Pinpoint your bus location with high accuracy and second-by-second updates."
            />
            <FeatureCard 
              icon={<IoStatsChartOutline className="text-4xl" style={{ color: colors.one }} />}
              title="Performance Reports"
              desc="Analyze fuel consumption, distance covered, and working hours for every driver."
            />
            <FeatureCard 
              icon={<IoShieldCheckmarkOutline className="text-4xl" style={{ color: colors.three }} />}
              title="Safety Alerts"
              desc="Instant notifications for over-speeding or unauthorized route diversions."
            />
            <FeatureCard 
              icon={<IoBusOutline className="text-4xl" style={{ color: colors.four }} />}
              title="Schedule Manager"
              desc="Organize departure and arrival times to ensure strict adherence to schedules."
            />
          </div>
        </div>
      </section>

      {/* Section 3: Map Preview */}
    {/* Section 3: Advanced Live Tracking & Geofencing */}
      <section id="tracking" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          
          {/* Text Content Area */}
          <div className="lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-extrabold tracking-tight" style={{ color: colors.four }}>
                Real-Time <span style={{ color: colors.one }}>Location Intelligence</span>
              </h2>
              <p className="text-gray-600 text-xl leading-relaxed">
                Beyond simple GPS tracking, our dashboard provides deep insights into your fleet's movement, ensuring every route is optimized for safety and efficiency.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl border-l-4 shadow-sm" style={{ borderColor: colors.one, backgroundColor: `${colors.two}20` }}>
                <h4 className="font-bold mb-1" style={{ color: colors.four }}>Live Geofencing</h4>
                <p className="text-sm text-gray-500">Instant alerts when a bus enters or leaves designated zones.</p>
              </div>
              <div className="p-4 rounded-xl border-l-4 shadow-sm" style={{ borderColor: colors.one, backgroundColor: `${colors.two}20` }}>
                <h4 className="font-bold mb-1" style={{ color: colors.four }}>Route Replay</h4>
                <p className="text-sm text-gray-500">Review full trip histories with precise timestamps and stop durations.</p>
              </div>
            </div>

            <ul className="space-y-5">
              {[
                "Instant driver-to-base communication protocols",
                "Automated arrival time (ETA) predictions for passengers",
                "Speed limit monitoring and harsh braking detection"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.one }}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-gray-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Image / Visualization Area */}
          <div className="lg:w-1/2 relative">
            {/* Decorative Background Element */}
            <div 
              className="absolute -top-10 -right-10 w-64 h-64 rounded-full blur-3xl opacity-20"
              style={{ backgroundColor: colors.two }}
            ></div>
            
            <div 
              className="relative z-10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-8"
              style={{ borderColor: colors.two }}
            >
              
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000" 
                alt="Fleet Dashboard Preview" 
                className="w-full h-[450px] object-cover"
              />
              
              {/* Floating "Status" Card Overlay */}
              <div className="absolute bottom-6 left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-gray-100">
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: colors.one }}></div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold">System Status</p>
                  <p className="text-sm font-bold" style={{ color: colors.four }}>Active Tracking: 42 Buses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-12 text-center" style={{ backgroundColor: colors.four }}>
        <div className="mb-6">
          <span className="text-2xl font-bold tracking-wider">
            Kid<span style={{ color: colors.one }}>Sero</span>
          </span>
        </div>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          The ultimate solution for school, corporate, and public transport management.
        </p>
        <div className="border-t border-white/10 pt-8">
          <button
            className="text-sm transition-all flex items-center gap-2 mx-auto hover:opacity-80"
            onClick={() => window.open("https://wegostation.com", "_blank")}
          >
            Powered by <span className="font-bold underline">Wegostation</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100 flex flex-col items-center text-center">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-[#043915]">{title}</h3>
    <p className="text-gray-500 text-sm">{desc}</p>
  </div>
);

export default BusManagementLanding;