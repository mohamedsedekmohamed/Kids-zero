import React, { useState, useMemo } from "react";
import useGet from "@/hooks/useGet";
import useDelete from "@/hooks/useDelete";
import usePut from "@/hooks/usePut";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/Components/UI/button";
import ConfirmModal from "@/Components/UI/ConfirmModal";
import { can } from "@/utils/can";
import RideCard from "./RideCard";

const Rides = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const endpoint = activeTab === "current" ? "/api/admin/rides/current" : "/api/admin/rides";
  
  // ✅ إضافة fallback للداتا لتجنب الأخطاء أثناء التحميل
  const { data: getRides, loading, refetch } = useGet(endpoint, [endpoint]);
  
  const { deleteData: deleteRide } = useDelete("/api/admin/rides");
  const { putData } = usePut("");

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

  // ✅ إصلاح 1: فحص البيانات داخل الـ Map لتجنب الخطأ
  const tableData = useMemo(() => {
    if (activeTab === "current" || !getRides?.data?.all) return [];

    return getRides.data.all.map((ride) => {
      // حماية إضافية في حال كان الأوبجكت فارغ
      if (!ride) return {}; 
      
      return {
        id: ride?.id,
        name: ride?.name,
        rideType: ride?.type,
        frequency: ride?.frequency,
        startDate: ride?.startDate ? new Date(ride.startDate).toLocaleDateString("en-GB") : "-",
        endDate: ride?.endDate ? new Date(ride.endDate).toLocaleDateString("en-GB") : "-",
        status: ride?.status,
        busNumber: ride?.bus?.busNumber || "-",
        driverName: ride?.driver?.name || "-",
        routeName: ride?.route?.name || "-",
        isActive: ride?.isActive,
      };
    });
  }, [getRides, activeTab]);

  const filteredRides = tableData.filter((ride) => {
    if (!getRides) return [];
    if (!ride?.id) return false; // تجاهل الصفوف التالفة
    if (activeTab === "all") return true;
    if (activeTab === "upcoming") return getRides.data.upcoming?.some((r) => r?.id === ride.id);
    if (activeTab === "past") return getRides.data.past?.some((r) => r?.id === ride.id);
    return [];
  });

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

  const handleEdit = (row) => {
    navigate(`edit/${row.id}`);
  };

  const handleChangeStatus = async (id, status) => {
    if (status === "") return;
    try {
      await putData({ status }, `/api/admin/rides/${id}`, "Status updated!");
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  const summary = getRides?.data?.summary || {};

  return (
    <div className="p-10 bg-background min-h-screen">
      {/* Tabs */}
      <div className="flex w-full justify-center gap-3 mb-6">
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
            {tab === "all" && "All"}
            {tab === "upcoming" && "Upcoming"}
            {tab === "current" && "Current"}
            {tab === "past" && "Past"}
            
            {tab === "all" && summary.total !== undefined && ` (${summary.total})`}
            {tab === "upcoming" && summary.upcoming !== undefined && ` (${summary.upcoming})`}
            {tab === "current" && summary.current !== undefined && ` (${summary.current})`}
            {tab === "past" && summary.past !== undefined && ` (${summary.past})`}
            {tab === "current" && activeTab === "current" && summary.total !== undefined && ` (${summary.total})`}
          </button>
        ))}
      </div>

      {can(user, "rides", "View") && (
        <button
          onClick={() => navigate("scheduling")}
          className="px-4 py-2 rounded-full text-sm font-medium transition w-full bg-one text-white hover:bg-one/80 mb-6"
        >
          Scheduling Upcoming
        </button>
      )}

      {/* ✅ إصلاح 2: إضافة ?. عند الوصول لـ Key الـ Map */}
      {activeTab === "current" ? (
        <div className="w-full">
            <h2 className="text-xl font-bold mb-4 text-one">Current Active Rides</h2>
            {getRides?.data?.rides && getRides.data.rides.length > 0 ? (
<div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 justify-items-stretch">
                {getRides.data.rides.map((rideItem, index) => (
                    // استخدمنا Optional Chaining هنا لمنع الكراش
                    // واستخدمنا index كبديل (Fallback) لو الـ id غير موجود
                    <RideCard 
                        key={rideItem?.occurrence?.id || index} 
                        data={rideItem} 
                    />
                ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                    <p className="text-gray-500 font-medium">No active rides at the moment.</p>
                </div>
            )}
        </div>
      ) : (
        <ReusableTable
          title={`Rides - ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
          titleAdd="Ride"
          columns={columns}
          data={filteredRides}
          viewAdd={can(user, "rides", "Add")}
          onAddClick={() => navigate("add")}
          renderActions={(row) => (
            <div className="flex gap-2 items-center">
              {can(user, "rides", "Status") && (
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
              )}

              {can(user, "rides", "Edit") && (
                <Button variant="edit" size="sm" onClick={() => handleEdit(row)}>
                  <Pencil className="size-4" />
                  Edit
                </Button>
              )}
              {can(user, "rides", "Delete") && (
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
              )}
            </div>
          )}
        />
      )}

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