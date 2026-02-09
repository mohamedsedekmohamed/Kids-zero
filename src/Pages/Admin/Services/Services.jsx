import React, { useState } from "react";
import useGet from "@/hooks/useGet";
import useDelete from "@/hooks/useDelete";
import usePut from "@/hooks/usePut";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/Components/UI/button";
import ConfirmModal from "@/Components/UI/ConfirmModal";
import { can } from "@/utils/can";

const Services = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const { data, loading, refetch } = useGet("/api/admin/services");
  const { deleteData } = useDelete("/api/admin/services");
  const { putData } = usePut("");

  /* ================= Columns ================= */
  const columns = [
    { header: "Service Name", key: "serviceName" },
    { header: "Description", key: "serviceDescription" },
    {
      header: "Price",
      key: "servicePrice",
      render: (value) => `${value} EGP`,
    },
    {
      header: "Zone Pricing",
      key: "useZonePricing",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      header: "Installments",
      key: "allowInstallments",
      render: (value) => (value ? "Allowed" : "Not Allowed"),
    },
    {
      header: "Due Day",
      key: "dueDay",
    },
  ];

  /* ================= Table Data ================= */
  const tableData =
    data?.data?.data?.map((item) => ({
      id: item.id,
      serviceName: item.serviceName,
      serviceDescription: item.serviceDescription,
      servicePrice: item.servicePrice,
      useZonePricing: item.useZonePricing,
      allowInstallments: item.allowInstallments,
      dueDay: item.dueDay,
    })) || [];

  /* ================= Handlers ================= */
  const handleDelete = async () => {
    try {
      await deleteData(`/api/admin/services/${selectedId}`);
      refetch();
    } catch (err) {
      console.error(err);
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
        title="Services Management"
        titleAdd="Service"
        columns={columns}
        data={tableData}
        viewAdd={can(user, "organizationServices", "Add")}
        onAddClick={() => navigate("add")}
        renderActions={(row) => (
          <div className="flex gap-2 items-center">
            {can(user, "organizationServices", "Edit") && (
              <Button
                variant="edit"
                size="sm"
                onClick={() => navigate(`edit/${row.id}`)}
              >
                <Pencil className="size-4" />
              </Button>
            )}
            {can(user, "organizationServices", "Delete") && (
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

      <ConfirmModal
        open={openDelete}
        title="Delete Service"
        description="Are you sure you want to delete this service?"
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Services;
