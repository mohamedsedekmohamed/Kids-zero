import React, { useState } from "react";
import AddPage from "@/components/AddPage";
import usePost from "@/hooks/usePost";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddPaymentMethods = () => {
  const { postData, loading } = usePost("/api/superadmin/paymentmethods");
  const navigate = useNavigate();

  const formSchema = [
    {
      name: "name",
      label: "Payment Method Name",
      type: "text",
      placeholder: "Enter payment method name",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter description",
      fullWidth: true,
    },
    {
      name: "logo",
      label: "Logo",
      type: "file",
      required: true,
            fullWidth: true,

    },
   { name: "is_active", label: "Active", type: "switch" },
  { name: "fee_status", label: "Fee Status", type: "switch" },
    {
      name: "fee_amount",
      label: "Fee Amount",
      type: "number",
      placeholder: "Enter fee amount",
      customValidator: (value, formData) => {
        if (formData.fee_status && (!value && value !== 0)) return "Fee amount is required";
        if (value < 0) return "Fee amount cannot be negative";
        return null;
      },
    },
  ];

  const handleSave = async (data) => {
    try {
      // تحويل الصورة إلى base64 إذا كانت ملف
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
        description: data.description,
        logo: logoBase64,
        is_active: data.is_active || false,
        fee_status: data.fee_status || false,
        fee_amount: data.fee_amount ? Number(data.fee_amount) : 0,
      };

      await postData(payload, null, "Payment method added successfully!");
      toast.success("Payment method added successfully!");
      navigate("/super/paymentmethods");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <AddPage
        title="Add Payment Method"
        fields={formSchema}
        onSave={handleSave}
        onCancel={() => navigate("/super/paymentmethods")}
        loading={loading}
      />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default AddPaymentMethods;
