import AddPage from "@/Components/AddPage";
import usePost from "@/hooks/usePost";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddDrivers = () => {
  const { postData, loading } = usePost("/api/admin/drivers");
  const navigate = useNavigate();

  const formSchema = [
    { name: "name", label: "Full Name", type: "text", placeholder: "Enter full name", required: true },
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
      }
    },
    { name: "password", label: "Password", type: "password", placeholder: "Enter password", required: true },
    { name: "nationalId", label: "National ID", type: "text", placeholder: "Enter National ID" },
    { name: "licenseExpiry", label: "License Expiry Date", type: "date", required: true },
    { name: "avatar", label: "Upload Avatar", type: "file", fullWidth: true },
    { name: "licenseImage", label: "Upload License Image", type: "file", fullWidth: true },
    { name: "nationalIdImage", label: "Upload National ID Image", type: "file", fullWidth: true },
  ];

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSave = async (data) => {
    try {
      const files = ["avatar", "licenseImage", "nationalIdImage"];
      const payload = { ...data };

      // تحويل كل ملف لـ Base64
      for (const key of files) {
        if (data[key] && data[key] instanceof File) {
          payload[key] = await convertFileToBase64(data[key]);
        }
      }

      await postData(payload, null, "Driver added successfully!");
      navigate("/admin/drivers");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add driver");
    }
  };

  return (
    <AddPage
      title="Add New Driver"
      fields={formSchema}
      onSave={handleSave}
      onCancel={() => navigate("/admin/drivers")}
      loading={loading}
    />
  );
};

export default AddDrivers;
