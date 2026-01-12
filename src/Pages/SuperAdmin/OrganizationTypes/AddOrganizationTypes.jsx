import React from "react";
import AddPage from "@/Components/AddPage";
import usePost from "@/hooks/usePost";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddOrganizationTypes = () => {
  const { postData, loading } = usePost("/api/superadmin/organizations/types");
  const navigate = useNavigate();

  // ✅ Form schema
  const formSchema = [
    {
      name: "name",
      label: "Organization Type Name",
      type: "text",
      placeholder: "Enter organization type",
      required: true,
    },
  ];

  // ✅ Save handler
  const handleSave = async (data) => {
    try {
      const payload = {
        name: data.name,
      };

      await postData(payload, null, "Organization type added successfully!");
      navigate("/super/typesorganization");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <AddPage
        title="Add New Organization Type"
        fields={formSchema}
        onSave={handleSave}
        onCancel={() => navigate("/super/typesorganization")}
        loading={loading}
      />

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default AddOrganizationTypes;
