import googleCalendar from '../../../assets/google-calendar.png';
import { useGoogleAuth } from "../../../Context/GoogleAuthContext";
import { useAuth } from '../../../Context/AuthContext';
import {User} from 'lucide-react'
import { logoIcon } from '../../../utils/homepage';

const Accounts = () => {
    const { isGoogleVerified, loading, userInfo } = useGoogleAuth();
    const { routineUser } = useAuth();

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
                            isGoogleVerified ?
                                <div className="flex items-center gap-4 border px-5 py-3 border-zinc-300 rounded-md hover:border-zinc-400">
                                    <img src={userInfo.picture} alt="Profile" className="w-13 h-13 rounded-full" />
                                    <div className="flex flex-col">
                                        <h2 className="text-lg font-semibold text-zinc-700">{userInfo.name}</h2>
                                        <p className="text-sm text-zinc-500">{userInfo.email}</p>
                                    </div>
                                    <img src={googleCalendar} alt="Google" className="w-7 h-7 ml-auto" />
                                </div>
                                :
                                <div className="flex flex-col items-center gap-4 border px-5 py-3 border-zinc-300 rounded-md hover:border-zinc-400  transition-all duration-200">
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
                    <div className="flex flex-col gap-3 mt-10 w-full">
                    <h1 className="text-xl font-semibold text-zinc-700 mb-1">Routine Account</h1>
                        <div className="flex items-center gap-4 border px-5 py-3 border-zinc-300 rounded-lg shadow-sm hover:border-zinc-400 transition-all duration-200">
                            <div className="flex items-center justify-center bg-blue-100 p-3 rounded-full">
                                <User className="h-6 w-6 text-blue-600" />
                            </div>

                            <div className="flex flex-col">
                                <h2 className="text-lg font-semibold text-zinc-800">{routineUser.firstName + " " + routineUser.lastName}</h2>
                                <p className="text-sm text-zinc-500">{routineUser.username}</p>
                            </div>
                            <img src={logoIcon} alt="Google" className="w-10 h-5 ml-auto" />
                        </div>

                        {/* <div className="text-xs text-zinc-400 mt-1 px-1">
                            Click to manage your account settings
                        </div> */}
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Accounts
