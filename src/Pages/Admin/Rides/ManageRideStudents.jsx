import React from "react";
import { useParams } from "react-router-dom";
import useGet from "@/hooks/useGet";
import Loading from "@/Components/Loading";
import { MapPin } from "lucide-react";

const StatusBadge = ({ status }) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-700",
    pickedUp: "bg-green-100 text-green-700",
    absent: "bg-red-100 text-red-700",
    excused: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        colors[status] || "bg-gray-100"
      }`}
    >
      {status}
    </span>
  );
};

const ManageRideStudents = () => {
  const { id } = useParams();
  const { data, loading } = useGet(`api/admin/rides/occurrence/${id}`);

  // ✅ لو البيانات لسه جايه أو مش موجودة
  if (loading || !data?.data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  const { ride, bus, driver, codriver, route, stats, students } = data.data;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* ================= Ride Info ================= */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-xl font-bold mb-2">{ride.name}</h2>
        <p className="text-gray-500">
          Type: {ride.type} • Status:{" "}
          <span className="font-semibold">{ride.status}</span>
        </p>
      </div>

      {/* ================= Driver & Bus ================= */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">🚌 Bus</h3>
          <p>Number: {bus.busNumber}</p>
          <p>Plate: {bus.plateNumber}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">👨‍✈️ Driver</h3>
          <p>{driver.name}</p>
          <p className="text-gray-500">{driver.phone}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">👤 Co-Driver</h3>
          <p>{codriver?.name || "—"}</p>
          <p className="text-gray-500">{codriver?.phone || ""}</p>
        </div>
      </div>

      {/* ================= Stats ================= */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div
            key={key}
            className="bg-white rounded-xl shadow p-4 text-center"
          >
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-gray-500 capitalize">{key}</p>
          </div>
        ))}
      </div>

      {/* ================= Students Table ================= */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Pickup Point</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.all.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={item.student.avatar}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{item.student.name}</p>
                    <p className="text-gray-500 text-xs">
                      Parent: {item.parent.name}
                    </p>
                  </div>
                </td>

                <td className="p-3">
                  {item.student.grade} - {item.student.classroom}
                </td>

                <td className="p-3">
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin size={14} />
                    {item.pickupPoint.name}
                  </div>
                </td>

                <td className="p-3">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageRideStudents;
