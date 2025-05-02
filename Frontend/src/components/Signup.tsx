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
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log(res.data);

            if (res.status === 200) {
                alert("SignUp Successful");
                navigate("/dashboard");
            }
        } catch (err) {
            console.error(err);
            // alert(res.json().message);
        }
    };


    return (
        <div className='h-screen text-center flex flex-col items-center justify-center '>
            <div className="w-full max-w-sm border rounded-md p-4">
                <h1 className='text-4xl font-bold mb-4' >SignUp</h1>
                <p className='mb-4 text-md'>Enter your information to create an account</p>

                <div className="flex justify-center items-center">
                    <div className="w-full">
                        <h3 className="font-bold text-md mb-1 text-left">First Name</h3>
                        <input
                            className="w-full p-2 border border-gray-300 rounded-md text-md mb-4"
                            type="text"
                            placeholder="John"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <h3 className="font-bold text-md mb-1 text-left">Last Name</h3>
                        <input
                            className="w-full p-2 border border-gray-300 rounded-md text-md  mb-4"
                            type="text"
                            placeholder="Doe"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}

                        />
                        <h3 className="font-bold text-md mb-1 text-left">Email</h3>
                        <input
                            className="w-full p-2 border border-gray-300 rounded-md text-md mb-4"
                            type="email"
                            placeholder="johndoe@example.com"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <h3 className="font-bold text-md mb-1 text-left">Password</h3>
                        <input
                            className="w-full p-2 border border-gray-300 rounded-md text-md mb-4"
                            type="password"
                            placeholder=""
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div onClick={handleSignUpButton}>
                            <button className="w-full bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md">
                                Sign Up
                            </button>
                        </div>

                        <p className="text-sm font-semibold text-gray-800 mt-4">
                            Already have an account? <Link to="/signin" className="text-gray-900 underline font-semibold hover:text-blue-700">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>



        </div>
    )
}

export default SignUp;
