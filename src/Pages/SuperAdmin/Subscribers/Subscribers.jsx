import React from "react";
import useGet from "@/hooks/useGet";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";

const Subscribers = () => {
  const { data, loading } = useGet(
    "/api/superadmin/subscriptions/subscribers"
  );

  const columns = [
    { header: "Organization Name", key: "name" },
    { header: "Email", key: "email" },
    { header: "Phone", key: "phone" },
    { header: "Address", key: "address" },
    { header: "Status", key: "status" },
    { header: "Created At", key: "createdAt" },
  ];

  const tableData =
    data?.data?.data?.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      address: item.address,
      status: item.status,
      createdAt: new Date(item.createdAt).toLocaleDateString(),
    })) || [];

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  return (
    <div className="p-10 bg-background min-h-screen">
      <ReusableTable
        title="Subscribers"
        columns={columns}
        data={tableData}
      />
    </div>
  );
};

export default Subscribers;
