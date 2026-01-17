import React from "react";
import AddPage from "@/Components/AddPage";
import usePost from "@/hooks/usePost";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddPlans = () => {
  const navigate = useNavigate();
  const { postData, loading } = usePost("/api/superadmin/plans");

  const formSchema = [
    {
      name: "name",
      label: "Plan Name",
      type: "text",
      required: true,
    },
    {
      name: "price_semester",
      label: "Semester Price",
      type: "number",
      required: true,
    },
    {
      name: "price_year",
      label: "Year Price",
      type: "number",
      required: true,
    },
    {
      name: "max_buses",
      label: "Max Buses",
      type: "number",
      required: true,
    },
    {
      name: "max_drivers",
      label: "Max Drivers",
      type: "number",
      required: true,
    },
    {
      name: "max_students",
      label: "Max Students",
      type: "number",
      required: true,
    },
    {
      name: "subscriptionFees",
      label: "Subscription Fees",
      type: "number",
      required: true,
    },
  ];

  const handleSave = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        price_semester: Number(formData.price_semester),
        price_year: Number(formData.price_year),
        max_buses: Number(formData.max_buses),
        max_drivers: Number(formData.max_drivers),
        max_students: Number(formData.max_students),
        subscriptionFees: Number(formData.subscriptionFees),
      };

      await postData(payload, null, "Plan added successfully!");
      navigate("/superadmin/plans");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add Plan");
    }
  };

  return (
    <AddPage
      title="Add New Plan"
      fields={formSchema}
      onSave={handleSave}
      onCancel={() => navigate("/superadmin/plans")}
      loading={loading}
    />
  );
};

export default AddPlans;
