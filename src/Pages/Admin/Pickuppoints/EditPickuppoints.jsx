  import React, { useEffect, useMemo, useState } from "react";
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
  const { data: parentsData } = useGet("/api/admin/students/selection");

  const zoneOptions = useMemo(() => {
    return (
      parentsData?.data?.zones?.map((p) => ({
        value: p.id,
        label: `${p.name} - cost(${p.cost})`,
      })) || []
    );
  }, [parentsData]);

  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (!data?.data?.pickupPoint) return;

    const pickup = data.data.pickupPoint;

    const zoneOption = zoneOptions.find((z) => String(z.value) === String(pickup.zoneId));

    setInitialData({
      ...pickup,
      zoneId: zoneOption || null,
    });
  }, [data, zoneOptions]);

  const handleSave = async (formData) => {
    try {
      const changedData = {};

      Object.keys(formData).forEach((key) => {
        if (key === "zoneId") {
          // ناخد بس القيمة
          if (formData[key]?.value !== initialData[key]?.value) {
            changedData[key] = formData[key]?.value;
          }
        } else if (formData[key] !== initialData[key]) {
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

  if (loadingGet || !initialData)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  const formSchema = [
    { name: "name", label: "Pickup Point Name", type: "text", required: true },
    { name: "address", label: "Address", type: "text", required: true, fullWidth: true },
    {
      name: "zoneId",
      label: "Select Zone",
      type: "autocomplete",
      placeholder: "Select Zone",
      options: zoneOptions,
      required: true,
      fullWidth: true,
    },
    { name: "lat", label: "Latitude", type: "text", required: true },
    { name: "lng", label: "Longitude", type: "text", required: true },
    { name: "map", type: "map", fullWidth: true },
  ];

  return (
    <AddPage
      title="Edit Pickup Point"
      fields={formSchema}
      initialData={initialData}
      onSave={handleSave}
      onCancel={() => navigate(-1)}
      loading={loading}
    />
  );
};

export default EditPickuppoints;