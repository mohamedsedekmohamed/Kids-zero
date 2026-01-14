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

  // جلب بيانات الآباء والمناطق للاختيار
  const { data: parentsData, loading: loadingParents } = useGet(
    "/api/admin/students/selection"
  );

  const { putData, loading: saving } = usePut(`/api/admin/students/${id}`);

  const [initialData, setInitialData] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  // 1. تحويل الآباء إلى خيارات autocomplete (محفوظ بـ useMemo)
  const parentsOptions = useMemo(() => {
    return (
      parentsData?.data?.parents?.map((p) => ({
        value: p.id,
        label: `${p.name} - ${p.phone}`,
      })) || []
    );
  }, [parentsData]);

  // 2. تحويل المناطق إلى خيارات (تم إضافة useMemo هنا لمنع تكرار الرندر)
  const zoneOptions = useMemo(() => {
    return (
      parentsData?.data?.zones?.map((p) => ({
        value: p.id,
        label: `${p.name} - cost(${p.cost})`,
      })) || []
    );
  }, [parentsData]);

  // 3. ضبط البيانات الأولية عند اكتمال التحميل
  useEffect(() => {
    const s = studentData?.data?.student;
    
    // تأكدنا هنا أن البيانات موجودة قبل البدء
    if (!s) return;

    const parentOption = parentsOptions.find(
      (p) => String(p.value) === String(s.parent?.id)
    );

    const zoneOption = zoneOptions.find(
      (p) => String(p.value) === String(s.zone?.id)
    );

    const initData = {
      name: s.name || "",
      grade: s.grade || "",
      classroom: s.classroom || "",
      parentId: parentOption || null,
      avatar: s.avatar || "",
      zoneId: zoneOption || null,
    };

    setInitialData(initData);
    setOriginalData(initData);
  }, [studentData, parentsOptions, zoneOptions]);

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

  // 4. تحسين دالة التحقق لتشمل الـ zoneId وأي حقول Object أخرى
  const getChangedFields = (original, current) => {
    if (!original) return current;
    const changed = {};

    Object.keys(current).forEach((key) => {
      const currentValue = current[key];
      const originalValue = original[key];

      // معالجة الملفات
      if (key === "avatar") {
        if (currentValue instanceof File) changed[key] = currentValue;
        return;
      }

      // معالجة الـ Autocomplete (parentId & zoneId)
      if (key === "parentId" || key === "zoneId") {
        if (currentValue?.value !== originalValue?.value) {
          changed[key] = currentValue;
        }
        return;
      }

      // معالجة النصوص العادية
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
        navigate("/admin/students");
        return;
      }

      // تحضير البيانات للإرسال
      const payload = { ...changedData };

      if (payload.avatar instanceof File) {
        payload.avatar = await convertFileToBase64(payload.avatar);
      }

      if (payload.parentId) payload.parentId = payload.parentId.value;
      if (payload.zoneId) payload.zoneId = payload.zoneId.value;

      await putData(payload);

      toast.success("Student updated successfully!");
      navigate("/admin/students");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update student");
    }
  };

  // حالة التحميل: ننتظر بيانات الطالب الأساسية وبيانات القوائم
  if (loadingStudent || loadingParents || !initialData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

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