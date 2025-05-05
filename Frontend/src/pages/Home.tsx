import { useNavigate } from "react-router-dom"
const Home = () => {

    const navigate = useNavigate()

    return (
        <div className="w-full h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4">
            <h1 className="text-center text-5xl md:text-6xl mb-4 font-bold text-zinc-800">The all-in-one work platform</h1>
            <p className="text-center text-lg md:text-2xl mb-16 text-zinc-700 ">Routine is the next-generation platform for professionals<br /> and teams to get things done faster!</p>
            <button className="text-md bg-coral px-4 py-3 rounded-md text-white" onClick={()=>navigate('/signup')}>Get Started</button>
        </div>
    )
}

export default Home
