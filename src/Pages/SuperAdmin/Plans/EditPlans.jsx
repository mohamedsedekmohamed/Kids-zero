import React, { useState, useEffect } from "react";
import AddPage from "@/Components/AddPage";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/Components/Loading";

const EditPlans = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: planData, loading: loadingGet } = useGet(
    `/api/superadmin/plans/${id}`
  );
  const { putData, loading: loadingPut } = usePut("");

  const [initialData, setInitialData] = useState(null);

  // Load plan data
  useEffect(() => {
    if (planData?.data?.plan) {
      const plan = planData.data.plan;
      setInitialData({
        name: plan.name,
        price: plan.price,
        max_buses: plan.maxBuses,
        max_drivers: plan.maxDrivers,
        max_students: plan.maxStudents,
        subscriptionFees: plan.subscriptionFees,
        min_subscriptionfeesPay: plan.minSubscriptionFeesPay,
      });
    }
  }, [planData]);

  const formSchema = [
    { name: "name", label: "Plan Name", type: "text", required: true },
  
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
        price_semester: Number(formData.price_semester),
        price_year: Number(formData.price_year),
        max_buses: Number(formData.max_buses),
        max_drivers: Number(formData.max_drivers),
        max_students: Number(formData.max_students),
        subscriptionFees: Number(formData.subscriptionFees),
         min_subscriptionfeesPay: Number(formData.min_subscriptionfeesPay),
      };

      await putData(
        payload,
        `/api/superadmin/plans/${id}`,
        "Plan updated successfully!"
      );
      navigate("/super/plans");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update Plan");
    }
  };

  if (!initialData || loadingGet)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  return (
    <AddPage
      title="Edit Plan"
      fields={formSchema}
      initialData={initialData}
      onSave={handleSave}
      onCancel={() => navigate("/super/plans")}
      loading={loadingPut}
    />
  );
};

export default EditPlans;
