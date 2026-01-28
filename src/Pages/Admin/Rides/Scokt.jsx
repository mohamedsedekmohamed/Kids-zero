import { useEffect, useRef } from "react";
import L from "leaflet";
import { io } from "socket.io-client";
import "leaflet/dist/leaflet.css";
import { getToken } from "@/utils/auth";

// 🛠️ حل مشكلة اختفاء أيقونة الماركر في Leaflet مع React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function LiveLocationMap() {
  const token = getToken();
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const socketRef = useRef(null);

  const rideId = "c40deb89-0042-4e70-a4d4-db4ccfb1b02b";

  useEffect(() => {
    // 1. 🗺️ تهيئة الخريطة
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([31.2109, 29.9424], 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(mapRef.current);
    }

    // 2. 🔌 إعداد السوكيت
    socketRef.current = io("https://Bcknd.Kidsero.com", {
      transports: ["websocket"],
      auth: {
        token: token,
      },
      // ⚠️ تصحيح: مسحت الـ Hardcoded Token وحطيت المتغير الصح
      extraHeaders: {
        Authorization: `Bearer ${token}`, 
      },
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Connected! Socket ID:", socketRef.current.id);
      socketRef.current.emit("joinRide", rideId);
    });

    // 3. 👂 استقبال التحديثات ورسم الماركر
    socketRef.current.on("locationUpdate", (data) => {
      console.log("📍 New Location:", data);

      if (data && data.lat && data.lng) {
        const { lat, lng } = data;

        // رسم الماركر لو مش موجود
        if (!markerRef.current) {
          markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
          
          // إضافة Popup عشان تتأكد إنه موجود
          markerRef.current.bindPopup("Saa'eq (Driver)").openPopup(); 
        } else {
          // تحريك الماركر
          markerRef.current.setLatLng([lat, lng]);
        }

        // تحريك الكاميرا
        mapRef.current.panTo([lat, lng], { animate: true });
      } else {
        console.warn("⚠️ Received data but missing lat/lng", data);
      }
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("❌ Connection Error:", err.message);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div id="map" style={{ height: "100vh", width: "100%" }} />;
}