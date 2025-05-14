import { useNavigate } from "react-router-dom"
import axios from "axios";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { icons, cards, yCompany, logoIcon, calendarIcon, timerIcon } from "../utils/homepage.js";
import { useAuth } from "../Context/AuthContext.js";

const Home = () => {

    const navigate = useNavigate()
    const [hoveredCard, setHoveredCard] = useState(1);
    const { isVerified } = useAuth();

    const checkToken = () => {
        isVerified ? navigate('/dashboard') : navigate('/signin');
    };

    return (
        <div className="w-full flex flex-col mt-18">
            <div className="w-full flex flex-col justify-center items-center " >
                <h1 className="text-center text-5xl md:text-6xl mb-6 font-semibold text-zinc-800 tracking-tight">The all-in-one work platform</h1>
                <p className="text-center text-xl md:text-2xl mb-16 text-zinc-700">Routine is the next-generation platform for professionals<br /> and teams to get things done faster!</p>
                <button className="text-md bg-coral px-4 py-2 rounded-md text-white flex items-center gap-1 cursor-pointer" onClick={checkToken}>Get Started <ArrowRight size={16} strokeWidth={3} /></button>
                <div className="flex gap-3 mt-4">
                    {
                        icons.map((icon) => (
                            <span key={icon.id} className="flex gap-1 text-zinc-400 text-sm">
                                <img src={icon.icon} alt="icon" />
                                {icon.name}
                            </span>

                        ))
                    }
                </div>
            </div>
            <div className="w-full mt-18 px-36 flex justify-between items-center">
                {
                    cards.map((card) => {
                        return (
                            <a key={card.id} className={`w-64 h-44 p-6 hover:border hover:${card.borderColor} rounded-md custom-shadow-${card.id} transition-shadow`} href={`#${card.title.toLowerCase()}`} onMouseEnter={() => setHoveredCard(card.id)}>
                                <img src={card.icon} alt={`${card.title} icon`} />
                                <h4 className="text-lg text-zinc-800 font-semibold py-1">{card.title}</h4>
                                <p className="text-zinc-800">{card.description}</p>
                            </a>
                        )
                    })
                }
            </div>
            <div className="mt-8 px-23">
                {
                    cards.map((card) => {
                        return (
                            <div key={card.id} className={card.id === hoveredCard ? "block" : "hidden"}>
                                <img src={card.image} alt={`${card.title}`} />
                            </div>
                        )
                    })
                }
            </div>
            <div className="w-full px-30 my-40">
                <div className="mb-10">
                    <h1 className="text-left text-5xl md:text-6xl mb-6 font-semibold text-zinc-800 tracking-tight">Get things done faster<br /> with Routine</h1>
                    <p className="text-left text-lg text-zinc-70">Define your ideal schedule and let Routine protect and optimize it for you <br /> to focus on what matters and achieve your goals.</p>
                </div>

                <div className="w-full flex flex-wrap ">
                    <div className="md:w-1/2 pr-6 pb-6">
                        <div className="p-[6px] border-3 border-cyan-100 rounded-lg">
                            <div className=" border border-cyan-100 rounded-lg  flex flex-col">
                                <div className="flex flex-col gap-3 px-8 py-8">
                                    <div className="flex text-lg gap-2 font-semibold text-zinc-800">
                                        <img src={calendarIcon} />
                                        Planner
                                    </div>
                                    <p className="text-md text-zinc-700"> Better plan and prioritize your work with Routine's planner-based calendar. </p>
                                    <a href="#planner" className="text-cyan-600 text-md font-semibold flex items-center gap-1">Learn more<ArrowRight size={16} strokeWidth={3} /></a>
                                </div>
                                <div>
                                    <img src="https://routine.co/_nuxt/bg-planner.B2iTEbqg.webp" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-1/2 pr-6 pb-6">
                        <div className=" p-[6px] border-3 border-cyan-100 rounded-lg">
                            <div className=" border border-cyan-100 rounded-lg  flex flex-col">
                                <div className="flex flex-col gap-3 px-8 py-8">
                                    <div className="flex text-lg gap-2 font-semibold text-zinc-800">
                                        <img src={timerIcon} />
                                        Time Blocking
                                    </div>
                                    <p className="text-md text-zinc-700">  Block time to make sure your most important work gets done in time.  </p>
                                    <a href="#planner" className="text-cyan-600 text-md font-semibold flex items-center gap-1">Learn more<ArrowRight size={16} strokeWidth={3} /></a>
                                </div>
                                <div>
                                    <img src="https://routine.co/_nuxt/bg-planner.B2iTEbqg.webp" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-1/2 pr-6 pb-6">
                        <div className=" p-[6px] border-3 border-cyan-100 rounded-lg">
                            <div className=" border border-cyan-100 rounded-lg  flex flex-col">
                                <div className="flex flex-col gap-3 px-8 py-8">
                                    <div className="flex text-lg gap-2 font-semibold text-zinc-800">
                                        <img src={calendarIcon} />
                                        Agenda
                                    </div>
                                    <p className="text-md text-zinc-700">   Remove distractions and focus on the what matters today in order to move the needle.  </p>
                                    <a href="#planner" className="text-cyan-600 text-md font-semibold flex items-center gap-1">Learn more<ArrowRight size={16} strokeWidth={3} /></a>
                                </div>
                                <div>
                                    <img src="https://routine.co/_nuxt/bg-agenda.BTfWj8tt.webp" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center py-24 gap-5 bg-[#FDFAFA]">
                <img className="w-17 h-9" src={logoIcon} />
                <h1 className="text-zinc-800 text-4xl font-semibold tracking-tight" >Try Routine today</h1>
                <p className="text-zinc-700 text-lg">Sign up and get started for free.</p>
                <button className="text-md bg-coral px-4 py-2 rounded-md text-white flex items-center gap-1" onClick={checkToken}>Get Started <ArrowRight size={16} strokeWidth={3} /></button>
            </div>
            {/* Footer */}
            <div className="h-80 w-full flex flex-col justify-start gap-3 px-36 py-18" >
                <img className="w-8 h-4" src={logoIcon} />
                <div>
                    <p className="text-zinc-400">Routine © 2025</p>
                    <p className="flex items-center gap-1 text-zinc-500">A <img className="h-[14px]" src={yCompany} /> company</p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500 py-4 cursor-pointer">Privacy Policy - Terms & Conditions</p>
                </div>
            </div>
        </div >
    )
}

export default Home
