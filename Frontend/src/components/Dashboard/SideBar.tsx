import { CalendarDays, SquareCheck, Settings, Search } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

const iconBaseClasses = 'p-1 rounded-lg';
const inactiveClasses = 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500';
const activeClasses = 'bg-zinc-100 text-zinc-600';

const SideBar = () => {
  const location = useLocation();
  return (
    <div className="w-18 h-full p-8 flex flex-col justify-between items-center gap-5 border-r border-zinc-200">
      <div className='flex flex-col gap-4'>
        <NavLink to="/dashboard">
          {() => (
            <SquareCheck strokeWidth={1} size={32} className={`${iconBaseClasses} ${location.pathname==='/dashboard' ? activeClasses : inactiveClasses}`}
            />
          )}
        </NavLink>

        <NavLink to="/dashboard/calendar">
          {({ isActive }) => (
            <CalendarDays strokeWidth={1} size={32} className={`${iconBaseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            />
          )}
        </NavLink>
      </div>

      <div className='flex flex-col gap-4'>
        <NavLink to="/dashboard/search">
          {({ isActive }) => (
            <Search strokeWidth={1} size={32} className={`${iconBaseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            />
          )}
        </NavLink>

        <NavLink to="/dashboard/settings">
          {({ isActive }) => (
            <Settings strokeWidth={1} size={32} className={`${iconBaseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            />
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default SideBar;
