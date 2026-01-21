import React, { useState } from "react";
import useGet from "@/hooks/useGet";
import useDelete from "@/hooks/useDelete";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/Components/UI/button";
import ConfirmModal from "@/Components/UI/ConfirmModal";
import { can } from "@/utils/can";

const Plans = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const { data, loading, refetch } = useGet("/api/superadmin/plans");
  const { deleteData } = useDelete("/api/superadmin/plans");
  const user = JSON.parse(localStorage.getItem("superAdmin"));

  // Table Columns
  const columns = [
    { header: "Plan Name", key: "name" },
    { header: "Price", key: "price" },
    { header: "Max Buses", key: "maxBuses" },
    { header: "Max Drivers", key: "maxDrivers" },
    { header: "Max Students", key: "maxStudents" },
    { header: "Subscription Fees", key: "subscriptionFees" },
    { header: "Min Subscription Pay", key: "minSubscriptionFeesPay" },
  ];

  const tableData =
    data?.data?.plans?.map((plan) => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      maxBuses: plan.maxBuses,
      maxDrivers: plan.maxDrivers,
      maxStudents: plan.maxStudents,
      subscriptionFees: plan.subscriptionFees,
      minSubscriptionFeesPay: plan.minSubscriptionFeesPay,
    })) || [];

  const handleDelete = async () => {
    try {
      await deleteData(`/api/superadmin/plans/${selectedId}`);
      refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setOpenDelete(false);
      setSelectedId(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  return (
    <div className="p-10 bg-background min-h-screen">
      <ReusableTable
        title="Plans Management"
        titleAdd="Plan"
        columns={columns}
        data={tableData}
        viewAdd={can(user, "plans", "create")}
        onAddClick={() => navigate("add")}
        renderActions={(row) => (
          <div className="flex gap-2 items-center">
            {can(user, "plans", "update") && (
              <Button
                variant="edit"
                size="sm"
                onClick={() => navigate(`edit/${row.id}`)}
              >
                <Pencil className="size-4" />
              </Button>
            )}
            {can(user, "plans", "delete") && (
              <Button
                variant="delete"
                size="sm"
                onClick={() => {
                  setSelectedId(row.id);
                  setOpenDelete(true);
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        )}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={openDelete}
        title="Delete Plan"
        description="Are you sure you want to delete this plan? This action cannot be undone."
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Plans;
