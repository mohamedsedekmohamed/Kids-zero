import React from "react";
import AddPage from "@/Components/AddPage";
import usePost from "@/hooks/usePost";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddServices = () => {
  const navigate = useNavigate();
  const { postData, loading } = usePost("/api/admin/services");

  /* ================= Form Schema ================= */
  const formSchema = [
    {
      name: "serviceName",
      label: "Service Name",
      type: "text",
      required: true,
      fullWidth: true,
    },
    {
      name: "serviceDescription",
      label: "Service Description",
      type: "textarea",
      required: true,
      fullWidth: true,
    },
    {
        name: "useZonePricing",
        label: "Use Zone Pricing",
        type: "switch",
        defaultValue: false,
    },
    {
      name: "servicePrice",
      label: "Service Price",
      type: "number",
       hidden: (formData) => formData.useZonePricing,
    },

    /* ===== Installments Settings (Optional) ===== */
    {
      name: "allowInstallments",
      label: "Allow Installments",
      type: "switch",
      defaultValue: false,
    },
    {
      name: "maxInstallmentDates",
      label: "Max Installments",
      type: "number",
      hidden: (formData) => !formData.allowInstallments,
    },
    {
      name: "dueDay",
      label: "Due Day of Month",
      type: "number",
      hidden: (formData) => !formData.allowInstallments,
    },
    {
      name: "earlyPaymentDiscount",
      label: "Early Payment Discount (%)",
      type: "number",
    },
    {
      name: "latePaymentFine",
      label: "Late Payment Fine (%)",
      type: "number",
    },
  ];

  /* ================= Save Handler ================= */
  const handleSave = async (formData) => {
  try {
    /* ===== Zone Pricing Validation ===== */
    if (!formData.useZonePricing) {
      if (!formData.servicePrice && formData.servicePrice !== 0) {
        toast.warn("Service price is required when zone pricing is disabled");
        return;
      }
    }

    /* ===== Installments Validation ===== */
    if (formData.allowInstallments) {
      if (!formData.maxInstallmentDates || !formData.dueDay) {
        toast.warn("Please complete installment settings");
        return;
      }
    }

    /* ===== Build Payload Smartly ===== */
    const payload = {
      serviceName: formData.serviceName,
      serviceDescription: formData.serviceDescription,
      useZonePricing: !!formData.useZonePricing,
      allowInstallments: !!formData.allowInstallments,
      earlyPaymentDiscount: Number(formData.earlyPaymentDiscount || 0),
      latePaymentFine: Number(formData.latePaymentFine || 0),
    };

    // ➕ price only if zone pricing is OFF
    if (!formData.useZonePricing) {
      payload.servicePrice = Number(formData.servicePrice);
    }

    // ➕ installments only if enabled
    if (formData.allowInstallments) {
      payload.maxInstallmentDates = Number(formData.maxInstallmentDates);
      payload.dueDay = Number(formData.dueDay);
    }

    await postData(payload, null, "Service added successfully!");
    navigate("/admin/services");
  } catch (err) {
    console.error(err);
    toast.error("Failed to add service");
  }
};


  return (
    <AddPage
      title="Add New Service"
      fields={formSchema}
      onSave={handleSave}
      onCancel={() => navigate("/admin/services")}
      loading={loading}
    />
  );
};

export default AddServices;
