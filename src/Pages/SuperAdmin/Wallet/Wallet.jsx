import axios from "axios";
import React, { useState } from "react";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";
import ConfirmModal from "@/Components/UI/ConfirmModal";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { RadialBarChart, RadialBar } from "recharts";

const Wallet = () => {
  const { data, loading, refetch } = useGet("/api/superadmin/wallet");


const { data: statsData, loading: statsLoading } = useGet("/api/superadmin/wallet/stats");

const balance = statsData?.data?.balance;
const requestss = statsData?.data?.requests;
const transactions = statsData?.data?.transactions?.last30Days;
// Requests Pie Chart
const requestData = [
  { name: "Pending", value: requestss?.pending?.amount || 0 },
  { name: "Approved", value: requestss?.approved?.amount || 0 },
  { name: "Rejected", value: requestss?.rejected?.amount || 0 },
];
const requestColors = ["#FACC15", "#22C55E", "#EF4444"];

// Transactions Bar Chart
const transactionsData = [
  { type: "Recharge", amount: transactions?.recharge?.amount || 0 },
  { type: "Purchase", amount: transactions?.purchase?.amount || 0 },
];

// Total Balance Radial Chart
const balanceData = [
  { name: "Total Balance", value: balance?.totalBalance || 0 },
];


  const { postData } = usePost("");

  const [openReject, setOpenReject] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const [openDetails, setOpenDetails] = useState(false);
  const [detailsData, setDetailsData] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // 🟢 Axios GET for details
  const fetchDetails = async (id) => {
    if (!id) return;
    try {
      setDetailsLoading(true);
      const token = localStorage.getItem("token"); // أو من أي مكان عندك
      const { data } = await axios.get(
        `https://bcknd.kidsero.com/api/superadmin/wallet/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDetailsData(data?.data?.request || null);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleActionChange = async (action, row) => {
    try {
      if (action === "approved") {
        await postData(
          {},
          `/api/superadmin/wallet/${row.id}/approve`,
          "Wallet request approved successfully"
        );
        refetch();
      }

      if (action === "rejected") {
        setSelectedId(row.id);
        setOpenReject(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) return;

    try {
      await postData(
        { reason: rejectReason },
        `/api/superadmin/wallet/${selectedId}/reject`,
        "Wallet request rejected successfully"
      );
      refetch();
    } finally {
      setOpenReject(false);
      setRejectReason("");
      setSelectedId(null);
    }
  };

  const requests = data?.data?.requests || [];

  const columns = [
    { header: "Amount", key: "amount" },
    {
      header: "Student",
      key: "student",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <img
            src={row.student.avatar}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span>{row.student.name}</span>
        </div>
      ),
    },
    {
      header: "Parent",
      key: "parent",
      render: (_, row) => (
        <div>
          <div>{row.parent.name}</div>
          <div className="text-xs text-muted-foreground">{row.parent.phone}</div>
        </div>
      ),
    },
    {
      header: "Payment Method",
      key: "paymentMethod",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <img
            src={row.paymentMethod.logo}
            alt="method"
            className="w-6 h-6 object-contain"
          />
          <span>{row.paymentMethod.name}</span>
        </div>
      ),
    },
    { header: "Status", key: "status" },
  ];

  const tableData = requests.map((item) => ({
    id: item.id,
    amount: item.amount,
    status: item.status,
    student: item.student,
    parent: item.parent,
    paymentMethod: item.paymentMethod,
  }));

  if (loading) return <Loading />;

  return (
    <div className="p-4 bg-background min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

  {/* 🏦 Total Balance */}
  <div className="p-4 bg-white rounded-lg shadow flex flex-col items-center">
    <div className="text-sm text-muted-foreground mb-2">Total Balance</div>
    <RadialBarChart
      width={150}
      height={150}
      cx="50%"
      cy="50%"
      innerRadius="70%"
      outerRadius="100%"
      barSize={15}
      data={balanceData}
    >
      <RadialBar minAngle={15} background clockWise dataKey="value" fill="#6366F1" />
    </RadialBarChart>
    <div className="text-xl font-bold mt-2">{balance?.totalBalance || 0} EGP</div>
    <div className="text-xs text-muted-foreground mt-1">
      {balance?.studentsWithBalance || 0} / {balance?.totalStudents || 0} students
    </div>
  </div>

  {/* 💳 Requests */}
  <div className="p-4 bg-white rounded-lg shadow flex  items-center">
    <div className="text-sm text-muted-foreground mb-2 ">Requests</div>
    <PieChart width={150} height={150}>
      <Pie
        data={requestData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={60}
        label
      >
        {requestData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={requestColors[index % requestColors.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend verticalAlign="bottom" height={36} />
    </PieChart>
    <div className="text-xl font-semibold mt-2"> Totel: {requestss?.total || 0}</div>
  </div>

  {/* 🔄 Transactions last 30 days */}
  <div className="p-4 bg-white rounded-lg shadow flex flex-col items-center">
    <div className="text-sm text-muted-foreground mb-2">Transactions (Last 30 Days)</div>
    <BarChart width={200} height={150} data={transactionsData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="type" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="amount" fill="#3B82F6" />
    </BarChart>
  </div>

</div>


      <ReusableTable
        title="Wallet Requests"
        columns={columns}
        data={tableData}
        renderActions={(row) => (
          <div className="flex gap-2 items-center">
            <button
              onClick={() => {
                setOpenDetails(true);
                fetchDetails(row.id); // 🟢 Axios call
              }}
              className="px-2 py-1 text-xs rounded bg-muted hover:bg-muted/80"
            >
              View
            </button>

            {row.status === "pending" && (
              <select
                defaultValue=""
                onChange={(e) => handleActionChange(e.target.value, row)}
                className="border rounded px-2 py-1 text-sm bg-background"
              >
                <option value="" disabled>
                  Select Action
                </option>
                <option value="approved">Approve</option>
                <option value="rejected">Reject</option>
              </select>
            )}
          </div>
        )}
      />

      {/* Reject Modal */}
      <ConfirmModal
        open={openReject}
        title="Reject Wallet Request"
        description={
          <textarea
            className="w-full border rounded p-2 mt-2"
            placeholder="Write rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        }
        onClose={() => setOpenReject(false)}
        onConfirm={handleRejectConfirm}
        confirmDisabled={!rejectReason.trim()}
      />

      {/* Details Modal */}
      <ConfirmModal
        open={openDetails}
        title="Wallet Request Details"
        onClose={() => {
          setOpenDetails(false);
          setDetailsData(null);
        }}
        hideActions
        description={
          detailsLoading ? (
            <Loading />
          ) : detailsData ? (
            <div className="space-y-4 text-sm">
              <div><b>Amount:</b> {detailsData.amount}</div>
              <div><b>Status:</b> {detailsData.status}</div>
              {detailsData.notes && (
                <div>
                  <b>Notes:</b>
                  <p className="text-muted-foreground">{detailsData.notes}</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <img src={detailsData.student.avatar} className="w-8 h-8 rounded-full" />
                <span>{detailsData.student.name} (Wallet: {detailsData.student.walletBalance})</span>
              </div>
              <div>
                <b>Parent:</b> {detailsData.parent.name} - {detailsData.parent.phone}
              </div>
              <div className="flex items-center gap-2">
                <img src={detailsData.paymentMethod.logo} className="w-6 h-6 object-contain" />
                <span>{detailsData.paymentMethod.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <img src={detailsData.organization.logo} className="w-6 h-6 object-contain" />
                <span>{detailsData.organization.name}</span>
              </div>
              
            </div>
          ) : null
        }
      />
    </div>
  );
};

export default Wallet;
