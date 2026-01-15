import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../Components/SideBar";
import Navbar from "../Components/Navbar";
import { Toaster } from "react-hot-toast";
import { Menu } from "lucide-react"; // أيقونة القائمة للموبايل

// ... (نفس الـ imports الخاصة بالأيقونات كما هي)
import {
  Home, LayoutDashboard, Bus, Building2, MapPin, ShieldCheck, Route,
  DiamondMinus, LandPlot, Spool, WalletCards, PenTool, BanknoteArrowDown
} from "lucide-react";
import { GiCaptainHatProfile } from "react-icons/gi";
import { MdSupportAgent } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
import { RiParentFill } from "react-icons/ri";
import { AiOutlineGateway } from "react-icons/ai";

const AppLayout = () => {
  // حالة للكمبيوتر: توسيع/طي القائمة
  const [isExpanded, setIsExpanded] = useState(true);
  // حالة للموبايل: إظهار/إخفاء القائمة
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { title: "Home", icon: <Home size={20} />, path: "/admin" },
    { title: "Admins", icon: <LayoutDashboard size={20} />, path: "/admin/admins" },
    { title: "Buses", icon: <Bus size={20} />, path: "/admin/buses" },
    { title: "Departments", icon: <Building2 size={20} />, path: "/admin/departments" },
    { title: "Pickuppoints", icon: <MapPin size={20} />, path: "/admin/pickuppoints" },
    { title: "Roles", icon: <ShieldCheck size={20} />, path: "/admin/roles" },
    { title: "Routes", icon: <Route size={20} />, path: "/admin/routes" },
    { title: "Cities", icon: <LandPlot size={20} />, path: "/admin/city" },
    { title: "Zones", icon: <DiamondMinus size={20} />, path: "/admin/zone" },
    { title: "Drivers", icon: <GiCaptainHatProfile size={20} />, path: "/admin/drivers" },
    { title: "Codrivers", icon: <MdSupportAgent size={20} />, path: "/admin/codrivers" },
    { title: "Students", icon: <PiStudentFill size={20} />, path: "/admin/students" },
    { title: "Parents", icon: <RiParentFill size={20} />, path: "/admin/parents" },
    { title: "Rides", icon: <AiOutlineGateway size={20} />, path: "/admin/rides" },
      { title: "Subscriptions", icon: <Spool size={20} />, path: "/admin/subscribtions" },
    { title: "Payment", icon: <BanknoteArrowDown size={20} />, path: "/admin/peyment" },
    { title: "Fee Installments", icon: <PenTool size={20} />, path: "/admin/feeinstallments" },
    { title: "Invoices", icon: <WalletCards size={20} />, path: "/admin/invoices" },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden relative">
      
      {/* 1. تمرير حالات الموبايل للـ SideBar 
         2. إضافة الـ Overlay (الخلفية السوداء) عند فتح الموبايل
      */}
      
      {/* خلفية سوداء تظهر فقط في الموبايل عند فتح القائمة */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <SideBar 
        menuItems={menuItems} 
        isExpanded={isExpanded} 
        setIsExpanded={setIsExpanded}
        isMobileOpen={isMobileOpen}       // جديد
        setIsMobileOpen={setIsMobileOpen} // جديد
      />

      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        
        {/* Navbar Wrapper contains Mobile Toggle + Original Navbar */}
        <div className="flex items-center bg-white md:bg-transparent">
            {/* زر القائمة يظهر فقط في الموبايل (md:hidden) */}
            <button 
              className="p-4 md:hidden text-gray-600 focus:outline-none"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            {/* جعل الناف بار يأخذ باقي المساحة */}
            <div className="flex-1">
                 <Navbar route="/admin/profile" />
            </div>
        </div>

        <main 
          className="flex-1 overflow-y-auto p-2"
          style={{
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
          }}
        >
          <Outlet />
        </main>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default AppLayout;