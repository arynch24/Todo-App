import { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import axios from 'axios';
import TodoLoader from '../components/Loader';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [createTodo, setCreateTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [refreshTodo, setRefreshTodo] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [tempTitle, setTempTitle] = useState("");


  // Handle date change for the calendar
  const handleDateChange = (direction: string) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'left' ? -1 : 1));
    setSelectedDate(newDate);
  };

  const day = selectedDate.toLocaleString('en-US', { weekday: 'long' });
  const month = selectedDate.toLocaleString('en-US', { month: 'long' });
  const date = selectedDate.getDate();

  // Create todo function
  const handleCreateTodo = async () => {
    if (!createTodo.trim()) return;

    try {
      const res = await axios.post("http://localhost:3000/api/user/createtodo", {
        title: createTodo,
        description: "dd",
        createdAt: selectedDate.toISOString()
      }, {
        withCredentials: true,
      });

      console.log("Todo Created:", res.data);
      setRefreshTodo(prev => prev + 1);
      setCreateTodo("");
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  // Update todo function to handle both title and status updates
  const updateTodo = async (todoId: number, updateData: object) => {
    if (!todoId) {
      console.error("Missing todo ID");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/user/updatetodo",
        {
          id: todoId,
          ...updateData,
          createdAt: selectedDate.toISOString()
        },
        {
          withCredentials: true,
        }
      );

      setRefreshTodo(prev => prev + 1);
      console.log("Update successful:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error updating todo:", error);
      return null;
    }
  };

  // Handle checkbox toggle 
  const handleTodoStatusToggle = async (todoId: number, currentStatus: boolean) => {
    await updateTodo(todoId, { done: !currentStatus });
  };

  // Handle todo item interaction - either edit or toggle based on where user clicked
  const handleTodoInteraction = (todo: { id: any, title: string, done: boolean }, isCheckboxClicked: boolean) => {
    if (isCheckboxClicked) {
      // Toggle the todo status
      handleTodoStatusToggle(todo.id, todo.done);
    } else {
      // Start editing the title
      setEditingTodoId(todo.id);
      setTempTitle(todo.title);
    }
  };

  // Save the edited title
  const handleTitleSave = async (todoId: number) => {
    if (!todoId) return;
    await updateTodo(todoId, { title: tempTitle });

    cancelEditing();
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTodoId(null);
    setTempTitle("");
  };

  // Fetch todos when the component mounts or when the selected date changes
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`http://localhost:3000/api/user/todos?date=${selectedDate.toISOString()}`, {
          withCredentials: true,
        });
        setTodos(res.data.todos);
        console.log(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, [selectedDate, refreshTodo]);

  const todoNotDone = todos.filter((todo: { done: boolean }) => todo.done === false);
  const todoDone = todos.filter((todo: { done: boolean }) => todo.done === true);

  // Delete todo function
  const deleteTodo = async (todoId: number) => {
    if (!todoId) {
      console.error("Missing todo ID");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/user/deletetodo",
        { id: todoId },
        {
          withCredentials: true,
        }
      );

      setRefreshTodo(prev => prev + 1);
      console.log("Todo deleted:", res.data);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  // Render a single todo item with its checkbox and title
  const renderTodoItem = (todo: any) => (
    <div
      key={todo.id}
      className="flex gap-3 hover:border hover:border-zinc-300 px-5 py-2 rounded-sm group"
    >
      <input
        type="checkbox"
        checked={todo.done}
        className={`w-4 h-5`}
        onClick={(e) => {
          e.stopPropagation();
          handleTodoInteraction(todo, true);
        }}
        readOnly
      />
      {editingTodoId === todo.id ? (
        <input
          type="text"
          value={tempTitle}
          onChange={(e) => setTempTitle(e.target.value)}
          onBlur={() => handleTitleSave(todo.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleTitleSave(todo.id);
            if (e.key === 'Escape') cancelEditing();
          }}
          className="text-sm focus:outline-none w-full"
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div
          className="w-full text-sm cursor-pointer flex justify-between items-center group"
          onDoubleClick={(e) => {
            e.stopPropagation(); 
            handleTodoInteraction(todo, false);
          }}
        >
          <span className={`${todo.done ? 'line-through text-zinc-400' : 'text-zinc-700'}`}>
            {todo.title}
          </span>
          <TrashIcon
            className="h-4 w-4 invisible group-hover:visible text-zinc-400 hover:text-red-500 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              deleteTodo(todo.id);
            }}
          />
        </div>
      )}
    </div>
  );

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

      {/* loading */}
      {isLoading ? (
        <TodoLoader />
      ) : (
        <div className='w-lg min-w-md'>
          {/* add tasks */}
          <div className='flex gap-3 hover:bg-zinc-100 px-5 py-3 mt-6 rounded-sm'>
            <input type='checkbox' className='w-4 h-5' />
            <input type='text'
              placeholder='Add task'
              className='placeholder-zinc-400 focus:outline-none text-sm text-zinc-600 w-full'
              onChange={(e) => setCreateTodo(e.target.value)}
              value={createTodo}
              autoFocus={true}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateTodo();
                }
              }}
            />
          </div>

          {/* tasks to do */}
          <div>
            {todoNotDone.map(renderTodoItem)}
          </div>

          <hr className='text-gray-200 my-4' />

          {/* tasks completed */}
          <div>
            {todoDone.map(renderTodoItem)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;