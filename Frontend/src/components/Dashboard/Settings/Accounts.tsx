import axios from "axios";
import { useEffect, useState } from "react";
import googleCalendar from '../../../assets/google-calendar.png';
import TodoLoader from "../../TodoLoader";

const Accounts = () => {
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

            } catch (error) {
                console.error("Error fetching user info:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchUserInfo();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center mt-12">
                <div className="w-1/2">
                    <h1 className="text-2xl text-zinc-800 font-medium mb-8">Accounts </h1>
                    <div className="todo-loader-container w-md mt-10 -ml-4">
                        {[1, 2].map((_, idx) => (
                            <div key={idx} className="shimmer-item pb-1">
                                <div className="shimmer-line " />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div>
            <div className="flex flex-col items-center mt-12">
                <div className="w-1/2">
                    <h1 className="text-2xl text-zinc-800 font-medium mb-8">Accounts </h1>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-xl font-semibold text-zinc-700 mb-1">Google Account</h1>
                        {
                            userInfo ?
                                <div className="flex items-center gap-4 border px-5 py-3 border-zinc-300 rounded-md hover:border-zinc-400">
                                    <img src={userInfo.picture} alt="Profile" className="w-13 h-13 rounded-full" />
                                    <div className="flex flex-col">
                                        <h2 className="text-lg font-semibold text-zinc-700">{userInfo.name}</h2>
                                        <p className="text-sm text-zinc-500">{userInfo.email}</p>
                                    </div>
                                    <img src={googleCalendar} alt="Google" className="w-7 h-7 ml-auto" />
                                </div>
                                :
                                <div className="flex flex-col items-center gap-4 border px-5 py-3 border-zinc-300 rounded-md hover:border-zinc-400">
                                    <p className="text-zinc-500">
                                        You are not connected to any Google account.
                                    </p>
                                    <button className="w-full flex-1 text-coral bg-[#FBEFEE] text-md font-semibold p-2 hover:bg-[#fddddd] transition-colors rounded-sm"
                                        onClick={() => { window.location.href = 'https://routine-jf3l.onrender.com/api/google/auth'; }}
                                    >
                                        Google SignIn
                                    </button>
                                </div>
                        }

                    </div>
                </div>
            </div>


        </div>
    )
}

export default Accounts
