import AddPage from "@/Components/AddPage";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddAdmins = () => {
  const { postData, loading } = usePost("/api/admin/admins");
  const navigate = useNavigate();
  const { data: roleData } = useGet("/api/admin/roles");
 const parentsOptions =
    roleData?.data?.roles?.map((p) => ({
      value: p.id,
      label: `${p.name} `,
    })) || [];

  // ✅ تعريف الحقول
  const formSchema = [
    { name: "name", label: "Full Name", type: "text", placeholder: "Enter full name", required: true },
    { name: "type", label: "type", type: "select",
      options:[
        { value: "admin", label: "Admin" },
        { value: "organizer", label: "Organizer" },
      
      ]
      , placeholder: "Enter  type", required: true },
    { 
      name: "email", 
      label: "Email", 
      type: "email", 
      placeholder: "example@gmail.com", 
      required: true,
      customValidator: (value) => {
        if (!value) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Invalid email format";
        return null;
      }
    },
    { 
      name: "phone", 
      label: "Phone Number", 
      type: "text", 
      placeholder: "0123456789",
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
{
  name: "roleId",
  label: "Role",
  type: "select",
  placeholder: "Select role",
  options: parentsOptions,
  required: true,
  hidden: (formData) => formData.type === "organizer"
}
  ];

const handleSave = async (data) => {
  try {
    const payload = { ...data };

    if (data.type === "organizer") {
      delete payload.roleId;
    }
if (data.type === "admin" && data.roleId) {
  toast.error("Admin can not have a role");
    }
    if (data.avatar && data.avatar instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(data.avatar);

      reader.onload = async () => {
        await postData(
          { ...payload, avatar: reader.result },
          null,
          "Admin added successfully!"
        );
        navigate("/admin/admins");
      };

      reader.onerror = () => toast.error("Failed to read avatar file");
    } else {
      await postData(payload, null, "Admin added successfully!");
      navigate("/admin/admins");
    }
  } catch (err) {
    console.error(err);
  }
};


  return (
    <AddPage
      title="Add New Admin"
      fields={formSchema}
      onSave={handleSave}
      onCancel={() => navigate("/admin/admins")}
      loading={loading}
    />
  );
};

export default AddAdmins;
