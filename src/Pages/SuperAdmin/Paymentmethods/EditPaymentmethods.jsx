import React, { useState, useEffect } from "react";
import AddPage from "@/Components/AddPage";
import usePut from "@/hooks/usePut";
import useGet from "@/hooks/useGet";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/Components/Loading";

const EditPaymentMethods = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // ✅ GET payment method
  const { data, loading: loadingGet } = useGet(
    `/api/superadmin/paymentmethods/${id}`
  );

  const originalData = data?.data?.paymentMethod;

  const { putData, loading } = usePut(`/api/superadmin/paymentmethods/${id}`);

  // ✅ Local state for form
  const [formData, setFormData] = useState(null);

  // ✅ Map API data to formData
  useEffect(() => {
    if (originalData) {
      setFormData({
        name: originalData.name || "",
        description: originalData.description || "",
        logo: originalData.logo || "",
        is_active: originalData.isActive || false,
        fee_status: originalData.feeStatus || false,
        fee_amount: originalData.feeAmount || 0,
      });
    }
  }, [originalData]);

  // ✅ Detect changed fields
  const getChangedFields = (original, current) => {
    if (!original) return current;

    const changed = {};

    Object.keys(current).forEach((key) => {
      const currentValue = current[key];
      let originalValue;

      switch (key) {
        case "is_active":
          originalValue = original.isActive;
          break;
        case "fee_status":
          originalValue = original.feeStatus;
          break;
        case "fee_amount":
          originalValue = original.feeAmount;
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
    {
      name: "name",
      label: "Payment Method Name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      fullWidth: true,
    },
    {
      name: "logo",
      label: "Logo",
      type: "file",
    },
    {
      name: "is_active",
      label: "Active",
      type: "switch",
    },
    {
      name: "fee_status",
      label: "Fee Status",
      type: "switch",
    },
    {
      name: "fee_amount",
      label: "Fee Amount",
      type: "number",
      customValidator: (value, formData) => {
        if (formData.fee_status && (!value && value !== 0)) return "Fee amount is required";
        if (value < 0) return "Fee amount cannot be negative";
        return null;
      },
    },
  ];

  // ✅ Save handler
  const handleSave = async (data) => {
    try {
      const changedData = getChangedFields(originalData, data);

      if (Object.keys(changedData).length === 0) {
        toast("No changes detected");
        navigate("/super/paymentmethods");
        return;
      }

      // تحويل الصورة الجديدة إلى Base64
      if (changedData.logo instanceof File) {
        const reader = new FileReader();
        changedData.logo = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(changedData.logo);
        });
      }

      // تحويل الـ switch إلى camelCase API fields
      if ("is_active" in changedData) {
        changedData.isActive = changedData.is_active;
        delete changedData.is_active;
      }
      if ("fee_status" in changedData) {
        changedData.feeStatus = changedData.fee_status;
        delete changedData.fee_status;
      }
      if ("fee_amount" in changedData) {
        changedData.feeAmount = Number(changedData.fee_amount);
        delete changedData.fee_amount;
      }

      await putData(changedData);
      toast.success("Payment method updated successfully!");
      navigate("/super/paymentmethods");
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
      title="Edit Payment Method"
      fields={formSchema}
      initialData={formData}
      onSave={handleSave}
      onCancel={() => navigate(-1)}
      loading={loading}
    />
  );
};

export default EditPaymentMethods;
