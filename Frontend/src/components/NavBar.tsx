import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"

const NavBar = () => {
  const navigate = useNavigate()
  const token = Cookies.get('token')

  return (
    <div className="w-full h-16 flex justify-between items-center border-b-[0.5px] border-gray-300 px-28">
      <div><img src="https://routine.co/_nuxt/logo.qmXltfCZ.svg" className="h-28 w-32" onClick={() => navigate('/')} /></div>
      <div>
        {
          token ? <button className="text-coral bg-[#FBEFEE] text-md font-semibold mr-2 px-3 py-2 rounded-md" onClick={() => navigate('/dashboard')}>
            Dashboard</button> :
            <button className="text-coral bg-[#FBEFEE] text-md font-semibold mr-2 px-3 py-2 rounded-md" onClick={() => navigate('/signin')}>
              Login
            </button>
        }
        {
          token ? <button className="text-coral bg-[#FBEFEE] text-md font-semibold mr-8 px-3 py-2 rounded-md" onClick={() => {
            Cookies.remove('token')
            navigate('/')
          }}>Logout</button> :
            <button className="text-coral bg-[#FBEFEE] text-md font-semibold mr-8 px-3 py-2 rounded-md" onClick={() => navigate('/signup')}>
              Sign Up
            </button>
        }
      </div>
    </div>
  )
}

export default NavBar
