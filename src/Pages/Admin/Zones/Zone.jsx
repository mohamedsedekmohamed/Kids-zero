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


const Zone = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const { data: getZones , loading, refetch } = useGet("/api/admin/zones");
  const { deleteData: deleteDepartment } = useDelete("/api/admin/zones");

  // تعريف الأعمدة
  const columns = [
    { header: "Zone ", key: "name" },
    { header: "City ", key: "city" },
    { header: "Cost", key: "cost" },
  ];

  const tableData =
    getZones?.data?.zones?.map((dept) => ({
      id: dept.id,
      name: dept.name,
      city: dept.city?.name,
      cost: dept.cost,
    })) || [];

  const handleDelete = async () => {
    try {
      await deleteDepartment(`/api/admin/zones/${selectedId}`);
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
        title="Zone Management"
        titleAdd="Zone"
        columns={columns}
        data={tableData}
        onAddClick={() => navigate("add")}
        renderActions={(row) => (
          <div className="flex gap-2 items-center">
            

            <Button variant="edit" size="sm" onClick={() => navigate(`edit/${row.id}`)}>
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

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={openDelete}
        title="Delete Zone"
        description="Are you sure you want to delete this Zone? This action cannot be undone."
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};



export default Zone