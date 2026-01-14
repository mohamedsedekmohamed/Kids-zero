import React, { useState } from "react";
import useGet from "@/hooks/useGet";
import ReusableTable from "@/Components/UI/ReusableTable";
import Loading from "@/Components/Loading";
import { format, parseISO } from "date-fns";
import { Button } from "@/Components/UI/button";

const Scheduling = () => {
  const { data: ridesData, loading } = useGet("/api/admin/rides/upcoming");

  // فلتر التاريخ
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const columns = [
    { header: "Date", key: "date" },
    { header: "Ride Name", key: "rideName" },
    { header: "Type", key: "rideType" },
    { header: "Bus Number", key: "busNumber" },
    { header: "Driver", key: "driverName" },
    { header: "Route", key: "routeName" },
    { header: "Status", key: "status" },
  ];

  // تجهيز البيانات للجدول مع فلترة التاريخ
  const tableData =
    ridesData?.data?.upcoming
      ?.filter((item) => {
        const itemDate = new Date(item.date);
        if (startDate && itemDate < new Date(startDate)) return false;
        if (endDate && itemDate > new Date(endDate)) return false;
        return true;
      })
      .map((item) => ({
        id: item.id,
        date: format(parseISO(item.date), "yyyy-MM-dd"),
        rideName: item.ride?.name,
        rideType: item.ride?.type,
        busNumber: item.bus?.busNumber,
        driverName: item.driver?.name,
        routeName: item.route?.name,
        status: item.status,
      })) || [];

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  return (
    <div className="p-10 bg-background min-h-screen">
      {/* فلتر التاريخ */}
   <div className="flex flex-col md:flex-row md:items-end gap-6 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 mb-8">
  <div className="flex-1 space-y-2">
    <label className="text-sm font-semibold text-one  my-2 ml-1">
      Start Date 
    </label>
    <div className="relative group my-2">
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="w-full bg-slate-50 border-none ring-1 ring-slate-200 rounded-xl p-3 text-slate-600 focus:ring-2 focus:ring-one focus:bg-white transition-all duration-200 outline-none"
      />
    </div>
  </div>

  {/* End Date Field */}
  <div className="flex-1 space-y-2 ">
    <label className="text-sm font-semibold text-one ml-1 ">
      End Date 
    </label>
    <div className="relative group my-2">
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="w-full bg-slate-50 border-none ring-1 ring-slate-200 rounded-xl p-3 text-slate-600 focus:ring-2 focus:ring-one focus:bg-white transition-all duration-200 outline-none"
      />
    </div>
  </div>

  {/* Action Button */}
  <div className="flex items-center">
    <Button 
      variant="ghost" 
      onClick={handleReset}
      className="h-[48px] px-6 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
    >
Reset    </Button>
  </div>
</div>
            
      <ReusableTable title="Scheduling Management" columns={columns} data={tableData} />
    </div>
  );
};

export default Scheduling;
