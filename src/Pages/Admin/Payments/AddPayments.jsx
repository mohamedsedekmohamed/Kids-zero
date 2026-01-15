import React, { useState, useEffect } from "react";
import AddPage from "@/Components/AddPage";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddPayments = () => {
  const navigate = useNavigate();
  const [showNextDueDate, setShowNextDueDate] = useState(false);

  // Get plans
  const { data: plansData } = useGet("/api/admin/plans");

  // Get payment methods
  const { data: paymentMethodsData } = useGet("/api/admin/paymentmethods");

  // Post payment
  const { postData, loading } = usePost("/api/admin/payments");

  const planOptions =
    plansData?.data?.plans?.map((p) => ({
      value: p.id,
      label: `
${p.name}
💰 Price: ${p.price}
🚌 Buses: ${p.maxBuses}
👨‍✈️ Drivers: ${p.maxDrivers}
🎓 Students: ${p.maxStudents}
💳 Min Pay: ${p.minSubscriptionFeesPay}
📄 Fees: ${p.subscriptionFees}
      `,
    })) || [];

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
    type: "autocomplete",
    options: planOptions,
    required: true,
    fullWidth: true,
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
    label: "Amount",
    type: "number",
    required: true,
  },
  {
    name: "receiptImage",
    label: "Receipt Image",
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

  const handleSave = async (formData) => {
    try {
      // جلب تفاصيل الخطة المختارة
      const selectedPlan = plansData?.data?.plans?.find(
        (p) => p.id === formData.planId?.value
      );

      if (!selectedPlan) {
        toast.error("Please select a valid plan");
        return;
      }

      const amount = parseFloat(formData.amount);

      // تحقق من المبلغ بالنسبة للحد الأدنى والأقصى
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

      // تحديث ظهور حقل nextDueDate
      setShowNextDueDate(amount < selectedPlan.subscriptionFees);

      // تجهيز payload
      const payload = {
        planId: formData.planId?.value,
        paymentMethodId: formData.paymentMethodId?.value,
        amount: formData.amount,
      };

      // إضافة nextDueDate لو موجود
      if (amount < selectedPlan.subscriptionFees) {
        if (!formData.nextDueDate) {
          toast.error("Please select next due date");
          return;
        }
        payload.nextDueDate = formData.nextDueDate;
      }

      if (formData.receiptImage instanceof File) {
        payload.receiptImage = await convertFileToBase64(
          formData.receiptImage
        );
      }

      await postData(payload, null, "Payment added successfully!");
      navigate("/admin/peyment");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add payment");
    }
  };

  return (
    <AddPage
      title="Add New Payment"
      fields={formSchema}
      onSave={handleSave}
      onCancel={() => navigate("/admin/peyment")}
      loading={loading}
    />
  );
};

export default AddPayments;
