import React from "react";
import AddPage from "@/Components/AddPage";
import usePost from "@/hooks/usePost";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useGet from "@/hooks/useGet";

const AddZone = () => {
  const navigate = useNavigate();
  const { postData, loading } = usePost("/api/admin/zones");
  const { data: cityData } = useGet("/api/admin/cities/zones");
  const CITYOptions =
    cityData?.data?.cities?.map((p) => ({
      value: p.id,
      label: `${p.name} `,
    })) || [];
  const formSchema = [
    { name: "name", label: "Zone Name", type: "text", required: true },
    { name: "cost", label: "Cost", type: "number", required: true  },
    { name: "cityId", label: "City", type: "select", required: true,     options: CITYOptions,
 }
  ];

  const handleSave = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        cost: Number(formData.cost),
        cityId: formData.cityId
      };

      await postData(payload, null, "Zone added successfully!");
      navigate("/admin/zone");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add Zone");
    }
  };

  return (
    <AddPage
      title="Add New Zone"
      fields={formSchema}
      onSave={handleSave}
      onCancel={() => navigate("/admin/zone")}
      loading={loading}
    />
  );
};

export default AddZone;
