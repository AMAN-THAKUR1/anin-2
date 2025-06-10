import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"


function Sidebar({ code, users,name,newSocket }) {
    const [side, setside] = useState(false);
    const hamburger = (e) => setside(prev => !prev);
    const navigate = useNavigate();

    const handleUnload =  () => {
        // await fetch("http://localhost:5000/delete", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({ code: code }),
        // }).then((data) => {
           
            navigate("/home");
        // } );

        
        
    };

    return (
        <>
            {side && (<nav className="h-full w-[15%] md:w-fit flex flex-col items-center justify-center max-h-[90%]" >

                <div className="md:bg-[#122255] p-2 w-full flex items-center justify-around gap-12 ">
                    <button className="transition-all active:scale-110" onClick={hamburger}><i className="fa fa-mobile fa-2x text-white" aria-hidden="true"></i></button>
                    <h1 className="hidden font-bold md:block text-sm md:text-md text-white orb ">{Number(code)}</h1>
                </div>
                <h1 className="md:hidden fixed top-4 right-[40%]  font-bold block text-sm md:text-md text-white orb ">{Number(code)}</h1>
                    <ul className = " bg-[#0f1a33] w-fit h-fit shadow-lg block md:hidden top-[7%] left-[10%] fixed">
                    {users.length != 1 ?
                        users.map((item, index) => (
                            <li key={index} className=" sm:text-sm md:text-md  p-4 cursor-pointer w-full" style={{ color: item.color }} >{item.name}</li>
                        )) : <li className="text-red-600 text-xs md:text-md p-4 ">No users are here</li>
                    }
                    </ul>

                <ul className=" bg-[#0f1a3b] h-full md:flex flex-col hidden  items-center justify-center w-full">
                    {users.length != 1 ?
                        users.map((item, index) => (
                            <li key={index} className="border-t sm:text-sm md:text-md  p-4 cursor-pointer w-full" style={{ color: item.color }} >{item.name}</li>
                        )) : <li className="text-red-600 text-xs md:text-md md:border-t p-4 ">No users are here</li>
                    }
                </ul>
                <div className="fixed top-[-15px] right-[-35px] md:top-0 md:right-1">
                    <button className="w-28 h-20 transition-all bottom-0 pl-3 text-red-700 active:scale-125 z-30" onClick={handleUnload} ><i className="fa fa-sign-out fa-2x" aria-hidden="true"></i></button>
                </div>
            </nav>)}
            {!side && (
                <nav className=" md:w-fit  w-[15%] h-full flex flex-col items-center justify-center max-h-[90%]">
                    <div className="p-2 b md:bg-[#122255] w-full flex items-center justify-around gap-12 ">
                        <button className="transition-all active:scale-110" onClick={hamburger}><i class="fa fa-users md:text-[30px] text-white" aria-hidden="true"></i></button>
                        <h1 className="font-bold text-white hidden md:block text-sm md:text-md orb">{Number(code)}</h1>
                    </div>
                    <h1 className="md:hidden fixed top-4 right-[40%]  font-bold block text-sm md:text-md text-white orb ">{Number(code)}</h1>
                    <ul className = " bg-[#0f1a33] w-fit h-fit shadow-lg block md:hidden top-[50%] left-[30%] fixed"></ul>
                    <div className="fixed top-[-15px] right-[-35px] md:top-0 md:right-1 ">
                        <button className="w-28 h-20 transition-all bottom-0 pl-3 text-red-700 active:scale-125 z-30" onClick={handleUnload} ><i className="fa fa-sign-out fa-2x" aria-hidden="true"></i></button>
                    </div>
                </nav>
            )}
        </>
    )
}

export default Sidebar
