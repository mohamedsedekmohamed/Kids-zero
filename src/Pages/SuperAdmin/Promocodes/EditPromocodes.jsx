import React, { useEffect, useState } from "react";
import AddPage from "@/Components/AddPage";
import usePut from "@/hooks/usePut";
import useGet from "@/hooks/useGet";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/Components/Loading";

const EditPromocodes = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, loading: loadingGet } = useGet(
    `/api/superadmin/promocodes/${id}`
  );

  const originalData = data?.data?.promoCode;

  const { putData, loading } = usePut(`/api/superadmin/promocodes/${id}`);

  // ✅ Local state for the form
  const [formData, setFormData] = useState(null);

  // ✅ Transform API data to formData
  useEffect(() => {
    if (originalData) {
      setFormData({
        name: originalData.name || "",
        code: originalData.code || "",
        promocode_type: originalData.promocodeType || "",
        amount: originalData.amount || "",
        description: originalData.description || "",
        start_date: originalData.startDate || "",
        end_date: originalData.endDate || "",
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

      // Map form field to API field
      switch (key) {
        case "promocode_type":
          originalValue = original.promocodeType;
          break;
        case "start_date":
          originalValue = original.startDate;
          break;
        case "end_date":
          originalValue = original.endDate;
          break;
        default:
          originalValue = original[key];
      }

      if (currentValue === "" || currentValue === undefined) return;

      if (currentValue !== originalValue) {
        if (key === "amount") {
          changed[key] = Number(currentValue);
        } else if (key === "start_date" || key === "end_date") {
          changed[key] = new Date(currentValue).toISOString();
        } else if (key === "promocode_type") {
          changed.promocodeType = currentValue;
        } else {
          changed[key] = currentValue;
        }
      }
    });

    return changed;
  };

  // ✅ Form schema
  const formSchema = [
    { name: "name", label: "Promo Name", type: "text", required: true },
    { name: "code", label: "Promo Code", type: "text", required: true },
    {
      name: "promocode_type",
      label: "Promo Type",
      type: "select",
      required: true,
      options: [
        { label: "Percentage", value: "percentage" },
        { label: "Amount", value: "amount" },
      ],
    },
    {
      name: "amount",
      label: "Amount",
      type: "number",
      required: true,
      customValidator: (value, formData) => {
        if (!value) return "Amount is required";
        if (Number(value) <= 0) return "Amount must be greater than 0";
        if (formData.promocode_type === "percentage" && Number(value) > 100)
          return "Percentage cannot exceed 100";
        return null;
      },
    },
    { name: "start_date", label: "Start Date", type: "date", required: true },
    {
      name: "end_date",
      label: "End Date",
      type: "date",
      required: true,
      customValidator: (value, formData) => {
        if (!value) return "End date is required";
        if (
          formData.start_date &&
          new Date(value) <= new Date(formData.start_date)
        )
          return "End date must be greater than start date";
        return null;
      },
    },
    { name: "description", label: "Description", type: "textarea", fullWidth: true },
  ];

  // ✅ Save
  const handleSave = async (data) => {
    try {
      const changedData = getChangedFields(originalData, data);

      if (Object.keys(changedData).length === 0) {
        toast("No changes detected");
        navigate("/super/promocodes");
        return;
      }

      // Convert start/end dates to camelCase for API
      if (changedData.start_date) {
        changedData.startDate = new Date(changedData.start_date).toISOString();
        delete changedData.start_date;
      }
      if (changedData.end_date) {
        changedData.endDate = new Date(changedData.end_date).toISOString();
        delete changedData.end_date;
      }

      await putData(changedData);
      toast.success("Promo code updated successfully!");
      navigate("/super/promocodes");
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
      title="Edit Promo Code"
      fields={formSchema}
      initialData={formData}
      onSave={handleSave}
      onCancel={() => navigate(-1)}
      loading={loading}
    />
  );
};

export default EditPromocodes;
