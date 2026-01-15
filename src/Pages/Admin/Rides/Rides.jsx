import React, { useState } from "react";
import useGet from "@/hooks/useGet";
import useDelete from "@/hooks/useDelete";
import usePut from "@/hooks/usePut";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/Components/UI/button";
import ConfirmModal from "@/Components/UI/ConfirmModal";

const Rides = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // all | upcoming | current | past
  const navigate = useNavigate();

  const { data: getRides, loading, refetch } = useGet("/api/admin/rides");
  const { deleteData: deleteRide } = useDelete("/api/admin/rides");
  const { putData } = usePut("");

  // ✅ الأعمدة
  const columns = [
    { header: "Ride Name", key: "name" },
    { header: "Bus", key: "busNumber" },
    { header: "Driver", key: "driverName" },
    { header: "Route", key: "routeName" },
    { header: "Type", key: "rideType" },
    { header: "Frequency", key: "frequency" },
    { header: "Start Date", key: "startDate" },
    { header: "End Date", key: "endDate" },
  ];

  // ✅ تجهيز الداتا للجدول
  const tableData =
    getRides?.data?.all?.map((ride) => ({
      id: ride.id,
      name: ride.name,
      rideType: ride.type,
      frequency: ride.frequency,
     startDate: ride.startDate ? new Date(ride.startDate).toLocaleDateString("en-GB") : "-",
    endDate: ride.endDate ? new Date(ride.endDate).toLocaleDateString("en-GB") : "-",
      status: ride.status,
      busNumber: ride.bus?.busNumber || "-",
      driverName: ride.driver?.name || "-",
      routeName: ride.route?.name || "-",
      isActive: ride.isActive,
    })) || [];

  // ✅ فلترة الداتا حسب التاب
  const filteredRides = tableData.filter((ride) => {
    if (!getRides) return [];
    if (activeTab === "all") return true;
    if (activeTab === "upcoming") return getRides.data.upcoming.some((r) => r.id === ride.id);
    if (activeTab === "current") return getRides.data.current.some((r) => r.id === ride.id);
    if (activeTab === "past") return getRides.data.past.some((r) => r.id === ride.id);
    return [];
  });

  // ✅ Delete
  const handleDelete = async () => {
    try {
      await deleteRide(`/api/admin/rides/${selectedId}`);
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setOpenDelete(false);
      setSelectedId(null);
    }
  };

  // ✅ Edit
  const handleEdit = (row) => {
    navigate(`edit/${row.id}`);
  };


  // ✅ Change Status
  const handleChangeStatus = async (id, status) => {
    if(status==="")return
    try {
      await putData({ status }, `/api/admin/rides/${id}`, "Status updated!");
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">
     <Loading />
  </div>;

  return (
    <div className="p-10 bg-background min-h-screen">
      {/* Tabs */}
      <div className="flex w-full justify-center  gap-3 mb-6">
        {["all", "upcoming", "current", "past"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
        ${
          activeTab === tab
            ? "bg-one text-white"
            : "bg-one/50 text-four hover:bg-muted/70"
        }
      `}
    >
            {tab === "all" && `All (${getRides?.data?.summary?.total || 0})`}
            {tab === "upcoming" && `Upcoming (${getRides?.data?.summary?.upcoming || 0})`}
            {tab === "current" && `Current (${getRides?.data?.summary?.current || 0})`}
            {tab === "past" && `Past (${getRides?.data?.summary?.past || 0})`}
          </button>
        ))}
      </div>
  <button onClick={()=>navigate("scheduling")} className="px-4 py-2 rounded-full text-sm font-medium transition
   w-full bg-one text-white hover:bg-one/80">
   Scheduling Upcoming
                        </button>

      {/* جدول الرحلات */}
      <ReusableTable
        title={`Rides - ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
        titleAdd="Ride"
        columns={columns}
        data={filteredRides}
        onAddClick={() => navigate("add")}
        renderActions={(row) => (
          <div className="flex gap-2 items-center">
            <select
              value={row.status}
              onChange={(e) => handleChangeStatus(row.id, e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="">Select</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
        
          
           <Button variant="edit" size="sm" onClick={() => handleEdit(row)}>
              <Pencil className="size-4" />
              Edit
            </Button>
            <Button
              variant="delete"
              size="sm"
              onClick={() => {
                setSelectedId(row.id);
                setOpenDelete(true);
              }}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          </div>
        )}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={openDelete}
        title="Delete Ride"
        description="Are you sure you want to delete this ride? This action cannot be undone."
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Rides;
