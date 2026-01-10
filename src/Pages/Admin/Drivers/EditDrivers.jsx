import AddPage from "@/components/AddPage";
import usePut from "@/hooks/usePut";
import useGet from "@/hooks/useGet";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/Components/Loading";

const EditDrivers = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, loading: loadingGet } = useGet(`/api/admin/drivers/${id}`);
  const { putData, loading } = usePut(`/api/admin/drivers/${id}`);

  const originalData = data?.data?.driver;

  // تحويل الملفات الجديدة فقط + password + تاريخ الرخصة
  const getChangedFields = (original, current) => {
    if (!original) return current;

    const changed = {};

    Object.keys(current).forEach((key) => {
      const currentValue = current[key];
      const originalValue = original[key];

      // تجاهل password لو فاضي
      if (key === "password" && !currentValue) return;

      // تجاهل الصور إذا لم تتغير
      if (["avatar", "licenseImage", "nationalIdImage"].includes(key)) {
        if (currentValue instanceof File) {
          changed[key] = currentValue;
        }
        return;
      }

      // لو القيمة اتغيرت
      if (currentValue !== originalValue) {
        changed[key] = currentValue;
      }
    });

    return changed;
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleSave = async (formData) => {
    try {
      const changedData = getChangedFields(originalData, formData);

      if (Object.keys(changedData).length === 0) {
        toast("No changes detected");
        navigate("/admin/drivers");
        return;
      }

      const fileFields = ["avatar", "licenseImage", "nationalIdImage"];
      for (const key of fileFields) {
        if (changedData[key] instanceof File) {
          changedData[key] = await convertFileToBase64(changedData[key]);
        }
      }

      // تحويل تاريخ الرخصة لصيغة ISO
      if (changedData.licenseExpiry) {
        changedData.licenseExpiry = new Date(changedData.licenseExpiry).toISOString();
      }

      await putData(changedData);
      toast.success("Driver updated successfully!");
      navigate("/admin/drivers");
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
    { name: "name", label: "Full Name", type: "text", required: true },
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
    { name: "password", label: "Password", type: "password", placeholder: "Leave empty to keep current password" },
    { name: "nationalId", label: "National ID", type: "text" },
    { name: "licenseExpiry", label: "License Expiry Date", type: "date", required: true },
    { name: "avatar", label: "Upload Avatar", type: "file", fullWidth: true },
    { name: "licenseImage", label: "Upload License Image", type: "file", fullWidth: true },
    { name: "nationalIdImage", label: "Upload National ID Image", type: "file", fullWidth: true },
  ];

  return (
    <AddPage
      title="Edit Driver"
      fields={formSchema}
      initialData={originalData}
      onSave={handleSave}
      onCancel={() => navigate(-1)}
      loading={loading}
    />
  );
};

export default EditDrivers;
