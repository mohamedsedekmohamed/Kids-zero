import React, { useState, useEffect } from "react";
import AddPage from "@/Components/AddPage";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Bus,
  Users,
  GraduationCap,
  CreditCard,
  CheckCircle,
  Sparkles,
} from "lucide-react";
const PlanCardsSelector = ({ plans, selectedPlan, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {plans.map((plan) => {
        const isSelected = selectedPlan?.value === plan.id;

        return (
          <div
            key={plan.id}
            onClick={() =>
              onSelect({
                value: plan.id,
                label: plan.name,
              })
            }
            className={`
              relative cursor-pointer rounded-3xl p-[1px]
              transition-all duration-300
              ${isSelected
                ? "bg-gradient-to-r from-one via-purple-500 to-pink-500 scale-[1.02]"
                : "bg-border hover:scale-[1.02]"}
            `}
          >
            {/* Card Body */}
            <div
              className={`
                h-full rounded-3xl p-6 backdrop-blur-xl
                transition-all duration-300
                ${isSelected
                  ? "bg-white/80 shadow-2xl"
                  : "bg-white/60 hover:bg-white/80 shadow-lg"}
              `}
            >
              {/* Badge */}
              {isSelected && (
                <div className="absolute -top-3 right-4 px-3 py-1 text-xs font-bold rounded-full bg-one text-white flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-3 h-3" />
                  Recommended
                </div>
              )}

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {plan.name}
                </h3>
                {isSelected && (
                  <CheckCircle className="w-6 h-6 text-one" />
                )}
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">
                  {plan.subscriptionFees}
                </span>
                <span className="text-sm text-gray-500 ml-1">/month</span>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-6" />

              {/* Details */}
              <ul className="space-y-4 text-sm text-gray-700">
                <li className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-one/10 text-one">
                    <Bus className="w-4 h-4" />
                  </div>
                  <span>
                    <strong>{plan.maxBuses}</strong> Buses
                  </span>
                </li>

                <li className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
                    <Users className="w-4 h-4" />
                  </div>
                  <span>
                    <strong>{plan.maxDrivers}</strong> Drivers
                  </span>
                </li>

                <li className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-pink-500/10 text-pink-600">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <span>
                    <strong>{plan.maxStudents}</strong> Students
                  </span>
                </li>

                <li className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                    <CreditCard className="w-4 h-4" />
                    </div>
                  <span>
                    Min Pay: <strong>{plan.minSubscriptionFeesPay}</strong>
                  </span>
                </li>
              </ul>

              {/* CTA */}
              <div className="mt-8">
                <button
                  type="button"
                  className={`
                    w-full py-3 rounded-2xl font-semibold text-sm
                    transition-all duration-300
                    ${isSelected
                      ? "bg-one text-white shadow-lg shadow-one/30"
                      : "bg-gray-100 text-gray-700 hover:bg-one hover:text-white"}
                  `}
                >
                  {isSelected ? "Plan Selected" : "Select Plan"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const AddPayments = () => {
  const navigate = useNavigate();
  const [showNextDueDate, setShowNextDueDate] = useState(false);

  // Get plans
  const { data: plansData } = useGet("/api/admin/plans");

  // Get payment methods
  const { data: paymentMethodsData } = useGet("/api/admin/paymentmethods");

  // Post payment
  const { postData:payment } = usePost("/api/admin/payments");
  const { postData:payplan ,loading } = usePost("/api/admin/payments/plan-price");



  const paymentMethodOptions =
    paymentMethodsData?.data?.paymentMethods
      ?.filter((m) => m.isActive)
      ?.map((m) => ({
        value: m.id,
        label: m.name,
      })) || [];

  // Fields
const formSchema = [
 {
  name: "planId",
  label: "Select Plan",
  type: "custom",
  fullWidth: true,
  required: true,
  render: ({ value, onChange }) => (
    <PlanCardsSelector
      plans={plansData?.data?.plans || []}
      selectedPlan={value}
      onSelect={onChange}
    />
  ),
}
,
  {
    name: "paymentMethodId",
    label: "Payment Method",
    type: "autocomplete",
    options: paymentMethodOptions,
    required: true,
    fullWidth: true,
  },
  {
    name: "amount",
    label: "Amount",
    type: "number",
    required: true,
  },

  {
    name: "receiptImagepayment",
    label: "Receipt Payment",
    type: "file",
    fullWidth: true,
  },
  {
    name: "receiptImageplan",
    label: "Receipt Plan",
    type: "file",
    fullWidth: true,
  },
  {
    name: "nextDueDate",
    label: "Next Due Date",
    type: "date",
    // 👇 هنا نتحكم بالظهور حسب الـ amount و plan
    hidden: (formData) => {
      const selectedPlan = plansData?.data?.plans?.find(
        (p) => p.id === formData.planId?.value
      );
      if (!selectedPlan) return true; // لو مفيش خطة مختارة نخفي الحقل
      return parseFloat(formData.amount || 0) >= selectedPlan.subscriptionFees;
    },
  },
];

  const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

// تحويل الصورة إلى Base64


// 👈 أول function: إضافة payment عادي
const addPayment = async (payload) => {
  return payment(payload, null, "Payment added successfully!");
};

// 👈 ثاني function: إضافة plan-price
const addPlanPricePayment = async (payload) => {
    return payplan(payload, null, "Pay Plan Price added successfully!");

};

// 👈 handleSave الرئيسي
const handleSave = async (formData) => {
  try {
    const selectedPlan = plansData?.data?.plans?.find(
      (p) => p.id === formData.planId?.value
    );
    if (!selectedPlan) {
      toast.error("Please select a valid plan");
      return;
    }

    const amount = parseFloat(formData.amount);

    if (amount < selectedPlan.minSubscriptionFeesPay) {
      toast.error(
        `Amount must be at least ${selectedPlan.minSubscriptionFeesPay}`
      );
      return;
    }
    if (amount > selectedPlan.subscriptionFees) {
      toast.error(
        `Amount must be less than or equal to ${selectedPlan.subscriptionFees}`
      );
      return;
    }

    setShowNextDueDate(amount < selectedPlan.subscriptionFees);

    let receiptBase64payment = null;
    if (formData.receiptImagepayment instanceof File) {
      receiptBase64payment = await convertFileToBase64(formData.receiptImagepayment);
    }
    let receiptBase64paln = null;
    if (formData.receiptImagepayment instanceof File) {
      receiptBase64paln = await convertFileToBase64(formData.receiptImageplan);
    }

    const payload = {
      planId: formData.planId?.value,
      paymentMethodId: formData.paymentMethodId?.value,
      amount,
      ...(amount < selectedPlan.subscriptionFees && {
        nextDueDate: formData.nextDueDate,
      }),
      ...(receiptBase64payment && { receiptImage: receiptBase64payment }),
    };


    const payload1 = {
      planId: formData.planId?.value,
      paymentMethodId: formData.paymentMethodId?.value,
    
      ...(receiptBase64paln && { receiptImage: receiptBase64paln }),
    };

    await addPayment(payload);
    await addPlanPricePayment(payload1);

    toast.success("Both payments added successfully!");
    navigate("/admin/peyment");
  } catch (error) {
    console.error(error);
    toast.error("Failed to add payment");
  }
};


  return (
    <AddPage
      title="Add New Payment and Pay Plan Price"
      fields={formSchema}
      onSave={handleSave}
      onCancel={() => navigate("/admin/peyment")}
      loading={loading}
    />
  );
};

export default AddPayments;
