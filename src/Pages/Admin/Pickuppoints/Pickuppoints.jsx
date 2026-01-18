import React, { useState } from "react";
import useGet from "@/hooks/useGet";
import useDelete from "@/hooks/useDelete";
import usePut from "@/hooks/usePut";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil, MapPin } from "lucide-react";
import { Button } from "@/Components/UI/button";
import ConfirmModal from "@/Components/UI/ConfirmModal";
import StatusSwitch from "@/Components/UI/StatusSwitch";
import { can } from "@/utils/can";

const Pickuppoints = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const { data, loading, refetch } = useGet("/api/admin/pickuppoints");
  const { deleteData } = useDelete("/api/admin/pickuppoints");
  const { putData } = usePut("");

  /* ================= Columns ================= */
  const columns = [
    { header: "Name", key: "name" },
    { header: "Address", key: "address" },
    {
      header: "Location",
      key: "map",
      render: (_, row) => (
        <a
          href={`https://www.google.com/maps?q=${row.lat},${row.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-primary hover:underline"
        >
          <MapPin className="size-4" />
          View Map
        </a>
      ),
    },
  ];

  /* ================= Table Data ================= */
  const tableData =
    data?.data?.pickupPoints?.map((item) => ({
      id: item.id,
      name: item.name,
      address: item.address,
      lat: item.lat,
      lng: item.lng,
      status: item.status,
    })) || [];

  /* ================= Handlers ================= */
  const handleDelete = async () => {
    try {
      await deleteData(`/api/admin/pickuppoints/${selectedId}`);
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
      await putData(
        { status: newStatus },
        `/api/admin/pickuppoints/${row.id}`,
        "Status updated!",
      );
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        {" "}
        <Loading />{" "}
      </div>
    );

  return (
    <div className="p-10 bg-background min-h-screen">
      <ReusableTable
        title="Pickup Points Management"
        titleAdd="Pickup Point"
        columns={columns}
        data={tableData}
        viewAdd={can(user, "pickup_points", "Add")}
        onAddClick={() => navigate("add")}
        renderActions={(row) => (
          <div className="flex gap-2 items-center">
            {can(user, "pickup_points", "Status") && (
              <StatusSwitch
                checked={row.status === "active"}
                onChange={() => handleToggleStatus(row)}
              />
            )}
            {can(user, "pickup_points", "Edit") && (
              <Button
                variant="edit"
                size="sm"
                onClick={() => navigate(`edit/${row.id}`)}
              >
                <Pencil className="size-4" />
              </Button>
            )}
            {can(user, "pickup_points", "Delete") && (
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
            )}
          </div>
        )}
      />

      <ConfirmModal
        open={openDelete}
        title="Delete Pickup Point"
        description="Are you sure you want to delete this pickup point? This action cannot be undone."
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Pickuppoints;
