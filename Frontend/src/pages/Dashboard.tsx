import { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import axios from 'axios';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [createTodo, setCreateTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [refreshTodo, setRefreshTodo] = useState(0);

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

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const todoId = parseInt(e.target.dataset.id || "");
    const isChecked = e.target.checked;

    if (!todoId) {
      console.error("Missing todo ID");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/user/updatetodo",
        {
          id: todoId,
          done: isChecked,
          createdAt: selectedDate.toISOString()
        },
        {
          withCredentials: true,
        }
      );

      setRefreshTodo((prev: number) => prev + 1);
      console.log("Update successful:", res.data);

    } catch (error) {
      console.error("Error updating todo:", error);
    }

    console.log("Checkbox checked:", isChecked);
  };


  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user/todos", {
          withCredentials: true, // 👈 REQUIRED for cookies to be sent!
        });
        setTodos(res.data.todos);
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTodos();
  }, [selectedDate, createTodo, refreshTodo]);

  const todoNotDone = todos.filter((todo: any) => todo.done === false);
  const todoDone = todos.filter((todo: any) => todo.done === true);

  // useEffect(() => {
  //   const todosDone = todos.filter((todo: any) => {
  //     const todoDate = new Date(todo.createdAt);
  //     return (
  //       todoDate.getDate() === selectedDate.getDate() &&
  //       todoDate.getMonth() === selectedDate.getMonth() &&
  //       todoDate.getFullYear() === selectedDate.getFullYear()
  //     );
  //   });
  // }, []);



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
      <div className='w-lg min-w-md'>
        {/* add tasks */}
        <div className='flex gap-3 hover:bg-zinc-100 px-5 py-3 mt-6 rounded-sm'>
          <input type='checkbox' className='' />
          <input type='text' placeholder='Add task' className='placeholder-zinc-400 focus:outline-none text-sm text-zinc-600 w-full'
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
          {todoNotDone.map((todo: any) => (
            <div
              key={todo.id}
              className="flex gap-3 hover:border hover:border-zinc-300 px-5 py-3 rounded-sm"
            >
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={todo.done}
                  data-id={todo.id}
                  className="peer hidden"
                  onChange={handleChange}
                />
                <div className="w-5 h-5 rounded border border-gray-400 peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center transition">
                  <svg
                    className="w-3 h-3 text-white hidden peer-checked:block"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </label>
              <div className="text-sm text-zinc-700">{todo.title}</div>
            </div>
          ))}
        </div>


        <hr className='text-gray-200 my-4' />

        {/* tasks pending */}
        <div>
          {todoDone.map((todo: any) => (
            <div key={todo.id} className='flex gap-3 hover:border-1 hover:border-zinc-300 px-5 py-3 rounded-sm'>
              <input type='checkbox' checked={todo.done} data-id={todo.id} className="peer hidden" onChange={handleChange} />
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={todo.done}
                  data-id={todo.id}
                  className="peer hidden"
                  onChange={handleChange}
                />
                <div className="w-5 h-5 rounded border border-gray-400 peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center transition">
                  <svg
                    className="w-3 h-3 text-white hidden peer-checked:block"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </label>
              <div className='text-sm text-zinc-400'>{todo.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
