import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";
import toast from "react-hot-toast";
import Loading from "@/Components/Loading";
import AddPage from "@/Components/AddPage";

const EditPickuppoints = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, loading: loadingGet } = useGet(`/api/admin/pickuppoints/${id}`);
  const { putData, loading } = usePut(`/api/admin/pickuppoints/${id}`);

  const originalData = data?.data?.pickupPoint;

  const handleSave = async (formData) => {
    try {
      // فقط الحقول التي تغيرت
      const changedData = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== originalData[key]) {
          changedData[key] = formData[key];
        }
      });

      if (Object.keys(changedData).length === 0) {
        toast("No changes detected");
        navigate("/admin/pickuppoints");
        return;
      }

      await putData(changedData);
      toast.success("Pickup point updated successfully!");
      navigate("/admin/pickuppoints");
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
    { name: "name", label: "Pickup Point Name", type: "text", required: true },
    { name: "address", label: "Address", type: "text", required: true, fullWidth: true },
    {
      name: "lat",
      label: "Latitude",
      type: "text",
      required: true,
    },
    {
      name: "lng",
      label: "Longitude",
      type: "text",
      required: true,
    },
    {
      name: "map",
      type: "map",
      fullWidth: true,
    },
  ];

  return (
    <AddPage
      title="Edit Pickup Point"
      fields={formSchema}
      initialData={originalData}
      onSave={handleSave}
      onCancel={() => navigate(-1)}
      loading={loading}
    />
  );
};

export default EditPickuppoints;
