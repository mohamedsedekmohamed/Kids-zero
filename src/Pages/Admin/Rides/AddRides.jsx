import React, { useEffect, useState } from "react";
import AddPage from "@/Components/AddPage";
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash2, UserPlus, Search } from "lucide-react";

const AddRides = () => {
  const navigate = useNavigate();
  const { data: selectionData } = useGet("/api/admin/rides/selection");
  const { postData, loading } = usePost("/api/admin/rides");

  const [selectedStudents, setSelectedStudents] = useState([]); // القائمة النهائية للجدول
  const [searchResults, setSearchResults] = useState([]); // نتائج البحث المؤقتة
  const [searchPhone, setSearchPhone] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // خيارات القوائم المنسدلة
  const routeOptions = selectionData?.data?.routes?.map((r) => ({ value: r.id, label: r.name })) || [];
  const busOptions = selectionData?.data?.buses?.map((b) => ({ value: b.id, label: `${b.busNumber} - ${b.plateNumber}` })) || [];
  const driverOptions = selectionData?.data?.drivers?.map((d) => ({ value: d.id, label: d.name })) || [];
  const codriverOptions = selectionData?.data?.codrivers?.map((c) => ({ value: c.id, label: c.name })) || [];

  // دالة البحث عن الطلاب (تحدث عند تغيير الرقم)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchPhone.length >= 1) {
        handleSearchStudent();
      } else {
        setSearchResults([]);
      }
    }, 600);
    return () => clearTimeout(delayDebounceFn);
  }, [searchPhone]);

  const handleSearchStudent = async () => {
    setIsSearching(true);
    try {
      const response = await axios.get(
        `https://bcknd.kidsero.com/api/admin/rides/students/search?phone=${searchPhone}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setSearchResults(response.data.data.students || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // دالة الإضافة اليدوية من نتائج البحث إلى الجدول
  const addStudentToList = (student) => {
    const isExists = selectedStudents.some(s => s.studentId === student.id);
    if (isExists) {
      return toast.error("Student already in the list");
    }

    const newStudent = {
      studentId: student.id,
      studentName: student.name,
      pickupPointId: "", 
      pickupTime: "07:30:00"
    };

    setSelectedStudents(prev => [...prev, newStudent]);
    setSearchPhone(""); // مسح البحث بعد الإضافة
    setSearchResults([]); // إغلاق قائمة النتائج
    toast.success(`${student.name} added to list`);
  };

  const formSchema = [
    { name: "name", label: "Ride Name", type: "text", required: true, fullWidth: true },
    {
      name: "rideType",
      label: "Ride Type",
      type: "select",
      options: [{ value: "morning", label: "Morning" }, { value: "afternoon", label: "Afternoon" }],
      required: true,
    },
    {
      name: "frequency",
      label: "Frequency",
      type: "select",
      options: [{ value: "repeat", label: "Repeat" }, { value: "once", label: "Once" }],
      required: true,
    },
{
  name: "repeatType",
  label: "Repeat Type",
  type: "select",
  options: [
    { value: "limited", label: "Limited" },
    { value: "unlimited", label: "Unlimited" },
  ],
  required: true,
  hidden: (formData) => formData.frequency !== "repeat",
},

{
  name: "startDate",
  label: "Start Date",
  type: "datetwo",
  required: true,
  hidden: (formData) =>
    formData.frequency !== "repeat" ||
    formData.repeatType !== "limited",
},
{
  name: "endDate",
  label: "End Date",
  type: "datetwo",
  required: true,
  hidden: (formData) =>
    formData.frequency !== "repeat" ||
    formData.repeatType !== "limited",
},

    { name: "routeId", label: "Select Route", type: "autocomplete", options: routeOptions, required: true },
    { name: "busId", label: "Select Bus", type: "autocomplete", options: busOptions, required: true },
    { name: "driverId", label: "Select Driver", type: "autocomplete", options: driverOptions, required: true },
    { name: "codriverId", label: "Select Co-Driver", type: "autocomplete", options: codriverOptions, required: true },
    
    {
      name: "studentsSection",
      label: "Ride Students",
      type: "custom",
      fullWidth: true,
      render: ({ formData }) => {
        // استخراج الطريق المختار لجلب نقاط التوقف
        const selectedRouteId = formData?.routeId?.value || formData?.routeId;
        const currentRoute = selectionData?.data?.routes?.find(r => String(r.id) === String(selectedRouteId));
        
        const pickupOptions = currentRoute?.pickupPoints?.map(pp => ({
          value: pp.pickupPoint.id,
          label: pp.pickupPoint.name,
        })) || [];

        return (
          <div className="mt-4 border-t pt-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Add Students to List</label>
            
            {/* نظام البحث اليدوي */}
            <div className="relative mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by Parent Phone..."
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-one pr-12 shadow-sm"
                />
                <div className="absolute right-4 top-3.5 text-gray-400">
                  {isSearching ? <div className="animate-spin h-5 w-5 border-2 border-one border-t-transparent rounded-full" /> : <Search size={20} />}
                </div>
              </div>

              {/* نتائج البحث المنبثقة */}
              {searchResults.length > 0 && (
                <div className="absolute z-50 w-full bg-white border rounded-xl shadow-2xl mt-2 max-h-64 overflow-y-auto">
                  {searchResults.map((s) => (
                    <div key={s.id} className="p-3 flex justify-between items-center hover:bg-gray-50 border-b last:border-0 transition-colors">
                      <div>
                        <p className="font-semibold text-gray-800">{s.name}</p>
                        <p className="text-xs text-gray-500">Parent Phone: {searchPhone}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addStudentToList(s)}
                        className="bg-one text-white px-4 py-1.5 rounded-lg text-sm flex items-center gap-2 hover:bg-one/90 active:scale-95 transition-all"
                      >
                        <UserPlus size={16} /> Add to list
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* جدول الطلاب المضافين */}
            <div className="overflow-x-auto border rounded-xl shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 font-bold uppercase text-xs">
                  <tr>
                    <th className="p-4 border-b">Student Name</th>
                    <th className="p-4 border-b">Pickup Point</th>
                    <th className="p-4 border-b">Pickup Time</th>
                    <th className="p-4 border-b text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedStudents.map((student, index) => (
                    <tr key={student.studentId} className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-4 font-medium text-gray-700">{student.studentName}</td>
                      <td className="p-4">
                        <select
                          value={student.pickupPointId}
                          onChange={(e) => {
                            const updated = [...selectedStudents];
                            updated[index].pickupPointId = e.target.value;
                            setSelectedStudents(updated);
                          }}
                          className="w-full p-2 border rounded-lg bg-white outline-none focus:border-one disabled:bg-gray-50"
                          disabled={!selectedRouteId}
                        >
                          <option value="">{selectedRouteId ? "Select Point..." : "← Select Route First"}</option>
                          {pickupOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4">
                        <input
                          type="time"
                          value={student.pickupTime}
                          onChange={(e) => {
                            const updated = [...selectedStudents];
                            updated[index].pickupTime = e.target.value;
                            setSelectedStudents(updated);
                          }}
                          className="w-full p-2 border rounded-lg outline-none focus:border-one"
                        />
                      </td>
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedStudents(selectedStudents.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {selectedStudents.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-12 text-center text-gray-400 italic">
                        The list is empty. Search and add students to populate.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      },
    },
  ];

  const handleSave = async (formData) => {
    const routeId = formData.routeId?.value || formData.routeId;

    if (!routeId) return toast.error("Please select a route first");
    if (selectedStudents.length === 0) return toast.error("Please add at least one student");
    if (selectedStudents.some(s => !s.pickupPointId)) return toast.error("Please select a pickup point for all students");

    try {
  const payload = {
  busId: formData.busId?.value || formData.busId,
  driverId: formData.driverId?.value || formData.driverId,
  codriverId: formData.codriverId?.value || formData.codriverId,
  routeId: routeId,
  name: formData.name,
  rideType: formData.rideType,
  frequency: formData.frequency,

  repeatType:
    formData.frequency === "repeat"
      ? formData.repeatType
      : null,

  startDate:
    formData.frequency === "repeat" &&
    formData.repeatType === "limited"
      ? formData.startDate
      : null,

  endDate:
    formData.frequency === "repeat" &&
    formData.repeatType === "limited"
      ? formData.endDate
      : null,

  students: selectedStudents.map((s) => ({
    studentId: s.studentId,
    pickupPointId: s.pickupPointId,
    pickupTime: s.pickupTime,
  })),
};


      await postData(payload, null, "Ride added successfully!");
      navigate("/admin/rides");
    } catch (err) {
      toast.error("Failed to add ride");
    }
  };

  return (
    <div>

    <AddPage
      title="Create New Ride"
      fields={formSchema}
      onSave={handleSave}
      onCancel={() => navigate("/admin/rides")}
      loading={loading}
      />
   {selectedStudents.length > 0 && (
  <div className="mt-4 mb-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
    <h3 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
      <UserPlus size={16} /> Selected Students (Click X to remove):
    </h3>
    <div className="flex flex-wrap gap-2">
      {selectedStudents.map((student) => (
        <span 
          key={student.studentId} 
          className="bg-white px-3 py-1.5 rounded-full border border-blue-200 text-sm text-gray-700 shadow-sm flex items-center gap-2 group hover:border-red-200 transition-colors"
        >
          {/* نقطة ملونة بجانب الاسم */}
          <span className="w-2 h-2 bg-one rounded-full"></span>
          
          {/* اسم الطالب */}
          <span className="font-medium">{student.studentName}-{student.pickupTime}-{student.pickupPointId}</span>

          {/* زر الحذف (X) */}
          <button
            type="button"
            onClick={() => {
              const filtered = selectedStudents.filter(s => s.studentId !== student.studentId);
              setSelectedStudents(filtered);
              toast.success(`${student.studentName} removed`);
            }}
            className="ml-1 text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
            title="Remove from list"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </span>
      ))}
    </div>
  </div>
)}
      </div>
  );
};

export default AddRides;