import React, { useState } from "react";
import AddPage from "@/components/AddPage";
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
    { name: "licenseExpiryDate", label: "License Expiry Date", type: "date",
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
const handleSave = async (formData) => {
 

  const [year, month, day] = formData.licenseExpiryDate.split("-");
  const expiryDateISO = new Date(Date.UTC(+year, +month - 1, +day)).toISOString();

  try {
    const payload = {
      busTypeId: formData.busTypeId,
      busNumber: formData.busNumber,
      plateNumber: formData.plateNumber,
      maxSeats: Number(formData.maxSeats),
      licenseNumber: formData.licenseNumber,
      licenseExpiryDate: expiryDateISO,
      status: "active",
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
