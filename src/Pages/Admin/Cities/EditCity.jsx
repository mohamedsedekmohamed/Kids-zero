import React, { useState, useEffect } from "react";
import AddPage from "@/Components/AddPage";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/Components/Loading";

const EditCity = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data:cityData, loading: loadingGet } = useGet(`/api/admin/cities/${id}`);
  const { putData, loading: loadingPut } = usePut("");

  const [initialData, setInitialData] = useState(null);

  // تحميل بيانات القسم عند الوصول
  useEffect(() => {
    if (cityData?.data?.city) {
      const dept = cityData.data.city;
      setInitialData({
        name: dept.name,
      });
    }
  }, [cityData]);

  const formSchema = [
    { name: "name", label: "City Name", type: "text", required: true },
  ];

  const handleSave = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
      };

      await putData(payload, `/api/admin/cities/${id}`, "City updated successfully!");
      navigate("/admin/city");
    } catch (err) {
      console.error(err);
    }
  };
  if (!initialData || loadingGet) return <div className="flex justify-center items-center
  h-screen
  "><Loading/></div>;

  return (
    <AddPage
      title="Edit City"
      fields={formSchema}
      initialData={initialData}
      onSave={handleSave}
      onCancel={() => navigate("/admin/city")}
      loading={loadingPut}
    />
  );
};



export default EditCity