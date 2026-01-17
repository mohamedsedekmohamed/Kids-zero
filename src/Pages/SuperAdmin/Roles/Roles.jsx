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

const Roles = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const { data: getRoles, loading, refetch } = useGet("/api/superadmin/roles");
  const { deleteData: deleteRole } = useDelete("/api/superadmin/roles");
  const { putData } = usePut("");

  const columns = [
    { header: "Role Name", key: "name" },
  ];

  const tableData =
    getRoles?.data?.roles?.map((role) => ({
      id: role.id,
      name: role.name,
      status: role.status || "active",
    })) || [];

  const handleDelete = async () => {
    try {
      await deleteRole(`/api/superadmin/roles/${selectedId}`);
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
      await putData({ status: newStatus }, `/api/superadmin/roles/${row.id}`, "Status updated!");
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"> <Loading />  </div>


  return (
    <div className="p-10 bg-background min-h-screen">
      <ReusableTable
        title="Roles Management"
        titleAdd="Role"
        columns={columns}
        data={tableData}
        onAddClick={() => navigate("add")}
        renderActions={(row) => (
          <div className="flex gap-2 items-center">
            <Button variant="edit" size="sm" onClick={() => navigate(`edit/${row.id}`)}>
              <Pencil className="size-4" />
            </Button>
              <StatusSwitch
              checked={row.status === "active"}
              onChange={() => handleToggleStatus(row)}
            />
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
        title="Delete Role"
        description="Are you sure you want to delete this role? This action cannot be undone."
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Roles;
