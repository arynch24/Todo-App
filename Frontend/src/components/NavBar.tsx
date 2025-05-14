import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const NavBar = () => {
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkToken = async () => {

      const res = await axios.get("https://routine-jf3l.onrender.com/api/user/verify", {
        withCredentials: true,
      });

      if (res.status === 200) {
        setIsVerified(true);
      }
    };

    checkToken();
  }, [navigate]);

  return (
    <div className="w-full h-16 flex justify-between items-center border-b-[0.5px] border-gray-300 px-6 sm:px-28">
      <div className="cursor-pointer">
        <img
          src="https://routine.co/_nuxt/logo.qmXltfCZ.svg"
          className="h-28 w-32"
          onClick={() => navigate('/')}
        />
      </div>

      <div className={`${location.pathname==='/'? "block" : "hidden"}`}>
            <button
              className="text-coral bg-[#FBEFEE] text-sm font-semibold mr-2 px-4 py-2 rounded-md cursor-pointer hover:bg-[#fddddd] transition-colors"
              onClick={() => isVerified ? navigate('/dashboard/agenda') : navigate('/signin')}
            >
              Get Started
            </button>
      </div>
    </div >
  );
};

export default NavBar;
