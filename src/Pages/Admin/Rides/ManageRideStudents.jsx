import React, { useEffect, useState } from "react";
import useGet from "@/hooks/useGet";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { Trash2, Save, Loader2, MapPin, Search } from "lucide-react";
import Loading from "@/Components/Loading";

const ManageRideStudents = () => {
  const { id } = useParams();
  
  // جلب البيانات من الـ API
  const { data: rideDetails, loading: fetching, refetch } = useGet(`/api/admin/rides/${id}`);
  
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchPhone, setSearchPhone] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 1. استخراج الخيارات المتاحة (نقاط التجمع من داخل route.stops)
  const pickupOptions = rideDetails?.data?.route?.stops?.map(stop => ({
    value: stop.id,
    label: stop.name,
  })) || [];

  // 2. تعبئة قائمة الطلاب الحاليين مع نقاط تجمعهم المخزنة
  useEffect(() => {
    if (rideDetails?.data?.students?.all) {
      const mapped = rideDetails.data.students.all.map((s) => ({
        studentId: s.student?.id,
        studentName: s.student?.name,
        // الربط الصحيح بناءً على الـ JSON: s.pickupPoint.id
        pickupPointId: s.pickupPoint?.id || "", 
        pickupTime: s.pickupTime || "",
        isNew: false, 
      }));
      setSelectedStudents(mapped);
    }
  }, [rideDetails]);

  // منطق البحث عن طالب جديد
  const handleSearchStudent = async (val) => {
    setSearchPhone(val);
    if (val.length < 2) { setSearchResults([]); return; }
    setIsSearching(true);
    try {
      const response = await axios.get(
        `https://bcknd.kidsero.com/api/admin/rides/students/search?phone=${val}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setSearchResults(response.data.data.students || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // إضافة طالب جديد للقائمة (بشكل مؤقت)
  const addStudentRow = (student) => {
    if (selectedStudents.some(s => s.studentId === student.id)) {
      return toast.error("Student already in this ride");
    }
    setSelectedStudents(prev => [
      ...prev,
      { 
        studentId: student.id, 
        studentName: student.name, 
        pickupPointId: "", // يترك فارغاً ليختاره المستخدم من الـ select
        pickupTime: "07:30:00", 
        isNew: true 
      }
    ]);
    setSearchPhone("");
    setSearchResults([]);
  };

  // حذف طالب (نهائي من الـ API أو مؤقت من القائمة)
  const handleDelete = async (studentId, isNew) => {
    if (isNew) {
      setSelectedStudents(prev => prev.filter(s => s.studentId !== studentId));
      return;
    }
    if (!window.confirm("Remove this student from the ride?")) return;
    try {
      await axios.delete(`https://bcknd.kidsero.com/api/admin/rides/${id}/students/${studentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Student removed");
      refetch();
    } catch (err) { toast.error("Delete failed"); }
  };

  // حفظ التغييرات (الطلاب الجدد + تعديلات نقاط التجمع للقدامى)
const handleSave = async () => {
  // 1️⃣ Validation: مفيش بيانات ناقصة
  const invalidStudent = selectedStudents.find(
    s => !s.studentId || !s.pickupPointId || !s.pickupTime
  );

  if (invalidStudent) {
    return toast.error(
      `Please complete pickup info for ${invalidStudent.studentName}`
    );
  }

  setIsSaving(true);

  try {
    // 2️⃣ payload بنفس الشكل المطلوب بالظبط
    const payload = {
      students: selectedStudents.map(s => ({
        studentId: String(s.studentId),
        pickupPointId: String(s.pickupPointId),
        pickupTime: s.pickupTime, // HH:mm:ss
      })),
    };

    await axios.post(
      `https://bcknd.kidsero.com/api/admin/rides/${id}/students`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    toast.success("Ride students updated successfully");
    refetch();
  } catch (err) {
    toast.error("Update failed");
    console.error(err);
  } finally {
    setIsSaving(false);
  }
};

  if (fetching) return <Loading />;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Ride Students</h2>
          <p className="text-gray-500 italic">Ride: {rideDetails?.data?.ride?.name}</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          Save Changes
        </button>
      </div>

      {/* Search Field */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="text-gray-400" size={20} />
        </div>
        <input
          type="text"
          placeholder="Add new student by parent phone..."
          value={searchPhone}
          onChange={(e) => handleSearchStudent(e.target.value)}
          className="w-full p-4 pl-12 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
        />
        {searchResults.length > 0 && (
          <div className="absolute z-50 w-full bg-white border rounded-xl shadow-xl mt-2 max-h-60 overflow-y-auto">
            {searchResults.map(s => (
              <div key={s.id} className="p-4 flex justify-between items-center hover:bg-gray-50 border-b last:border-0">
                <span className="font-medium">{s.name}</span>
                <button onClick={() => addStudentRow(s)} className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm">Add</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-sm font-bold text-gray-600">Student Name</th>
              <th className="p-4 text-sm font-bold text-gray-600">Assign Stop (Point)</th>
              <th className="p-4 text-sm font-bold text-gray-600">Pickup Time</th>
              <th className="p-4 text-center text-sm font-bold text-gray-600">Remove</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {selectedStudents.map((s, idx) => (
              <tr key={s.studentId} className="hover:bg-gray-50/50">
                <td className="p-4 font-medium text-gray-800">
                  {s.studentName}
                  {s.isNew && <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">NEW</span>}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-500" />
                    <select
                      value={s.pickupPointId}
                      onChange={(e) => {
                        const next = [...selectedStudents];
                        next[idx].pickupPointId = e.target.value;
                        setSelectedStudents(next);
                      }}
                      className="flex-1 p-2 border rounded-lg bg-white focus:border-blue-500 outline-none"
                    >
                      <option value="">Select Point...</option>
                      {pickupOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="p-4">
                  <input
                    type="time"
                    value={s.pickupTime}
                    onChange={(e) => {
                      const next = [...selectedStudents];
                      next[idx].pickupTime = e.target.value;
                      setSelectedStudents(next);
                    }}
                    className="p-2 border rounded-lg outline-none"
                  />
                </td>
                <td className="p-4 text-center">
                  <button onClick={() => handleDelete(s.studentId, s.isNew)} className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageRideStudents;