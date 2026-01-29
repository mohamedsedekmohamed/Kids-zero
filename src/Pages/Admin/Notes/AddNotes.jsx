import AddPage from "@/Components/AddPage";
import usePost from "@/hooks/usePost";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddNotes = () => {
  const { postData, loading } = usePost("/api/admin/notes");
  const navigate = useNavigate();

  const formSchema = [
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Enter note title",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter description",
      required: true,
      fullWidth: true,
    },
    {
      name: "date",
      label: "Date",
      type: "date",
      required: true,
    },
    {
      name: "type",
      label: "Type",
      type: "select",
      required: true,
      options: [
        { label: "Holiday", value: "holiday" },
        { label: "Event", value: "event" },
        { label: "Announcement", value: "announcement" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "cancelRides",
      label: "Cancel Rides",
      type: "switch",
      defaultValue: false,
      fullWidth: true,
    },
  ];

  const handleSave = async (data) => {
    try {
      await postData(data, null, "Note added successfully!");
      navigate("/admin/notes");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add note");
    }
  };

  return (
    <AddPage
      title="Add New Note"
      fields={formSchema}
      onSave={handleSave}
      onCancel={() => navigate("/admin/notes")}
      loading={loading}
    />
  );
};

export default AddNotes;
