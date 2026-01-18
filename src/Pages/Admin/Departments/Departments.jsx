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

const Departments = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const { data: getDepartments, loading, refetch } = useGet("/api/admin/departments");
  const { deleteData: deleteDepartment } = useDelete("/api/admin/departments");

  // تعريف الأعمدة
  const columns = [
    { header: "Department Name", key: "name" },
  ];

  const tableData =
    getDepartments?.data?.departments?.map((dept) => ({
      id: dept.id,
      name: dept.name,
    })) || [];

  const handleDelete = async () => {
    try {
      await deleteDepartment(`/api/admin/departments/${selectedId}`);
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setOpenDelete(false);
      setSelectedId(null);
    }
  };



  if (loading) return <div className="flex justify-center items-center h-screen"> <Loading />  </div>

  return (
    <div className="p-10 bg-background min-h-screen">
      <ReusableTable
        title="Departments Management"
        titleAdd="Department"
        columns={columns}
        data={tableData}
          viewAdd={can(user, "departments", "Add")}
        onAddClick={() => navigate("add")}
        renderActions={(row) => (
          <div className="flex gap-2 items-center">
        
  {can(user, "departments", "Edit") && (

            <Button variant="edit" size="sm" onClick={() => navigate(`edit/${row.id}`)}>
              <Pencil className="size-4" />
            </Button>
)}  
  {can(user, "departments", "Delete") && (
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

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={openDelete}
        title="Delete Department"
        description="Are you sure you want to delete this department? This action cannot be undone."
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Departments;
