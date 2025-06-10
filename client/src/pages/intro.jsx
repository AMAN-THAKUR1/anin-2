import React from 'react';
import { useState } from "react"
import { useNavigate } from "react-router-dom"
function Intro() {

    const navigate = useNavigate();
    const handleclick = () => navigate("/home");
    const [log, setlog] = useState("text-red-500");

    return (
        <div className="w-full max-w-md p-6 text-center">
            <div className="w-full max-w-md p-6 text-center">
                <i className={`fa fa-user-secret fa-5x ${log}`} id="log" aria-hidden="true"></i>
                <h1 className="text-3xl font-bold text-green-400">AnonyMe</h1>
            </div>
            <div className="">
                <button className=" w-[60px] h-[60px] bg-white rounded-full transition-all hover:shadow-lg hover:shadow-green-400 hover:scale-110 " onClick={handleclick} onMouseLeave={() => { setlog("text-red-500") }} onMouseEnter={() => { setlog("text-green-500") }}><i class="fa fa-arrow-right" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    );
}

export default Intro;
