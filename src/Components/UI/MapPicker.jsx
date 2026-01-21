import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationMarker = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
};

const MapPicker = ({ lat, lng, onChange }) => {
const position = lat && lng ? [lat, lng] : [31.2001, 29.9187];

  return (
    <MapContainer
      center={position}
      zoom={13}
      className="rounded-xl"
      style={{ height: '100%', width: '100%' }} 
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker
        setPosition={(pos) => onChange(pos.lat, pos.lng)}
      />

      {lat && lng && (
        <Marker position={[lat, lng]} icon={icon} />
      )}
    </MapContainer>
  );
};

export default MapPicker;
