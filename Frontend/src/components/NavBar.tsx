import { useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from "react";
import axios from "axios";

const MenuBar = ({ isVerified, navigate, logout }: { isVerified: boolean, navigate: any, logout: any }) => {
  return (
    <div className="w-screen flex flex-col justify-between items-end gap-1 bg-[#ffffff] p-4 transition-normal">
      {isVerified ? (
        <>
          <button
            className="w-full text-coral bg-[#FBEFEE] text-md font-semibold p-2 hover:bg-[#fddddd] transition-colors rounded-sm"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>
          <button
            className="w-full text-coral bg-[#FBEFEE] text-md font-semibold p-2 hover:bg-[#fddddd] transition-colors rounded-sm"
            onClick={logout}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <button
            className="w-full text-coral bg-[#FBEFEE] text-md font-semibold p-2 hover:bg-[#fddddd] transition-colors rounded-sm"
            onClick={() => navigate('/signin')}
          >
            Login
          </button>
          <button
            className="w-full text-coral bg-[#FBEFEE] text-md font-semibold p-2 hover:bg-[#fddddd] transition-colors rounded-sm"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </button>
        </>
      )}
    </div>
  );
};

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

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

  const logout = async () => {
    try {
      await axios.get("https://routine-jf3l.onrender.com/api/user/signout", {
        withCredentials: true,
      });
      navigate("/");
      setIsVerified(false);
    } catch (err) {
      console.error(err);
    }
  };



  return (
    <div className="w-full h-16 flex justify-between items-center border-b-[0.5px] border-gray-300 px-6 sm:px-28">
      <div className="cursor-pointer">
        <img
          src="https://routine.co/_nuxt/logo.qmXltfCZ.svg"
          className="h-28 w-32"
          onClick={() => navigate('/')}
        />
      </div>

      <div className="sm:hidden">
        {isMenuOpen ? (
          <XMarkIcon className="h-8 w-8 text-coral" onClick={() => setIsMenuOpen(false)} />
        ) : (
          <Bars3Icon className="h-8 w-8 text-coral" onClick={() => setIsMenuOpen(true)} />
        )}
      </div>

      {isMenuOpen && (
        <div className="absolute top-16 right-0 bg-white shadow-lg rounded-lg ">
          <MenuBar isVerified={isVerified} navigate={navigate} logout={logout} />
        </div>
      )}

      <div className="hidden sm:block">
        {isVerified ? (
          <>
            <button
              className="text-coral bg-[#FBEFEE] text-md font-semibold mr-2 px-3 py-2 rounded-md cursor-pointer hover:bg-[#fddddd] transition-colors"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </button>
            <button
              className="text-coral bg-[#FBEFEE] text-md font-semibold mr-8 px-3 py-2 rounded-md cursor-pointer hover:bg-[#fddddd] transition-colors"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="text-coral bg-[#FBEFEE] text-md font-semibold mr-2 px-3 py-2 rounded-md cursor-pointer hover:bg-[#fddddd] transition-colors"
              onClick={() => navigate('/signin')}
            >
              Login
            </button>
            <button
              className="text-coral bg-[#FBEFEE] text-md font-semibold mr-8 px-3 py-2 rounded-md cursor-pointer hover:bg-[#fddddd] transition-colors"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
