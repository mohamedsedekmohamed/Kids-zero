import React, { useState, useEffect } from "react";
import AddPage from "@/Components/AddPage";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/Components/Loading";

const EditParentPlans = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: planData, loading: loadingGet } = useGet(
    `/api/superadmin/parentplans/${id}`
  );
  const { putData, loading: loadingPut } = usePut("");

  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (planData?.data?.parentPlan) {
      const plan = planData.data.parentPlan;
      setInitialData({
        name: plan.name,
        price: plan.price,
    
        minSubscriptionfeesPay: plan.minSubscriptionFeesPay,
        subscriptionFees: plan.subscriptionFees,
      });
    }
  }, [planData]);

  const formSchema = [
    { name: "name", label: "Plan Name", type: "text", required: true },
    { name: "price", label: "Price", type: "number", required: true },
  {
      name: "minSubscriptionfeesPay",
      label: "Min Subscription Pay",
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
        price: Number(formData.price),
        startDate: formData.startDate,
        endDate: formData.endDate,
        minSubscriptionfeesPay: Number(formData.minSubscriptionfeesPay),
        subscriptionFees: Number(formData.subscriptionFees),
      };

      await putData(
        payload,
        `/api/superadmin/parentplans/${id}`,
        "Parent plan updated successfully!"
      );
      navigate("/super/parentplans");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update Parent Plan");
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
      title="Edit Parent Plan"
      fields={formSchema}
      initialData={initialData}
      onSave={handleSave}
      onCancel={() => navigate("/super/parentplans")}
      loading={loadingPut}
    />
  );
};

export default EditParentPlans;
