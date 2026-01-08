import AddPage from "@/components/AddPage";
import usePut from "@/hooks/usePut";
import useGet from "@/hooks/useGet";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/Components/Loading";

const EditParents = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, loading: loadingGet } = useGet(`/api/admin/parents/${id}`);

  const { putData, loading } = usePut(`/api/admin/parents/${id}`);

  const originalData = data?.data?.parent;

const getChangedFields = (original, current) => {
  if (!original) return current;

  const changed = {};

  Object.keys(current).forEach((key) => {
    const currentValue = current[key];
    const originalValue = original[key];

    // تجاهل password لو فاضي
    if (key === "password" && !currentValue) return;

    // لو avatar ملف جديد
    if (key === "avatar" && currentValue instanceof File) {
      changed.avatar = currentValue;
      return;
    }

    // تجاهل avatar لو String (يعني لم تتغير)
    if (key === "avatar" && typeof currentValue === "string") return;

    // لو القيمة اتغيرت
    if (currentValue !== originalValue) {
      changed[key] = currentValue;
    }
  });

  return changed;
};


  const formSchema = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      required: true,
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
      name: "address",
      label: "Address",
      type: "text",
    },
    {
      name: "nationalId",
      label: "National ID",
      type: "text",
    },
    {
      name: "avatar",
      label: "Upload Avatar",
      type: "file",
      fullWidth: true,
    },
  ];

 const handleSave = async (formData) => {
  try {
    const changedData = getChangedFields(originalData, formData);

    if (Object.keys(changedData).length === 0) {
      toast("No changes detected");
      navigate("/admin/parents");
      return;
    }

    // لو avatar ملف → Base64
    if (changedData.avatar instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(changedData.avatar);

      reader.onload = async () => {
        await putData({
          ...changedData,
          avatar: reader.result,
        });
        toast.success("Parent updated successfully!");
        navigate("/admin/parents");
      };
    } else {
      await putData(changedData);
      toast.success("Parent updated successfully!");
      navigate("/admin/parents");
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};


  if (loadingGet) return <div className="flex justify-center items-center h-screen"><Loading/></div>;

  return (
    <AddPage
      title="Edit Parent"
      fields={formSchema}
      initialData={originalData}
      onSave={handleSave}
      onCancel={() => navigate(-1)}
      loading={loading}
    />
  );
};

export default EditParents;
