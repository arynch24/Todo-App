import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }:any) => {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    console.log("ProtectedRoute token:", token);

    if (!token) {
      navigate("/signin", { replace: true });
    } else {
      setCheckingAuth(false);
    }
  }, [navigate]);

  if (checkingAuth) return null;

  return children;
};

export default ProtectedRoute;
