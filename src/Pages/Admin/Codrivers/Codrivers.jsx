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
import { can } from "@/utils/can"; 

const Codrivers = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const { data: getCodrivers, loading, refetch } = useGet("/api/admin/codrivers");
  const { deleteData: deleteCodriver } = useDelete("/api/admin/codrivers");
  const { putData } = usePut("");

  /* ================= Columns ================= */
  const columns = [
    {
      header: "Co-Driver Info",
      key: "avatar",
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <img
            src={val}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border shadow-sm"
          />
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    { header: "Phone", key: "phone" },
    {
      header: "National ID Image",
      key: "nationalIdImage",
      render: (_, row) => (
        <div className="group relative">
          <img
            src={row.nationalIdImage}
            alt="ID"
            className="w-8 h-8 rounded border cursor-pointer hover:scale-110 transition"
          />
          <span className="absolute -top-8 left-0 bg-black text-white text-[10px] px-1 rounded hidden group-hover:block">
            National ID
          </span>
        </div>
      ),
    },
    { header: "National ID No.", key: "nationalId" },
  ];

  /* ================= Table Data ================= */
  const tableData =
    getCodrivers?.data?.codrivers?.map((item) => ({
      id: item.id,
      name: item.name,
      phone: item.phone,
      status: item.status,
      avatar: item.avatar,
      nationalId: item.nationalId,
      nationalIdImage: item.nationalIdImage,
    })) || [];

  /* ================= Handlers ================= */
  const handleDelete = async () => {
    try {
      await deleteCodriver(`/api/admin/codrivers/${selectedId}`);
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
        `/api/admin/codrivers/${row.id}`,
        "Status updated!"
      );
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"> <Loading />  </div>


  return (
    <div className="p-10 bg-background min-h-screen">
      <ReusableTable
        title="Co-Drivers Management"
        titleAdd="Co-Driver"
         viewAdd={can(user, "codrivers", "Add")}
        columns={columns}
        data={tableData}
        onAddClick={() => navigate("add")}
        renderActions={(row) => (
          <div className="flex gap-2 items-center">
              {can(user, "codrivers", "Status") && (
            
            <StatusSwitch
              checked={row.status === "active"}
              onChange={() => handleToggleStatus(row)}
            />
              )}
                {can(user, "codrivers", "Edit") && (
              
            <Button
              variant="edit"
              size="sm"
              onClick={() => navigate(`edit/${row.id}`)}
            >
              <Pencil className="size-4" />
            </Button>
                )}
                  {can(user, "codrivers", "Delete") && (
                
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
        title="Delete Co-Driver"
        description="Are you sure you want to delete this co-driver? This action cannot be undone."
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Codrivers;
