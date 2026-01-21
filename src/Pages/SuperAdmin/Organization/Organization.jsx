import React, { useState } from "react";
import useGet from "@/hooks/useGet";
import useDelete from "@/hooks/useDelete";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/Components/UI/button";
import ConfirmModal from "@/Components/UI/ConfirmModal";
import { can } from "@/utils/can";

const Organization = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("superAdmin"));

  // ✅ GET Organizations
  const { data: orgsData, loading, refetch } = useGet("/api/superadmin/organizations");

  // ✅ DELETE Organization
  const { deleteData: deleteOrg } = useDelete("/api/superadmin/organizations");

  // ✅ Table columns
  const columns = [
    { header: "Name", key: "name" },
    { header: "Email", key: "email" },
    { header: "Phone", key: "phone" },
    { header: "Type", key: "organizationType" },
    { header: "Status", key: "status" },

  ];

  // ✅ Prepare table data
  const tableData =
    orgsData?.data?.orgs?.map((org) => ({
      id: org.id,
      name: org.name,
      email: org.email,
      phone: org.phone,
      organizationType: org.organizationType?.name || "-",
      status: org.status,
      createdAt: new Date(org.createdAt).toLocaleDateString(),
      updatedAt: new Date(org.updatedAt).toLocaleDateString(),
    })) || [];

  // ✅ Delete handler
  const handleDelete = async () => {
    try {
      await deleteOrg(`/api/superadmin/organizations/${selectedId}`);
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
        title="Organizations"
        titleAdd="Organization"
        columns={columns}
        data={tableData}
          viewAdd={can(user, "organizations", "create")}
        onAddClick={() => navigate("add")}
        renderActions={(row) => (
          <div className="flex gap-2 items-center">
                         {can(user, "organizations", "update") && (
            
            <Button variant="edit" size="sm" onClick={() => handleEdit(row)}>
              <Pencil className="size-4" /> Edit
            </Button>
                          )}  
              {can(user, "organizations", "delete") && (

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
                         )} 

          </div>
        )}
      />

      <ConfirmModal
        open={openDelete}
        title="Delete Organization"
        description="Are you sure you want to delete this organization?"
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Organization;
