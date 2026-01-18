import React from "react";
import AddPage from "@/Components/AddPage";
import usePost from "@/hooks/usePost";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddParentPlans = () => {
  const navigate = useNavigate();
  const { postData, loading } = usePost("/api/superadmin/parentplans");

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
      name: "minSubscriptionfeesPay",
      label: "Min Subscription Pay",
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
        startDate: formData.startDate,
        endDate: formData.endDate,
        minSubscriptionfeesPay: Number(formData.minSubscriptionfeesPay),
        subscriptionFees: Number(formData.subscriptionFees),
      };

      await postData(payload, null, "Parent plan added successfully!");
      navigate("/super/parentplans");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add Parent Plan");
    }
  };

  return (
    <AddPage
      title="Add Parent Plan"
      fields={formSchema}
      onSave={handleSave}
      onCancel={() => navigate("/super/parentplans")}
      loading={loading}
    />
  );
};

export default AddParentPlans;
