import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddPage from "@/Components/AddPage";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import toast from "react-hot-toast";

const AddFeeInstallments = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const totalAmount = location.state?.amount || 0; 

  const { data: paymentMethodsData } = useGet("/api/admin/paymentmethods");
  const { postData: addInstallment, loading } = usePost("/api/admin/fee-installments");

  const paymentMethodOptions =
    paymentMethodsData?.data?.paymentMethods
      ?.filter((m) => m.isActive)
      ?.map((m) => ({
        value: m.id,
        label: `${m.name} `,
      })) || [];

  const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const formSchema = [
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
      type: "numberstep",
      required: true,
      defaultValue: totalAmount, // المستخدم يقدر يغيره (جزئي / كامل)
      min: 0,
      max: totalAmount,
    },
    {
      name: "receiptImage",
      label: "Receipt",
      type: "file",
      fullWidth: true,
      required: true,
    },
    {
      name: "nextDueDate",
      label: "Next Due Date",
      type: "date",
      hidden: (formData) => {
        const paid = parseFloat(formData.amount || 0);
        return paid >= totalAmount; // لو دفع كامل نخفي التاريخ
      },
    },
  ];

  const handleSave = async (formData) => {
    try {
      if (!formData.paymentMethodId?.value) {
        toast.error("Please select payment method");
        return;
      }

      const paid = parseFloat(formData.amount || 0);

      if (!paid || paid <= 0) {
        toast.error("Amount must be greater than 0");
        return;
      }

      if (paid > totalAmount) {
        toast.error("Amount cannot be greater than total amount");
        return;
      }

      if (paid < totalAmount && !formData.nextDueDate) {
        toast.error("Next due date is required for partial payment");
        return;
      }

      let receiptBase64 = null;
      if (formData.receiptImage instanceof File) {
        receiptBase64 = await convertFileToBase64(formData.receiptImage);
      }

      const payload = {
        amount: paid,
        paymentMethodId: formData.paymentMethodId?.value,
        ...(receiptBase64 && { receiptImage: receiptBase64 }),
        ...(paid < totalAmount && { nextDueDate: formData.nextDueDate }),
      };

      await addInstallment(payload, null, "Payment added successfully!");
      navigate("/admin/feeinstallments");
    } catch (error) {
      console.error(error);
      toast.error("Process failed");
    }
  };

  return (
    <AddPage
      title="Add Fee Installment"
      fields={formSchema}
      onSave={handleSave}
      onCancel={() => navigate("/admin/feeinstallments")}
      loading={loading}
    />
  );
};

export default AddFeeInstallments;
