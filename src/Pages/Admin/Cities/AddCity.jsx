import React from "react";
import AddPage from "@/Components/AddPage";
import usePost from "@/hooks/usePost";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddCity = () => {
  const navigate = useNavigate();
  const { postData, loading } = usePost("/api/admin/cities");

  const formSchema = [
    { name: "name", label: "City Name", type: "text", required: true },
  ];

  const handleSave = async (formData) => {
    try {
      const payload = {
        name: formData.name,
      };

      await postData(payload, null, "City added successfully!");
      navigate("/admin/city");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add City");
    }
  };

  return (
    <AddPage
      title="Add New City"
      fields={formSchema}
      onSave={handleSave}
      onCancel={() => navigate("/admin/city")}
      loading={loading}
    />
  );
};


export default AddCity