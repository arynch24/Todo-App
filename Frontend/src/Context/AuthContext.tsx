import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await axios.get("https://routine-jf3l.onrender.com/api/user/verify", {
          withCredentials: true,
        });
        setIsVerified(res.status === 200);
      } catch {
        setIsVerified(false);
      }
    };

    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isVerified, setIsVerified }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
