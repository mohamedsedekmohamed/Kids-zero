import React, { useEffect, useState } from "react";
import AddPage from "@/Components/AddPage";
import usePut from "@/hooks/usePut";
import useGet from "@/hooks/useGet";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/Components/Loading";

const EditOrganizationTypes = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // ✅ GET Organization Type
  const { data, loading: loadingGet } = useGet(
    `/api/superadmin/organizations/types/${id}`
  );

  const originalData = data?.data?.orgType; // افترض أن الـ API يرسل orgType

  const { putData, loading } = usePut(
    `/api/superadmin/organizations/types/${id}`
  );

  // ✅ Local state for the form
  const [formData, setFormData] = useState(null);

  // ✅ Transform API data to formData
  useEffect(() => {
    if (originalData) {
      setFormData({
        name: originalData.name || "",
      });
    }
  }, [originalData]);

  // ✅ Detect changed fields
  const getChangedFields = (original, current) => {
    if (!original) return current;

    const changed = {};

    Object.keys(current).forEach((key) => {
      const currentValue = current[key];
      const originalValue = original[key];

      if (currentValue === "" || currentValue === undefined) return;

      if (currentValue !== originalValue) {
        changed[key] = currentValue;
      }
    });

    return changed;
  };

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

  // ✅ Save
  const handleSave = async (data) => {
    try {
      const changedData = getChangedFields(originalData, data);

      if (Object.keys(changedData).length === 0) {
        toast("No changes detected");
        navigate("/super/typesorganization");
        return;
      }

      await putData(changedData);
      toast.success("Organization type updated successfully!");
      navigate("/super/typesorganization");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  if (loadingGet || !formData)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  return (
    <AddPage
      title="Edit Organization Type"
      fields={formSchema}
      initialData={formData}
      onSave={handleSave}
      onCancel={() => navigate(-1)}
      loading={loading}
    />
  );
};

export default EditOrganizationTypes;
