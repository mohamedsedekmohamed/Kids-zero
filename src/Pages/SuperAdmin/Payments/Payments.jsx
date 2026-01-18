import React, { useState } from "react";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";
import ConfirmModal from "@/Components/UI/ConfirmModal";

const Payments = () => {
  const [activeTab, setActiveTab] = useState("payments"); // payments | parent
  const { putData } = usePut("");

  const {
    data,
    loading,
    refetch,
  } = useGet(
    activeTab === "payments"
      ? "/api/superadmin/payments"
      : "/api/superadmin/payments/parents"
  );

  const [openReject, setOpenReject] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [rejectedReason, setRejectedReason] = useState("");

  const handleActionChange = async (action, row) => {
    try {
      if (action === "completed") {
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
    {
      header: "Receipt Image",
      key: "receiptImage",
      render: (value) => (
        <img
          src={value}
          alt="receipt"
          className="w-10 h-10 rounded-full object-cover border"
        />
      ),
    },
    { header: "Status", key: "status" },
  ];

  const tableData = payments.map((item) => ({
    id: item.id,
    amount: item.amount,
    paymentType: item.paymentType,
    status: item.status,
    receiptImage: item.receiptImage,
  }));

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  return (
    <div className="p-2 bg-background min-h-screen">
      {/* 🔹 Tabs */}
      <div className="flex w-full justify-center gap-4 my-6">
        <button
          onClick={() => setActiveTab("payments")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "payments"
              ? "bg-one text-white"
              : "bg-muted text-muted-foreground"
          }`}
        >
          Payments
        </button>

        <button
          onClick={() => setActiveTab("parent")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "parent"
              ? "bg-one text-white"
              : "bg-muted text-muted-foreground"
          }`}
        >
          Payments Parent
        </button>
      </div>

      {/* 🔹 Table */}
      <ReusableTable
        title={activeTab === "payments" ? "Payments" : "Payments Parent"}
        columns={columns}
        data={tableData}
        renderActions={(row) =>
          row.status === "pending" && (
            <select
              defaultValue=""
              onChange={(e) =>
                handleActionChange(e.target.value, row)
              }
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

      {/* 🔹 Reject Modal */}
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
        onClose={() => setOpenReject(false)}
        onConfirm={handleRejectConfirm}
        confirmDisabled={!rejectedReason.trim()}
      />
    </div>
  );
};

export default Payments;
