import React, { useEffect, useState } from "react";
import AddPage from "@/Components/AddPage";
import usePut from "@/hooks/usePut";
import useGet from "@/hooks/useGet";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Trash2, UserPlus, Search } from "lucide-react";
import Loading from "@/Components/Loading";

const EditRides = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // جلب الخيارات الأساسية
  const { data: selectionData } = useGet("/api/admin/rides/selection");

  // جلب بيانات الرحلة الحالية
  const { data: rideDetails, loading: fetchingRide } = useGet(`/api/admin/rides/${id}`);

  // هوك التحديث
  const { putData, loading: saving } = usePut(`/api/admin/rides/${id}`);

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchPhone, setSearchPhone] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [initialData, setInitialData] = useState(null);

  // تحويل بيانات الـ API إلى تنسيق الفورم
  useEffect(() => {
    if (rideDetails?.data) {
      const { ride, bus, driver, codriver, route, students } = rideDetails.data;

      setInitialData({
        name: ride.name || "",
        rideType: ride.type || "",
        frequency: ride.frequency || "",
        repeatType: ride.repeatType || "",
        startDate: ride.startDate ? ride.startDate.split("T")[0] : "",
        endDate: ride.endDate ? ride.endDate.split("T")[0] : "",
        rideDate: ride.startDate ? ride.startDate.split("T")[0] : "",
        routeId: route ? { value: route.id, label: route.name } : null,
        busId: bus ? { value: bus.id, label: bus.busNumber } : null,
        driverId: driver ? { value: driver.id, label: driver.name } : null,
        codriverId: codriver?.id ? { value: codriver.id, label: codriver.name } : null,
      });

      const mappedStudents = students?.map((s) => ({
        studentId: s.student?.id,
        studentName: s.student?.name,
        pickupPointId: s.pickupPoint?.id || "",
        pickupTime: s.pickupTime,
      })) || [];

      setSelectedStudents(mappedStudents);
    }
  }, [rideDetails]);

  // تجهيز الخيارات للقوائم المنسدلة
  const routeOptions = selectionData?.data?.routes?.map((r) => ({ value: r.id, label: r.name })) || [];
  const busOptions = selectionData?.data?.buses?.map((b) => ({ value: b.id, label: `${b.busNumber} - ${b.plateNumber}` })) || [];
  const driverOptions = selectionData?.data?.drivers?.map((d) => ({ value: d.id, label: d.name })) || [];
  const codriverOptions = selectionData?.data?.codrivers?.map((c) => ({ value: c.id, label: c.name })) || [];

  // البحث عن الطلاب
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchPhone.length >= 1) handleSearchStudent();
      else setSearchResults([]);
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

  const addStudentToList = (student) => {
    if (selectedStudents.some(s => s.studentId === student.id)) {
      return toast.error("Student already in the list");
    }
    const newStudent = {
      studentId: student.id,
      studentName: student.name,
      pickupPointId: "",
      pickupTime: "07:30:00",
    };
    setSelectedStudents(prev => [...prev, newStudent]);
    setSearchPhone("");
    setSearchResults([]);
    toast.success(`${student.name} added to list`);
  };

  // الفورم
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
      name: "rideDate",
      label: "Start Date",
      type: "datetwo",
      hidden: (formData) => formData.frequency !== "once",
    },
    {
      name: "repeatType",
      label: "Repeat Type",
      type: "select",
      options: [{ value: "limited", label: "Limited" }, { value: "unlimited", label: "Unlimited" }],
      hidden: (formData) => formData.frequency !== "repeat",
      required: true,
    },
    {
      name: "startDate",
      label: "Start Date",
      type: "datetwo",
      hidden: (formData) => formData.frequency !== "repeat",
    },
    {
      name: "endDate",
      label: "End Date",
      type: "datetwo",
      hidden: (formData) => formData.frequency !== "repeat" || formData.repeatType !== "limited",
    },
    { name: "routeId", label: "Select Route", type: "autocomplete", options: routeOptions, required: true },
    { name: "busId", label: "Select Bus", type: "autocomplete", options: busOptions, required: true },
    { name: "driverId", label: "Select Driver", type: "autocomplete", options: driverOptions, required: true },
    { name: "codriverId", label: "Select Co-Driver", type: "autocomplete", options: codriverOptions },

    // قسم الطلاب
    {
      name: "studentsSection",
      label: "Ride Students",
      type: "custom",
      fullWidth: true,
      render: ({ formData }) => {
        const selectedRouteId = formData?.routeId?.value || formData?.routeId;
        const currentRoute = selectionData?.data?.routes?.find(r => String(r.id) === String(selectedRouteId));
        const pickupOptions = currentRoute?.pickupPoints?.map(pp => ({
          value: pp.pickupPoint.id,
          label: pp.pickupPoint.name,
        })) || [];

        return (
          <div className="mt-4 border-t pt-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Add Students to List</label>

            {/* البحث */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search by Parent Phone..."
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-one pr-12 shadow-sm"
              />
              <div className="absolute right-4 top-3.5 text-gray-400">
                {isSearching ? (
                  <div className="animate-spin h-5 w-5 border-2 border-one border-t-transparent rounded-full" />
                ) : (
                  <Search size={20} />
                )}
              </div>

              {searchResults.length > 0 && (
                <div className="absolute z-50 w-full bg-white border rounded-xl shadow-2xl mt-2 max-h-64 overflow-y-auto">
                  {searchResults.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 flex justify-between items-center hover:bg-gray-50 border-b last:border-0 transition-colors"
                    >
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

            {/* جدول الطلاب */}
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
                          <option value="">
                            {selectedRouteId ? "Select Point..." : "← Select Route First"}
                          </option>
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

  // حفظ التعديلات
  const handleSave = async (formData) => {
    const routeId = formData.routeId?.value || formData.routeId;

    if (!routeId) return toast.error("Please select a route first");
    if (selectedStudents.length === 0) return toast.error("Please add at least one student");
    if (selectedStudents.some((s) => !s.pickupPointId))
      return toast.error("Please select a pickup point for all students");

    try {
      const payload = {
        busId: formData.busId?.value || formData.busId,
        driverId: formData.driverId?.value || formData.driverId,
        routeId,
        name: formData.name,
        rideType: formData.rideType,
        frequency: formData.frequency,
        students: selectedStudents.map((s) => ({
          studentId: s.studentId,
          pickupPointId: s.pickupPointId,
          pickupTime: s.pickupTime,
        })),
      };

      if (formData.codriverId) payload.codriverId = formData.codriverId?.value || formData.codriverId;

      if (formData.frequency === "repeat") {
        payload.repeatType = formData.repeatType;
        if (formData.repeatType === "limited") {
          if (!formData.startDate || !formData.endDate)
            return toast.error("Start date and End date are required");
          if (new Date(formData.startDate) > new Date(formData.endDate))
            return toast.error("Start date must be before end date");
          payload.startDate = formData.startDate;
          payload.endDate = formData.endDate;
        } else {
          if (!formData.startDate) return toast.error("Start date is required for repeat rides");
          payload.startDate = formData.startDate;
        }
      } else if (formData.frequency === "once") {
        if (!formData.rideDate) return toast.error("Please select a date for this ride");
        payload.startDate = formData.rideDate;
      }

      await putData(payload, null, "Ride updated successfully!");
      navigate("/admin/rides");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update ride");
    }
  };

  if (fetchingRide) return <div className="p-10 text-center"><Loading /></div>;

  return (
    <div>
      <AddPage
        title="Edit Ride"
        fields={formSchema}
        initialData={initialData}
        onSave={handleSave}
        onCancel={() => navigate("/admin/rides")}
        loading={saving}
        isEdit={true}
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
                <span className="w-2 h-2 bg-one rounded-full"></span>
                <span className="font-medium">
                  {student.studentName}-{student.pickupTime}-{student.pickupPointId}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStudents(selectedStudents.filter(s => s.studentId !== student.studentId));
                    toast.success(`${student.studentName} removed`);
                  }}
                  className="ml-1 text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
                  title="Remove from list"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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

export default EditRides;
