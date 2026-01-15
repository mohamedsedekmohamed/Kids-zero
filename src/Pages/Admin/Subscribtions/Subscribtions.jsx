import React, { useState } from "react";
import useGet from "@/hooks/useGet";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";
import usePost from "@/hooks/usePost";
import toast from "react-hot-toast";

const Subscribtions = () => {
  const [activeTab, setActiveTab] = useState("all");

  const { data, loading, refetch } = useGet("/api/admin/subscribtions");
  const { data: paymentMethodsData } = useGet("/api/admin/paymentmethods");
  const { postData: payment, loading: paymentLoading } =
    usePost("/api/admin/payments/renewal");

  // Payment modal states
  const [openPayment, setOpenPayment] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(null);
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [receiptImage, setReceiptImage] = useState("");

  const paymentMethodOptions =
    paymentMethodsData?.data?.paymentMethods
      ?.filter((m) => m.isActive)
      ?.map((m) => ({
        value: m.id,
        label: m.name,
      })) || [];

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  const subscriptionsData = data?.data || {};
const sub=data?.data?.subscriptionStatus
  const allData = [
    ...(subscriptionsData.active || []).map((s) => ({ ...s, tab: "active" })),
    ...(subscriptionsData.pending || []).map((s) => ({ ...s, tab: "pending" })),
    ...(subscriptionsData.rejected || []).map((s) => ({ ...s, tab: "rejected" })),
    ...(subscriptionsData.expired || []).map((s) => ({ ...s, tab: "expired" })),
  ];

  const filteredData =
    activeTab === "all"
      ? allData
      : allData.filter((item) => item.tab === activeTab);

  const tableData = filteredData.map((item) => ({
    id: item.id,
    planName: item.plan?.name,
    price: item.plan?.price,
    maxBuses: item.plan?.maxBuses,
    maxDrivers: item.plan?.maxDrivers,
    maxStudents: item.plan?.maxStudents,
    startDate: new Date(item.startDate).toLocaleDateString("en-GB"),
    endDate: new Date(item.endDate).toLocaleDateString("en-GB"),
    paymentStatus: item.payment?.status,
    status: item.tab,
    daysRemaining: item.daysRemaining,
  }));

  const columns = [
    {
      header: "Plan",
      key: "planName",
      render: (_, row) => (
        <div>
          <div className="font-medium">{row.planName}</div>
          <div className="text-sm text-muted">Price: {row.price} EGP</div>
        </div>
      ),
    },
    {
      header: "Limits",
      key: "limits",
      render: (_, row) => (
        <div className="text-sm space-y-1">
          <div>Buses: {row.maxBuses}</div>
          <div>Drivers: {row.maxDrivers}</div>
          <div>Students: {row.maxStudents}</div>
        </div>
      ),
    },
    { header: "Start Date", key: "startDate" },
    { header: "End Date", key: "endDate" },
    {
      header: "Payment",
      key: "paymentStatus",
      render: (_, row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium
            ${
              row.paymentStatus === "completed"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
        >
          {row.paymentStatus}
        </span>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (_, row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium
            ${
              row.status === "active"
                ? "bg-green-100 text-green-700"
                : row.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Days Left",
      key: "daysRemaining",
      render: (_, row) =>
        row.status === "active" ? `${row.daysRemaining} days` : "-",
    },
  ];

  // Image to base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Submit payment
  const handlePaymentSubmit = async () => {
    if (!paymentMethodId || !receiptImage) {
      toast.success("Please complete payment data");
      return;
    }

    try {
      await payment(
        {
          paymentMethodId,
          receiptImage,
        },null,
        "Payment sent successfully"
      );

      setOpenPayment(false);
      setPaymentMethodId("");
      setReceiptImage("");
      setSelectedSubscriptionId(null);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Tabs */}
      <div className="flex w-full justify-center gap-3 mb-4">
        {["all", "active", "pending", "rejected", "expired"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${
                activeTab === tab
                  ? "bg-one text-white"
                  : "bg-one/50 text-four hover:bg-muted/70"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <ReusableTable
        title="Subscriptions Management"
        columns={columns}
        data={tableData}
        renderActions={(row) =>
          ( sub === "subscribed") && (
            <button
              onClick={() => {
                setSelectedSubscriptionId(row.id);
                setOpenPayment(true);
              }}
              className="px-3 py-1 text-xs bg-one text-white rounded hover:bg-one/90"
            >
              Renew
            </button>
          )
        }
      />

      {/* Payment Modal */}
      {openPayment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold">Renew Subscription</h2>

            <div>
              <label className="block text-sm mb-1">Payment Method</label>
              <select
                value={paymentMethodId}
                onChange={(e) => setPaymentMethodId(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select method</option>
                {paymentMethodOptions.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Receipt Image</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {receiptImage && (
                <img
                  src={receiptImage}
                  alt="receipt"
                  className="mt-2 w-32 rounded border"
                />
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpenPayment(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentSubmit}
                disabled={paymentLoading}
                className="px-4 py-2 bg-one text-white rounded disabled:opacity-50"
              >
                {paymentLoading ? "Sending..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscribtions;
