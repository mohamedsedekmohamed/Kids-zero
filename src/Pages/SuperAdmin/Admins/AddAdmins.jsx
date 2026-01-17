import AddPage from "@/Components/AddPage";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddAdmins = () => {
  const { postData, loading } = usePost("/api/superadmin/subadmins");
  const navigate = useNavigate();
  const { data: roleData } = useGet("/api/superadmin/roles");
 const parentsOptions =
    roleData?.data?.roles?.map((p) => ({
      value: p.id,
      label: `${p.name} `,
    })) || [];

  // ✅ تعريف الحقول
  const formSchema = [
    { name: "name", label: "Full Name", type: "text", placeholder: "Enter full name", required: true },
    
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

    
   
      await postData(payload, null, "Admin added successfully!");
      navigate("/super/admins");
    
  } catch (err) {
    console.error(err);
  }
};


  return (
    <AddPage
      title="Add New Admin"
      fields={formSchema}
      onSave={handleSave}
      onCancel={() => navigate("/super/admins")}
      loading={loading}
    />
  );
};

export default AddAdmins;
