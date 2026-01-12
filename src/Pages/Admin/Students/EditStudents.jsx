import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddPage from "@/Components/AddPage";
import useGet from "@/hooks/useGet";
import usePut from "@/hooks/usePut";
import toast from "react-hot-toast";
import Loading from "@/Components/Loading";

const EditStudent = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // جلب بيانات الطالب
  const { data: studentData, loading: loadingStudent } = useGet(
    `/api/admin/students/${id}`
  );

  // جلب بيانات الآباء للاختيار
  const { data: parentsData, loading: loadingParents } = useGet(
    "/api/admin/students/selection"
  );

  const { putData, loading: saving } = usePut(`/api/admin/students/${id}`);

  const [initialData, setInitialData] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  // تحويل الآباء إلى خيارات autocomplete
  const parentsOptions = useMemo(() => {
    return (
      parentsData?.data?.parents?.map((p) => ({
        value: p.id,
        label: `${p.name} - ${p.phone}`,
      })) || []
    );
  }, [parentsData]);

  useEffect(() => {
    if (!studentData?.data?.student || parentsOptions.length === 0) return;

    const s = studentData.data.student;

    const parentOption = parentsOptions.find(
      (p) => String(p.value) === String(s.parent?.id)
    );

    const initData = {
      name: s.name,
      grade: s.grade,
      classroom: s.classroom,
      parentId: parentOption || null,
      avatar: s.avatar,
    };

    setInitialData(initData);
    setOriginalData(initData); // حفظ نسخة أصلية للمقارنة لاحقًا
  }, [studentData, parentsOptions]);

  const formSchema = [
    { name: "name", label: "Student Name", type: "text", required: true },
    { name: "grade", label: "Grade", type: "text", required: true },
    { name: "classroom", label: "Classroom", type: "text", required: true },
    {
      name: "parentId",
      label: "Select Parent",
      type: "autocomplete",
      options: parentsOptions,
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

  // دالة تتحقق من التعديلات فقط
  const getChangedFields = (original, current) => {
    if (!original) return current;

    const changed = {};

    Object.keys(current).forEach((key) => {
      const currentValue = current[key];
      const originalValue = original[key];

      // ملفات
      if (key === "avatar") {
        if (currentValue instanceof File) changed[key] = currentValue;
        return;
      }

      // parentId قيمة داخل object
      if (key === "parentId") {
        if (currentValue?.value !== originalValue?.value) {
          changed[key] = currentValue;
        }
        return;
      }

      if (currentValue !== originalValue) changed[key] = currentValue;
    });

    return changed;
  };

  const handleSave = async (formData) => {
    try {
      const changedData = getChangedFields(originalData, formData);

      if (Object.keys(changedData).length === 0) {
        toast("No changes detected");
        navigate("/admin/students");
        return;
      }

      // تحويل الملفات لـ Base64
      if (changedData.avatar instanceof File) {
        changedData.avatar = await convertFileToBase64(changedData.avatar);
      }

      // parentId تحويل للاستخدام API
      if (changedData.parentId) {
        changedData.parentId = changedData.parentId.value;
      }

      await putData(changedData);
      toast.success("Student updated successfully!");
      navigate("/admin/students");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update student");
    }
  };

  if (loadingStudent || loadingParents || !initialData)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  return (
    <AddPage
      title="Edit Student"
      fields={formSchema}
      initialData={initialData}
      onSave={handleSave}
      onCancel={() => navigate("/admin/students")}
      loading={saving}
    />
  );
};

export default EditStudent;
