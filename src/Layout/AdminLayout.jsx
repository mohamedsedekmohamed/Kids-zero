import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../Components/SideBar";
import Navbar from "../Components/Navbar";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import {
  Home,
  LayoutDashboard,
  Bus,
  Building2,
  MapPin,
  ShieldCheck,
  Route,
 DiamondMinus ,
 LandPlot ,
Spool ,WalletCards , 
PenTool,
BanknoteArrowDown 
} from "lucide-react";
import { GiCaptainHatProfile } from "react-icons/gi";
import { MdSupportAgent } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
import { RiParentFill } from "react-icons/ri";
import { AiOutlineGateway } from "react-icons/ai";

const AppLayout = () => {
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
  { title: "Subscribtions", icon: <Spool size={20} />, path: "/admin/subscribtions" },
  { title: "Peyment", icon: <BanknoteArrowDown size={20} />, path: "/admin/peyment" },
  { title: "Fee Installments", icon: <PenTool size={20} />, path: "/admin/feeinstallments" },
  { title: "Invoices", icon: <WalletCards size={20} />, path: "/admin/invoices" },
];
  return (
    <div className="flex h-screen gap-1 bg-gray-100 font-sans" >
      
        <SideBar menuItems={menuItems} /> 


      <div className="flex-1 flex flex-col  overflow-hidden"
      
      >
        <Navbar route="/admin/profile" />
<div className=" overflow-y-auto"
          style={{
            scrollbarWidth: 'none', // لمتصفح Firefox
            msOverflowStyle: 'none', // لمتصفح Internet Explorer
          }}
        >
      <Outlet/>
</div>
      </div>
  <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  );
}

export default AppLayout;