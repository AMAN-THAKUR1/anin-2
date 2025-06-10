import React, { useState, useEffect, useRef } from 'react'
import FileOptions from "./FileOptions"
import { Micon, Mute, Videoon, Videooff } from "./Vchat";

function Inputs({ socket, code, options, setoptions, mic, video, toggleMic, toggleCamera, stream, peerStreams, activecalls }) {

    const [message, setmessage] = useState("")
    const [window, setwindow] = useState(false)
    const [call, setcall] = useState(false)
    const videoRef = useRef(null);




    const sendchat = (e) => {
        e.preventDefault();
        if (socket && message.trim()) {
            const messageData = { roomId: code, message };
            socket.emit("message", messageData);
            setmessage("");
        } else console.log("Socket is not connected or message is empty.");
    };

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement && stream) {
          videoElement.srcObject = stream;
        }
      
        return () => {
          if (videoElement) {
            videoElement.srcObject = null;
          }
        };
      }, [stream, window]);
      

    return (
        <>
            <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[33%] max-w-[40%] flex justify-center md:justify-center">
                <div className="flex justify-center md:justify-center items-center gap-4 w-full ">
                    <form onSubmit={sendchat} className="flex w-full gap-2 justify-start items-center">
                        <input
                            type="text"
                            className="rounded-lg md:w-full w-[150px] lg:w-[500px] h-[40px] md:h-[55px] p-2 text-white text-xs md:text-md outline-none border-none overflow-hidden bg-blue-900 resize-none whitespace-normal"
                            value={message}
                            onChange={(e) => setmessage(e.target.value)}
                            placeholder="Type a message..."
                        />
                        <button
                            type="submit"
                            className="md:p-2 p-1 rounded-full bg-blue-900 transition-all active:shadow-inner active:shadow-white active:scale-110"
                            onClick={sendchat}
                        >
                            <i className="fa fa-paper-plane md:text-[30px] text-[#03032fee]" aria-hidden="true"></i>
                        </button>
                        <button
                            className="md:p-2 rounded-full bg-blue-900 transition-all active:shadow-inner active:shadow-white active:scale-110 px-1 py-1"
                            onClick={(e) => {
                                e.preventDefault();
                                setoptions(prev => !prev)
                            }}
                        >
                            <i className="fa fa-paperclip fa md:text-[30px] text-[#03032fee]" aria-hidden="true"></i>
                        </button>
                        <button
                            className="md:p-2 rounded-full bg-blue-900 transition-all active:shadow-inner active:shadow-white active:scale-110 px-1 py-1"
                            onClick={(e) => {
                                e.preventDefault();
                                setcall(prev => !prev)
                            }}
                        >
                            <i className="fa fa-phone fa md:text-[30px] text-[#03032fee]" aria-hidden="true"></i>
                        </button>
                        <button
                            className="md:p-2 rounded-full bg-blue-900 transition-all active:shadow-inner active:shadow-white active:scale-110 px-1 py-1"
                            onClick={(e) => {
                                activecalls();
                                setwindow(prev => !prev)
                            }}
                        >
                            <i className="fa fa-window-maximize fa md:text-[30px] text-[#03032fee]" aria-hidden="true"></i>
                        </button>
                    </form>
                    <FileOptions options={options} socket={socket} code={code} />
                    {call && (
                        <div className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-blue-900 md:w-[150px] w-[120px] p-4 shadow-md shadow-blue-900 z-50 transition-all duration-700 rounded-t-2xl rounded-br-2xl flex flex-col items-center gap-4">

                            {/* Mic Toggle */}
                            {mic ? (
                                <button onClick={toggleMic}>
                                    <Micon />
                                </button>
                            ) : (
                                <button onClick={toggleMic}>
                                    <Mute />
                                </button>
                            )}
                            {/* Video Toggle */}
                            {video ? (
                                <button onClick={toggleCamera}>
                                    <Videoon />
                                </button>
                            ) : (
                                <button onClick={toggleCamera}>
                                    <Videooff />
                                </button>
                            )}
                        </div>
                    )}

                    {window && (
                        <div className="fixed top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-blue-950 md:w-[80%] w-[90%] p-4 shadow-md shadow-blue-900 z-10 transition-all duration-700 rounded-t-2xl rounded-br-2xl grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[80vh] overflow-y-auto">

                            {/* Your own stream */}
                            <div className="bg-black rounded-xl overflow-hidden">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover"
                                />
                                <p className="text-white text-xs text-center mt-1">You</p>
                            </div>

                            {/* Remote peer streams */}
                            {peerStreams?.map((streamObj, idx) => (
                                <div key={idx} className="bg-black rounded-xl overflow-hidden">
                                    <video
                                        ref={(el) => {
                                            if (el && streamObj.stream) {
                                                el.srcObject = streamObj.stream;
                                            }
                                        }}
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                    <p className="text-white text-xs text-center mt-1">{streamObj.name || `User ${idx + 1}`}</p>
                                </div>
                            ))}
                        </div>
                    )}


                </div>

            </div>
        </>
    )
}

export default Inputs
