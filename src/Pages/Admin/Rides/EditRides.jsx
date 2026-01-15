import React, { useEffect, useState } from "react";
import AddPage from "@/Components/AddPage";
import usePut from "@/hooks/usePut";
import useGet from "@/hooks/useGet";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Trash2 } from "lucide-react";
import Loading from "@/Components/Loading";

const EditRides = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. جلب الخيارات الأساسية (الباصات، السائقين، الطرق)
  const { data: selectionData } = useGet("/api/admin/rides/selection");
  
  // 2. جلب بيانات الرحلة الحالية
  const { data: rideDetails, loading: fetchingRide } = useGet(`/api/admin/rides/${id}`);
  
  // 3. هوك التحديث
  const { putData, loading: saving } = usePut(`/api/admin/rides/${id}`);

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchPhone, setSearchPhone] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [initialData, setInitialData] = useState(null);

  // 4. تحويل بيانات الـ API إلى تنسيق يفهمه الفورم (Mapping)
  useEffect(() => {
    if (rideDetails?.data) {
      const { ride, bus, driver, codriver, route, students } = rideDetails.data;

      // تحديث البيانات الأساسية للفورم
      setInitialData({
        name: ride.name || "",
        rideType: ride.type || "", // الـ API يرجعها type والسكيمه تنتظر rideType
        frequency: ride.frequency || "",
        repeatType: ride.repeatType || "",
        startDate: ride.startDate ? ride.startDate.split("T")[0] : "",
        endDate: ride.endDate ? ride.endDate.split("T")[0] : "",
        // Autocomplete يتوقع object يحتوي على value و label
        routeId: route ? { value: route.id, label: route.name } : null,
        busId: bus ? { value: bus.id, label: bus.busNumber } : null,
        driverId: driver ? { value: driver.id, label: driver.name } : null,
        codriverId: codriver?.id ? { value: codriver.id, label: codriver.name } : null,
      });

      // تحديث قائمة الطلاب المضافين
      const mappedStudents = students?.map((s) => ({
        studentId: s.student?.id,
        studentName: s.student?.name,
        pickupPointId: s.pickupPoint?.id || "",
        pickupTime: s.pickupTime ,
      })) || [];

      setSelectedStudents(mappedStudents);
    }
  }, [rideDetails]);

  // تجهيز الخيارات للقوائم المنسدلة
  const routeOptions = selectionData?.data?.routes?.map((r) => ({ value: r.id, label: r.name })) || [];
  const busOptions = selectionData?.data?.buses?.map((b) => ({ value: b.id, label: `${b.busNumber}` })) || [];
  const driverOptions = selectionData?.data?.drivers?.map((d) => ({ value: d.id, label: d.name })) || [];
  const codriverOptions = selectionData?.data?.codrivers?.map((c) => ({ value: c.id, label: c.name })) || [];

  // منطق البحث عن طالب
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
    setSelectedStudents(prev => [...prev, {
      studentId: student.id,
      studentName: student.name,
      pickupPointId: "",
      pickupTime: "07:30:00"
    }]);
    setSearchPhone("");
    setSearchResults([]);
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
  type: "date",
  required: true,
  hidden: (formData) =>
    formData.frequency !== "repeat" ||
    formData.repeatType !== "limited",
},
{
  name: "endDate",
  label: "End Date",
  type: "date",
  required: true,
  hidden: (formData) =>
    formData.frequency !== "repeat" ||
    formData.repeatType !== "limited",
},

    { name: "routeId", label: "Select Route", type: "autocomplete", options: routeOptions, required: true },
    { name: "busId", label: "Select Bus", type: "autocomplete", options: busOptions, required: true },
    { name: "driverId", label: "Select Driver", type: "autocomplete", options: driverOptions, required: true },
    { name: "codriverId", label: "Select Co-Driver", type: "autocomplete", options: codriverOptions},
    
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
            <label className="block mb-2 text-sm font-medium text-gray-700">Add/Manage Students</label>
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search by Parent Phone..."
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="w-full p-3 border rounded-xl"
              />
              {searchResults.length > 0 && (
                <div className="absolute z-50 w-full bg-white border rounded-xl shadow-2xl mt-1 max-h-48 overflow-y-auto">
                  {searchResults.map((s) => (
                    <div key={s.id} className="p-3 flex justify-between items-center hover:bg-gray-50 border-b">
                      <span>{s.name}</span>
<button
  type="button"
  onClick={() => addStudentToList(s)}
  className="bg-one text-white px-3 py-1 rounded-lg"
>
  Add
</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Student</th>
                    <th className="p-3 text-left">Pickup Point</th>
                    <th className="p-3 text-left">Time</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStudents.map((student, index) => (
                    <tr key={student.studentId} className="border-t">
                      <td className="p-3">{student.studentName}</td>
                      <td className="p-3">
                        <select
                          value={student.pickupPointId}
                          onChange={(e) => {
                            const updated = [...selectedStudents];
                            updated[index].pickupPointId = e.target.value;
                            setSelectedStudents(updated);
                          }}
                          className="w-full p-2 border rounded-lg"
                        >
                          <option value="">Select Point...</option>
                          {pickupOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="time"
                          value={student.pickupTime}
                          onChange={(e) => {
                            const updated = [...selectedStudents];
                            updated[index].pickupTime = e.target.value;
                            setSelectedStudents(updated);
                          }}
                          className="p-2 border rounded-lg"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <button onClick={() => setSelectedStudents(selectedStudents.filter((_, i) => i !== index))} className="text-red-500">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
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
    if (!routeId) return toast.error("Please select a route");
    if (selectedStudents.length === 0) return toast.error("Add at least one student");
const invalidStudent = selectedStudents.find(
  (s) => !s.pickupPointId || !s.pickupTime
);

if (invalidStudent) {
  return toast.error("Please complete pickup point and time for all students");
}
    // تنظيف البيانات للإرسال
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


    try {
      await putData(payload, null, "Ride updated successfully!");
      navigate("/admin/rides");
    } catch (err) {
      console.error(err);
    }
  };

  if (fetchingRide) return <div className="p-10 text-center"><Loading/></div>;

  return (
    <AddPage
      title="Edit Ride"
      fields={formSchema}
      initialData={initialData} // سيتم استلامها في AddPage وتحديث الفورم
      onSave={handleSave}
      onCancel={() => navigate("/admin/rides")}
      loading={saving}
      isEdit={true}
    />
  );
};

export default EditRides;