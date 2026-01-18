import React, { useState } from "react";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";
import { Button } from "@/Components/UI/button";
import ConfirmModal from "@/Components/UI/ConfirmModal";
import toast from "react-hot-toast";

const Payments = () => {
  const { data, loading, refetch } = useGet("/api/superadmin/payments");
  const { putData } = usePut("");

  const [openReject, setOpenReject] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [rejectedReason, setRejectedReason] = useState("");
const handleActionChange = async (action, row) => {
  try {
    if (action === "completed" ) {
      await putData(
        { status: action },
        `/api/superadmin/payments/${row.id}/reply`,
        "Payment accepted successfully"
      );
      refetch();
    }

    if (action === "rejected") {
      setSelectedId(row.id);
      setOpenReject(true);
    }
  } catch (err) {
    console.error(err);
  }
};

const handleRejectConfirm = async () => {
  if (!rejectedReason.trim()) return;

  try {
    await putData(
      {
        status: "rejected",
        rejectedReason,
      },
      `/api/superadmin/payments/${selectedId}/reply`,
      "Payment rejected successfully"
    );
    refetch();
  } catch (err) {
    console.error(err);
  } finally {
    setOpenReject(false);
    setRejectedReason("");
    setSelectedId(null);
  }
};

  const payments = data?.data?.payments || [];

  const columns = [
    { header: "Amount", key: "amount" },
    { header: "Type", key: "paymentType" },
    { header: "Receipt Image", key: "receiptImage",
render: (value) => <img src={value} alt="receipt" 
className="w-10 h-10 rounded-full object-cover border border-border shadow-sm" />

     },
    { header: "Status", key: "status" },
  ];

  const tableData = payments.map((item) => ({
    id: item.id,
    amount: item.amount,
    paymentType: item.paymentType,
    status: item.status,
    receiptImage: item.receiptImage,
    createdAt: new Date(item.createdAt).toLocaleString(),
  }));


  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  return (
    <div className="p-10 bg-background min-h-screen">
      <ReusableTable
        title="Payments"
        columns={columns}
        data={tableData}
      renderActions={(row) =>
  row.status === "pending" && (
    <select
      defaultValue=""
      onChange={(e) => handleActionChange(e.target.value, row)}
      className="border rounded px-2 py-1 text-sm bg-background"
    >
      <option value="" disabled>
        Select Action
      </option>
      <option value="completed">Completed</option>
      <option value="rejected">Reject</option>
    </select>
  )
}

      />
<ConfirmModal
  open={openReject}
  title="Reject Payment"
  description={
    <textarea
      className="w-full border rounded p-2 mt-2"
      placeholder="Write rejection reason..."
      value={rejectedReason}
      onChange={(e) => setRejectedReason(e.target.value)}
    />
  }
  onClose={() => {
    setOpenReject(false);
    setRejectedReason("");
  }}
  onConfirm={handleRejectConfirm}
  confirmDisabled={!rejectedReason.trim()}
/>


    </div>
  );
};

export default Payments;
