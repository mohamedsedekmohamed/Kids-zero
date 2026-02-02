import React from 'react';
import useGet from '../../../hooks/useGet'; 
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ComposedChart
} from 'recharts';
import { 
  Users, Bus, UserCheck, MapPin, Navigation, CheckCircle, 
  Clock, Loader2, Route, ShieldCheck, Wallet 
} from 'lucide-react';

const Home = () => {
  const { data: response, loading, error } = useGet('/api/admin/dashboard');

  const MY_COLORS = {
    one: '#93BD57',    // الأخضر الأساسي
    two: '#C5D89D',    // الأخضر الفاتح
    three: '#980404',  // الأحمر الداكن
    four: '#043915',   // الأخضر الغامق جداً
    gray: '#f3f4f6'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin" style={{ color: MY_COLORS.one }} />
      </div>
    );
  }

  if (error) return <div className="p-10 text-red-600 font-bold">Error: {error}</div>;

  const d = response?.data || {};
  const stats = d.stats || {};

  // --- Data Preparation ---
  
  // Chart 1: Pie - Ride Type
  const chart1Data = [
    { name: 'Morning', value: d.chart1?.morningRides || 0 },
    { name: 'Afternoon', value: d.chart1?.afternoonRides || 0 }
  ];

  // Chart 3: Donut - Ride Status
  const chart3Data = [
    { name: 'Scheduled', value: d.chart3?.scheduled || 0 },
    { name: 'In Progress', value: d.chart3?.inProgress || 0 },
    { name: 'Completed', value: d.chart3?.completed || 0 },
    { name: 'Cancelled', value: d.chart3?.cancelled || 0 },
  ];

  // Chart 5: Line - Time Analysis (Time taken per ride)
  const chart5Data = d.chart5?.rideTimingData?.map((item, index) => ({
    order: index + 1,
    time: item.timeTakenMinutes,
    point: item.pickupPointName
  })) || [];

  // Chart 6: Financials
  const chart6Data = d.chart6?.installmentData?.map(item => ({
    date: new Date(item.dueDate).toLocaleDateString('en-GB'),
    amount: item.amount,
    status: item.statusCategory // Paid vs Not Paid
  })) || [];

  const StatCard = ({ title, value, icon: Icon, bgColor }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center">
      <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: bgColor }}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-bold uppercase">{title}</p>
        <h3 className="text-xl font-black" style={{ color: MY_COLORS.four }}>{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-left" dir="ltr">
      <header className="mb-8">
        <h1 className="text-2xl font-black" style={{ color: MY_COLORS.four }}>Fleet Operations Center</h1>
        <p className="text-gray-400 text-sm">Real-time school bus monitoring dashboard</p>
      </header>

      {/* --- Stats Section --- */}
      <div className=" flex flex-wrap  justify-between gap-4 mb-8">
        <StatCard title="Buses" value={stats.totalBuses} icon={Bus} bgColor={MY_COLORS.one} />
        <StatCard title="Drivers" value={stats.totalDrivers} icon={UserCheck} bgColor={MY_COLORS.four} />
        <StatCard title="Co-Drivers" value={stats.totalCoDrivers} icon={ShieldCheck} bgColor={MY_COLORS.two} />
        <StatCard title="Students" value={stats.totalUsers} icon={Users} bgColor={MY_COLORS.one} />
        <StatCard title="Active Rides" value={stats.activeRides} icon={Navigation} bgColor={MY_COLORS.three} />
        <StatCard title="Completed" value={stats.completedRides} icon={CheckCircle} bgColor={MY_COLORS.one} />
        <StatCard title="Routes" value={stats.totalRoutes} icon={Route} bgColor={MY_COLORS.four} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Ride Type (Pie) */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h4 className="text-sm font-bold mb-4 flex items-center"><Clock className="w-4 h-4 mr-2"/> Ride Type Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={chart1Data} innerRadius={50} outerRadius={80} dataKey="value" label>
                  <Cell fill={MY_COLORS.one} />
                  <Cell fill={MY_COLORS.four} />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Ride Status (Donut) */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h4 className="text-sm font-bold mb-4 flex items-center"><Navigation className="w-4 h-4 mr-2"/> Ride Status</h4>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={chart3Data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {chart3Data.map((_, i) => <Cell key={i} fill={[MY_COLORS.one, MY_COLORS.two, MY_COLORS.four, MY_COLORS.three][i]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Students per Pickup (Column) */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h4 className="text-sm font-bold mb-4 flex items-center"><MapPin className="w-4 h-4 mr-2"/> Students per Pickup</h4>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={d.chart4?.pickupPointData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 10}} />
                <YAxis />
                <Tooltip cursor={{fill: MY_COLORS.gray}} />
                <Bar dataKey="count" fill={MY_COLORS.one} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Time Analysis (Line) */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm lg:col-span-1">
          <h4 className="text-sm font-bold mb-4 flex items-center"><Clock className="w-4 h-4 mr-2"/> Trip Duration (Minutes)</h4>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={chart5Data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="order" label={{ value: 'Pickup Order', position: 'insideBottom', offset: -5 }} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="time" stroke={MY_COLORS.three} strokeWidth={3} dot={{ r: 6, fill: MY_COLORS.three }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: School Installments (Line with Markers) */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm lg:col-span-2">
          <h4 className="text-sm font-bold mb-4 flex items-center"><Wallet className="w-4 h-4 mr-2"/> Financials: Installments History</h4>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={chart6Data}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={MY_COLORS.one} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={MY_COLORS.one} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="amount" stroke={MY_COLORS.one} fillOpacity={1} fill="url(#colorPrice)" strokeWidth={3} />
                {/* Marker logic: different colors for paid vs unpaid can be handled via Dot customization */}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 7: Balance Ranges (Bar) */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm lg:col-span-3">
          <h4 className="text-sm font-bold mb-4 flex items-center"><Users className="w-4 h-4 mr-2"/> Student Balance Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={d.chart7?.balanceRanges} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="range" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="count" fill={MY_COLORS.four} radius={[0, 4, 4, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;