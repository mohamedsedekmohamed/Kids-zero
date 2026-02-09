import React, { useState } from "react";
import useGet from "@/hooks/useGet";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";
import { Button } from "@/Components/UI/button";
import ConfirmModal from "@/Components/UI/ConfirmModal";
import { Eye } from "lucide-react";
import { can } from "@/utils/can"; 
import usePost from "@/hooks/usePost";

const ParentInstallment = () => {
  const [activeTab, setActiveTab] = useState("all"); // all | completed | pending | rejected
  const [openImage, setOpenImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { postData } = usePost("");

  const user = JSON.parse(localStorage.getItem("user"));
  const [openReject, setOpenReject] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [rejectedReason, setRejectedReason] = useState("");

  const { data, loading , refetch } = useGet("/api/admin/payments/parent-payment-installments");

  const handleActionChange = async (action, row) => {
    try {
      if (action === "completed") {
        await postData(
          { status: action },
          `api/admin/payments/replyParentPaymentInstallment/${row.id}`,
          "Installment accepted successfully"
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
      await postData(
        { status: "rejected", rejectedReason },
        `api/admin/payments/replyParentPayment/${selectedId}`,
        "Installment rejected successfully"
      );
      refetch();
    } finally {
      setOpenReject(false);
      setRejectedReason("");
      setSelectedId(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  const columns = [
    {
      header: "Parent",
      key: "parentInfo",
      render: (_, row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.parentName}</span>
          <span className="text-sm text-muted-foreground">{row.parentPhone}</span>
        </div>
      ),
    },
    { header: "Plan", key: "planName" },
    { header: "Paid Amount", key: "paidAmount", render: (value) => <span>{value} EGP</span> },
    { header: "Remaining", key: "remainingAmount", render: (value) => <span>{value} EGP</span> },
    { header: "Payment Method", key: "paymentMethod" },
    {
      header: "Receipt",
      key: "receiptImage",
      render: (_, row) =>
        row.receiptImage ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedImage(row.receiptImage);
              setOpenImage(true);
            }}
          >
            <Eye className="size-4" />
          </Button>
        ) : "-",
    },
    {
      header: "Status",
      key: "status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "completed"
              ? "bg-green-100 text-green-700"
              : value === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {value}
        </span>
      ),
    },
    ...(activeTab === "rejected"
      ? [{ header: "Rejected Reason", key: "rejectedReason", render: (value) => value || "-" }]
      : []),
    {
      header: "Actions",
      key: "actions",
      render: (_, row) =>
        row.status === "pending" &&
        can(user, "payments", "update") && (
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
        ),
    },
  ];

  const tableData =
    data?.data?.installments?.map((inst) => ({
      id: inst.id,
      paidAmount: inst.paidAmount,
      remainingAmount: inst.service?.remainingAmount || 0,
      status: inst.status,
      createdAt: new Date(inst.createdAt).toLocaleString("en-GB"),
      updatedAt: new Date(inst.updatedAt).toLocaleString("en-GB"),
      planName: inst.service?.serviceName || "-",
      paymentMethod: inst.paymentMethodId ? "Method" : "-",
      parentName: inst.parent?.name || "-",
      parentPhone: inst.parent?.phone || "-",
      receiptImage: inst.receiptImage || null,
      rejectedReason: inst.rejectedReason || "-",
    })) || [];

  const summary = tableData.reduce(
    (acc, inst) => {
      acc.total += 1;
      if (inst.status === "completed") acc.completed += 1;
      else if (inst.status === "pending") acc.pending += 1;
      else if (inst.status === "rejected") acc.rejected += 1;
      return acc;
    },
    { total: 0, completed: 0, pending: 0, rejected: 0 }
  );

  const filteredData = tableData.filter((item) => (activeTab === "all" ? true : item.status === activeTab));

  return (
    <div className="min-h-screen p-4">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: summary.total },
          { label: "Completed", value: summary.completed },
          { label: "Pending", value: summary.pending },
          { label: "Rejected", value: summary.rejected },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="text-2xl font-bold text-one">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex w-full justify-center gap-3 mb-6">
        {["all", "completed", "pending", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeTab === tab ? "bg-one text-white" : "bg-one/50 text-four hover:bg-muted/70"
            }`}
          >
            {tab === "all" && "All Installments"}
            {tab === "completed" && "Completed"}
            {tab === "pending" && "Pending"}
            {tab === "rejected" && "Rejected"}
          </button>
        ))}
      </div>

      {/* Table */}
      <ReusableTable title="Parent Payment Installments" columns={columns} data={filteredData} />

      {/* Receipt Modal */}
      <ConfirmModal
        open={openImage}
        title="Receipt Image"
        description={
          selectedImage && <img src={selectedImage} alt="receipt" className="w-full h-100 rounded" />
        }
        onClose={() => setOpenImage(false)}
      />

      {/* Reject Modal */}
      <ConfirmModal
        open={openReject}
        title="Reject Installment"
        description={
          <textarea
            className="w-full border rounded p-2 mt-2"
            placeholder="Write rejection reason..."
            value={rejectedReason}
            onChange={(e) => setRejectedReason(e.target.value)}
          />
        }
        mes="Reject"
        onClose={() => setOpenReject(false)}
        onConfirm={handleRejectConfirm}
        confirmDisabled={!rejectedReason.trim()}
      />
    </div>
  );
};

export default ParentInstallment;
