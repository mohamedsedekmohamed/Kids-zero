import React, { useState } from "react";
import {
  LogOut,
} from "lucide-react";

import { FaBusAlt } from "react-icons/fa";
import { NavLink, useLocation ,useNavigate } from "react-router-dom";

const SideBar = ({menuItems}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation(); // 👈 هنا
  const navigate = useNavigate();


const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");

  navigate("/login", { replace: true }); 
  
};
  return (
<div className="flex h-screen bg-gray-100 overflow-hidden"> 
      <aside
        className={`
          h-screen bg-white shadow-xl flex flex-col
          transition-all duration-300 ease-in-out
          fixed md:relative z-50
          ${isExpanded ? "w-full md:w-64" : "w-0 md:w-20"}
        `}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
        >

        {/* Logo - جزء ثابت لا يتحرك */}
        <div className="flex items-center gap-x-4 p-5 h-20 border-b border-gray-100 flex-shrink-0">
          <div className="min-w-[40px]">
            <FaBusAlt size={40} className="text-one" />
          </div>
          <h1 className={`text-one font-bold text-xl origin-right duration-200 ${!isExpanded && "scale-0 hidden"}`}>
            KIDS ZERO
          </h1>
        </div>
        </button>

        {/* Menu - هذا هو الجزء الذي يحتوي على الـ Scroll */}
        <ul 
          className="flex-1 pt-6 px-3 space-y-2 overflow-y-auto"
          style={{
            scrollbarWidth: 'none', // لمتصفح Firefox
            msOverflowStyle: 'none', // لمتصفح Internet Explorer
          }}
        >
          

          {menuItems.map((item, index) => {
            const isActive = 
              item.path === "/" 
                ? location.pathname === "/" || location.pathname.startsWith("/home")
                : location.pathname.startsWith(item.path);

            return (
              <li key={index} className="relative">
                <NavLink
                  to={item.path}
                  className={`
                    flex items-center p-3 rounded-lg cursor-pointer transition-colors group
                    ${!isExpanded ? "justify-center" : "gap-x-4"}
                    ${isActive ? "bg-one text-white shadow-lg shadow-one/20" : "text-gray-600 hover:bg-two/80 hover:text-white"}
                  `}
                >
                  <span className="shrink-0 transition-transform group-hover:scale-110">
                    {item.icon}
                  </span>
                  <span className={`font-medium whitespace-nowrap origin-right duration-200 ${!isExpanded && "hidden"}`}>
                    {item.title}
                  </span>
                  {!isExpanded && (
                    <div className="absolute left-full ml-6 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      {item.title}
                    </div>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Footer - جزء ثابت لا يتحرك */}
        <div className="p-3 border-t border-gray-100 flex-shrink-0">
          <button
        onClick={handleLogout}
          
          className={`flex items-center p-3 rounded-lg cursor-pointer text-red-500 hover:bg-red-50 transition-colors ${!isExpanded ? "justify-center" : "gap-x-4"}`}>
            <LogOut size={20} />
            <span className={`${!isExpanded && "hidden"} font-medium`}>Logout</span>
          </button>
        </div>
      </aside>
    </div>

  );
};

export default SideBar;
