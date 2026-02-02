import React from 'react';
import useGet from '../../../hooks/useGet'; 
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Users, Bus, UserCheck, MapPin, Navigation, CheckCircle, Clock, Loader2 } from 'lucide-react';

const Home = () => {
  const { data: response, loading, error } = useGet('/api/admin/dashboard');

  // الألوان الخاصة بك
  const MY_COLORS = {
    one: '#93BD57',    // الأخضر الأساسي
    two: '#C5D89D',    // الأخضر الفاتح
    three: '#980404',  // الأحمر الداكن
    four: '#043915',   // الأخضر الغامق جداً
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin" style={{ color: MY_COLORS.one }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">
        Error: {error}
      </div>
    );
  }

  const dashboardData = response?.data || {};
  const stats = dashboardData.stats || {};

  const rideDistribution = [
    { name: 'Morning Rides', value: dashboardData.chart1?.morningRides || 0 },
    { name: 'Afternoon Rides', value: dashboardData.chart1?.afternoonRides || 0 }
  ];

  const pickupData = dashboardData.chart4?.pickupPointData || [];
  
  const paymentData = dashboardData.chart6?.installmentData?.map(item => ({
    date: new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    amount: item.amount
  })) || [];

  // مصفوفة الألوان للرسم الدائري
  const PIE_COLORS = [MY_COLORS.one, MY_COLORS.four];

  const StatCard = ({ title, value, icon: Icon, bgColor }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center transition-transform hover:scale-105">
      <div className="p-4 rounded-xl mr-4" style={{ backgroundColor: bgColor }}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-bold uppercase tracking-tight">{title}</p>
        <h3 className="text-2xl font-black" style={{ color: MY_COLORS.four }}>{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-left" dir="ltr">
      <header className="mb-10">
        <h1 className="text-3xl font-black" style={{ color: MY_COLORS.four }}>System Dashboard</h1>
        <div className="w-20 h-1 mt-2" style={{ backgroundColor: MY_COLORS.one }}></div>
        <p className="text-gray-500 mt-2">Fleet management and financial overview</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Buses" value={stats.totalBuses} icon={Bus} bgColor={MY_COLORS.one} />
        <StatCard title="Drivers" value={stats.totalDrivers} icon={UserCheck} bgColor={MY_COLORS.four} />
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} bgColor={MY_COLORS.two} />
        <StatCard title="Active Rides" value={stats.activeRides} icon={Navigation} bgColor={MY_COLORS.three} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Ride Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 flex items-center" style={{ color: MY_COLORS.four }}>
            <Clock className="mr-2 w-5 h-5" style={{ color: MY_COLORS.one }} /> Ride Time Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={rideDistribution} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value">
                  {rideDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Used Pickup Points */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 flex items-center" style={{ color: MY_COLORS.four }}>
            <MapPin className="mr-2 w-5 h-5" style={{ color: MY_COLORS.three }} /> Popular Pickup Points
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pickupData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: MY_COLORS.four}} axisLine={false} />
                <YAxis axisLine={false} tick={{fill: MY_COLORS.four}} />
                <Tooltip cursor={{fill: MY_COLORS.two, opacity: 0.2}} />
                <Bar dataKey="count" fill={MY_COLORS.one} radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-bold mb-6 flex items-center" style={{ color: MY_COLORS.four }}>
            <CheckCircle className="mr-2 w-5 h-5" style={{ color: MY_COLORS.one }} /> Approved Installments History
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={paymentData}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={MY_COLORS.one} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={MY_COLORS.one} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{fill: MY_COLORS.four}} />
                <YAxis tick={{fill: MY_COLORS.four}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke={MY_COLORS.one} 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorAmt)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;