import axios from "axios";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { UserRoundPen, CircleEllipsis, Settings2 } from 'lucide-react';
import { useLocation } from "react-router-dom";

const SettingsSidebar = () => {
  const location = useLocation();
  return (
    <div className="w-64 bg-white h-screen border-r-[0.5px] border-gray-300 flex flex-col  py-10">
      <h2 className="px-4 text-xs text-zinc-400">ACCOUNT</h2>
      <ul className="w-full py-3 px-3 flex flex-col gap-1">
        <NavLink to="/dashboard/settings">
          {() => (
            <li className={`flex items-center gap-2 py-2 px-3 text-zinc-500 text-sm rounded-lg ${location.pathname==='/dashboard/settings' ? "bg-zinc-100 text-zinc-800" : "hover:bg-zinc-100 hover:text-zinc-800"} cursor-pointer`}>
              <UserRoundPen strokeWidth={2} className={location.pathname==='/dashboard/settings' ? "text-zinc-800" : "text-zinc-500 hover:text-zinc-800"} size={14} />Accounts
            </li>
          )}
        </NavLink>
        <NavLink to="/dashboard/settings/preferences">
          {({ isActive }) => (
            <li className={`flex items-center gap-2 py-2 px-3 text-zinc-500 text-sm rounded-lg ${isActive ? "bg-zinc-100 text-zinc-800" : "hover:bg-zinc-100 hover:text-zinc-800"} cursor-pointer`}>
              <Settings2 strokeWidth={2} className={isActive ? "text-zinc-800" : "text-zinc-500 hover:text-zinc-800"} size={14} />Preferences
            </li>
          )}
        </NavLink>
        <NavLink to="/dashboard/settings/advanced">
          {({ isActive }) => (
            <li className={`flex items-center gap-2 py-2 px-3 text-zinc-500 text-sm rounded-lg ${isActive ? "bg-zinc-100 text-zinc-800" : "hover:bg-zinc-100 hover:text-zinc-800"} cursor-pointer`}>
              <CircleEllipsis strokeWidth={2} className={isActive ? "text-zinc-800" : "text-zinc-500 hover:text-zinc-800`"} size={14} />Advanced
            </li>
          )}
        </NavLink>
      </ul>
    </div>
  )
}

const Settings = () => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);

  const logout = async () => {
    try {
      await axios.get("https://routine-jf3l.onrender.com/api/user/signout", {
        withCredentials: true,
      });
      navigate("/");
      setIsVerified(false);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="flex">
      <SettingsSidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}

export default Settings
