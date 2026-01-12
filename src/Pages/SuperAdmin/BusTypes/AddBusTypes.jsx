import AddPage from "@/components/AddPage";
import usePost from "@/hooks/usePost";
import { useNavigate } from "react-router-dom";

const AddBusTypes = () => {
  const { postData, loading } = usePost("/api/superadmin/bustypes");
  const navigate = useNavigate();

  const formSchema = [
    {
      name: "name",
      label: "Bus Type Name",
      type: "text",
      placeholder: "Enter bus type name",
      required: true,
    },
    {
      name: "capacity",
      label: "Capacity",
      type: "number",
      placeholder: "Enter capacity",
      required: true,
      customValidator: (value) => {
        if (!value) return "Capacity is required";
        if (Number(value) <= 0) return "Capacity must be greater than 0";
        return null;
      },
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter description",
      fullWidth: true,
    },
  ];

  const handleSave = async (data) => {
    try {
      const payload = {
        name: data.name,
        capacity: Number(data.capacity),
        description: data.description,
      };

      await postData(payload, null, "Bus type added successfully!");
      navigate("/super/bustypes"); // عدّل المسار حسب الراوت عندك
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AddPage
      title="Add New Bus Type"
      fields={formSchema}
      onSave={handleSave}
      onCancel={() => navigate("/super/bustypes")}
      loading={loading}
    />
  );
};

export default AddBusTypes;
