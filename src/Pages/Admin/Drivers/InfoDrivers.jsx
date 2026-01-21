import React, { useState } from 'react';
import useGet from "@/hooks/useGet";
import { useParams } from 'react-router-dom';
import { 
  User, Phone, Calendar, FileText, Shield, 
  MapPin, Bus, Users, Clock, CheckCircle, 
  AlertTriangle, History, Navigation, BadgeCheck
} from 'lucide-react';
import { format } from 'date-fns';

const InfoDrivers = () => {
  const { id } = useParams();
  const { data: response, loading } = useGet(`/api/admin/drivers/details/${id}`);
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) return <div className="p-8 text-center text-gray-500">Loading driver profile...</div>;
  if (!response?.success) return <div className="p-8 text-center text-red-500">Failed to load data</div>;

  const { driver, rides, students, upcomingRides, rideHistory, stats } = response.data;

  // Helper for license status color
  const getLicenseColor = (days) => {
    if (days < 0) return 'bg-red-50 text-red-600 border-red-200';
    if (days < 30) return 'bg-yellow-50 text-yellow-600 border-yellow-200';
    return 'bg-green-50 text-green-600 border-green-200';
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6" dir="rtl">
      
      {/* --- Header Profile Section --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img 
              src={driver.avatar} 
              alt={driver.name} 
              className="w-20 h-20 rounded-full object-cover border-4 border-gray-50 shadow-sm"
            />
            <span className={`absolute bottom-0 right-0 w-5 h-5 border-2 border-white rounded-full ${driver.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{driver.name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" /> {driver.phone}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" /> {driver.nationalId}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${getLicenseColor(stats.daysUntilLicenseExpiry)}`}>
             <Shield className="w-5 h-5" />
             <div className="text-right">
               <div className="text-xs font-semibold opacity-70">License Status</div>
               <div className="text-sm font-bold">
                 {stats.daysUntilLicenseExpiry > 0 ? `${stats.daysUntilLicenseExpiry} Days Left` : 'Expired'}
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* --- Statistics Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Navigation} label="Active Routes" value={stats.activeRides} subValue={`${stats.totalRides} Assigned`} color="blue" />
        <StatCard icon={Users} label="Total Students" value={stats.totalStudents} subValue="Across all routes" color="purple" />
        <StatCard icon={CheckCircle} label="Completed Trips" value={stats.totalTripsThisMonth} subValue="This Month" color="green" />
        <StatCard icon={Bus} label="Vehicle Info" value={rides[0]?.bus?.plateNumber || "N/A"} subValue={rides[0]?.bus?.number || "No Bus"} color="orange" />
      </div>

      {/* --- Tabs & Content --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 px-6 pt-4 flex gap-6 overflow-x-auto">
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Overview & Docs" icon={FileText} />
          <TabButton active={activeTab === 'students'} onClick={() => setActiveTab('students')} label={`Students (${students.length})`} icon={Users} />
          <TabButton active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} label="Schedule & History" icon={Calendar} />
        </div>

        <div className="p-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Documents Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocumentCard 
                  title="National ID Card" 
                  date={null} 
                  image={driver.nationalIdImage} 
                  idNumber={driver.nationalId}
                />
                <DocumentCard 
                  title="Driving License" 
                  date={driver.licenseExpiry} 
                  image={driver.licenseImage} 
                  isLicense={true}
                />
              </div>

              {/* Active Routes List */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-blue-600" /> Assigned Routes
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {rides.map((ride) => (
                    <div key={ride.id} className="border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:shadow-md transition-all">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-gray-900">{ride.name}</span>
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{ride.type}</span>
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                           <MapPin className="w-4 h-4 text-gray-400" /> {ride.route.name}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                           <Bus className="w-4 h-4 text-gray-400" /> {ride.bus.plateNumber} ({ride.bus.number})
                        </div>
                      </div>

                      {/* Co-Driver Info */}
                      {ride.codriver && (
                        <div className="flex items-center gap-3 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                          <img src={ride.codriver.avatar} alt="Co" className="w-8 h-8 rounded-full" />
                          <div>
                            <p className="text-xs text-blue-800 font-semibold">Co-Driver</p>
                            <p className="text-sm text-gray-700">{ride.codriver.name}</p>
                          </div>
                        </div>
                      )}
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
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Student</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Pickup</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Parent Contact</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Ride</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={student.avatar} className="w-9 h-9 rounded-full border border-gray-100" alt="" />
                          <div>
                            <p className="text-sm font-bold text-gray-900">{student.name}</p>
                            <p className="text-xs text-gray-500">{student.grade} - {student.classroom}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-700">{student.pickupPoint.name}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {student.pickupTime}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm font-medium">{student.parent.name}</div>
                        <a href={`tel:${student.parent.phone}`} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {student.parent.phone}
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                          {student.ride.name}
                        </span>
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
                  <Calendar className="w-5 h-5 text-indigo-600" /> Upcoming Schedule
                </h3>
                <div className="space-y-3">
                  {upcomingRides.slice(0, 6).map((trip) => (
                    <div key={trip.occurrenceId} className="flex items-center bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                      <div className="bg-indigo-50 text-indigo-700 w-14 h-14 flex flex-col items-center justify-center rounded-lg ml-4">
                        <span className="text-xs font-bold uppercase">{format(new Date(trip.date), 'MMM')}</span>
                        <span className="text-xl font-bold">{format(new Date(trip.date), 'dd')}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800">{trip.ride.name}</h4>
                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                          <span className="flex items-center gap-1"><Bus className="w-3 h-3"/> {trip.bus.plateNumber}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span>{trip.ride.type}</span>
                        </div>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 bg-yellow-50 text-yellow-700 rounded-lg">
                        {trip.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* History */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <History className="w-5 h-5 text-gray-600" /> Recent Trips
                </h3>
                <div className="space-y-4 relative border-r border-gray-200 mr-2 pr-6">
                  {rideHistory.slice(0, 6).map((hist) => (
                    <div key={hist.id} className="relative">
                      <div className="absolute -right-[31px] top-2 w-3 h-3 rounded-full bg-gray-300 border-2 border-white"></div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-gray-800">{format(new Date(hist.date), 'EEEE, dd MMM')}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Ride: {hist.ride.name} ({hist.bus})</p>
                        </div>
                        <div className="text-right">
                           <span className="text-xs text-gray-400 block">{format(new Date(hist.startedAt), 'hh:mm a')}</span>
                           <span className="text-xs text-green-600 font-medium">Started</span>
                        </div>
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
  const styles = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900 my-1">{value}</h3>
        <p className="text-xs text-gray-400">{subValue}</p>
      </div>
      <div className={`p-3 rounded-lg ${styles[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, label, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
      active ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
  >
    <Icon className="w-4 h-4" /> {label}
  </button>
);

const DocumentCard = ({ title, date, image, isLicense, idNumber }) => (
  <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
      <div className="flex items-center gap-2">
        {isLicense ? <Shield className="w-5 h-5 text-blue-500" /> : <BadgeCheck className="w-5 h-5 text-purple-500" />}
        <h4 className="font-bold text-gray-800">{title}</h4>
      </div>
      {date && (
        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
          Expires: {format(new Date(date), 'dd/MM/yyyy')}
        </span>
      )}
      {idNumber && (
         <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
           {idNumber}
         </span>
      )}
    </div>
    <div className="p-4 flex justify-center bg-gray-100/50">
      <img src={image} alt={title} className="h-48 object-contain rounded-lg shadow-sm border border-gray-200 hover:scale-105 transition-transform cursor-pointer" />
    </div>
  </div>
);

export default InfoDrivers;