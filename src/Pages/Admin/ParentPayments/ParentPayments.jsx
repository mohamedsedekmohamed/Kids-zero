import React, { useState } from "react";
import useGet from "@/hooks/useGet";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";
import { Button } from "@/Components/UI/button";
import ConfirmModal from "@/Components/UI/ConfirmModal";
import { Eye } from "lucide-react";
import { can } from "@/utils/can"; 
import usePost from "@/hooks/usePost";

const ParentPayments = () => {
  const [activeTab, setActiveTab] = useState("all"); // all | completed | pending | rejected
  const [openImage, setOpenImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { postData } = usePost("");

  const user = JSON.parse(localStorage.getItem("user"));
  const [openReject, setOpenReject] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [rejectedReason, setRejectedReason] = useState("");
    const handleActionChange = async (action, row) => {
    try {
      if (action === "completed") {
        await postData(
          { status: action },
          `api/admin/payments/replyParentPayment/${row.id}`,
          "Payment accepted successfully",
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
        {
          status: "rejected",
          rejectedReason,
        },
        `api/admin/payments/replyParentPayment/${selectedId}`,
        "Payment rejected successfully",
      );
      refetch();
    } finally {
      setOpenReject(false);
      setRejectedReason("");
      setSelectedId(null);
    }
  };

  const { data, loading ,refetch } = useGet("/api/admin/payments/parent-payments");

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
  { header: "Amount", key: "amount", render: (value) => <span>{value} EGP</span> },
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
      ) : (
        "-"
      ),
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
  // ✅ عمود Actions
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

  

  /* ================= Table Data ================= */
const tableData =
  data?.data?.payments?.map((payment) => ({
    id: payment.id,
    amount: payment.amount,
    parentName: payment.parent?.name || "-",
    parentPhone: payment.parent?.phone || "-",
    status: payment.status,
    createdAt: new Date(payment.createdAt).toLocaleString("en-GB"),
    updatedAt: new Date(payment.updatedAt).toLocaleString("en-GB"),

    planName: payment.service?.serviceName || "-",
    paymentMethod: payment.paymentMethod?.name || "-",

    receiptImage: payment.receiptImage || null,
    rejectedReason: payment.rejectedReason || "-",
  })) || [];

/* ================= Compute Summary ================= */
const summary = tableData.reduce(
  (acc, payment) => {
    acc.total += 1;
    if (payment.status === "completed") acc.completed += 1;
    else if (payment.status === "pending") acc.pending += 1;
    else if (payment.status === "rejected") acc.rejected += 1;
    return acc;
  },
  { total: 0, completed: 0, pending: 0, rejected: 0 }
);


  /* ================= Filter ================= */
  const filteredData = tableData.filter((item) => {
    if (activeTab === "all") return true;
    return item.status === activeTab;
  });

  return (
    <div className="min-h-screen p-4">
      {/* ================= Summary ================= */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
  {[
    { label: "Total", value: summary.total },
    { label: "Completed", value: summary.completed },
    { label: "Pending", value: summary.pending },
    { label: "Rejected", value: summary.rejected },
  ].map((item) => (
    <div
      key={item.label}
      className="bg-white rounded-xl p-4 shadow text-center"
    >
      <p className="text-sm text-muted-foreground">{item.label}</p>
      <p className="text-2xl font-bold text-one">{item.value}</p>
    </div>
  ))}
</div>


      {/* ================= Tabs ================= */}
      <div className="flex w-full justify-center gap-3 mb-6">
        {["all", "completed", "pending", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${
                activeTab === tab
                  ? "bg-one text-white"
                  : "bg-one/50 text-four hover:bg-muted/70"
              }
            `}
          >
            {tab === "all" && "All Payments"}
            {tab === "completed" && "Completed"}
            {tab === "pending" && "Pending"}
            {tab === "rejected" && "Rejected"}
          </button>
        ))}
      </div>

      {/* ================= Table ================= */}
      <ReusableTable
        title="Payments Management"
        columns={columns}
        data={filteredData}
      />

      {/* ================= Receipt Modal ================= */}
      <ConfirmModal
        open={openImage}
        title="Payment Parent" 
         description={

          selectedImage && (
            <img
              src={selectedImage}
              alt="receipt"
              className="w-full h-100 rounded"
            />
          )
        }
        onClose={() => setOpenImage(false)}
        
         renderActions={(row) =>
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
        onClose={() => setOpenReject(false)}
        onConfirm={handleRejectConfirm}
        confirmDisabled={!rejectedReason.trim()}
      />
    </div>
  );
};


export default ParentPayments