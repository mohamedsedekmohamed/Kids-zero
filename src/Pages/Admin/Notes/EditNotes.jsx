import AddPage from "@/Components/AddPage";
import usePut from "@/hooks/usePut";
import useGet from "@/hooks/useGet";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/Components/Loading";

const EditNotes = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, loading: loadingGet } = useGet(`/api/admin/notes/${id}`);
  const { putData, loading } = usePut(`/api/admin/notes/${id}`);

  const originalData = data?.data?.note;

  // نبعث بس الحقول اللي اتغيرت
  const getChangedFields = (original, current) => {
    if (!original) return current;

    const changed = {};

    Object.keys(current).forEach((key) => {
      if (current[key] !== original[key]) {
        changed[key] = current[key];
      }
    });

    return changed;
  };

  const handleSave = async (formData) => {
    try {
      const changedData = getChangedFields(originalData, formData);

      if (Object.keys(changedData).length === 0) {
        toast("No changes detected");
        navigate("/admin/notes");
        return;
      }

      await putData(changedData);
      toast.success("Note updated successfully!");
      navigate("/admin/notes");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  if (loadingGet)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  const formSchema = [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
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

  ];

  return (
    <AddPage
      title="Edit Note"
      fields={formSchema}
      initialData={originalData}
      onSave={handleSave}
      onCancel={() => navigate(-1)}
    />
  );
};

export default EditNotes;
