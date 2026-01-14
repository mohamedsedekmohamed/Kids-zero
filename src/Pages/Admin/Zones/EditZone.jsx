import React from "react";
import AddPage from "@/Components/AddPage";
import usePut from "@/hooks/usePut";
import useGet from "@/hooks/useGet";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/Components/Loading";

const EditZone = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // 🔹 جلب الزون الحالي
  const { data, loading: loadingGet } = useGet(`/api/admin/zones/${id}`);
  const originalData = data?.data?.zone;

  // 🔹 تعديل الزون
  const { putData, loading } = usePut(`/api/admin/zones/${id}`);

  // 🔹 جلب المدن للـ select
  const { data: cityData } = useGet("/api/admin/cities/zones");
  const CITYOptions =
    cityData?.data?.cities?.map((p) => ({
      value: p.id,
      label: p.name,
    })) || [];

  // 🔹 دالة مقارنة البيانات القديمة بالجديدة
  const getChangedFields = (original, current) => {
    if (!original) return current;
    const changed = {};
    Object.keys(current).forEach((key) => {
      if (current[key] !== original[key]) changed[key] = current[key];
    });
    return changed;
  };

  // 🔹 إعداد الفورم
  const formSchema = [
    { name: "name", label: "Zone Name", type: "text", required: true },
    { name: "cost", label: "Cost", type: "number", required: true },
    {
      name: "cityId",
      label: "City",
      type: "select",
      required: true,
      options: CITYOptions,
    },
  ];

  // 🔹 حفظ البيانات
  const handleSave = async (formData) => {
    try {
      const changedData = getChangedFields(originalData, formData);

      if (Object.keys(changedData).length === 0) {
        toast("No changes detected");
        navigate("/admin/zone");
        return;
      }

      await putData({
        ...changedData,
        cost: Number(changedData.cost),
      });

      toast.success("Zone updated successfully!");
      navigate("/admin/zone");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update Zone");
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
      title="Edit Zone"
      fields={formSchema}
      initialData={{
        ...originalData,
        cityId: originalData?.city?.id, 
      }}
      onSave={handleSave}
      onCancel={() => navigate("/admin/zone")}
      loading={loading}
    />
  );
};

export default EditZone;
