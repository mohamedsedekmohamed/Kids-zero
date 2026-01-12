import AddPage from "@/components/AddPage";
import usePut from "@/hooks/usePut";
import useGet from "@/hooks/useGet";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/Components/Loading";

const EditBusTypes = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // ✅ GET bus type
  const { data, loading: loadingGet } = useGet(
    `/api/superadmin/bustypes/${id}`
  );

  // ✅ PUT bus type
  const { putData, loading } = usePut(
    `/api/superadmin/bustypes/${id}`
  );

  const originalData = data?.data?.busType;

  // ✅ Detect changed fields only
  const getChangedFields = (original, current) => {
    if (!original) return current;

    const changed = {};

    Object.keys(current).forEach((key) => {
      const currentValue = current[key];
      const originalValue = original[key];

      // تجاهل القيم الفاضية
      if (currentValue === "" || currentValue === undefined) return;

      // لو القيمة اتغيرت
      if (currentValue !== originalValue) {
        // capacity لازم رقم
        if (key === "capacity") {
          changed[key] = Number(currentValue);
        } else {
          changed[key] = currentValue;
        }
      }
    });

    return changed;
  };

  // ✅ Form schema
  const formSchema = [
    {
      name: "name",
      label: "Bus Type Name",
      type: "text",
      required: true,
    },
    {
      name: "capacity",
      label: "Capacity",
      type: "number",
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
      fullWidth: true,
    },
  ];

  // ✅ Save
  const handleSave = async (formData) => {
    try {
      const changedData = getChangedFields(originalData, formData);

      if (Object.keys(changedData).length === 0) {
        toast("No changes detected");
        navigate("/admin/bus-types");
        return;
      }

      await putData(changedData);
      toast.success("Bus type updated successfully!");
          navigate("/super/bustypes")
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
      title="Edit Bus Type"
      fields={formSchema}
      initialData={originalData}
      onSave={handleSave}
      onCancel={() => navigate(-1)}
      loading={loading}
    />
  );
};

export default EditBusTypes;
