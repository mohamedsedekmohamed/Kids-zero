import React, { useState } from "react";
import useGet from "@/hooks/useGet";
import useDelete from "@/hooks/useDelete";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/Components/UI/button";
import ConfirmModal from "@/Components/UI/ConfirmModal";

const ParentPlans = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const { data, loading, refetch } = useGet("/api/superadmin/parentplans");
  const { deleteData } = useDelete("/api/superadmin/parentplans");

  const columns = [
    { header: "Plan Name", key: "name" },
    { header: "Price", key: "price" },
    { header: "Min Subscription Pay", key: "minSubscriptionFeesPay" },
    { header: "Subscription Fees", key: "subscriptionFees" },
  ];

  const tableData =
    data?.data?.parentPlans?.map((plan) => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      minSubscriptionFeesPay: plan.minSubscriptionFeesPay,
      subscriptionFees: plan.subscriptionFees,

    })) || [];

  const handleDelete = async () => {
    try {
      await deleteData(`/api/superadmin/parentplans/${selectedId}`);
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
        title="Parent Plans Management"
        titleAdd="Parent Plan"
        columns={columns}
        data={tableData}
        onAddClick={() => navigate("add")}
        renderActions={(row) => (
          <div className="flex gap-2 items-center">
            <Button
              variant="edit"
              size="sm"
              onClick={() => navigate(`edit/${row.id}`)}
            >
              <Pencil className="size-4" />
            </Button>

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
          </div>
        )}
      />

      <ConfirmModal
        open={openDelete}
        title="Delete Parent Plan"
        description="Are you sure you want to delete this plan? This action cannot be undone."
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ParentPlans;
