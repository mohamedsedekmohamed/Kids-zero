import React, { useState } from "react";
import useGet from "@/hooks/useGet";
import useDelete from "@/hooks/useDelete";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/Components/UI/Button";
import ConfirmModal from "@/Components/UI/ConfirmModal";
import usePut from "@/hooks/usePut";
import StatusSwitch from "@/Components/UI/StatusSwitch";

const PaymentMethods = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  // ✅ GET Payment Methods
  const { data: paymentData, loading, refetch } = useGet(
    "/api/superadmin/paymentmethods"
  );
  const { putData } = usePut("");

  // ✅ DELETE Payment Method
  const { deleteData } = useDelete("/api/superadmin/paymentmethods");

  // ✅ Table columns
  const columns = [
      {
      header: "Student Info",
      key: "logo",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.logo}
            alt={row.name}
            className="w-10 h-10 rounded-full object-cover border shadow-sm"
          />
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    { header: "Description", key: "description" },
    { header: "Fee Status", key: "feeStatus" },
    { header: "Fee Amount", key: "feeAmount" },
  ];

  // ✅ Table data
  const tableData =
    paymentData?.data?.paymentMethods?.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      logo: item.logo,
      isActive: item.isActive ,
      feeStatus: item.feeStatus ,
      feeAmount: item.feeAmount,
    })) || [];
      const handleToggleStatus = async (row) => {
    const newStatus = row.isActive === "true" ? true : false ;
    try {
      await putData(
        { is_active: newStatus },
        `/api/superadmin/paymentmethods/${row.id}`,
        "Status updated!"
      );
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Delete handler
  const handleDelete = async () => {
    try {
      await deleteData(`/api/superadmin/paymentmethods/${selectedId}`);
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
        title="Payment Methods"
        titleAdd="Payment Method"
        columns={columns}
        data={tableData}
        onAddClick={() => navigate("add")}
        renderActions={(row) => (
          <div className="flex gap-2 items-center">
              <StatusSwitch
              checked={row.status === "true"}
              onChange={() => handleToggleStatus(row)}
            />
            <Button variant="edit" size="sm" onClick={() => handleEdit(row)}>
              <Pencil className="size-4" />
              Edit
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
              Delete
            </Button>
          </div>
        )}
      />

      <ConfirmModal
        open={openDelete}
        title="Delete Payment Method"
        description="Are you sure you want to delete this payment method?"
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default PaymentMethods;
