import React, { useState } from "react";
import useGet from "@/hooks/useGet";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";
import { Button } from "@/Components/UI/button";
import ConfirmModal from "@/Components/UI/ConfirmModal";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Payments = () => {
  const [activeTab, setActiveTab] = useState("all"); // all | completed | pending | rejected
  const [openImage, setOpenImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const { data, loading } = useGet("/api/admin/payments");

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  /* ================= Columns ================= */
 const columns = [
  {
    header: "Plan",
    key: "planName",
  },
  {
    header: "Plan Price",
    key: "planPrice",
    render: (value) => <span>{value} EGP</span>,
  },
  {
    header: "Amount",
    key: "amount",
    render: (value) => <span className="font-medium">{value} EGP</span>,
  },
  {
    header: "Payment Method",
    key: "paymentMethod",
  },
  {
    header: "Receipt",
    key: "receiptImage",
    render: (_, row) => (
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
    ),
  },
  {
    header: "Status",
    key: "status",
    render: (value) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium
          ${
            value === "completed"
              ? "bg-green-100 text-green-700"
              : value === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }
        `}
      >
        {value}
      </span>
    ),
  },

  ...(activeTab === "rejected"
    ? [
        {
          header: "Rejected Reason",
          key: "rejectedReason",
          render: (value) => value || "-",
        },
      ]
    : []),

  {
    header: "Created At",
    key: "createdAt",
  },
  {
    header: "Updated At",
    key: "updatedAt",
  },
];

  

  /* ================= Table Data ================= */
  const tableData =
    data?.data?.payments?.map((payment) => ({
      id: payment.id,
      amount: payment.amount,
      status: payment.status,
      receiptImage: payment.receiptImage,
      rejectedReason: payment.rejectedReason,
      createdAt: new Date(payment.createdAt).toLocaleString("en-GB"),
      updatedAt: new Date(payment.updatedAt).toLocaleString("en-GB"),
      planName: payment.plan?.name || "-",
      planPrice: payment.plan?.price || "-",
      paymentMethod: payment.paymentMethod?.name || "-",
    })) || [];

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
          { label: "Total", value: data.data.summary.total },
          { label: "Completed", value: data.data.summary.completed },
          { label: "Pending", value: data.data.summary.pending },
          { label: "Rejected", value: data.data.summary.rejected },
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
                titleAdd="Payments"

        data={filteredData}
                onAddClick={() => navigate("add")}

      />

      {/* ================= Receipt Modal ================= */}
      <ConfirmModal
        open={openImage}
        title="Payment Receipt"
        description={
          selectedImage && (
            <img
              src={selectedImage}
              alt="receipt"
              className="w-full rounded"
            />
          )
        }
        onClose={() => setOpenImage(false)}
        hideActions
      />
    </div>
  );
};

export default Payments;
