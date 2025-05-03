import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import axios from 'axios';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [createTodo, setCreateTodo] = useState("");

  const handleDateChange = (direction: 'left' | 'right') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'left' ? -1 : 1));
    setSelectedDate(newDate);
  };

  const day = selectedDate.toLocaleString('en-US', { weekday: 'long' });
  const month = selectedDate.toLocaleString('en-US', { month: 'long' });
  const date = selectedDate.getDate();

  const handleCreateTodo = async () => {
    console.log(selectedDate.toISOString());
    // selectedDate.setHours(10, 30, 0, 0);

    const res = await axios.post("http://localhost:3000/api/user/createtodo", {
      title: createTodo,
      description: "dd",
      createdAt: selectedDate.toISOString()
    }, {
      withCredentials: true, // 👈 REQUIRED for cookies to be sent!
    });

    console.log(res.data);

    // Handle the enter key press
    console.log("Todo Created: ", createTodo);
    setCreateTodo("");
  }

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
      <div>
        {/* add tasks */}
        <div className='flex gap-3 bg-zinc-100 px-5 py-3 mt-6 rounded-sm'>
          <input type='checkbox' className='' />
          <input type='text' placeholder='Add task' className='placeholder-zinc-400 focus:outline-none text-sm text-zinc-600'
            onChange={(e) => setCreateTodo(e.target.value)}
            value={createTodo}
            autoFocus={true}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                // Handle creating a new todo
                handleCreateTodo();

              }
            }
            }
          />
        </div>
        {/* tasks to do */}
        <div>

        </div>

        <hr className='text-gray-200 my-4' />

        {/* tasks pending */}
        <div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
