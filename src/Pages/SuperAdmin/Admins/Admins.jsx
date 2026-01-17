import React, { useState } from "react";
import useGet from "@/hooks/useGet";
import useDelete from "@/hooks/useDelete";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/Components/UI/button";
import ConfirmModal from "@/Components/UI/ConfirmModal";

const Admins = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const { data, loading, refetch } = useGet("/api/superadmin/subadmins");
  const { deleteData } = useDelete("/api/superadmin/subadmins");

  const columns = [
    { header: "Name", key: "name" },
    { header: "Email", key: "email" },
    { header: "Role", key: "roleName" },
    { header: "Status", key: "status" },
  ];

  const tableData =
    data?.data?.subAdmins?.map((admin) => ({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      roleName: admin.roleDetails?.name || "-",
      status: admin.status,
      createdAt: new Date(admin.createdAt).toLocaleDateString(),
    })) || [];

  const handleDelete = async () => {
    try {
      await deleteData(`/api/superadmin/subadmins/${selectedId}`);
      refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setOpenDelete(false);
      setSelectedId(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  return (
    <div className="p-10 bg-background min-h-screen">
      <ReusableTable
        title="Sub Admins Management"
        titleAdd="Sub Admin"
        columns={columns}
        data={tableData}
        onAddClick={() => navigate("add")}
        renderActions={(row) => (
          <div className="flex gap-2 items-center">
            <Button
              variant="edit"
              size="sm"
              onClick={() => navigate(`edit/${row.id}`)}
            >
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
        title="Delete Sub Admin"
        description="Are you sure you want to delete this sub admin? This action cannot be undone."
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Admins;
