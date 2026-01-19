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
  TicketPercent,
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
            <div
              className={`
                h-full rounded-3xl p-6 backdrop-blur-xl
                transition-all duration-300
                ${isSelected
                  ? "bg-white/80 shadow-2xl"
                  : "bg-white/60 hover:bg-white/80 shadow-lg"}
              `}
            >
              {isSelected && (
                <div className="absolute -top-3 right-4 px-3 py-1 text-xs font-bold rounded-full bg-one text-white flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-3 h-3" />
                  Recommended
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                {isSelected && <CheckCircle className="w-6 h-6 text-one" />}
              </div>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">
                  {plan.subscriptionFees}
                </span>
                <span className="text-sm text-gray-500 ml-1">/month</span>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-6" />

              <ul className="space-y-4 text-sm text-gray-700">
                <li className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-one/10 text-one">
                    <Bus className="w-4 h-4" />
                  </div>
                  <span><strong>{plan.maxBuses}</strong> Buses</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
                    <Users className="w-4 h-4" />
                  </div>
                  <span><strong>{plan.maxDrivers}</strong> Drivers</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-pink-500/10 text-pink-600">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <span><strong>{plan.maxStudents}</strong> Students</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span>Min Pay: <strong>{plan.minSubscriptionFeesPay}</strong></span>
                </li>
              </ul>

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
  const [promoData, setPromoData] = useState(null);

  // APIs
  const { data: plansData } = useGet("/api/admin/plans");
  const { data: paymentMethodsData } = useGet("/api/admin/paymentmethods");
  const { postData: payment } = usePost("/api/admin/payments");
  const { postData: payplan, loading } = usePost("/api/admin/payments/plan-price");
  const { postData: verifyPromo, loading: verifyingPromo } = usePost("/api/admin/promocodes/verify");

  const paymentMethodOptions =
    paymentMethodsData?.data?.paymentMethods
      ?.filter((m) => m.isActive)
      ?.map((m) => ({
        value: m.id,
        label:`${m.name} (fees ${m.feeAmount})`,
      })) || [];

  const handleVerifyPromo = async (code) => {
    if (!code) return toast.error("Please enter a code first");
    try {
      const response = await verifyPromo({ code });
      if (response?.success) {
        setPromoData(response.data.promocode);
        toast.success(`Applied: ${response.data.promocode.name}`);
      } else {
        setPromoData(null);
        toast.error("Invalid Promo Code");
      }
    } catch (err) {
      setPromoData(null);
    }
  };

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
          onSelect={(val) => {
            onChange(val);
            setPromoData(null); // Reset promo when plan changes
          }}
        />
      ),
    },
    {
      name: "promocode",
      label: "Promo Code",
      type: "custom",
      fullWidth: true,
      render: ({ value, onChange }) => (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Promo Code (Optional)</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <TicketPercent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-one outline-none transition-all"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter discount code"
              />
            </div>
            <button
              type="button"
              onClick={() => handleVerifyPromo(value)}
              disabled={verifyingPromo}
              className="px-8 py-3 bg-one text-white rounded-2xl font-bold hover:bg-two disabled:bg-gray-400 transition-all"
            >
              {verifyingPromo ? "Checking..." : "Apply"}
            </button>
          </div>
          {promoData && (
            <p className="text-sm text-one font-medium flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> 
              Discount Applied: {promoData.promocodeType === 'percentage' ? `${promoData.amount}%` : `${promoData.amount} Fixed`}
            </p>
          )}
        </div>
      ),
    },
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
      label: "Amount to Pay",
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
      hidden: (formData) => {
        const selectedPlan = plansData?.data?.plans?.find(
          (p) => p.id === formData.planId?.value
        );
        if (!selectedPlan) return true;
        
        let finalFees = selectedPlan.subscriptionFees;
        if (promoData) {
          if (promoData.promocodeType === "percentage") {
            finalFees = finalFees - (finalFees * promoData.amount) / 100;
          } else {
            finalFees = finalFees - promoData.amount;
          }
        }
        return parseFloat(formData.amount || 0) >= finalFees;
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
      
      // Calculate max allowed based on promo
      let maxAllowed = selectedPlan.subscriptionFees;
      if (promoData) {
        if (promoData.promocodeType === "percentage") {
          maxAllowed = maxAllowed - (maxAllowed * promoData.amount) / 100;
        } else {
          maxAllowed = maxAllowed - promoData.amount;
        }
      }

      if (amount < selectedPlan.minSubscriptionFeesPay) {
        toast.error(`Amount must be at least ${selectedPlan.minSubscriptionFeesPay}`);
        return;
      }
      
      if (amount > maxAllowed) {
        toast.error(`Amount cannot exceed the discounted price: ${maxAllowed}`);
        return;
      }

      let receiptBase64payment = null;
      if (formData.receiptImagepayment instanceof File) {
        receiptBase64payment = await convertFileToBase64(formData.receiptImagepayment);
      }
      let receiptBase64plan = null;
      if (formData.receiptImageplan instanceof File) {
        receiptBase64plan = await convertFileToBase64(formData.receiptImageplan);
      }

      const payload = {
        planId: formData.planId?.value,
        paymentMethodId: formData.paymentMethodId?.value,
        amount,
        ...(amount < maxAllowed && {
          nextDueDate: formData.nextDueDate,
        }),
        ...(receiptBase64payment && { receiptImage: receiptBase64payment }),
      };
      if(promoData?.code){
        payload.promoCode = promoData.code
      }

      const payload1 = {
        planId: formData.planId?.value,
        paymentMethodId: formData.paymentMethodId?.value,
        ...(receiptBase64plan && { receiptImage: receiptBase64plan }),
      };

      await payment(payload, null, "Payment added successfully!");
      await payplan(payload1, null, "Pay Plan Price added successfully!");

      toast.success("Both operations completed!");
      navigate("/admin/peyment");
    } catch (error) {
      console.error(error);
      toast.error("Process failed");
    }
  };

  return (
    <AddPage
      title="Add Payment & Plan Activation"
      fields={formSchema}
      onSave={handleSave}
      onCancel={() => navigate("/admin/peyment")}
      loading={loading}
    />
  );
};

export default AddPayments;