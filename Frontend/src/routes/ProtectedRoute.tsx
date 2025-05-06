import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProtectedRoute = ({ children }: any) => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await axios.get("https://routine-jf3l.onrender.com/api/user/verify", {
          withCredentials: true,
        });

        if (res.status === 200) {
          setIsVerified(true);
        } else {
          navigate("/signin");
        }
      } catch (err) {
        navigate("/signin");
      }
    };

    checkToken();
  }, [navigate]);

  return isVerified ? children : null;
};

export default ProtectedRoute;
