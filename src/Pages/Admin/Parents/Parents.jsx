import React, { useState } from "react";
import useGet from "@/hooks/useGet";
import useDelete from "@/hooks/useDelete";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/Components/UI/button";
import ConfirmModal from "@/Components/UI/ConfirmModal";
import StatusSwitch from "@/Components/UI/StatusSwitch";
import usePut from "@/hooks/usePut";

const Parents = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  // ✅ Correct endpoint
  const {
    data: getParents,
    loading,
    error,
    refetch,
  } = useGet("/api/admin/parents");

  const { deleteData: deleteParent, loading: loadingDelete } =
    useDelete("/api/admin/parents");
const { putData } = usePut(""); // بدون selectedId

  // ✅ Correct columns
  const columns = [
    { header: "Name", key: "name" },
    { header: "Phone", key: "phone" },
    { header: "address", key: "address" },
    { header: "nationalId", key: "nationalId" },
  ];
  const tableData =
    getParents?.data?.parents?.map((item) => ({
      id: item.id,
      name: item.name,
      phone: item.phone,
      status: item.status,
      address: item.address,
      nationalId: item.nationalId,
      avatar: item.avatar,
    })) || [];

  const handleDelete = async () => {
    try {
      await deleteParent(`/api/admin/parents/${selectedId}`);
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
    // نستخدم customUrl هنا
    await putData(
      { status: newStatus }, // body
      `/api/admin/parents/${row.id}`, // URL مخصص لكل صف
      "Status updated!" // رسالة Toast
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
        title="Parents"
        titleAdd="Parents"
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
              src={row.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
          </div>
        )}
      />
      <ConfirmModal
        open={openDelete}
        title="Delete Parent"
        description="Are you sure you want to delete this parent? This action cannot be undone."
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Parents;
