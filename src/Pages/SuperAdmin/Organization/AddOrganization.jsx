import React, { useState, useEffect } from "react";
import AddPage from "@/Components/AddPage";
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddOrganization = () => {
  const { postData, loading } = usePost("/api/superadmin/organizations");
  const { data: typesData } = useGet("/api/superadmin/organizations/types");
  const navigate = useNavigate();
  const [organizationTypes, setOrganizationTypes] = useState([]);

  // ✅ Load organization types for select dropdown
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

  // ✅ Form schema
  const formSchema = [
    {
      name: "name",
      label: "Organization Name",
      type: "text",
      placeholder: "Enter organization name",
      required: true,
      fullWidth: true,
    },
    {
      name: "phone",
      label: "Phone",
      type: "number",
      placeholder: "Enter phone number",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter email address",
      required: true,
    },
    {
      name: "adminPassword",
      label: "Password",
      type: "number",
      placeholder: "Enter Admin Password",
      required: true,
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      placeholder: "Enter address",
      required: true,
    },
    {
      name: "organizationTypeId",
      label: "Organization Type",
      type: "select",
      options: organizationTypes,
      placeholder: "Select organization type",
      required: true,
    },
    {
      name: "logo",
      label: "Logo",
      type: "file", // File upload component should return Base64
      required: false,
            fullWidth: true
    },
  ];

  // ✅ Save handler
  const handleSave = async (data) => {
    try {

       let logoBase64 = data.logo;
      if (data.logo instanceof File) {
        const reader = new FileReader();
        logoBase64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(data.logo);
        });
      }


      const payload = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        adminPassword: data.adminPassword,
        organizationTypeId: data.organizationTypeId,
        logo: logoBase64, // expect Base64 string
      };

      await postData(payload, null, "Organization added successfully!");
      navigate("/super/organization");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <AddPage
        title="Add New Organization"
        fields={formSchema}
        onSave={handleSave}
        onCancel={() => navigate("/super/organization")}
        loading={loading}
      />

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default AddOrganization;
