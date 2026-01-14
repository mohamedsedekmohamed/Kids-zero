import React, { useState } from "react";
import useGet from "@/hooks/useGet";
import useDelete from "@/hooks/useDelete";
import usePut from "@/hooks/usePut";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil, MapPin } from "lucide-react";
import { Button } from "@/Components/UI/button";
import ConfirmModal from "@/Components/UI/ConfirmModal";

const Routes = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [openPickupModal, setOpenPickupModal] = useState(false);
  const [pickupPoints, setPickupPoints] = useState([]);
  const navigate = useNavigate();

  const { data: getRoutes, loading, refetch } = useGet("/api/admin/routes");
  const { deleteData: deleteRoute } = useDelete("/api/admin/routes");
  const { putData } = usePut("");

  const columns = [
    { header: "Route Name", key: "name" },
    { header: "Description", key: "description" },
    {
      header: "Pickup Points",
      key: "pickupPoints",
      render: (_, row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setPickupPoints(row.pickupPoints || []);
            setOpenPickupModal(true);
          }}
        >
          View Points
        </Button>
      ),
    },
  ];

  const tableData =
    getRoutes?.data?.routes?.map((route) => ({
      id: route.id,
      name: route.name,
      description: route.description,
      pickupPoints: route.pickupPoints,
      status: route.status || "active",
    })) || [];

  const handleDelete = async () => {
    try {
      await deleteRoute(`/api/admin/routes/${selectedId}`);
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
        title="Routes Management"
        titleAdd="Route"
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
        title="Delete Route"
        description="Are you sure you want to delete this route? This action cannot be undone."
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />

      {/* Pickup Points Modal */}
     {openPickupModal && (
  <div className="fixed inset-0 bg-black/80 bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl w-96 max-w-full p-6 relative shadow-2xl animate-fade-in overflow-y-scroll">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <MapPin className="text-green-500" /> Pickup Points
      </h2>

      <ul className="space-y-3 max-h-96 overflow-y-auto">
        {pickupPoints.map((point) => (
          <li
            key={point.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-all shadow-sm"
          >
            {/* دائرة للترتيب */}
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full font-medium text-sm">
              {point.stopOrder}
            </div>

            {/* أيقونة النقطة */}
            <MapPin className="text-green-500 w-5 h-5 flex-shrink-0" />

            {/* التفاصيل */}
            <div className="text-gray-700 text-sm">
              <div className="font-medium">{point.pickupPoint.name}</div>
              <div className="text-gray-500 text-xs">{point.pickupPoint.address}</div>
            </div>
          </li>
        ))}
      </ul>

      {/* زر الإغلاق */}
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg font-bold"
        onClick={() => setOpenPickupModal(false)}
      >
        ✕
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default Routes;
