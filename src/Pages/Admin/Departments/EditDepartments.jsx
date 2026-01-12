import React, { useState, useEffect } from "react";
import AddPage from "@/Components/AddPage";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const EditDepartments = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: departmentData, loading: loadingGet } = useGet(`/api/admin/departments/${id}`);
  const { putData, loading: loadingPut } = usePut("");

  const [initialData, setInitialData] = useState(null);

  // تحميل بيانات القسم عند الوصول
  useEffect(() => {
    if (departmentData?.data?.department) {
      const dept = departmentData.data.department;
      setInitialData({
        name: dept.name,
      });
    }
  }, [departmentData]);

  const formSchema = [
    { name: "name", label: "Department Name", type: "text", required: true },
  ];

  const handleSave = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
      };

      await putData(payload, `/api/admin/departments/${id}`, "Department updated successfully!");
      navigate("/admin/departments");
    } catch (err) {
      console.error(err);
    }
  };

  if (!initialData || loadingGet) return <div>Loading...</div>;

  return (
    <AddPage
      title="Edit Department"
      fields={formSchema}
      initialData={initialData}
      onSave={handleSave}
      onCancel={() => navigate("/admin/departments")}
      loading={loadingPut}
    />
  );
};

export default EditDepartments;
