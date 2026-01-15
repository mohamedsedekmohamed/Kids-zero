import React, { useState } from "react";
import useGet from "@/hooks/useGet";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";
import { Button } from "@/Components/UI/button";

const FeeInstallments = () => {
  const [activeTab, setActiveTab] = useState("status"); // status | history

  // جلب البيانات
  const { data: statusData, loading: statusLoading } = useGet("/api/admin/fee-installments/status");
  const { data: historyData, loading: historyLoading } = useGet("/api/admin/fee-installments/history");

  // تجهيز بيانات الـ Status
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
          <a href={row.receipt} target="_blank" rel="noreferrer" className="text-blue-500 underline">
            View
          </a>
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
              activeTab === tab ? "bg-one text-white" : "bg-one/50 text-four hover:bg-muted/70"
            }`}
          >
            {tab === "status" ? "Status" : "History"}
          </button>
        ))}
      </div>

      {activeTab === "status" && (
        <ReusableTable
          title="Subscription Status"
          columns={statusColumns}
          data={statusTableData}
          hideActions
        />
      )}

      {activeTab === "history" && (
        <ReusableTable
          title="Installment History"
          columns={historyColumns}
          data={historyTableData}
          hideActions
        />
      )}
    </div>
  );
};

export default FeeInstallments;
