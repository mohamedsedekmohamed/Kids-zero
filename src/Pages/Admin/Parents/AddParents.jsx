  import AddPage from "@/Components/AddPage";
  import usePost from "@/hooks/usePost";
  import toast from "react-hot-toast";
  import { useNavigate } from "react-router-dom";
  const AddParents = () => {
    const { postData, loading } = usePost("/api/admin/parents");
  const navigator = useNavigate();
    const formSchema = [
      { name: "name", label: "Full Name", type: "text", placeholder: "Enter full name", required: true },
      { name: "phone", label: "Phone Number", type: "text", placeholder: "0123456789", required: true,
      customValidator: (value) => {
    if (!value) return "Phone is required"; // لو فاضي
    if (!/^\d+$/.test(value)) {
      return "Phone must contain digits only";
    }
    if (value.length < 10) {
      return "Phone must be at least 10 digits";
    }
    if (!/^01/.test(value)) {
      return "Phone must start with 01";
    }
    return null; // لا يوجد خطأ
  }

      },
      { name: "password", label: "Password", type: "password", placeholder: "Enter password", required: true },
      { name: "address", label: "Address", type: "text", placeholder: "Enter address" },
      { name: "nationalId", label: "National ID", type: "text", placeholder: "Enter National ID" },
      { name: "avatar", label: "Upload Avatar", type: "file", fullWidth: true },
    ];
  const handleSave = async (data) => {
    try {
      if (data.avatar && data.avatar instanceof File) {
        const reader = new FileReader();
        reader.readAsDataURL(data.avatar);

        reader.onload = async () => {
          const payload = { ...data, avatar: reader.result };
          await postData(payload, null, "Parent added successfully!");
          navigator("/admin/parents"); // <=== هنا ضيف العودة
        };

        reader.onerror = () => toast.error("Failed to read avatar file");
      } else {
        await postData(data, null, "Parent added successfully!");
        navigator("/admin/parents");
      }
    } catch (err) {
      console.error(err);
    }
  };


    return (
      <AddPage
        title="Add New Parent"
        fields={formSchema}
        onSave={handleSave}
        onCancel={() => console.log("Back to Parents Table")}
        loading={loading}
      />
    );
  };

  export default AddParents;
