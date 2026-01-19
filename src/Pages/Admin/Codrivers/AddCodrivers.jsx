import AddPage from "@/Components/AddPage";
import usePost from "@/hooks/usePost";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddCodrivers = () => {
  const { postData, loading } = usePost("/api/admin/codrivers");
  const navigate = useNavigate();

  const formSchema = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Enter full name",
      required: true,
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "text",
      placeholder: "01012345678",
      required: true,
      customValidator: (value) => {
        if (!value) return "Phone is required";
        if (!/^\d+$/.test(value)) return "Phone must contain digits only";
        if (value.length < 10) return "Phone must be at least 10 digits";
        if (!/^01/.test(value)) return "Phone must start with 01";
        return null;
      },
    },
     { name: "email", label: "Gmail", type: "email", placeholder: "Enter email", required: true },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter password",
      required: true,
    },
    {
      name: "nationalId",
      label: "National ID",
      type: "text",
      placeholder: "Enter National ID",
      required: true,
    },
    {
      name: "avatar",
      label: "Upload Avatar",
      type: "file",
      fullWidth: true,
    },
    {
      name: "nationalIdImage",
      label: "Upload National ID Image",
      type: "file",
      fullWidth: true,
    },
  ];

  /* ========= Convert File → Base64 ========= */
  const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  /* ========= Save Handler ========= */
  const handleSave = async (data) => {
    try {
      const payload = { ...data };
      const files = ["avatar", "nationalIdImage"];

      for (const key of files) {
        if (data[key] instanceof File) {
          payload[key] = await convertFileToBase64(data[key]);
        }
      }

      await postData(payload, null, "Co-Driver added successfully!");
      navigate("/admin/codrivers");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add co-driver");
    }
  };

  return (
    <AddPage
      title="Add New Co-Driver"
      fields={formSchema}
      onSave={handleSave}
      onCancel={() => navigate("/admin/codrivers")}
      loading={loading}
    />
  );
};

export default AddCodrivers;
