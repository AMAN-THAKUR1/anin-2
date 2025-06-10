import React, { useRef } from 'react'

function FileOptions({ options, socket, code }) {

    const imageInputRef = useRef(null);
    const documentInputRef = useRef(null);
    const audioInputRef = useRef(null);
    const triggerFileInput = (inputRef) => inputRef.current.click();

    const sendFile = (file) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const fileBuffer = e.target.result;
            socket.emit('send-file', { roomId: code, fileName: file.name, fileBuffer });
        };
        reader.readAsArrayBuffer(file);
    }
    const handleFile = (event) => event.target.files[0] && sendFile(event.target.files[0]);
    return (
        <div className={` fixed top-[50%] bottom-[50%] left-[50%] transform  bg-blue-900 md:w-[300px] w-[170px] h-fit md:h-fit  shadow-md shadow-blue-900 z-10 transition-all duration-700 rounded-t-2xl rounded-br-2xl ${options ? "block" : "hidden"}`}>
            <div>
                <div className="flex p-1 gap-2 items-center hover:bg-blue-950  cursor-pointer  active:shadow-blue-400 active:scale-110" onClick={() => triggerFileInput(imageInputRef)}>
                    <input type="file" accept=".jpeg, .jpg, .webp , .png" ref={imageInputRef} onChange={handleFile} className="hidden" /> <button className="block p-1 md:p-3 rounded-full transition-all active:shadow-inner" ><i className="fa fa-picture-o md:fa-2x text-[#00f58b]" aria-hidden="true"></i> </button><p className="text-white block ">Images</p></div>

                <div className="flex p-1 gap-2 items-center  hover:bg-blue-950 cursor-pointer active:shadow-blue-400 active:scale-110" onClick={() => triggerFileInput(documentInputRef)} >
                    <input type="file" accept=".doc,.pptx,.docx,.pdf,.txt,.md,.xlsx" ref={documentInputRef} onChange={handleFile} className="hidden" /> <button className=" p-1 md:p-3 rounded-full  transition-all active:shadow-inner   "  ><i className="fa fa-file-text md:fa-2x text-[#01ddff]" aria-hidden="true"></i> </button> <p className="text-white " >Documents</p></div>

                <div className="flex p-1 gap-2 items-center  hover:bg-blue-950 cursor-pointer active:shadow-blue-400 active:scale-110" onClick={() => triggerFileInput(audioInputRef)} >
                    <input type="file" accept=".ogg, .amr, .3gp , .aac, .mp3" ref={audioInputRef} onChange={handleFile} className="hidden" /> <button className="p-1 md:p-3 rounded-full  transition-all active:shadow-inner"  ><i className="fa fa-headphones md:fa-2x text-[#ffff36]" aria-hidden="true"></i> </button><p className="text-white " >Audio</p></div>
            </div>
        </div>
    )
}

export default FileOptions;
