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
import { TfiInfo } from "react-icons/tfi";

const Drivers = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const { data: getDrivers, loading, refetch } = useGet("/api/admin/drivers");
  const { deleteData: deleteDriver } = useDelete("/api/admin/drivers");
  const { putData } = usePut("");

  // ✅ تعريف الأعمدة مع الـ Render المخصص للصور
  const columns = [
    {
      header: "Driver Info",
      key: "avatar",
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <img src={val} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-border shadow-sm" />
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    { header: "Phone", key: "phone" },
    {
      header: "License",
      key: "licenseImage",
      render: (_, row) => (
        <div className="flex gap-2">
          <div className="group relative">
             <img src={row.licenseImage} alt="license" className="w-8 h-8 rounded border hover:scale-110 transition-transform cursor-pointer" />
             <span className="absolute -top-8 left-0 bg-black text-white text-[10px] px-1 rounded hidden group-hover:block">License</span>
          </div>
         
        </div>
      ),
    },
     {
      header: "National",
      key: "nationalIdImage",
      render: (_, row) => (
        <div className="flex gap-2">
        
          <div className="group relative">
             <img src={row.nationalIdImage} alt="ID" className="w-8 h-8 rounded border hover:scale-110 transition-transform cursor-pointer" />
             <span className="absolute -top-8 left-0 bg-black text-white text-[10px] px-1 rounded hidden group-hover:block">National ID</span>
          </div>
        </div>
      ),
    },
    { header: "National ID No.", key: "nationalId" },
    { header: "License Expiry", key: "licenseExpiry" },
  ];

  const tableData = getDrivers?.data?.drivers?.map((item) => ({
    id: item.id,
    name: item.name,
    phone: item.phone,
    status: item.status,
    nationalId: item.nationalId,
    licenseExpiry: new Date(item.licenseExpiry).toLocaleDateString("en-GB"),
    avatar: item.avatar,
    licenseImage: item.licenseImage,
    nationalIdImage: item.nationalIdImage,
  })) || [];

  const handleDelete = async () => {
    try {
      await deleteDriver(`/api/admin/drivers/${selectedId}`);
      refetch();
    } catch (err) { console.error(err); }
    finally { setOpenDelete(false); setSelectedId(null); }
  };

  const handleToggleStatus = async (row) => {
    const newStatus = row.status === "active" ? "inactive" : "active";
    try {
      await putData({ status: newStatus }, `/api/admin/drivers/${row.id}`, "Status updated!");
      refetch();
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"> <Loading />  </div>


  return (
    <div className="p-10 bg-background min-h-screen">
      <ReusableTable
        title="Drivers Management"
        titleAdd="Driver"
        columns={columns}
        data={tableData}
        viewAdd={can(user, "drivers", "Add")}
        onAddClick={() => navigate("add")}
        renderActions={(row) => (
          <div className="flex gap-2 items-center">
              {can(user, "drivers", "Status") && (
            
            <StatusSwitch
              checked={row.status === "active"}
              onChange={() => handleToggleStatus(row)}
            />
              )}
                {can(user, "drivers", "Edit") && (
              
            <Button variant="edit" size="sm" onClick={() => navigate(`edit/${row.id}`)}>
              <Pencil className="size-4" />
            </Button>
                )}
                 {can(user, "drivers", "View") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`info/${row.id}`)}
                              >
                                <TfiInfo className="size-4 " />
                              </Button>
                            )}
                  {can(user, "drivers", "Delete") && (
                
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
        title="Delete Driver"
        description="Are you sure you want to delete this driver? This action cannot be undone."
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Drivers;