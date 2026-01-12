import React, { useState } from "react";
import useGet from "@/hooks/useGet";
import useDelete from "@/hooks/useDelete";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/Components/UI/Button";
import ConfirmModal from "@/Components/UI/ConfirmModal";

const OrganizationTypes = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  // ✅ GET Organization Types
  const {
    data: orgTypesData,
    loading,
    refetch,
  } = useGet("/api/superadmin/organizations/types");

  // ✅ DELETE
  const { deleteData: deleteOrgType } = useDelete("/api/superadmin/organizations/types");

  // ✅ Table columns
  const columns = [
    { header: "Name", key: "name" },
    { header: "Created At", key: "createdAt" },
    { header: "Updated At", key: "updatedAt" },
  ];

  // ✅ Table data
  const tableData =
    orgTypesData?.data?.orgTypes?.map((item) => ({
      id: item.id,
      name: item.name,
      createdAt: new Date(item.createdAt).toLocaleDateString(),
      updatedAt: new Date(item.updatedAt).toLocaleDateString(),
    })) || [];

  // ✅ Delete handler
  const handleDelete = async () => {
    try {
      await deleteOrgType(`/api/superadmin/organizations/types/${selectedId}`);
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setOpenDelete(false);
      setSelectedId(null);
    }
  };

  // ✅ Edit handler
  const handleEdit = (row) => {
    navigate(`edit/${row.id}`);
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
        title="Organization Types"
        titleAdd="Organization Type"
        columns={columns}
        data={tableData}
        onAddClick={() => navigate("add")}
        renderActions={(row) => (
          <div className="flex gap-2 items-center">
            <Button variant="edit" size="sm" onClick={() => handleEdit(row)}>
              <Pencil className="size-4" /> Edit
            </Button>
            <Button
              variant="delete"
              size="sm"
              onClick={() => {
                setSelectedId(row.id);
                setOpenDelete(true);
              }}
            >
              <Trash2 className="size-4" /> Delete
            </Button>
          </div>
        )}
      />

      <ConfirmModal
        open={openDelete}
        title="Delete Organization Type"
        description="Are you sure you want to delete this organization type?"
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default OrganizationTypes;
