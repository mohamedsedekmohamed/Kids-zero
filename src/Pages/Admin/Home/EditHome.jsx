import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddPage from '../../../components/AddPage';
import toast from "react-hot-toast";

const EditHome = () => {
  const { id } = useParams(); // 1. جلب الآي دي من الرابط
  const navigate = useNavigate(); // للتنقل بعد الحفظ أو الإلغاء
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  // نفس هيكل الفورم الموجود في صفحة الإضافة
  const formSchema = [
    { name: "fullName", label: "Full Name", type: "text", placeholder: "Enter name", required: true },
    { name: "userEmail", label: "Email Address", type: "email", placeholder: "mail@example.com" },
    { name: "userRole", label: "Position", type: "select", options: [
      { label: "Manager", value: "mgr" },
      { label: "Developer", value: "dev" }
    ]},
    { name: "birthDate", label: "Start Date", type: "date" },
    { name: "profilePic", label: "Upload Image", type: "file", fullWidth: true },
    { name: "notes", label: "Notes", type: "textarea", fullWidth: true },
  ];

  // 2. جلب البيانات عند فتح الصفحة
  useEffect(() => {
    const fetchData = async () => {
      try {
        // استبدل الرابط التالي برابط الـ API الحقيقي لديك
        const response = await fetch(`/api/data/${id}`);
        const data = await response.json();
        
        // هنا نتأكد أن أسماء الحقول في الداتا تطابق الأسماء في formSchema
        setInitialData(data);
      } catch (error) {
        toast.error("Failed to load data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // 3. دالة الحفظ (تعديل البيانات)
  const handleUpdate = (updatedData) => {
    toast.promise(
      // استبدل الرابط برابط التعديل (PUT/PATCH)
      fetch(`/api/data/${id}`, {
        method: "PUT", // أو PATCH حسب الباك إند
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }),
      {
        loading: "Updating...",
        success: () => {
          navigate("/admin"); // العودة للصفحة الرئيسية بعد التعديل بنجاح
          return "Updated Successfully!";
        },
        error: "Error occurred while updating",
      }
    );
  };

  if (loading) {
    return <div className="p-4">Loading user data...</div>;
  }

  return (
    <AddPage 
      title="Edit Employee Details" // تغيير العنوان
      fields={formSchema} 
      initialData={initialData} // 4. نمرر البيانات القديمة هنا
      onSave={handleUpdate} 
      onCancel={() => navigate("/admin")} // العودة عند الإلغاء
    />
  );
}

export default EditHome;