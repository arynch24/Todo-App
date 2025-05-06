import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const ProtectedRoute = ({ children }: any) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const res = await axios.get("https://routine-jf3l.onrender.com/api/user/verify",
        {
          withCredentials: true,
        });

      if (res.status !== 200) {
        navigate("/signin");
      }
    }

    checkToken();
  }
    , []);

  return children;
};

export default ProtectedRoute;
