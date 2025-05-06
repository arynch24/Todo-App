import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: any) => {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  console.log("Dashboard token"+token);

  useEffect(() => {
    const checkToken = () => {
      if (!token) {
        navigate("/signin");
      }
    }
    checkToken();
  }
    , [token, navigate]);

  return children;
};

export default ProtectedRoute;
