import React, { useState } from "react";
import AddPage from "@/Components/AddPage";
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const AddBuses = () => {
  const navigate = useNavigate();
  const { data: busTypesData } = useGet("/api/admin/buses/types");
  const { postData, loading } = usePost("/api/admin/buses");


  // تحويل بيانات أنواع الباصات لاستخدام react-select
  const busTypeOptions =
    busTypesData?.data?.busTypes?.map((type) => ({
      value: type.id,
      label: `${type.name} (Capacity: ${type.capacity})`,
    })) || [];

  const formSchema = [
    { name: "busNumber", label: "Bus Number", type: "text", required: true },
    { name: "plateNumber", label: "Plate Number", type: "text", required: true },
    { name: "maxSeats", label: "Max Seats", type: "number", required: true },
    { name: "licenseNumber", label: "License Number", type: "text", required: true },
    { name: "licenseExpiryDate", label: "License Expiry Date", type: "datetwo",
       required: true },
    {
      name: "busTypeId",
      label: "Bus Type",
      type: "select",
      required: true,
      options: busTypeOptions,
    
    },
    {
      name: "licenseImage",
      label: "License Image",
      type: "file",
      required: true,
    },
    {
      name: "busImage",
      label: "Bus Image",
      type: "file",
      required: true,
    
    },
  ];
    const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

const handleSave = async (formData) => {
  try {
    const [year, month, day] = formData.licenseExpiryDate.split("-");

    const expiryDateISO = new Date(Date.UTC(+year, +month - 1, +day))
      .toISOString()
      .split("T")[0];

    // 🔥 تحويل الصور إلى Base64
    const licenseImageBase64 = await convertFileToBase64(formData.licenseImage);
    const busImageBase64 = await convertFileToBase64(formData.busImage);

    const payload = {
      busTypeId: formData.busTypeId,
      busNumber: formData.busNumber,
      plateNumber: formData.plateNumber,
      maxSeats: Number(formData.maxSeats),
      licenseNumber: formData.licenseNumber,
      licenseExpiryDate: expiryDateISO,
      status: "active",
      licenseImage: licenseImageBase64,
      busImage: busImageBase64,
    };

    await postData(payload, null, "Bus added successfully!");
    navigate("/admin/buses");
  } catch (err) {
    console.error(err);
    toast.error("Failed to add bus");
  }
};



  return (
    <AddPage
      title="Add New Bus"
      fields={formSchema}
      onSave={handleSave}
      onCancel={() => navigate("/admin/buses")}
      loading={loading}
    />
  );
};

export default AddBuses;
