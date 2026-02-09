import React, { useEffect, useState } from "react";
import useGet from "@/hooks/useGet";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";
import { Button } from "@/Components/UI/button";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Calendar,
  Wallet,
  BadgeCheck,
  AlertTriangle,
  DollarSign,
} from "lucide-react";const FeeInstallments = () => {
  const [activeTab, setActiveTab] = useState("status"); // status | history
  const navigate = useNavigate();
  // جلب البيانات
  const { data: statusData, loading: statusLoading } = useGet(
    "/api/admin/fee-installments/status",
  );
  const { data: historyData, loading: historyLoading } = useGet(
    "/api/admin/fee-installments/history",
  );

  const subscription = statusData?.data?.data?.subscription;
  const feeDetails = statusData?.data?.data?.feeDetails;
  const pendingInstallment = statusData?.data?.data?.pendingInstallment;

  const statusTableData = subscription
    ? [
        {
          planName: subscription.planName,
          startDate: new Date(subscription.startDate).toLocaleDateString(),
          endDate: new Date(subscription.endDate).toLocaleDateString(),
          totalFeeAmount: feeDetails.totalFeeAmount,
          minPaymentRequired: feeDetails.minPaymentRequired,
          totalPaid: feeDetails.totalPaid,
          remainingAmount: feeDetails.remainingAmount,
          status: feeDetails.isFullyPaid ? "Fully Paid" : "Not Fully Paid",
          pendingInstallment: pendingInstallment ? "Yes" : "No",
        },
      ]
    : [];
  const statusColumns = [
    { header: "Plan", key: "planName" },
    { header: "Start Date", key: "startDate" },
    { header: "End Date", key: "endDate" },
    { header: "Total Fee", key: "totalFeeAmount" },
    { header: "Min Payment", key: "minPaymentRequired" },
    { header: "Total Paid", key: "totalPaid" },
    { header: "Remaining", key: "remainingAmount" },
    { header: "Status", key: "status" },
    { header: "Pending Installment", key: "pendingInstallment" },
  ];

  // تجهيز بيانات الـ History
  const historyTableData =
    historyData?.data?.installments?.map((inst, idx) => ({
      installmentNumber: inst.installmentNumber,
      installmentAmount: inst.installmentAmount,
      paidAmount: inst.paidAmount,
      remainingAmount: inst.remainingAmount,
      dueDate: new Date(inst.dueDate).toLocaleDateString(),
      status: inst.status,
      receipt: inst.receiptImage,
    })) || [];
const [openReceipt, setOpenReceipt] = useState(false);
const [receiptImage, setReceiptImage] = useState(null);

  const historyColumns = [
    { header: "#", key: "installmentNumber" },
    { header: "Installment Amount", key: "installmentAmount" },
    { header: "Paid Amount", key: "paidAmount" },
    { header: "Remaining Amount", key: "remainingAmount" },
    { header: "Due Date", key: "dueDate" },
    { header: "Status", key: "status" },
   {
  header: "Receipt",
  key: "receipt",
  render: (_, row) =>
    row.receipt ? (
      <button
        onClick={() => {
          setReceiptImage(row.receipt);
          setOpenReceipt(true);
        }}
        className="text-one underline"
      >
        View
      </button>
    ) : (
      "-"
    ),
},

  ];

  if (statusLoading || historyLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  return (
    <div className="p-6 min-h-screen">
      <div className="flex gap-3 mb-4">
        {["status", "history"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeTab === tab
                ? "bg-one text-white"
                : "bg-one/50 text-four hover:bg-muted/70"
            }`}
          >
            {tab === "status" ? "Status" : "History"}
          </button>
        ))}
      </div>

{activeTab === "status" && subscription && (
  <div className="w-full bg-white rounded-2xl shadow-md p-6">
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <CreditCard className="w-6 h-6 text-one" />
        <h2 className="text-xl font-semibold text-one">
          feeinstallments Status
        </h2>
      </div>

      <span
        className={`px-4 py-1 rounded-full text-xs font-medium ${
          feeDetails.isFullyPaid
            ? "bg-green-100 text-green-700"
            : "bg-orange-100 text-orange-700"
        }`}
      >
        {feeDetails.isFullyPaid ? "Fully Paid" : "Not Fully Paid"}
      </span>
    </div>

    {/* Info Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Plan */}
      <div className="bg-muted/40 rounded-xl p-4 flex items-center gap-3">
        <Wallet className="w-5 h-5 text-one" />
        <div>
          <p className="text-xs text-gray-500">Plan</p>
          <p className="font-semibold">{subscription.planName}</p>
        </div>
      </div>

      {/* Start Date */}
      <div className="bg-muted/40 rounded-xl p-4 flex items-center gap-3">
        <Calendar className="w-5 h-5 text-one" />
        <div>
          <p className="text-xs text-gray-500">Start Date</p>
          <p className="font-semibold">
            {new Date(subscription.startDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* End Date */}
      <div className="bg-muted/40 rounded-xl p-4 flex items-center gap-3">
        <Calendar className="w-5 h-5 text-one" />
        <div>
          <p className="text-xs text-gray-500">End Date</p>
          <p className="font-semibold">
            {new Date(subscription.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Total Fee */}
      <div className="bg-muted/40 rounded-xl p-4 flex items-center gap-3">
        <DollarSign className="w-5 h-5 text-one" />
        <div>
          <p className="text-xs text-gray-500">Total Fee</p>
          <p className="font-semibold">{feeDetails.totalFeeAmount}</p>
        </div>
      </div>

      {/* Total Paid */}
      <div className="bg-muted/40 rounded-xl p-4 flex items-center gap-3">
        <BadgeCheck className="w-5 h-5 text-green-600" />
        <div>
          <p className="text-xs text-gray-500">Total Paid</p>
          <p className="font-semibold">{feeDetails.totalPaid}</p>
        </div>
      </div>

      {/* Remaining */}
      <div className="bg-muted/40 rounded-xl p-4 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        <div>
          <p className="text-xs text-gray-500">Remaining</p>
          <p className="font-semibold text-red-600">
            {feeDetails.remainingAmount}
          </p>
        </div>
      </div>
    </div>

    {/* Pending Installment Message */}
    <div className="mt-4 flex items-center gap-2 text-sm">
      <span className="text-gray-500">Pending Installment:</span>
      {pendingInstallment ? (
  <span className="flex items-center gap-1 text-yellow-600 font-semibold">
    ⏳ A payment is currently under review
  </span>
) : (
  <span className="flex items-center gap-1 text-green-600 font-semibold">
    ✅ No pending payment (you can proceed with payment)
  </span>
)}

    </div>

    {/* Pay Button */}
    {feeDetails.remainingAmount > 0 && !pendingInstallment && (
      <div className="mt-6">
        <button
          onClick={() =>
            navigate("/admin/feeinstallments/pay", {
              state: { amount: feeDetails.remainingAmount },
            })
          }
          className="px-6 w-full py-4 font-bold bg-one text-white rounded-full text-sm hover:opacity-90 transition"
        >
          Pay Now
        </button>
      </div>
     )} 
  </div>
)}
      {activeTab === "history" && (
        <ReusableTable
          title="Installment History"
          columns={historyColumns}
          data={historyTableData}
        />
      )}
      {openReceipt && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
    <div className="bg-white rounded-xl p-4 max-w-3xl w-full relative">
      {/* Close Button */}
      <button
        onClick={() => setOpenReceipt(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
      >
        ✕
      </button>

      {/* Image */}
      <img
        src={receiptImage}
        alt="Receipt"
        className="w-full max-h-[80vh] object-contain rounded-lg"
      />
    </div>
  </div>
)}

    </div>
  );
};

export default FeeInstallments;
