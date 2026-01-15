import React from "react";
import { LogOut, ChevronLeft, ChevronRight, X } from "lucide-react"; // X icon added
import { FaBusAlt } from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const SideBar = ({ menuItems, isExpanded, setIsExpanded, isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  // دالة لإغلاق القائمة في الموبايل عند الضغط على أي رابط
  const handleLinkClick = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      <aside
        className={`
          bg-white shadow-xl flex flex-col h-screen
          transition-all duration-300 ease-in-out z-50
          
          /* Mobile CSS: Fixed position, slide in/out logic */
          fixed inset-y-0 left-0 
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          w-64
          
          /* Desktop CSS: Relative position, always visible, dynamic width */
          md:relative md:translate-x-0 
          md:${isExpanded ? "w-64" : "w-20"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 h-20 border-b border-gray-100 flex-shrink-0 relative">
          <div className="flex items-center gap-x-3 overflow-hidden">
            <FaBusAlt size={35} className="text-one  flex-shrink-0" />
            {/* العنوان يظهر دائماً في الموبايل، وفي الديسك توب حسب التوسيع */}
            <h1 className={` font-bold text-xl text-one  whitespace-nowrap transition-all duration-300 ${!isExpanded ? "md:opacity-0 md:translate-x-10" : ""}`}>
              KIDS ZERO
            </h1>
          </div>

          {/* زر غلق القائمة (يظهر فقط في الموبايل) */}
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-gray-500 hover:text-red-500"
          >
            <X size={24} />
          </button>

          {/* زر التوسيع/الطي (يظهر فقط في الكمبيوتر) */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden md:block absolute -right-3 top-8 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:bg-gray-100 z-50"
          >
            {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Menu Items */}
        <ul
          className="flex-1 pt-4 px-3 space-y-2 overflow-y-auto overflow-x-hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {menuItems.map((item, index) => {
            const isActive =
            (item.path === "/admin" || item.path === "/super") 
              ? location.pathname === item.path || location.pathname === item.path + "/" || location.pathname.startsWith(item.path + "/home")
              : location.pathname.startsWith(item.path);

            return (
              <li key={index}>
                <NavLink
                  to={item.path}
                  onClick={handleLinkClick} // أغلق القائمة عند الاختيار في الموبايل
                  className={`
                    flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 group relative
                    ${isActive ? "bg-text-one  text-gray-800 shadow-lg shadow-one/50 bg-one" : "text-gray-600 hover:bg-text-one/80  hover:"}
                    /* في الموبايل دائماً النصوص ظاهرة، في الديسك توب حسب الحالة */
                    ${!isExpanded ? "md:justify-center" : "gap-x-4"}
                  `}
                >
                  <span className="shrink-0">{item.icon}</span>
                  
                  {/* النص: ظاهر دائماً في الموبايل. مخفي في الديسك توب إذا كانت القائمة صغيرة */}
                  <span className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-200 
                    ${!isExpanded ? "md:w-0 md:opacity-0 hidden md:block" : "w-auto opacity-100"}
                  `}>
                    {item.title}
                  </span>

                  {/* Tooltip للديسك توب فقط */}
                  {!isExpanded && (
                    <div className="hidden md:block absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                      {item.title}
                    </div>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full p-3 rounded-lg cursor-pointer text-red-500 hover:bg-red-50 transition-colors 
              ${!isExpanded ? "md:justify-center" : "gap-x-4"}
            `}
          >
            <LogOut size={20} className="shrink-0" />
            <span className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-200 
               ${!isExpanded ? "md:w-0 md:opacity-0 hidden md:block" : "w-auto opacity-100"}
            `}>
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideBar;