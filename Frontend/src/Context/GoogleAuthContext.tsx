import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const GoogleAuthContext = createContext<any>(null);

export const GoogleAuthProvider = ({ children }: any) => {
    const [isGoogleVerified, setIsGoogleVerified] = useState<boolean | null>(null);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://routine-jf3l.onrender.com/api/google/check', {
                    withCredentials: true,
                });
                setUserInfo(response.data);
                setIsGoogleVerified(response.status === 200)

            } catch (error) {
                setIsGoogleVerified(false);
                console.error("Error fetching user info:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchUserInfo();
    }, []);

    return (
        <GoogleAuthContext.Provider value={{ isGoogleVerified, setIsGoogleVerified, userInfo, setUserInfo, loading, setLoading }}>
            {children}
        </GoogleAuthContext.Provider>
    );
};

export const useGoogleAuth = () => useContext(GoogleAuthContext);
