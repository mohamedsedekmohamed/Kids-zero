import React from "react";
import useGet from "@/hooks/useGet";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";

const Installments = () => {
  const { data, loading } = useGet("/api/superadmin/payments/installments/all");

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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  const summary = data?.data?.summary;

  return (
        <div className="p-10 bg-background min-h-screen">

      <div className="flex w-full justify-center  gap-3 mb-6">
      {summary && (
        <div className="flex gap-4 text-sm font-medium">
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
        hideAdd
      />
    </div>
  );
};

export default Installments;
