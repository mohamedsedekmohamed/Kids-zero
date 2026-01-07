
import { 
  Search, 
  Bell, 
  Menu, 
  ChevronDown, 
  MessageSquare 
} from 'lucide-react';
         import { Link } from "react-router-dom";

const Navbar = ({route}) => {

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="flex items-center justify-between h-16 px-6">

        {/* الجزء الأيمن */}
        <div className="flex items-center gap-x-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 lg:hidden">
            <Menu size={24} />
          </button>
        </div>

        {/* الجزء الأيسر */}
        <div className="flex items-center gap-x-4">

          <div className="h-8 w-[1px] bg-gray-200 mx-1"></div>

          {/* البروفايل */}

<Link
  to={route}
  className="flex items-center gap-x-3 cursor-pointer p-1 rounded-lg hover:bg-gray-50 transition-colors"
>
  <div className="hidden md:block text-right">
    <p className="text-sm font-semibold text-one">Mo Sedek</p>
    <p className="text-xs text-two">Admin</p>
  </div>
  <ChevronDown size={16} className="text-gray-400" />
</Link>


        </div>
      </div>
    </header>
  );
};


export default Navbar;