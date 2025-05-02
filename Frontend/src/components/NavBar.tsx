import { useNavigate } from "react-router-dom"

const NavBar = () => {
  const navigate = useNavigate()

  return (
    <div className="w-full h-14 flex justify-between items-center border-b-[0.5px] border-gray-300 px-10">
      <h1 className="text-2xl">Todo App</h1>
      <div>
        <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded" onClick={() => navigate('/signin')}>Signin</button>
        <button className="bg-blue-700  hover:bg-blue-800 text-white px-4 py-2 rounded ml-2" onClick={() => navigate('/signup')}>SignUp</button>
      </div>
    </div>
  )
}

export default NavBar
