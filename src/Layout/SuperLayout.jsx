import React from "react";
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
  
} from "lucide-react";
import { MdOutlinePayment } from "react-icons/md";

const SuperLayout = () => {

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
 
];
  return (
    <div className="flex h-screen gap-1 bg-gray-100 font-sans">
      <SideBar menuItems={superMenuItems} /> 
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar route="/super/profile" />
        <div className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default SuperLayout;