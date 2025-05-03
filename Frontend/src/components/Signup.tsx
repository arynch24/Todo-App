import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {

    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignUpButton = async () => {
        if (!username || !firstName || !lastName || !password) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:3000/api/user/signup", {
                username,
                firstName,
                lastName,
                password
            },{
                withCredentials: true, // 👈 REQUIRED for cookies to be sent!
              });

            console.log(res.data);

            if (res.status === 200) {
                alert("SignUp Successful");
                navigate("/dashboard");
            }
        } catch (err:any) {
            console.error(err);
            alert("SignUp Failed!" );
        }
    };


    return (
        <div className='h-[714px] flex ml-28 items-center gap-64'>
            <div className="w-full max-w-sm ">
                <h1 className='text-2xl font-semibold  text-zinc-800' >Get Started</h1>
                <p className='mb-4 text-md text-zinc-700'>Start managing your tasks with routine !</p>

                <div className="flex justify-center items-center">
                    <div className="w-full">
                        <h3 className="font-semibold text-md mb-1 text-left">First Name</h3>
                        <input
                            className="w-full p-2 border border-gray-300 rounded-md text-md mb-4"
                            type="text"
                            placeholder="John"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <h3 className="font-semibold text-md mb-1 text-left">Last Name</h3>
                        <input
                            className="w-full p-2 border border-gray-300 rounded-md text-md  mb-4"
                            type="text"
                            placeholder="Doe"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}

                        />
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
                        <div onClick={handleSignUpButton}>
                            <button className="w-full bg-coral text-white px-4 py-2 rounded-md">
                                Sign Up
                            </button>
                        </div>

                        <p className="text-sm font-semibold text-gray-800 mt-4">
                            Already have an account? <Link to="/signin" className="text-gray-900 underline font-semibold hover:text-coral">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
            <div className='h-[714px] w-[0.5px] bg-zinc-400'></div>
            <div className='h-full w-full flex items-end'>
                <div className='h-12 w-24 ml-10 bg-coral rounded-t-full'></div>
            </div>
        </div>
    )
}

export default SignUp;
