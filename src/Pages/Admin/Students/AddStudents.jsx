import React from "react";
import AddPage from "@/Components/AddPage";
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddStudent = () => {
  const navigate = useNavigate();
  const { data: parentsData } = useGet("/api/admin/students/selection");
  const { postData, loading } = usePost("/api/admin/students");

  const parentsOptions =
    parentsData?.data?.parents?.map((p) => ({
      value: p.id,
      label: `${p.name} - ${p.phone}`,
    })) || [];
  const zoneOptions =
    parentsData?.data?.zones?.map((p) => ({
      value: p.id,
      label: `${p.name}-cost(${p.cost})`,
    })) || [];

  const formSchema = [
   
    { name: "name", label: "Student Name", type: "text", required: true },
    { name: "grade", label: "Grade", type: "text", required: true },
    { name: "classroom", label: "Classroom", type: "text", required: true },
  //   {
  //    name: "parentId",
  //    label: "Select Parent",
  //    type: "autocomplete",
  //    options: parentsOptions,
  //    required: true,
  //    fullWidth: true,
  //  },
    {
     name: "zoneId",
     label: "Select Zone",
     type: "autocomplete",
     options: zoneOptions,
     required: true,
     fullWidth: true,
   },
    { name: "avatar", label: "Student Avatar", type: "file", fullWidth: true },
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
      const payload = { ...formData ,
         parentId: formData.parentId?.value,
zoneId: formData.zoneId?.value
        };
      if (formData.avatar instanceof File) {
        payload.avatar = await convertFileToBase64(formData.avatar);
      }

      await postData(payload, null, "Student added successfully!");
      navigate("/admin/students");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add student");
    }
  };

  return (
    <AddPage
      title="Add New Student"
      fields={formSchema}
      onSave={handleSave}
      onCancel={() => navigate("/admin/students")}
      loading={loading}
    />
  );
};

export default AddStudent;
