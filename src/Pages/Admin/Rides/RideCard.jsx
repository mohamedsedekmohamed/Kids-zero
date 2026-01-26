import React from "react";
import {
  Bus,
  Navigation,
  CheckCircle2,
  User,
  Users,       // Total
  LogIn,       // Picked Up
  LogOut,      // Dropped Off
  Clock,       // Pending
  AlertCircle  // Absent
} from "lucide-react";

const getDistanceInMeters = (lat1, lng1, lat2, lng2) => {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371000;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/* ================= Helper Component for Stats ================= */


/* ================= Main Component ================= */
const RideCard = ({ data }) => {
  const rideData = data || {};

  const driver = rideData.driver || {};
  const codriver = rideData.codriver || {};
  const route = rideData.route || {};
  const bus = rideData.bus || {};
  const stops = route.stops || [];
  const occurrence = rideData.occurrence || {};
  const currentLocation = occurrence.currentLocation;

  // ✅ FIX: secure occupancy
  const occupancy = bus.occupancy || {
    current: 0,
    max: 0,
    percentage: 0,
  };

  const currentStopIndex = React.useMemo(() => {
    if (!currentLocation || !stops.length) {
      return route.completedStops || 0;
    }

    let nearestIndex = 0;
    let minDistance = Infinity;

    stops.forEach((stop, index) => {
      if (!stop.lat || !stop.lng) return;

      const distance = getDistanceInMeters(
        currentLocation.lat,
        currentLocation.lng,
        parseFloat(stop.lat),
        parseFloat(stop.lng)
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    });

    return minDistance <= 150
      ? nearestIndex
      : route.completedStops || 0;
  }, [currentLocation, stops, route.completedStops]);

  return (
    <div
      className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-sm border border-one overflow-hidden font-sans text-sm h-[600px] overflow-y-scroll"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {/* ===== Staff ===== */}
      <div className="flex flex-col divide-y bg-gray-50">
        {/* Driver */}
        <div className="flex items-center gap-3 p-3 bg-white">
          <img
            src={driver.avatar}
            className="w-12 h-12 rounded-full border"
            alt="Driver"
          />
          <div className="flex-1">
            <p className="text-[10px] font-bold text-one uppercase">
              Driver
            </p>
            <p className="font-semibold">{driver.name || "N/A"}</p>
            <p className="text-xs text-gray-500">{driver.phone || "-"}</p>
          </div>
        </div>

        {/* Co-driver */}
        {codriver?.id ? (
          <div className="flex items-center gap-3 p-3 bg-white">
            <img
              src={
                codriver.avatar ||
                `https://ui-avatars.com/api/?name=${codriver.name}`
              }
              className="w-12 h-12 rounded-full border"
              alt="Co-driver"
            />
            <div className="flex-1">
              <p className="text-[10px] font-bold text-pink-500 uppercase">
                Co-driver
              </p>
              <p className="font-semibold">{codriver.name}</p>
              <p className="text-xs text-gray-500">
                {codriver.phone || "-"}
              </p>
            </div>
            <User size={16} className="text-pink-500" />
          </div>
        ) : (
          <div className="p-3 text-center text-xs text-gray-400">
            No Co-driver Assigned
          </div>
        )}
      </div>

      {/* ===== Bus Info ===== */}
      <div className="w-full shadow-md rounded-xl p-4 flex flex-col items-end space-y-2 bg-white mt-2 mb-2">
        <div className="flex items-center justify-between space-x-2 w-full">
          <Bus size={24} className="text-one" />
          <h2 className="text-lg font-semibold text-gray-700">
            Bus Number: {bus.busNumber || "-"}
          </h2>
        </div>

        <p className="text-sm text-gray-500">
          Plate Number: {bus.plateNumber || "-"}
        </p>

        <div className="w-full mt-2">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>
              Seats: {occupancy.current}/{occupancy.max}
            </span>
            <span>{occupancy.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-one h-2 rounded-full"
              style={{ width: `${occupancy.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* ===== Route Header ===== */}
      <div className="bg-one text-white p-3 flex justify-between items-center rounded-bl-4xl">
        <div>
          <p className="font-bold text-sm">
            Route: {route.name || "-"}
          </p>
          <p className="text-[10px] opacity-80 flex items-center gap-1">
            <Navigation size={10} /> {stops.length} Stops
          </p>
        </div>
        <p className="text-sm font-bold">
          {Math.min(currentStopIndex + 1, stops.length)} /{" "}
          {stops.length}
        </p>
      </div>

      {/* ===== Timeline ===== */}
      <div className="p-4">
        <div className="relative pl-3">
          {/* الخط الخلفي الثابت */}
          <div className="absolute left-[14px] top-2 bottom-2 w-[2px] bg-gray-200" />

          {stops.map((stop, index) => {
            const isCompleted = index < currentStopIndex;
            const isCurrent = index === currentStopIndex;

            return (
              <div
                key={stop.id || index}
                className="relative mb-6 transition-all last:mb-0"
              >
                {/* الخط الرأسي الملون */}
                <div
                  className={`absolute left-4 top-0 bottom-[-24px] w-[2px] rounded z-0
                    ${index < currentStopIndex ? "bg-emerald-400" : "bg-transparent"}
                  `}
                />

                <div className="flex items-start gap-3 relative z-10">
                  {/* الدائرة + FINISH */}
                  <div className="flex flex-col items-center gap-1 bg-white py-1">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                        ${
                          isCompleted
                            ? "bg-emerald-500 text-white shadow-md"
                            : isCurrent
                            ? "bg-blue-600 text-white scale-110 shadow-md animate-pulse"
                            : "bg-gray-200 text-gray-600"
                        }
                      `}
                    >
                      {isCompleted ? <CheckCircle2 size={14} /> : isCurrent ? <Bus size={12} /> : index + 1}
                    </div>

                    {/* كلمة FINISH للنقاط المكتملة */}
                    {isCompleted && (
                      <span className="text-[8px] font-bold text-emerald-700 uppercase">
                        FINISH
                      </span>
                    )}
                  </div>

                  {/* معلومات النقطة */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex justify-between items-start">
                      <p
                        className={`text-xs font-bold truncate ${
                          isCurrent ? "text-blue-700" : isCompleted ? "text-emerald-800" : "text-gray-800"
                        }`}
                      >
                        {stop.name}
                      </p>
                      {isCurrent && (
                        <span className="text-[8px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">
                          Arriving
                        </span>
                      )}
                    </div>
                    
                    <p className="text-[10px] text-gray-600 truncate mb-2">
                      {stop.address || "No address"}
                    </p>

                    {/* ===== إضافة الإحصائيات (New Stats Section) ===== */}
                 {stop.stats?.total > 0 && (
  <div className="flex flex-wrap items-center gap-2 mt-2">
    
    {/* Total Students */}
    <StatBadge 
      icon={Users} 
      label="Total" 
      value={stop.stats.total} 
      bgClass="bg-gray-100" 
      colorClass="text-gray-600" 
    />

    {/* Picked Up (In Bus) */}
    {stop.stats.pickedUp > 0 && (
      <StatBadge 
        icon={LogIn} 
        label="On Board" 
        value={stop.stats.pickedUp} 
        bgClass="bg-emerald-100" 
        colorClass="text-emerald-700" 
      />
    )}

    {/* Dropped Off */}
    {stop.stats.droppedOff > 0 && (
      <StatBadge 
        icon={LogOut} 
        label="Dropped" 
        value={stop.stats.droppedOff} 
        bgClass="bg-blue-100" 
        colorClass="text-blue-700" 
      />
    )}

    {/* Pending / Waiting */}
    {stop.stats.pending > 0 && (
       <StatBadge 
         icon={Clock} 
         label="Waiting" 
         value={stop.stats.pending} 
         bgClass="bg-amber-100" 
         colorClass="text-amber-700" 
       />
    )}

     {/* Absent */}
     {stop.stats.absent > 0 && (
       <StatBadge 
         icon={AlertCircle} 
         label="Absent" 
         value={stop.stats.absent} 
         bgClass="bg-red-100" 
         colorClass="text-red-700" 
       />
    )}
  </div>
)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RideCard;

const StatBadge = ({ icon: Icon, label, value, colorClass, bgClass }) => (
  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border ${bgClass} ${colorClass} border-transparent bg-opacity-50`}>
    {/* الأيقونة */}
    <Icon size={11} strokeWidth={2.5} />
    
    {/* الاسم (Label) */}
    <span className="text-[9px] font-medium uppercase tracking-wide opacity-80">
      {label}
    </span>
    
    {/* الفاصل الرأسي الصغير (اختياري للجمالية) */}
    <span className="w-[1px] h-2 bg-current opacity-20"></span>

    {/* الرقم */}
    <span className="text-[10px] font-bold">
      {value}
    </span>
  </div>
);