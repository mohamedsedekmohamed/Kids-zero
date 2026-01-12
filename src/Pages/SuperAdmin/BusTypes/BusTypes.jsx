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

const BusTypes = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  // ✅ GET Bus Types
  const {
    data: getBusTypes,
    loading,
    refetch,
  } = useGet("/api/superadmin/bustypes");

  // ✅ DELETE
  const { deleteData: deleteBusType } =
    useDelete("/api/superadmin/bustypes");

  // ✅ UPDATE (Status)
  const { putData } = usePut("");

  // ✅ Table columns
  const columns = [
    { header: "Name", key: "name" },
    { header: "Capacity", key: "capacity" },
    { header: "Description", key: "description" },
  ];

  // ✅ Table data
  const tableData =
    getBusTypes?.data?.busTypes?.map((item) => ({
      id: item.id,
      name: item.name,
      capacity: item.capacity,
      description: item.description,
      status: item.status,
    })) || [];

  // ✅ Delete handler
  const handleDelete = async () => {
    try {
      await deleteBusType(`/api/superadmin/bustypes/${selectedId}`);
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

  // ✅ Toggle status
  const handleToggleStatus = async (row) => {
    const newStatus = row.status === "active" ? "inactive" : "active";
    try {
      await putData(
        { status: newStatus },
        `/api/superadmin/bustypes/${row.id}`,
        "Status updated!"
      );
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return    
   <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>;

  return (
    <div className="p-10 bg-background min-h-screen">
      <ReusableTable
        title="Bus Types"
        titleAdd="Bus Type"
        columns={columns}
        data={tableData}
        onAddClick={() => navigate("add")}
        renderActions={(row) => (
          <div className="flex gap-2 items-center">
            <StatusSwitch
              checked={row.status === "active"}
              onChange={() => handleToggleStatus(row)}
            />
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

      <ConfirmModal
        open={openDelete}
        title="Delete Bus Type"
        description="Are you sure you want to delete this bus type?"
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default BusTypes;
