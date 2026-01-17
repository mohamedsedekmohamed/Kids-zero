import React, { useState } from "react";
import useGet from "@/hooks/useGet";
import useDelete from "@/hooks/useDelete";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";
import ConfirmModal from "@/Components/UI/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Button } from "@/Components/UI/button";

const Invoices = () => {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { data, loading, refetch } = useGet("/api/superadmin/invoices");
  const { deleteData } = useDelete("/api/superadmin/invoices");

  const navigate = useNavigate();

  const columns = [
    { header: "Invoice ID", key: "id" },
    { header: "Amount", key: "amount" },
    { header: "Status", key: "status" },
    { header: "Issued At", key: "issuedAt" },
    { header: "Due Date", key: "dueAt" },
    { header: "Paid At", key: "paidAt" },
  ];

  const tableData =
    data?.invoices?.map((invoice) => ({
      id: invoice.id,
      amount: `${invoice.amount.toLocaleString()} EGP`,
      status: invoice.status,
      issuedAt: new Date(invoice.issuedAt).toLocaleDateString(),
      dueAt: new Date(invoice.dueAt).toLocaleDateString(),
      paidAt: invoice.paidAt
        ? new Date(invoice.paidAt).toLocaleDateString()
        : "-",
    })) || [];

  const handleDelete = async () => {
    try {
      await deleteData(`/api/superadmin/invoices/${selectedId}`);
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
        title="Invoices"
        columns={columns}
        data={tableData}
        hideAdd
        renderActions={(row) => (
          <div className="flex gap-2 items-center">
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
        title="Delete Invoice"
        description="Are you sure you want to delete this invoice? This action cannot be undone."
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Invoices;
