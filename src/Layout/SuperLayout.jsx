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
  WalletCards,
  ShieldCheck,
  PenTool,
  Home
} from "lucide-react";
import { MdOutlinePayment } from "react-icons/md";
import { Menu } from "lucide-react";
import { RiParentFill } from "react-icons/ri";
import { RiSecurePaymentFill } from "react-icons/ri";
import { FaWallet } from "react-icons/fa";
import { canView } from "@/utils/canView";

const SuperLayout = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  // حالة للموبايل: إظهار/إخفاء القائمة
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const superAdmin = JSON.parse(localStorage.getItem("superAdmin")) || {};
  const superMenuItems = [
        { title: "Home", icon: <Home size={20} />, path: "/super", module: null },

    {
      title: "Bus Types",
      icon: <Bus size={20} />,
      path: "/super/bustypes",
      module: "bustypes" 
    },
    {
      title: "Organizations",
      icon: <Building2 size={20} />,
      path: "/super/organization",
      module: "organizations" 
    },
    {
      title: "Promo Codes",
      icon: <TicketPercent size={20} />,
      path: "/super/promocodes",
      module: "promocodes" 
    },
    {
      title: "Plans",
      icon: <Layers size={20} />,
      path: "/super/plans",
      module: "plans" 
    },
    {
      title: "Org Types",
      icon: <LayoutGrid size={20} />,
      path: "/super/typesorganization",
      module: "typesorganization" 
    },
    {
      title: "Payment methods",
      icon: <MdOutlinePayment size={20} />,
      path: "/super/paymentmethods",
      module: "payment_methods" 
    },
    {
      title: "Subscribers",
      icon: <Spool size={20} />,
      path: "/super/subscribers",
      module: "subscribers" 
    },
    {
      title: "Parent  Plans",
      icon: <RiParentFill size={20} />,
      path: "/super/parentplans",
      module: "parentplans" 
    },
    {
      title: "Admins",
      icon: <LayoutDashboard size={20} />,
      path: "/super/admins",
      module: "sub_admins" 
    },
    {
      title: "Invoices",
      icon: <WalletCards size={20} />,
      path: "/super/invoice",
      module: "invoice" 
    },
    { title: "Roles", icon: <ShieldCheck size={20} />,
    path: "/super/roles" ,
    module: "super_admin_roles" 
    },
    {
      title: "Installments",
      icon: <PenTool size={20} />,
      path: "/super/installments",
      module: "installments"
    },
    {
      title: "Payments",
      icon: <RiSecurePaymentFill size={20} />,
      path: "/super/payments",
      module: "payments"
    },
    { title: "Wallet", icon: <FaWallet size={20} />, path: "/super/wallet",
    module: "wallet"},
  ];
    const filteredMenu = superMenuItems.filter((item) => {
      if (!item.module) return true;
      return canView(superAdmin, item.module);
    });
  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* 1. تمرير حالات الموبايل للـ SideBar 
         2. إضافة الـ Overlay (الخلفية السوداء) عند فتح الموبايل
      */}

      {/* خلفية سوداء تظهر فقط في الموبايل عند فتح القائمة */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <SideBar
        menuItems={filteredMenu}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="flex items-center bg-white border-b border-gray-100 shrink-0">
          <button
            className="p-4 md:hidden text-gray-600 focus:outline-none"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* جعل الناف بار يأخذ باقي المساحة */}
          <div className="flex-1">
            <Navbar
              route="/super/profile"
              name={superAdmin?.name}
              gmail={superAdmin?.email}
            />
          </div>
        </header>

        <main
          className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <Outlet />
        </main>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default SuperLayout;
