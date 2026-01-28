import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { io } from "socket.io-client";
import "leaflet/dist/leaflet.css";
import { getToken } from "@/utils/auth";
import { useParams, useLocation } from "react-router-dom";

// =========================================
// 🚌 1️⃣ إعداد أيقونة الأتوبيس
// =========================================
// لو الصورة عندك في المشروع (الأفضل):
// import busImage from "@/assets/bus-marker.png"; 

// للتجربة السريعة (رابط خارجي):
const busImage = "https://cdn-icons-png.flaticon.com/512/3448/3448339.png";

// تعريف كائن الأيقونة
const BusIcon = L.icon({
  iconUrl: busImage,
  iconSize: [40, 40], // حجم الأيقونة [عرض, طول] - عدله حسب صورتك
  iconAnchor: [20, 20], // النقطة اللي بتشاور على المكان بالظبط (نص العرض ونص الطول عشان تبقى في السنتر)
  popupAnchor: [0, -20], // مكان ظهور الـ Popup بالنسبة للأيقونة
  // shadowUrl: 'مسار الضل لو عايز',
});

export default function LiveLocationMap() {
  const token = getToken();
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const socketRef = useRef(null);
  const { id } = useParams();
  const rideId = id;

  const location = useLocation();
  const { currentLocation } = location.state || {};

  const initialLat = currentLocation?.lat || 31.2109;
  const initialLng = currentLocation?.lng || 29.9424;

  const [hasStarted, setHasStarted] = useState(!!(currentLocation?.lat && currentLocation?.lng));

  useEffect(() => {
    // 🗺️ تهيئة الخريطة
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([initialLat, initialLng], 15);
      
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(mapRef.current);

      // ✅ رسم الماركر الابتدائي (لو اللوكيشن موجود)
      if (currentLocation?.lat && currentLocation?.lng) {
        // 🚌 2️⃣ استخدام أيقونة الأتوبيس هنا
        markerRef.current = L.marker([initialLat, initialLng], { icon: BusIcon }).addTo(mapRef.current);
        markerRef.current.bindPopup("Bus Location").openPopup();
      }
    }

    // 🔌 إعداد السوكيت
    socketRef.current = io("https://Bcknd.Kidsero.com", {
      transports: ["websocket"],
      auth: { token: token },
      extraHeaders: { Authorization: `Bearer ${token}` },
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Connected!");
      socketRef.current.emit("joinRide", rideId);
    });

    // 👂 استقبال التحديثات
    socketRef.current.on("locationUpdate", (data) => {
      console.log("📍 Live Update:", data);

      if (data && data.lat && data.lng) {
        setHasStarted(true);
        const { lat, lng } = data;

        if (markerRef.current) {
            // تحريك الماركر الموجود
            markerRef.current.setLatLng([lat, lng]);
        } else {
            // رسم ماركر جديد (في حالة عدم وجود لوكيشن ابتدائي)
            // 🚌 3️⃣ وبرضه لازم نستخدم أيقونة الأتوبيس هنا
            markerRef.current = L.marker([lat, lng], { icon: BusIcon }).addTo(mapRef.current);
            markerRef.current.bindPopup("Bus Location").openPopup();
        }

        mapRef.current.panTo([lat, lng], { animate: true });
      }
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [rideId, token]);

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      {!hasStarted && (
        <div
          style={{
            position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 1000,
            backgroundColor: "rgba(255, 255, 255, 0.9)", padding: "10px 20px", borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)", fontWeight: "bold", color: "#d9534f",
          }}
        >
          🚦 جاري الاتصال بالأتوبيس...
        </div>
      )}
      <div id="map" style={{ height: "100%", width: "100%" }} />
    </div>
  );
}