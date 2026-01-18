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

const City = () => {
    const user = JSON.parse(localStorage.getItem("user"));

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const { data: getCity , loading, refetch } = useGet("/api/admin/cities");
  const { deleteData: deleteDepartment } = useDelete("/api/admin/cities");

  // تعريف الأعمدة
  const columns = [
    { header: "City Name", key: "name" },
  ];

  const tableData =
    getCity?.data?.cities?.map((dept) => ({
      id: dept.id,
      name: dept.name,
    })) || [];

  const handleDelete = async () => {
    try {
      await deleteDepartment(`/api/admin/cities/${selectedId}`);
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
        title="City Management"
        titleAdd="City"
        columns={columns}
        data={tableData}
                viewAdd={can(user, "city", "Add")}
        
        onAddClick={() => navigate("add")}
        renderActions={(row) => (
          <div className="flex gap-2 items-center">
            
  {can(user, "city", "Edit") && (

            <Button variant="edit" size="sm" onClick={() => navigate(`edit/${row.id}`)}>
              <Pencil className="size-4" />
            </Button>
            )}
              {can(user, "city", "Delete") && (
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
        title="Delete City"
        description="Are you sure you want to delete this City? This action cannot be undone."
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};


export default City