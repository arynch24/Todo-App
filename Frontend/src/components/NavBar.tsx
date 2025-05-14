import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isVerified } = useAuth();

  return (
    <div className="w-full h-16 flex justify-between items-center border-b-[0.5px] border-gray-300 px-6 sm:px-28">
      <div className="cursor-pointer">
        <img
          src="https://routine.co/_nuxt/logo.qmXltfCZ.svg"
          className="h-28 w-32"
          onClick={() => navigate('/')}
        />
      </div>

      <div className={`${location.pathname === '/' ? "block" : "hidden"}`}>
        <button
          className="text-coral bg-[#FBEFEE] text-sm font-semibold mr-2 px-4 py-2 rounded-md cursor-pointer hover:bg-[#fddddd] transition-colors"
          onClick={() => isVerified ? navigate('/dashboard') : navigate('/signin')}
        >
          Get Started
        </button>
      </div>
    </div >
  );
};

export default NavBar;
