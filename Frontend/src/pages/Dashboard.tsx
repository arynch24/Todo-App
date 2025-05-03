import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (direction: 'left' | 'right') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'left' ? -1 : 1));
    setSelectedDate(newDate);
  };

  const day = selectedDate.toLocaleString('en-US', { weekday: 'long' });
  const month = selectedDate.toLocaleString('en-US', { month: 'long' });
  const date = selectedDate.getDate();

  return (
    <div className='ml-24 mt-16'>
      <div className='inline-block hover:bg-gray-100 hover:rounded-md px-4 py-2 mb-4'>
        <div className='flex gap-3 mb-1'>
          <div className='text-2xl text-zinc-900'>{day}</div>
          <div className='text-2xl text-zinc-400'>{month}</div>
        </div>
        <div className='text-6xl'>{date}</div>
      </div>
      <div className='flex gap-2 ml-4'>
        <ChevronLeftIcon 
          className="h-8 w-8 text-zinc-500 border-1 border-zinc-400 rounded-md p-2 cursor-pointer" 
          onClick={() => handleDateChange('left')} 
        />
        <ChevronRightIcon 
          className="h-8 w-8 text-zinc-500 border-1 border-zinc-400 rounded-md p-2 cursor-pointer" 
          onClick={() => handleDateChange('right')} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
