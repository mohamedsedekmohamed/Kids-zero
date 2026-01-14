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
import StatusSwitch from "@/Components/UI/StatusSwitch";

const Buses = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();


  const { data: getBuses, loading, refetch } = useGet("/api/admin/buses");
  const { deleteData: deleteBus } = useDelete("/api/admin/buses");
  const { putData } = usePut("");

  // ✅ تعريف الأعمدة مع Render مخصص للصور
  const columns = [
    {
      header: "Bus Info",
      key: "busImage",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.busImage}
            alt="bus"
            className="w-12 h-12 rounded object-cover border shadow-sm"
          />
          <div>
            <div className="font-medium">{row.busNumber}</div>
            <div className="text-sm text-muted">{row.plateNumber}</div>
          </div>
        </div>
      ),
    },
    { header: "Max Seats", key: "maxSeats" },
    { header: "License No.", key: "licenseNumber" },
    {
      header: "License",
      key: "licenseImage",
      render: (_, row) => (
        <div className="group relative">
          <img
            src={row.licenseImage}
            alt="license"
            className="w-8 h-8 rounded border hover:scale-110 transition-transform cursor-pointer"
          />
          <span className="absolute -top-8 left-0 bg-black text-white text-[10px] px-1 rounded hidden group-hover:block">
            License
          </span>
        </div>
      ),
    },
    { header: "License Expiry", key: "licenseExpiryDate" },
    { header: "Bus Type", key: "busTypeName" },
  ];

  const tableData =
    getBuses?.data?.buses?.map((bus) => ({
      id: bus.id,
      busNumber: bus.busNumber,
      plateNumber: bus.plateNumber,
      maxSeats: bus.maxSeats,
      licenseNumber: bus.licenseNumber,
      licenseExpiryDate: new Date(bus.licenseExpiryDate).toLocaleDateString(
        "en-GB"
      ),
      busImage: bus.busImage,
      licenseImage: bus.licenseImage,
      status: bus.status,
      busTypeName: bus.busType?.name || "-",
    })) || [];

  const handleDelete = async () => {
    try {
      await deleteBus(`/api/admin/buses/${selectedId}`);
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setOpenDelete(false);
      setSelectedId(null);
    }
  };

  const handleToggleStatus = async (row) => {
    const newStatus = row.status === "active" ? "inactive" : "active";
    try {
      await putData({ status: newStatus }, `/api/admin/buses/${row.id}`, "Status updated!");
      refetch();
    } catch (err) {
      console.error(err);
    }
  };
const [activeTab, setActiveTab] = useState("all"); // all | active | inactive
const filteredData = tableData.filter((bus) => {
  if (activeTab === "all") return true;
  return bus.status === activeTab;
});

  if (loading) return <div className="flex justify-center items-center h-screen"> <Loading />  </div>


  return (
    <div className="  min-h-screen">
      <div className="flex w-full justify-center  gap-3 mb-2">
  {["all", "active", "inactive"].map((tab) => (
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
      {tab === "all" && "All Buses"}
      {tab === "active" && "Active"}
      {tab === "inactive" && "Inactive"}
    </button>
  ))}
</div>

      <ReusableTable
        title="Buses Management"
        titleAdd="Bus"
        columns={columns}
data={filteredData}
        onAddClick={() => navigate("add")}
        renderActions={(row) => (
          <div className="flex gap-2 items-center">
            <StatusSwitch
              checked={row.status === "active"}
              onChange={() => handleToggleStatus(row)}
            />
            <Button variant="edit" size="sm" onClick={() => navigate(`edit/${row.id}`)}>
              <Pencil className="size-4" />
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
            </Button>
          </div>
        )}
      />

      <ConfirmModal
        open={openDelete}
        title="Delete Bus"
        description="Are you sure you want to delete this bus? This action cannot be undone."
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Buses;
