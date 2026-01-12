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

const Admins = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  // ✅ جلب بيانات الادمنز
  const {
    data: getAdmins,
    loading,
    error,
    refetch,
  } = useGet("/api/admin/admins");

  const { deleteData: deleteAdmin, loading: loadingDelete } =
    useDelete("/api/admin/admins");

  const { putData } = usePut(""); // PUT مع URL مخصص لكل صف

  // ✅ اعمدة الجدول
  const columns = [
    { header: "Name", key: "name" },
    { header: "Email", key: "email" },
    { header: "Phone", key: "phone" },
    { header: "Type", key: "type" },
  ];

  const tableData =
    getAdmins?.data?.admins?.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      status: item.status,
      type: item.type,
      avatar: item.avatar,
    })) || [];

  const handleDelete = async () => {
    try {
      await deleteAdmin(`/api/admin/admins/${selectedId}`);
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

  const handleToggleStatus = async (row) => {
    const newStatus = row.status === "active" ? "inactive" : "active";
    try {
      await putData(
        { status: newStatus },
        `/api/admin/admins/${row.id}`,
        "Status updated!"
      );
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-10 bg-background min-h-screen">
      <ReusableTable
        title="Admins"
        titleAdd="Admin"
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
        renderplus={(row) => (
          <div className="flex gap-2">
            <img
              src={row.avatar || "/default-avatar.png"}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
          </div>
        )}
      />
      <ConfirmModal
        open={openDelete}
        title="Delete Admin"
        description="Are you sure you want to delete this admin? This action cannot be undone."
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Admins;
