import AddPage from "@/Components/AddPage";
import usePut from "@/hooks/usePut";
import useGet from "@/hooks/useGet";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/Components/Loading";

const EditAdmins = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // 🔹 Get admin by id
  const { data, loading: loadingGet } = useGet(`/api/admin/admins/${id}`);

  // 🔹 Put admin
  const { putData, loading } = usePut(`/api/admin/admins/${id}`);

  const originalData = data?.data?.admin;

  // 🔹 نفس دالة المقارنة بالظبط
  const getChangedFields = (original, current) => {
    if (!original) return current;

    const changed = {};

    Object.keys(current).forEach((key) => {
      const currentValue = current[key];
      const originalValue = original[key];

      // تجاهل password لو فاضي
      if (key === "password" && !currentValue) return;

      // avatar جديد
      if (key === "avatar" && currentValue instanceof File) {
        changed.avatar = currentValue;
        return;
      }

      // تجاهل avatar لو String
      if (key === "avatar" && typeof currentValue === "string") return;

      // لو القيمة اتغيرت
      if (currentValue !== originalValue) {
        changed[key] = currentValue;
      }
    });

    return changed;
  };

  // 🔹 الفورم
  const formSchema = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      customValidator: (value) => {
        if (!value) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Invalid email format";
        return null;
      },
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "text",
      required: true,
      customValidator: (value) => {
        if (!value) return "Phone is required";
        if (!/^\d+$/.test(value)) return "Phone must contain digits only";
        if (value.length < 10) return "Phone must be at least 10 digits";
        if (!/^01/.test(value)) return "Phone must start with 01";
        return null;
      },
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Leave empty to keep current password",
    },
    {
      name: "roleId",
      label: "Role",
      type: "select",
      options: [], // تقدر تربطها بـ API لاحقًا
      required: true,
    },
    {
      name: "avatar",
      label: "Upload Avatar",
      type: "file",
      fullWidth: true,
    },
  ];

  // 🔹 الحفظ
  const handleSave = async (formData) => {
    try {
      const changedData = getChangedFields(originalData, formData);

      if (Object.keys(changedData).length === 0) {
        toast("No changes detected");
        navigate("/admin/admins");
        return;
      }

      // avatar → Base64
      if (changedData.avatar instanceof File) {
        const reader = new FileReader();
        reader.readAsDataURL(changedData.avatar);

        reader.onload = async () => {
          await putData({
            ...changedData,
            avatar: reader.result,
          });
          toast.success("Admin updated successfully!");
          navigate("/admin/admins");
        };
      } else {
        await putData(changedData);
        toast.success("Admin updated successfully!");
        navigate("/admin/admins");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  if (loadingGet)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  return (
    <AddPage
      title="Edit Admin"
      fields={formSchema}
      initialData={{
        ...originalData,
        roleId: originalData?.role?.id, // مهم جدًا
      }}
      onSave={handleSave}
      onCancel={() => navigate(-1)}
      loading={loading}
    />
  );
};

export default EditAdmins;
