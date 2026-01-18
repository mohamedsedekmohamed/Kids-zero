import React, { useState, useEffect } from "react";
import AddPage from "@/Components/AddPage";
import usePut from "@/hooks/usePut";
import useGet from "@/hooks/useGet";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/Components/Loading";

const EditOrganization = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // ✅ GET organization by ID
  const { data, loading: loadingGet } = useGet(`/api/superadmin/organizations/${id}`);
  const originalData = data?.data?.org;

  const { putData, loading } = usePut(`/api/superadmin/organizations/${id}`);

  // ✅ Local form state
  const [formData, setFormData] = useState(null);
  const [organizationTypes, setOrganizationTypes] = useState([]);

  // ✅ Load initial form data
  useEffect(() => {
    if (originalData) {
      setFormData({
        name: originalData.name || "",
        phone: originalData.phone || "",
        email: originalData.email || "",
        address: originalData.address || "",
        organizationTypeId: originalData.organizationTypeId|| "",
        logo: originalData.logo || "",
      });
    }
  }, [originalData]);

  // ✅ Load organization types for select
  const { data: typesData } = useGet("/api/superadmin/organizations/types");
  useEffect(() => {
    if (typesData?.data?.orgTypes) {
      setOrganizationTypes(
        typesData.data.orgTypes.map((type) => ({
          label: type.name,
          value: type.id,
        }))
      );
    }
  }, [typesData]);

  // ✅ Detect changed fields
const getChangedFields = (original, current) => {
  if (!original) return current;

  const changed = {};
  Object.keys(current).forEach((key) => {
    // ❌ تجاهل الباسورد هنا
    if (key === "adminPassword") return;

    const currentValue = current[key];
    let originalValue;

    switch (key) {
      case "organizationTypeId":
        originalValue = original.organizationType?.id || "";
        break;
      case "logo":
        originalValue = original.logo;
        break;
      default:
        originalValue = original[key];
    }

    if (currentValue === "" || currentValue === undefined) return;

    if (currentValue !== originalValue) {
      changed[key] = currentValue;
    }
  });

  return changed;
};

  // ✅ Form schema
  const formSchema = [
    { name: "name", label: "Organization Name", type: "text", required: true },
    { name: "phone", label: "Phone", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
     {
      name: "adminPassword",
      label: "Password",
      type: "number",
      placeholder: "Enter Admin Password",
    },
    { name: "address", label: "Address", type: "text", required: true },
    {
      name: "organizationTypeId",
      label: "Organization Type",
      type: "select",
      options: organizationTypes,
      required: true,
    },
    { name: "logo", label: "Logo", type: "file" }, // file input returning Base64
  ];

  // ✅ Save handler
const handleSave = async (data) => {
  try {
    const changedData = getChangedFields(originalData, data);

    // ✅ لو كتب باسورد → ابعته
    if (data.adminPassword && data.adminPassword.trim() !== "") {
      changedData.adminPassword = data.adminPassword;
    }

    if (Object.keys(changedData).length === 0) {
      toast("No changes detected");
      navigate("/super/organizations");
      return;
    }

    // ✅ تحويل اللوجو Base64 لو اتغير
    if (changedData.logo instanceof File) {
      const reader = new FileReader();
      changedData.logo = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(changedData.logo);
      });
    }

    await putData(changedData);
    toast.success("Organization updated successfully!");
    navigate("/super/organization");
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
      title="Edit Organization"
      fields={formSchema}
      initialData={formData}
      onSave={handleSave}
      onCancel={() => navigate(-1)}
      loading={loading}
    />
  );
};

export default EditOrganization;
