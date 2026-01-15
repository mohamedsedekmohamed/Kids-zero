import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useGet from "@/hooks/useGet";
import Loading from "@/Components/Loading";
import { 
  MapPin, Bus, User, Navigation2, Phone, ShieldCheck
} from "lucide-react";

// 1. استيراد Polyline من المكتبة
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- دالة لإنشاء أيقونة مرقمة (1, 2, 3) ---
const createNumberedIcon = (number) => {
  return new L.DivIcon({
    className: "custom-number-icon",
    // نستخدم HTML و CSS مخصص لرسم دائرة خضراء بداخلها رقم
    html: `
      <div style="
        background-color: #93BD57; 
        color: white; 
        width: 32px; 
        height: 32px; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-weight: 900;
        font-family: sans-serif;
        border: 3px solid white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
      ">
        ${number}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16], // لجعل الأيقونة في المنتصف تماماً
    popupAnchor: [0, -20] // لضبط مكان النافذة المنبثقة فوق الرقم
  });
};

const StatusBadge = ({ status }) => {
  // ... (نفس كود StatusBadge القديم) ...
  const configs = {
    pickedUp: "bg-[#93BD57]/10 text-[#93BD57] border-[#93BD57]/20",
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    absent: "bg-rose-50 text-rose-600 border-rose-100",
    excused: "bg-[#C5D89D]/20 text-[#7A9E41] border-[#C5D89D]",
  };
  return (
    <span className={`px-3 py-1 rounded-lg text-[11px] font-bold border ${configs[status] || "bg-gray-50 text-gray-500"} uppercase tracking-tight`}>
      {status}
    </span>
  );
};

const ManageRideStudents = () => {
  const { id } = useParams();
  const { data, loading } = useGet(`api/admin/rides/occurrence/${id}`);

  if (loading || !data?.data) return <Loading />;

  const { ride, bus, driver, route, stats, students } = data.data;

  // 2. ترتيب المحطات والتجهيز للرسم
  // نتأكد أن المحطات مرتبة حسب stopOrder
  const sortedStops = [...route.stops].sort((a, b) => a.stopOrder - b.stopOrder);

  // استخراج الإحداثيات فقط لرسم الخط (Polyline)
  const polylinePositions = sortedStops.map(stop => [
    parseFloat(stop.lat), 
    parseFloat(stop.lng)
  ]);

  const defaultCenter = polylinePositions.length > 0 ? polylinePositions[0] : [24.7136, 46.6753];

  return (
    <div className="min-h-screen bg-[#FBFDF9] p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- Header Section (نفس القديم) --- */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#93BD57] font-bold text-sm tracking-widest uppercase">
              <ShieldCheck size={18} />
              Secure School Transport
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              {ride.name} <span className="text-[#C5D89D] font-medium">Monitoring</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-[#C5D89D]/30">
             <div className="text-right">
                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Active Ride </p>
             </div>
             <div className="w-10 h-10 rounded-full bg-[#93BD57] flex items-center justify-center text-white shadow-lg shadow-[#93BD57]/20">
                <Navigation2 size={20} fill="currentColor" />
             </div>
          </div>
        </header>

        {/* --- MAP SECTION --- */}
        <section className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-[#C5D89D]/20 h-[500px] relative z-0">
          <MapContainer 
            center={defaultCenter} 
            zoom={13} 
            scrollWheelZoom={false} 
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* 3. رسم الخط الواصل بين النقاط */}
            <Polyline 
              positions={polylinePositions} 
              pathOptions={{ color: '#93BD57', weight: 4, dashArray: '10, 10', opacity: 0.8 }} 
            />

            {/* 4. رسم النقاط المرقمة */}
            {sortedStops.map((stop) => (
              <Marker 
                key={stop.id} 
                position={[parseFloat(stop.lat), parseFloat(stop.lng)]}
                // هنا نستخدم دالة الأيقونة المرقمة
                icon={createNumberedIcon(stop.stopOrder)}
              >
                <Popup>
                  <div className="text-center p-2 min-w-[150px]">
                    <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-md font-bold mb-2 inline-block">
                      STOP #{stop.stopOrder}
                    </span>
                    <h3 className="font-bold text-slate-800 text-sm mb-1">{stop.name}</h3>
                    <p className="text-xs text-slate-500 mb-2">{stop.address}</p>
                    <div className="text-[10px] bg-[#93BD57] text-white px-2 py-1 rounded-full inline-block">
                      {stop.studentsCount} Students Waiting
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-slate-100">
            <h3 className="text-xs font-black text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#93BD57] animate-pulse"></span>
              LIVE ROUTE SEQUENCE
            </h3>
          </div>
        </section>

        {/* --- بقية الصفحة (Sidebar & Table) كما هي --- */}
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            {/* Driver Card */}
            <div className="bg-[#93BD57] rounded-[2.5rem] p-8 text-white shadow-xl shadow-[#93BD57]/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-20 transform group-hover:scale-110 transition-transform">
                 <Bus size={120} />
               </div>
               <p className="text-[#C5D89D] text-[11px] uppercase font-black tracking-[0.2em] mb-8">On-Duty Driver</p>
               <div className="relative z-10 flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                    <img 
                      src={driver.avatar} 
                      alt={driver.name}
                      className="w-full h-full object-cover rounded-2xl"
                      onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='flex'}} 
                    />
                    <div className="hidden w-full h-full items-center justify-center">
                       <User size={32} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black">{driver.name}</h4>
                    <p className="text-[#C5D89D] text-sm flex items-center gap-1">
                      <Phone size={14} fill="currentColor" /> {driver.phone}
                    </p>
                  </div>
               </div>
               <div className="bg-black/10 rounded-2xl p-4 flex justify-between items-center border border-white/10">
                  <div>
                    <p className="text-[10px] text-white/60 uppercase font-bold">Bus Number</p>
                    <p className="font-bold tracking-widest">{bus.busNumber}</p>
                  </div>
                  <div className="h-8 w-[1px] bg-white/20"></div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/60 uppercase font-bold">Plate</p>
                    <p className="font-bold tracking-widest">{bus.plateNumber}</p>
                  </div>
               </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(stats).slice(0, 4).map(([key, value]) => (
                <div key={key} className="bg-white border-b-4 border-[#C5D89D] p-5 rounded-3xl shadow-sm hover:translate-y-[-4px] transition-transform">
                  <p className="text-3xl font-black text-slate-800">{value}</p>
                  <p className="text-[10px] text-[#93BD57] uppercase font-black tracking-widest">{key}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8">
             {/* Table code remains same as previous */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden px-4">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-black text-2xl flex items-center gap-3">
                  Student Manifest
                  <span className="text-sm font-bold text-[#93BD57] bg-[#93BD57]/10 px-4 py-1 rounded-full">
                    {students.all.length} Total
                  </span>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-slate-400 text-[10px] uppercase font-black tracking-[0.15em]">
                      <th className="p-6">Student Info</th>
                      <th className="p-6 text-center">Academic</th>
                      <th className="p-6">Pickup Point</th>
                      <th className="p-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {students.all.map((item) => (
                      <tr key={item.id} className="group hover:bg-[#FBFDF9] transition-all">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <img src={item.student.avatar} className="w-14 h-14 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform border-2 border-white" alt="student" />
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#93BD57] border-2 border-white rounded-full shadow-sm"></div>
                            </div>
                            <div>
                              <p className="font-black text-slate-800 text-base">{item.student.name}</p>
                              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">Parent: {item.parent.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6 text-center">
                          <span className="inline-block px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-black">
                            {item.student.grade} - {item.student.classroom}
                          </span>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                            <MapPin size={14} className="text-[#93BD57]" />
                            {item.pickupPoint.name}
                          </div>
                        </td>
                        <td className="p-6 text-right">
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

export default ManageRideStudents;