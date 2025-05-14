import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext"; 

const ProtectedRoute = ({ children }: any) => {
  const { isVerified } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isVerified === false) {
      navigate("/signin");
    }
  }, [isVerified, navigate]);

  if (isVerified === null) return null; 

  return children;
};

export default ProtectedRoute;