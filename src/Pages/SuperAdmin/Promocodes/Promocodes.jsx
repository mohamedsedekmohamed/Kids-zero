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

const Promocodes = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("superAdmin"));

  // ✅ GET Promo Codes
  const {
    data: promoCodesData,
    loading,
    refetch,
  } = useGet("/api/superadmin/promocodes");

  // ✅ DELETE
  const { deleteData: deletePromoCode } =
    useDelete("/api/superadmin/promocodes");

  // ✅ Table columns
  const columns = [
    { header: "Name", key: "name" },
    { header: "Code", key: "code" },
    { header: "Amount", key: "amount" },
    { header: "Type", key: "promocodeType" },
    { header: "Start Date", key: "startDate" },
    { header: "End Date", key: "endDate" },
  ];

  // ✅ Table data
  const tableData =
    promoCodesData?.data?.promoCodes?.map((item) => ({
      id: item.id,
      name: item.name,
      code: item.code,
      amount: item.amount,
      promocodeType: item.promocodeType,
      startDate: new Date(item.startDate).toLocaleDateString(),
      endDate: new Date(item.endDate).toLocaleDateString(),
    })) || [];

  // ✅ Delete handler
  const handleDelete = async () => {
    try {
      await deletePromoCode(
        `/api/superadmin/promocodes/${selectedId}`
      );
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setOpenDelete(false);
      setSelectedId(null);
    }
  };

  // ✅ Edit
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
        title="Promo Codes"
        titleAdd="Promo Code"
        columns={columns}
        data={tableData}
       viewAdd={can(user, "promocodes", "create")}
        onAddClick={() => navigate("add")}
        renderActions={(row) => (
          <div className="flex gap-2 items-center">
    {can(user, "promocodes", "update") && (
            <Button
              variant="edit"
              size="sm"
              onClick={() => handleEdit(row)}
            >
              <Pencil className="size-4" />
              Edit
            </Button>
                 )}  
        {can(user, "promocodes", "delete") && (
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
                 )}
          </div>
        )}
      />

      <ConfirmModal
        open={openDelete}
        title="Delete Promo Code"
        description="Are you sure you want to delete this promo code?"
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Promocodes;
