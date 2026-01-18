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
      name: "price",
      label: "Price",
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
    {
      name: "min_subscriptionfeesPay",
      label: "Min Subscription Fees",
      type: "number",
      required: true,
    },
  ];

  const handleSave = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        max_buses: Number(formData.max_buses),
        max_drivers: Number(formData.max_drivers),
        max_students: Number(formData.max_students),
        subscriptionFees: Number(formData.subscriptionFees),
        min_subscriptionfeesPay: Number(formData.min_subscriptionfeesPay),
      };

      await postData(payload, null, "Plan added successfully!");
      navigate("/super/plans");
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
      onCancel={() => navigate("/super/plans")}
      loading={loading}
    />
  );
};

export default AddPlans;
