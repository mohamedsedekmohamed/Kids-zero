import React, { useEffect, useState } from "react";
import AddPage from "@/components/AddPage";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/Components/Loading";

const EditBuses = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: busTypesData } = useGet("/api/admin/buses/types");
  const { data, loading: loadingGet } = useGet(`/api/admin/buses/${id}`);
  const { putData, loading } = usePut(`/api/admin/buses/${id}`);

  const originalData = data?.data?.bus;

  const busTypeOptions =
    busTypesData?.data?.busTypes?.map((type) => ({
      value: type.id,
      label: `${type.name} (Capacity: ${type.capacity})`,
    })) || [];

  const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  // نفس منطق EditDrivers 👇
  const getChangedFields = (original, current) => {
    if (!original) return current;

    const changed = {};

    Object.keys(current).forEach((key) => {
      const currentValue = current[key];
      const originalValue = original[key];

      // الصور
      if (["licenseImage", "busImage"].includes(key)) {
        if (currentValue instanceof File) {
          changed[key] = currentValue;
        }
        return;
      }

      // لو القيمة اتغيرت
      if (currentValue !== originalValue) {
        changed[key] = currentValue;
      }
    });

    return changed;
  };

  const handleSave = async (formData) => {
    try {
      const changedData = getChangedFields(originalData, formData);

      if (Object.keys(changedData).length === 0) {
        toast("No changes detected");
        navigate("/admin/buses");
        return;
      }

      // تحويل الصور الجديدة فقط
      for (const key of ["licenseImage", "busImage"]) {
        if (changedData[key] instanceof File) {
          changedData[key] = await convertFileToBase64(changedData[key]);
        }
      }

      await putData(changedData);
      toast.success("Bus updated successfully!");
      navigate("/admin/buses");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update bus");
    }
  };

  if (loadingGet)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  const initialData = {
    busTypeId: originalData?.busType?.id || "",
    plateNumber: originalData?.plateNumber || "",
    busNumber: originalData?.busNumber || "",
    maxSeats: originalData?.maxSeats || "",
    licenseNumber: originalData?.licenseNumber || "",
    licenseExpiryDate: originalData?.licenseExpiryDate
      ? originalData.licenseExpiryDate.split("T")[0]
      : "",
    licenseImage: originalData?.licenseImage || null,
    busImage: originalData?.busImage || null,
    status: originalData?.status || "active",
  };

  const formSchema = [
    { name: "plateNumber", label: "Plate Number", type: "text", required: true },
    { name: "busNumber", label: "Bus Number", type: "text", required: true },
    { name: "maxSeats", label: "Max Seats", type: "number", required: true },
    {
      name: "busTypeId",
      label: "Bus Type",
      type: "select",
      required: true,
      options: busTypeOptions,
    },
    { name: "licenseNumber", label: "License Number", type: "text", required: true },
    { name: "licenseExpiryDate", label: "License Expiry Date", type: "date", required: true },
    { name: "licenseImage", label: "License Image", type: "file" },
    { name: "busImage", label: "Bus Image", type: "file" },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ];

  return (
    <AddPage
      title="Edit Bus"
      fields={formSchema}
      initialData={initialData}
      onSave={handleSave}
      onCancel={() => navigate("/admin/buses")}
      loading={loading}
    />
  );
};

export default EditBuses;
