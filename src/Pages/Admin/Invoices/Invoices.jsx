import React from "react";
import useGet from "@/hooks/useGet";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";

const Invoices = () => {


  const { data: getInvoices, loading } = useGet("/api/admin/invoices");

  // جدول الأعمدة
  const columns = [
    { header: "Organization ID", key: "organizationId" },
    { header: "Subscription ID", key: "subscriptionId" },
    { header: "Plan ID", key: "planId" },
    { header: "Amount", key: "amount" },
    { header: "Status", key: "status" },
    { header: "Issued At", key: "issuedAt" },
    { header: "Due At", key: "dueAt" },
    { header: "Paid At", key: "paidAt" },
    { header: "Updated At", key: "updatedAt" },
  ];

  // بيانات الجدول
  const tableData =
    getInvoices?.invoices?.map((item) => ({
      id: item.id,
      organizationId: item.organizationId,
      subscriptionId: item.subscriptionId,
      planId: item.planId,
      amount: item.amount,
      status: item.status,
      issuedAt: new Date(item.issuedAt).toLocaleDateString(),
      dueAt: new Date(item.dueAt).toLocaleDateString(),
      paidAt: item.paidAt ? new Date(item.paidAt).toLocaleDateString() : "-",
      updatedAt: new Date(item.updatedAt).toLocaleDateString(),
    })) || [];

  // حذف فاتورة


  // تعديل فاتورة


  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  return (
    <div className="p-10 bg-background min-h-screen">
      <ReusableTable
        title="Invoices"
        columns={columns}
        data={tableData}
      
      />

     
    </div>
  );
};

export default Invoices;
