import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import LoginLoader from './LoginLoader';
import LoadingContext from '../Context/LoadingContext';

const SignIn = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {loading, setLoading } = useContext(LoadingContext);
    const navigate = useNavigate();

    const handleSignInButton = async () => {
        if (!username || !password) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post("http://localhost:3000/api/user/signin", {
                username,
                password
            }, {
                withCredentials: true, // 👈 REQUIRED for cookies to be sent!
            });

            console.log(res.data);

            if (res.status === 200) {
                navigate("/dashboard", { replace: true });
            }
        } catch (err) {
            console.error(err);
            alert("Sign-in failed. Check credentials.");
        }
        finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoginLoader />
    }

    return (
        <div className='h-[calc(100vh-4rem)] flex justify-center lg:ml-28 items-center gap-60'>
            <div className="w-full max-w-sm ">
                <h1 className='text-2xl font-semibold  text-zinc-800' >Get Started</h1>
                <p className='mb-4 text-md text-zinc-700'>Start managing your tasks with routine !</p>

                <div className="flex justify-center items-center">
                    <div className="w-full">
                        <h3 className="font-semibold text-md mb-1 text-left">Email</h3>
                        <input
                            className="w-full p-2 border border-gray-300 rounded-md text-md mb-4"
                            type="email"
                            placeholder="johndoe@example.com"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <h3 className="font-semibold text-md mb-1 text-left">Password</h3>
                        <input
                            className="w-full p-2 border border-gray-300 rounded-md text-md mb-4"
                            type="password"
                            placeholder=""
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div onClick={handleSignInButton}>
                            <button className="w-full bg-coral text-white px-4 py-2 rounded-md">
                                Sign In
                            </button>
                        </div>

                        <p className="text-sm font-semibold text-gray-800 mt-4">
                            Don't have an account? <Link to="/signup" className="text-gray-900 underline font-semibold hover:text-coral">Sign Up</Link>
                        </p>
                    </div>
                </div>
            </div>
            <div className='h-full w-[0.5px] bg-zinc-400 hidden lg:block'></div>
            <div className='h-full w-full hidden lg:block'>
                <div className='h-full w-full flex items-end '>
                    <div className='h-12 w-24 ml-10 bg-coral rounded-t-full'></div>
                </div>
            </div>
        </div>
    )
}

export default SignIn;
