import React, { useState } from "react";
import useGet from "@/hooks/useGet";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";
import axios from "axios";
import { getToken } from "@/utils/auth";
import toast ,{Toaster} from "react-hot-toast";

const Installments = () => {
  const { data, loading } = useGet("/api/superadmin/payments/installments/all");
const token =getToken();
const [showRejectModal, setShowRejectModal] = useState(false);
const [selectedId, setSelectedId] = useState(null);
const [rejectedReason, setRejectedReason] = useState("");

  const columns = [
  
    { header: "Installment Amount", key: "installmentAmount" },
    { header: "Payment Method", key: "paymentMethod" },
    { header: "Plan", key: "plan"  },
    { header: "Paid Amount", key: "paidAmount" },
    { header: "Remaining Amount", key: "remainingAmount" },
    { header: "Due Date", key: "dueDate" },
    { header: "Status", key: "status" },
    { header: "Receipt", key: "receiptImage",

             render: (_, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.receiptImage}
            alt={row.name}
            className="w-10 h-10 rounded-full object-cover border shadow-sm"
          />
        </div>
      ),
     },
  ];

  const tableData =
    data?.data?.installments?.map((item) => ({
      id: item.id,
      installmentNumber: item.installmentNumber,
      subscriptionId: item.subscriptionId,
      organizationId: item.organizationId,
      paymentMethodId: item.paymentMethodId,
        paymentMethod: item.paymentMethod?.name || "-", // 🔹 حوّل الاسم مباشرة
  plan: item.plan?.name || "-",     
      installmentAmount: item.installmentAmount.toLocaleString(),
      paidAmount: item.paidAmount.toLocaleString(),
      remainingAmount: item.remainingAmount.toLocaleString(),
      dueDate: new Date(item.dueDate).toLocaleDateString(),
      status: item.status,
      receiptImage: item.receiptImage,
      createdAt: new Date(item.createdAt).toLocaleDateString(),
    })) || [];


    const handleActionChange = (action, id) => {
  if (action === "approve") {
    approveInstallment(id);
  }

  if (action === "reject") {
    setSelectedId(id);
    setShowRejectModal(true);
  }
};

const approveInstallment = async (id) => {
  await axios.put(
    `https://Bcknd.Kidsero.com/api/superadmin/payments/installments/${id}/approve`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const rejectInstallment = async () => {
  if (!rejectedReason.trim()) return;

  await axios.put(
    `https://Bcknd.Kidsero.com/api/superadmin/payments/installments/${selectedId}/reject`,
    { rejectedReason },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  setShowRejectModal(false);
  setRejectedReason("");
};
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  const summary = data?.data?.summary;

  return (
        <div className="p-10 bg-background min-h-screen">

      <div className="flex  w-full justify-center  gap-3 mb-6">
      {summary && (
        <div className="flex gap-4  flex-wrap text-sm font-medium">
          <div className="px-4 py-2 rounded-full text-sm font-medium transition  bg-one text-white ">Total: {summary.total}</div>
        <div className="px-4 py-2 rounded-full text-sm font-medium transition bg-one text-white ">Pending: {summary.pending}</div>
          <div className="px-4 py-2 rounded-full text-sm font-medium transition bg-one text-white ">Approved: {summary.approved}</div>
          <div className="px-4 py-2 rounded-full text-sm font-medium transition bg-one text-white ">Rejected: {summary.rejected}</div>
          <div className="px-4 py-2 rounded-full text-sm font-medium transition bg-one text-white ">Overdue: {summary.overdue}</div>
        </div>
      )}
</div>

      <ReusableTable
        title="Installments Management"
        columns={columns}
        data={tableData}
renderActions={(row) =>
  row.status === "pending" && (
    <select
      defaultValue=""
      onChange={(e) => handleActionChange(e.target.value, row.id)}
      className="border rounded px-2 py-1 text-sm"
    >
      <option value="" disabled>
        Select Action
      </option>
      <option value="approve">Approve</option>
      <option value="reject">Reject</option>
    </select>
  )
}


      />
      <Toaster/>
      {showRejectModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Reject Installment
      </h2>

      <textarea
        value={rejectedReason}
        onChange={(e) => setRejectedReason(e.target.value)}
        placeholder="Write rejection reason..."
        className="w-full h-28 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
      />

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => {
            setShowRejectModal(false);
            setRejectedReason("");
          }}
          className="px-4 py-2 rounded-lg border"
        >
          Cancel
        </button>

        <button
          onClick={rejectInstallment}
          disabled={!rejectedReason.trim()}
          className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
        >
          Reject
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Installments;
