import AddPage from "@/Components/AddPage";
import usePut from "@/hooks/usePut";
import useGet from "@/hooks/useGet";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/Components/Loading";
import { useState, useEffect } from "react";

const EditServices = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  /* ================= Get Service ================= */
  const { data, loading: loadingGet } = useGet(`/api/admin/services/${id}`);
  const { putData, loading } = usePut(`/api/admin/services/${id}`);

  const [formState, setFormState] = useState(null);

  const originalData = Array.isArray(data?.data?.data)
    ? data.data.data[0]
    : data?.data?.data;

  // عندما يتم تحميل البيانات، نضبط formState
  useEffect(() => {
    if (originalData) {
      setFormState({
        serviceName: originalData.serviceName ?? "",
        serviceDescription: originalData.serviceDescription ?? "",
        servicePrice: originalData.servicePrice ?? "",
        useZonePricing: originalData.useZonePricing ?? false,
        allowInstallments: originalData.allowInstallments ?? false,
        maxInstallmentDates: originalData.maxInstallmentDates ?? "",
        dueDay: originalData.dueDay ?? "",
        earlyPaymentDiscount: originalData.earlyPaymentDiscount ?? 0,
        latePaymentFine: originalData.latePaymentFine ?? 0,
      });
    }
  }, [originalData]);

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

    /* ===== Installments (Optional) ===== */
    {
      name: "allowInstallments",
      label: "Allow Installments",
      type: "switch",
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

  /* ================= Save ================= */
const handleSave = async (formData) => {
  try {
    if (!originalData) return;

  
    const payload = {
      serviceName: formData.serviceName ?? "",
      serviceDescription: formData.serviceDescription ?? "",
      useZonePricing: formData.useZonePricing ?? false,
      servicePrice: formData.useZonePricing
        ? 0
        : Number(formData.servicePrice ?? 0),
      allowInstallments: formData.allowInstallments ?? false,
      maxInstallmentDates: formData.allowInstallments
        ? Number(formData.maxInstallmentDates ?? 0)
        : 0,
      dueDay: formData.allowInstallments
        ? Number(formData.dueDay ?? 0)
        : 0,
     earlyPaymentDiscount: Number(formData.earlyPaymentDiscount || 0),
      latePaymentFine: Number(formData.latePaymentFine || 0),
    };

    // validations
    if (!payload.useZonePricing && !formData.servicePrice) {
      toast.warn("Service Price is required when not using zone pricing");
      return;
    }

    if (payload.allowInstallments) {
      if (!formData.maxInstallmentDates || !formData.dueDay) {
        toast.warn("Please complete installment settings");
        return;
      }
    }

    await putData(payload);
    toast.success("Service updated successfully!");
    navigate("/admin/services");
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};


  if (loadingGet || !formState)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  return (
    <AddPage
      title="Edit Service"
      fields={formSchema}
      initialData={formState}
      onSave={handleSave}
      onCancel={() => navigate(-1)}
      loading={loading}
    />
  );
};

export default EditServices;
