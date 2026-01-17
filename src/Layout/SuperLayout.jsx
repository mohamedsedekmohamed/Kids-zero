import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../Components/SideBar";
import Navbar from "../Components/Navbar";
import { Toaster } from "react-hot-toast";
import { 
  Bus, 
  Building2, 
  TicketPercent, 
  Layers, 
  LayoutGrid,
  Spool,
  LayoutDashboard,
  WalletCards ,
  ShieldCheck ,
  PenTool
} from "lucide-react";
import { MdOutlinePayment } from "react-icons/md";
import { Menu } from "lucide-react";
import { RiParentFill } from "react-icons/ri";

const SuperLayout = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  // حالة للموبايل: إظهار/إخفاء القائمة
  const [isMobileOpen, setIsMobileOpen] = useState(false);
const superMenuItems = [
 
  { 
    title: "Bus Types", 
    icon: <Bus size={20} />, 
    path: "/super/bustypes" 
  },
  { 
    title: "Organizations", 
    icon: <Building2 size={20} />, 
    path: "/super/organization" 
  },
  { 
    title: "Promo Codes", 
    icon: <TicketPercent size={20} />, 
    path: "/super/promocodes" 
  },
  { 
    title: "Plans", 
    icon: <Layers size={20} />, 
    path: "/super/plans" 
  },
  { 
    title: "Org Types", 
    icon: <LayoutGrid size={20} />, 
    path: "/super/typesorganization" 
  },
  { 
    title: "Payment methods", 
    icon: <MdOutlinePayment size={20} />, 
    path: "/super/paymentmethods" 
  },
        { title: "Subscribers", icon: <Spool size={20} />, path: "/super/subscribers" },
        { title: "Parent  Plans", icon: <RiParentFill size={20} />, path: "/super/parentplans" },
        { title: "Admins", icon: <LayoutDashboard size={20} />, path: "/super/admins" },
    { title: "Invoices", icon: <WalletCards size={20} />, path: "/super/invoice" },
    { title: "Roles", icon: <ShieldCheck size={20} />, path: "/super/roles" },
    { title: " Installments", icon: <PenTool size={20} />, path: "/super/installments" },

 
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
        menuItems={superMenuItems} 
        isExpanded={isExpanded} 
        setIsExpanded={setIsExpanded}
        isMobileOpen={isMobileOpen}       
        setIsMobileOpen={setIsMobileOpen} 
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


export default SuperLayout;