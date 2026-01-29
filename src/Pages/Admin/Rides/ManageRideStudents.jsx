import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGet from "@/hooks/useGet";
import Loading from "@/Components/Loading";
import { 
  MapPin, Bus, User, Navigation2, Phone, ShieldCheck, RefreshCcw
} from "lucide-react";
import { MdNearbyError } from "react-icons/md";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 1. تعريف أيقونة الباص (تأكد من وجود اتصال إنترنت لتحميل الصورة)
const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png', 
  iconSize: [45, 45],
  iconAnchor: [22, 22],
  popupAnchor: [0, -20],
  className: "bus-moving-icon"
});

// 2. دالة الأيقونات المرقمة للمحطات
const createNumberedIcon = (number, color = "#93BD57") => {
  return new L.DivIcon({
    className: "custom-number-icon",
    html: `
      <div style="
        background-color: ${color}; 
        color: white; 
        width: 32px; 
        height: 32px; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-weight: 900;
        border: 3px solid white;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
      ">
        ${number}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// 3. مكون فرعي لتحديث مركز الخريطة عند تحرك الباص
const RecenterMap = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.panTo(coords);
    }
  }, [coords, map]);
  return null;
};

const ManageRideStudents = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // إضافة مفتاح للتحديث اليدوي أو التلقائي
  const [refreshKey, setRefreshKey] = useState(0);
  const { data, loading } = useGet(`api/admin/rides/occurrences/${id}?refresh=${refreshKey}`);

  // تحديث البيانات تلقائياً كل 15 ثانية لمراقبة حركة الباص
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 15000); 
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) return <Loading />;
  if (!data?.data) return <div className="p-10 text-center font-bold">No Data Found</div>;

  const { occurrence, ride, bus, driver, route, stats, students } = data.data;

  // تجهيز إحداثيات المحطات
  const sortedStops = [...route.stops].sort((a, b) => a.stopOrder - b.stopOrder);
  const polylinePositions = sortedStops.map(stop => [parseFloat(stop.lat), parseFloat(stop.lng)]);

  // إحداثيات الباص الحالية (المستهدفة)
  const busCurrentPos = occurrence.currentLocation 
    ? [parseFloat(occurrence.currentLocation.lat), parseFloat(occurrence.currentLocation.lng)]
    : null;

  return (
    <div className="min-h-screen bg-[#FBFDF9] p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#93BD57] font-bold text-sm tracking-widest uppercase">
              <ShieldCheck size={18} />
              Secure School Transport
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              {ride.name} <span className="text-[#C5D89D] font-medium">Live</span>
            </h1>
          </div>
          <button 
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl shadow-sm border border-[#C5D89D]/30 hover:bg-slate-50 transition-all font-bold text-slate-600"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            {loading ? "Updating..." : "Refresh Live Data"}
          </button>
        </header>

        {/* --- MAP SECTION --- */}
        <section className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border-8 border-white h-[550px] relative z-0">
          <MapContainer 
            center={busCurrentPos || polylinePositions[0] || [24.7, 46.6]} 
            zoom={14} 
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* تحديث الكاميرا لتتبع الباص */}
            {busCurrentPos && <RecenterMap coords={busCurrentPos} />}

            {/* رسم مسار الرحلة (الخط المقطع) */}
            <Polyline 
              positions={polylinePositions} 
              pathOptions={{ color: '#93BD57', weight: 4, dashArray: '10, 10', opacity: 0.5 }} 
            />

            {/* 1. رسم نقاط المحطات (باللون الرمادي/الأزرق لأنها ثابتة) */}
            {sortedStops.map((stop) => (
              <Marker 
                key={stop.id} 
                position={[parseFloat(stop.lat), parseFloat(stop.lng)]}
                icon={createNumberedIcon(stop.stopOrder, "#64748b")}
              >
                <Popup>
                  <div className="p-1 font-sans">
                    <p className="font-black text-slate-800">Stop {stop.stopOrder}: {stop.name}</p>
                    <p className="text-xs text-slate-500">{stop.address}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* 2. رسم الباص في موقعه الحالي (العلامة المميزة) */}
            {busCurrentPos && (
              <Marker position={busCurrentPos} icon={busIcon} zIndexOffset={1000}>
                <Popup className="bus-popup">
                   <div className="text-center p-1">
                      <p className="font-black text-[#93BD57] text-lg">باص {bus.busNumber}</p>
                      <p className="text-xs font-bold text-slate-500">لوحة: {bus.plateNumber}</p>
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-red-500">LIVE NOW</span>
                      </div>
                   </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
          
          {/* Map Overlay Info */}
          <div className="absolute top-6 left-6 z-[400] flex flex-col gap-2">
            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-slate-200">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</h3>
              <p className="text-sm font-black text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                {occurrence.status.replace('_', ' ')}
              </p>
            </div>
          </div>
        </section>

        {/* --- Sidebar & Table --- */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Driver Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#93BD57] rounded-[2.5rem] p-8 text-white shadow-xl shadow-[#93BD57]/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:rotate-12 transition-transform">
                 <Bus size={150} />
               </div>
               <p className="text-[#C5D89D] text-[11px] uppercase font-black tracking-[0.2em] mb-8">Active Driver</p>
               <div className="relative z-10 flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 overflow-hidden shadow-inner">
                    <img src={driver.avatar} className="w-full h-full object-cover" alt={driver.name} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black">{driver.name}</h4>
                    <p className="text-[#C5D89D] text-sm flex items-center gap-1">
                      <Phone size={14} /> {driver.phone}
                    </p>
                  </div>
               </div>
               <div className="bg-black/10 rounded-2xl p-4 flex justify-between items-center border border-white/10">
                  <div>
                    <p className="text-[10px] text-white/60 uppercase font-bold">Bus ID</p>
                    <p className="font-bold">{bus.busNumber}</p>
                  </div>
                  <div className="h-8 w-[1px] bg-white/20"></div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/60 uppercase font-bold">Plate No</p>
                    <p className="font-bold">{bus.plateNumber}</p>
                  </div>
               </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(stats).slice(0, 4).map(([key, value]) => (
                <div key={key} className="bg-white p-5 rounded-3xl shadow-sm border-b-4 border-[#C5D89D]">
                  <p className="text-3xl font-black text-slate-800">{value}</p>
                  <p className="text-[10px] text-[#93BD57] uppercase font-black">{key}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Student Table */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-black text-2xl">Student Manifest</h3>
                <span className="text-xs font-bold text-[#93BD57] bg-[#93BD57]/10 px-4 py-2 rounded-full">
                   {students.all.length} Students Total
                </span>
              </div>
              <div className="overflow-x-auto p-4">
                <table className="w-full border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-left text-slate-400 text-[10px] uppercase font-black tracking-widest">
                      <th className="px-4 pb-4">Student</th>
                      <th className="px-4 pb-4">Class</th>
                      <th className="px-4 pb-4">Stop</th>
                      <th className="px-4 pb-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.all.map((item) => (
                      <tr key={item.id} className="bg-slate-50/50 hover:bg-[#FBFDF9] transition-colors group">
                        <td className="p-4 rounded-l-2xl">
                          <div className="flex items-center gap-3">
                            <img src={item.student.avatar} className="w-10 h-10 rounded-xl object-cover" />
                            <p className="font-bold text-slate-800">{item.student.name}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-xs font-bold text-slate-500">{item.student.grade}-{item.student.classroom}</span>
                        </td>
                        <td className="p-4">
                          <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                            <MapPin size={12} /> {item.pickupPoint.name}
                          </p>
                        </td>
                        <td className="p-4 rounded-r-2xl text-right">
                          <StatusBadge status={item.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const configs = {
    pickedUp: "bg-[#93BD57]/10 text-[#93BD57]",
    pending: "bg-amber-100 text-amber-600",
    absent: "bg-rose-100 text-rose-600",
    excused: "bg-slate-100 text-slate-600",
  };
  return (
    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${configs[status] || "bg-gray-100"}`}>
      {status}
    </span>
  );
};

export default ManageRideStudents;  