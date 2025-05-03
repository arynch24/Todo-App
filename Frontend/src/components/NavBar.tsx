import { useNavigate } from "react-router-dom"

const NavBar = () => {
  const navigate = useNavigate()

  return (
    <div className="w-full h-16 flex justify-between items-center border-b-[0.5px] border-gray-300 px-28">
      <div><img src="https://routine.co/_nuxt/logo.qmXltfCZ.svg" className="h-28 w-32" onClick={()=>navigate('/')}/></div>
      <div>
        <button className="text-coral bg-[#FBEFEE] text-md font-semibold mr-8 px-3 py-2 rounded-md" onClick={() => navigate('/signup')}>Get Started</button>
      </div>
    </div>
  )
}

export default NavBar
