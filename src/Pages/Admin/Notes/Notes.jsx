import React, { useState } from "react";
import useGet from "@/hooks/useGet";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/Components/UI/button";
import ConfirmModal from "@/Components/UI/ConfirmModal";
import { can } from "@/utils/can";
import axios from "axios";
import { getToken } from "@/utils/auth";

const Notes = () => {
  const user = JSON.parse(localStorage.getItem("user"));
const token =getToken();
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();
const [restoreRides, setRestoreRides] = useState(false);

  const { data: notesData, loading, refetch } = useGet("/api/admin/notes");

  const columns = [
    { header: "Title", key: "title" },
    { header: "Description", key: "description" },
    { header: "Type", key: "type" },
    { header: "Day Name", key: "dayName" },
    { header: "Date", key: "date" },
    { header: "cancelRides", key: "cancelRides" },
  ];

  const tableData =
    notesData?.data?.notes?.map((note) => ({
      id: note.id,
      title: note.title,
      description: note.description,
      type: note.type,
      date: new Date(note.date).toLocaleDateString(),
      status: note.status,
      dayName: note.dayName,
      cancelRides: note.cancelRides,
    })) || [];

const handleDelete = async () => {
  try {
    await axios.delete(`https://bcknd.kidsero.com/api/admin/notes/${selectedId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        restoreRides: restoreRides, 
      },
    });

    refetch();
  } catch (err) {
    console.error(err);
  } finally {
    setOpenDelete(false);
    setSelectedId(null);
    setRestoreRides(false); // إعادة ضبط للمرّة الجاية
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
        title="Notes Management"
        titleAdd="Note"
        columns={columns}
        data={tableData}
        viewAdd={can(user, "Notes", "Add")}
        onAddClick={() => navigate("add")}
        renderActions={(row) => (
          <div className="flex gap-2 items-center">
            
            {can(user, "Notes", "Edit") && (
              <Button
                variant="edit"
                size="sm"
                onClick={() => navigate(`edit/${row.id}`)}
              >
                <Pencil className="size-4" />
              </Button>
            )}

            {can(user, "Notes", "Delete") && (
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
{openDelete && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
    <div className="bg-white rounded-2xl shadow-xl p-6 w-11/12 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-800">Delete Note</h2>
      <p className="mt-3 text-gray-600">
        Are you sure you want to delete this note? This action cannot be undone.
      </p>

      <div className="flex items-center gap-3 mt-5">
        <input
          type="checkbox"
          id="restoreRides"
          checked={restoreRides}
          onChange={(e) => setRestoreRides(e.target.checked)}
          className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
        <label htmlFor="restoreRides" className="text-gray-700 select-none">
          Restore rides after deletion?
        </label>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setOpenDelete(false)}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}



    </div>
  );
};

export default Notes;
