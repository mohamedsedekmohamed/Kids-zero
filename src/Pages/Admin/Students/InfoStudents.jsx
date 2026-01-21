import React, { useState } from 'react';
import useGet from "@/hooks/useGet";
import { useParams } from 'react-router-dom';
import { 
  User, Phone, Mail, MapPin, CreditCard, 
  Calendar, Clock, Bus, CheckCircle, XCircle, 
  AlertCircle, LayoutDashboard, History, Route
} from 'lucide-react';
import { format } from 'date-fns';
import Loading from '@/Components/Loading';

const InfoStudents = () => {
  const { id } = useParams();
  // Using the hook as per your structure
  const { data: response, loading } = useGet(`/api/admin/students/details/${id}`);
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) return <div className="h-screen flex justify-center items-center "><Loading/></div>;
  if (!response?.success) return <div className="p-8 text-center text-red-500">Failed to load data</div>;

  const { student, rides, attendance, upcomingRides } = response.data;

  // Helper for Attendance Status Colors
  const getStatusStyle = (status) => {
    switch (status) {
      case 'present':
      case 'picked_up':
      case 'dropped_off':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'absent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'excused':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6" dir="rtl">
      
      {/* --- Profile Header --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
        {/* Decorative Background Blob */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative">
          <img 
            src={student.avatar} 
            alt={student.name} 
            className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md"
          />
          <span className={`absolute -bottom-2 -right-2 px-3 py-1 text-xs font-bold rounded-full border-2 border-white ${student.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
            {student.status.toUpperCase()}
          </span>
        </div>

        <div className="flex-1 text-center md:text-right space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm text-gray-600">
            <span className="px-3 py-1 bg-gray-100 rounded-lg border border-gray-200 font-medium">
              {student.grade}
            </span>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 font-medium">
              Class {student.classroom}
            </span>
            <span className="flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-lg border border-orange-100 font-medium">
              <MapPin className="w-3 h-3" /> {student.zone.name}
            </span>
          </div>
        </div>

        {/* Quick Balance Stat */}
        <div className="bg-gradient-to-br from-two to-one text-white p-4 rounded-xl shadow-lg min-w-[200px]">
          <div className="flex items-center gap-2 opacity-80 mb-1">
            <CreditCard className="w-4 h-4" />
            <span className="text-xs font-medium">Wallet Balance</span>
          </div>
          <div className="text-2xl font-bold">{student.walletBalance} EGP</div>
        </div>
      </div>

      {/* --- Main Content Tabs --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100 px-6 pt-4 flex gap-6">
          <TabButton 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')} 
            label="Profile Overview" 
            icon={LayoutDashboard}
          />
          <TabButton 
            active={activeTab === 'attendance'} 
            onClick={() => setActiveTab('attendance')} 
            label="Attendance & History" 
            icon={History}
          />
        </div>

        <div className="p-6">
          {activeTab === 'overview' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Parent & Upcoming */}
              <div className="space-y-6 lg:col-span-1">
                {/* Parent Card */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" /> Guardian Info
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <img src={student.parent.avatar} alt="Parent" className="w-12 h-12 rounded-full" />
                    <div>
                      <p className="font-semibold text-gray-900">{student.parent.name}</p>
                      <p className="text-xs text-gray-500">Primary Contact</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <ContactRow icon={Phone} value={student.parent.phone} type="tel" />
                    <ContactRow icon={Mail} value={student.parent.email} type="mailto" />
                  </div>
                </div>

                {/* Upcoming Rides */}
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Upcoming Schedule
                  </div>
                  <div className="divide-y divide-gray-100">
                    {upcomingRides.slice(0, 3).map((ride) => (
                      <div key={ride.occurrenceId} className="p-3 bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-gray-800 text-sm">{format(new Date(ride.date), 'EEE, dd MMM')}</span>
                          <span className="text-[10px] uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                            {ride.ride.type}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Bus className="w-3 h-3" /> {ride.bus}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Rides */}
              <div className="lg:col-span-2">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Route className="w-5 h-5 text-indigo-600" /> Assigned Bus Routes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rides.map((ride) => (
                    <div key={ride.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow relative">
                      <div className="absolute top-4 left-4 bg-gray-100 px-2 py-1 rounded text-xs text-gray-600 font-medium">
                        {ride.pickupTime.slice(0, 5)} PM
                      </div>
                      
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                          <Bus className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{ride.name}</h4>
                          <p className="text-xs text-gray-500">{ride.type} Route</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm mt-4 pt-3 border-t border-dashed border-gray-200">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Bus Plate:</span>
                          <span className="font-mono font-medium">{ride.bus.plateNumber}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Driver:</span>
                          <div className="flex items-center gap-2">
                            <img src={ride.driver.avatar} className="w-5 h-5 rounded-full" alt="Driver" />
                            <span className="font-medium">{ride.driver.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // --- TAB 2: ATTENDANCE ---
            <div className="space-y-8">
              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatBox label="Total Days" value={attendance.stats.total} color="bg-gray-50 text-gray-700" />
                <StatBox label="Present" value={attendance.stats.present} color="bg-green-50 text-green-700 border-green-100" icon={CheckCircle} />
                <StatBox label="Absent" value={attendance.stats.absent} color="bg-red-50 text-red-700 border-red-100" icon={XCircle} />
                <StatBox label="Pending" value={attendance.stats.pending} color="bg-yellow-50 text-yellow-700 border-yellow-100" icon={AlertCircle} />
              </div>

              {/* History Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 font-bold text-gray-800">
                  Attendance History
                </div>
                <div className="max-h-[500px] overflow-y-auto">
                  <table className="w-full text-right">
                    <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500">Date</th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500">Ride</th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500">Scheduled</th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {attendance.history.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3 px-6 text-sm text-gray-900 font-medium">
                            {format(new Date(record.date), 'dd MMM yyyy')}
                          </td>
                          <td className="py-3 px-6 text-sm text-gray-600">
                            {record.rideName}
                          </td>
                          <td className="py-3 px-6 text-sm text-gray-500 font-mono">
                            {record.pickupTime.slice(0, 5)}
                          </td>
                          <td className="py-3 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(record.status)}`}>
                              {record.status === 'present' || record.status === 'picked_up' ? <CheckCircle className="w-3 h-3"/> : 
                               record.status === 'absent' ? <XCircle className="w-3 h-3"/> : 
                               <Clock className="w-3 h-3"/>
                              }
                              {record.status.replace('_', ' ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

const ContactRow = ({ icon: Icon, value, type }) => (
  <a 
    href={type === 'tel' ? `tel:${value}` : `mailto:${value}`}
    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group"
  >
    <div className="p-2 bg-gray-50 group-hover:bg-blue-50 rounded-full transition-colors">
      <Icon className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
    </div>
    <span className="text-sm font-medium text-gray-700">{value}</span>
  </a>
);

const TabButton = ({ active, onClick, label, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`pb-4 px-2 text-sm font-medium transition-colors relative whitespace-nowrap flex items-center gap-2 ${
      active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
    {active && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}
  </button>
);

const StatBox = ({ label, value, color, icon: Icon }) => (
  <div className={`p-4 rounded-xl border ${color} flex flex-col items-center justify-center gap-2`}>
    {Icon && <Icon className="w-5 h-5 opacity-80" />}
    <span className="text-2xl font-bold">{value}</span>
    <span className="text-xs uppercase tracking-wide opacity-80">{label}</span>
  </div>
);

export default InfoStudents;