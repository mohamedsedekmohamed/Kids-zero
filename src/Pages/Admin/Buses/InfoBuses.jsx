import React, { useState } from 'react';
import useGet from "@/hooks/useGet";
import { useParams } from 'react-router-dom';
import { 
  Bus, Calendar, Users, Activity, FileText, MapPin, 
  Clock, Phone, AlertCircle, CheckCircle, XCircle, 
  ChevronRight, History, Route
} from 'lucide-react';
import { format } from 'date-fns';
import Loading from '@/Components/Loading';

const InfoBuses = () => {
  const { id } = useParams();
  const { data: response, loading } = useGet(`/api/admin/buses/details/${id}`);
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) return <div className="p-8 text-center"><Loading/></div>;
  if (!response?.success) return <div className="p-8 text-center text-red-500">Failed to load data</div>;

  const { bus, rides, students, upcomingRides, rideHistory, stats } = response.data;

  // Helper to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'expired': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6" dir="rtl">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-100">
            <Bus className="h-8 w-8 text-one" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{bus.plateNumber}</h1>
            <p className="text-gray-500 flex items-center gap-2">
              <span className="font-medium text-gray-700">Code: {bus.busNumber}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>{bus.busType.name}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(bus.status)}`}>
            {bus.status.toUpperCase()}
          </span>
          {stats.licenseStatus === 'expired' && (
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-red-50 text-red-600 border border-red-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              License Expired
            </span>
          )}
        </div>
      </div>

      {/* --- Statistics Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Students" value={stats.totalStudents} subValue={`${stats.availableSeats} Available Seats`} color="blue" />
        <StatCard icon={Route} label="Active Rides" value={stats.activeRides} subValue={`${stats.totalRides} Total Routes`} color="indigo" />
        <StatCard icon={Activity} label="Capacity" value={`${stats.capacityPercentage}%`} subValue={`${bus.maxSeats} Max Seats`} color="emerald" />
        <StatCard icon={FileText} label="License Expiry" value={format(new Date(bus.licenseExpiryDate), 'dd MMM yyyy')} subValue={`${stats.daysUntilLicenseExpiry} Days remaining`} color={stats.daysUntilLicenseExpiry < 0 ? 'red' : 'orange'} />
      </div>

      {/* --- Main Content Tabs --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 px-6 pt-4 flex gap-6 overflow-x-auto">
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Overview & Rides" />
          <TabButton active={activeTab === 'students'} onClick={() => setActiveTab('students')} label={`Students (${students.length})`} />
          <TabButton active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} label="Schedule & History" />
        </div>

        <div className="p-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Bus Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-500" /> License Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
                    <DetailRow label="License Number" value={bus.licenseNumber} />
                    <DetailRow label="Expiry Date" value={format(new Date(bus.licenseExpiryDate), 'PPP')} />
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Document Image</p>
                      <img src={bus.licenseImage} alt="License" className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Bus className="w-5 h-5 text-gray-500" /> Vehicle Photo
                  </h3>
                  <div className="h-full">
                    <img src={bus.busImage} alt="Bus" className="w-full h-64 object-cover rounded-xl border border-gray-200 shadow-sm" />
                  </div>
                </div>
              </div>

              {/* Active Routes List */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-500" /> Assigned Routes (Rides)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rides.map((ride) => (
                    <div key={ride.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900">{ride.name}</h4>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{ride.type}</span>
                        </div>
                        <span className={`w-3 h-3 rounded-full ${ride.isActive === 'on' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span>{ride.route.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <img src={ride.driver.avatar} className="w-5 h-5 rounded-full" alt="Driver" />
                          <span>{ride.driver.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span>Start: {format(new Date(ride.startDate), 'MMM dd')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STUDENTS */}
          {activeTab === 'students' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Student</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Grade/Class</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Pickup Point</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Parent Info</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Ride</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                          <span className="font-medium text-gray-900">{student.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {student.grade} - <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">{student.classroom}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {student.pickupPoint.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{student.pickupTime}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-900">{student.parent.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {student.parent.phone}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {student.ride.name} ({student.ride.type})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: SCHEDULE & HISTORY */}
          {activeTab === 'schedule' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upcoming */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" /> Upcoming Schedule
                </h3>
                <div className="space-y-3">
                  {upcomingRides.slice(0, 5).map((item) => (
                    <div key={item.occurrenceId} className="flex items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                      <div className="bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-md ml-3 text-center">
                        <div className="text-xs">JAN</div>
                        <div className="text-lg">{format(new Date(item.date), 'dd')}</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.ride.name}</h4>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                           Driver: {item.driver.name}
                        </p>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full border border-yellow-100">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* History */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-600" /> Recent History
                </h3>
                <div className="relative border-r-2 border-gray-200 mr-3 space-y-6">
                  {rideHistory.slice(0, 5).map((hist) => (
                    <div key={hist.id} className="relative mr-6">
                      <div className="absolute -right-[31px] top-1 w-4 h-4 rounded-full bg-gray-200 border-2 border-white"></div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="flex justify-between mb-1">
                          <span className="font-semibold text-gray-700">{format(new Date(hist.date), 'EEEE, dd MMM')}</span>
                          <span className={`text-xs px-2 rounded-full ${hist.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                            {hist.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Ride: {hist.ride.name}</p>
                        <p className="text-xs text-gray-400 mt-1">Started: {format(new Date(hist.startedAt), 'hh:mm a')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Sub Components ---

const StatCard = ({ icon: Icon, label, value, subValue, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-xs text-gray-400 mt-2">{subValue}</p>
      </div>
      <div className={`p-3 rounded-xl ${colorClasses[color] || 'bg-gray-50 text-gray-600'}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`pb-4 px-2 text-sm font-medium transition-colors relative whitespace-nowrap ${
      active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    {label}
    {active && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}
  </button>
);

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center border-b border-gray-200/50 pb-2 last:border-0 last:pb-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-800">{value}</span>
  </div>
);

export default InfoBuses;