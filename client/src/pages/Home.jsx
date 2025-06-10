import React from 'react'
import { useNavigate } from "react-router-dom"

function Home() {
    const navigate = useNavigate();
    return (
        <div className = "flex flex-col items-center">
            <h1 className="text-red-500 font-bold text-2xl md:text-5xl">Anonymous chatting </h1>
            <div className=" flex justify-center items-center gap-20 md:gap-40 mt-32">

                <button className="hover:scale-110 transition-all hover:shadow-lg hover:shadow-green-600 rounded-full " onClick={() => { navigate("/Croom") }} ><i className="fa fa-plus text-[40px] md:text-[100px] bg-green-500 rounded-full w-[70px] h-[70px]   md:w-[150px] md:h-[150px] flex items-center justify-center " aria-hidden="true"></i></button>
                <button className="hover:scale-110 transition-all hover:shadow-lg hover:shadow-green-600 rounded-full" onClick={() => { navigate("/Jroom") }} ><i className="fa fa-sign-in text-[40px] md:text-[100px]  bg-green-500 rounded-full  w-[70px] h-[70px]     md:w-[150px] md:h-[150px] flex items-center justify-center " aria-hidden="true"></i></button>
            </div>

            <div className=" flex justify-center items-center gap-12 md:gap-44 mt-12 ">
                <h1 className="font-bold text-sm md:text-xl text-white">Create Room</h1>
                <h1 className="font-bold text-sm md:text-xl text-white" >Join Room</h1>
            </div>

        </div>
    )
}

export default Home
