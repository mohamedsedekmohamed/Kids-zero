import React from "react";
import AddPage from "@/Components/AddPage";
import usePost from "@/hooks/usePost";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddDepartments = () => {
  const navigate = useNavigate();
  const { postData, loading } = usePost("/api/admin/departments");

  const formSchema = [
    { name: "name", label: "Department Name", type: "text", required: true },
  ];

  const handleSave = async (formData) => {
    try {
      const payload = {
        name: formData.name,
      };

      await postData(payload, null, "Department added successfully!");
      navigate("/admin/departments");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add department");
    }
  };

  return (
    <AddPage
      title="Add New Department"
      fields={formSchema}
      onSave={handleSave}
      onCancel={() => navigate("/admin/departments")}
      loading={loading}
    />
  );
};

export default AddDepartments;
