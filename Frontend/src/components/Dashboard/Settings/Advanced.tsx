import axios from "axios";
import { useNavigate } from "react-router-dom";


const Advanced = () => {
    const navigate = useNavigate();
    const logout = async () => {
        try {
            await axios.get("https://routine-jf3l.onrender.com/api/user/signout", {
                withCredentials: true,
            });
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <div className="flex flex-col items-center mt-12">
            <div className="w-1/2">
                <h1 className="text-2xl text-zinc-800 font-medium mb-8">Advanced </h1>
                <ul className="flex flex-col gap-5 text-sm">
                    <li className="flex justify-between border-b border-zinc-200 pb-4">
                        <span>Version</span>
                        <span className="text-zinc-600">Beta Mode</span>
                    </li>
                    <li className="flex justify-between border-b border-zinc-200 pb-4">
                        <span>Timezone</span>
                        <span className="text-zinc-600">{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
                    </li>
                    <li className="flex justify-between ">
                        <span>Channel</span>
                        <span className="text-zinc-600">Backend Hosted on Render SLOW</span>
                    </li>
                </ul>
                <button
                    type="button"
                    onClick={logout}
                    className="text-coral  text-sm border-1 border-[#fac0c0] px-3 py-1 hover:bg-[#f8eaea] cursor-pointer transition-colors rounded-md mt-16"
                >
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Advanced
