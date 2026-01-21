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
import StatusSwitch from "@/Components/UI/StatusSwitch";
import { can } from "@/utils/can";
import { TfiInfo } from "react-icons/tfi";

const Students = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const { data, loading, refetch } = useGet("/api/admin/students");
  const { deleteData } = useDelete("/api/admin/students");
  const { putData } = usePut("");

  /* ================= Columns ================= */
  const columns = [
    {
      header: "Student Info",
      key: "avatar",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar}
            alt={row.name}
            className="w-10 h-10 rounded-full object-cover border shadow-sm"
          />
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    { header: "Grade", key: "grade" },
    { header: "Classroom", key: "classroom" },
    {
      header: "Parent Info",
      key: "parent",
      render: (_, row) => (
        <div className="flex flex-col text-sm">
          <span>{row.parent?.name}</span>
          <span>{row.parent?.phone}</span>
        </div>
      ),
    },
  ];

  /* ================= Table Data ================= */
  const tableData =
    data?.data?.students?.map((item) => ({
      id: item.id,
      name: item.name,
      avatar: item.avatar,
      grade: item.grade,
      classroom: item.classroom,
      status: item.status,
      parent: item.parent,
    })) || [];

  /* ================= Handlers ================= */
  const handleDelete = async () => {
    try {
      await deleteData(`/api/admin/students/${selectedId}`);
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setOpenDelete(false);
      setSelectedId(null);
    }
  };

  const handleToggleStatus = async (row) => {
    const newStatus = row.status === "active" ? "inactive" : "active";
    try {
      await putData(
        { status: newStatus },
        `/api/admin/students/${row.id}`,
        "Status updated!",
      );
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        {" "}
        <Loading />{" "}
      </div>
    );

  return (
    <div className="p-10 bg-background min-h-screen">
      <ReusableTable
        title="Students Management"
        titleAdd="Student"
        columns={columns}
        data={tableData}
        viewAdd={can(user, "students", "Add")}
        onAddClick={() => navigate("add")}
        renderActions={(row) => (
          <div className="flex gap-2 items-center">
            {can(user, "students", "Status") && (
              <StatusSwitch
                checked={row.status === "active"}
                onChange={() => handleToggleStatus(row)}
              />
            )}
            {can(user, "students", "Edit") && (
              <Button
                variant="edit"
                size="sm"
                onClick={() => navigate(`edit/${row.id}`)}
              >
                <Pencil className="size-4" />
              </Button>
            )}
            {can(user, "students", "View") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`info/${row.id}`)}
              >
                <TfiInfo className="size-4 " />
              </Button>
            )}
            {can(user, "students", "Delete") && (
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
        title="Delete Student"
        description="Are you sure you want to delete this student? This action cannot be undone."
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Students;
