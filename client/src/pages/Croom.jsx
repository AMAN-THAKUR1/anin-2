import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Sidebar from "../components/Sidebar";
import Inputs from "../components/Inputs";
import Chatbox from "../components/Chatbox";
import getMimeType from "../utils/getMineType";
import { Toaster, toast } from "react-hot-toast"
import Peer from 'simple-peer'

function createPeer(userToSignal, callerID, stream,socket) {
    const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" }  // Google STUN server
            // You can add TURN servers here if you have them
          ]
        }
      });
    peer.on("signal", signal => {
      socket.emit("sending-signal", { userToSignal, callerID, signal });
    });
    return peer;
  }
  
  function addPeer(incomingSignal, callerID, stream, socket) {
    const peer = new Peer({
        initiator: false,
        trickle: false,
        stream,
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" }
            // TURN servers here if needed
          ]
        }
      });
    peer.on("signal", signal => {
      socket.emit("returning-signal", { signal, callerID });
    });
    peer.signal(incomingSignal);
    return peer;
  }
  



function Croom() {
    const [code, setcode] = useState(localStorage.getItem("code") ? JSON.parse(localStorage.getItem("code")) : null);
    const [socket, setSocket] = useState(null);
    const [chat, setchat] = useState([]);
    const [name, setname] = useState("");
    const [users, setusers] = useState([]);
    const [options, setoptions] = useState(false);
    const [left, setLeft] = useState("");
    const nameRef = useRef(name);
    const codeRef = useRef(code);
    

    const peersRef = useRef([]);
    const [peerStreams, setPeerStreams] = useState([]);

    const [mic, setmic] = useState(false)
    const [video, setvideo] = useState(false)


    const [stream, setStream] = useState(null);


    const toggleMic = () => {
        if (stream) {
            const current = stream.getAudioTracks()[0].enabled;
            stream.getAudioTracks()[0].enabled = !current;
            setmic(!current);
        }
    };

    const toggleCamera = () => {
        if (stream) {
            const current = stream.getVideoTracks()[0].enabled;
            stream.getVideoTracks()[0].enabled = !current;
            setvideo(!current);
        }
    };
    const activecalls = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(currentStream => {
                setStream(currentStream);
                socket.emit("join-video-room", code);
            })
            .catch(err => {
                console.error("Media error:", err);
            });
    }




    const joinRoom = (roomId) => { socket && socket.emit('joinRoom', roomId) };

    useEffect(() => {
        if (localStorage.getItem("code")) return
        else {
            try {
                fetch("https://anin-2.onrender.com/create", { method: "GET" })
                    .then(res => res.json())
                    .then(data => {
                        localStorage.setItem("code", JSON.stringify(data))
                        localStorage.setItem("code2", JSON.stringify(data))
                        setcode(data);
                    })
            } catch (error) {
                console.log(error);
            }
        }
    }, []);

    useEffect(() => {
        const newSocket = io("https://anin-2.onrender.com/");
        setSocket(newSocket);
        newSocket.on("connect", () => { });

        // Handling new messages
        newSocket.on("message", (data) => setchat((prevChat) => [data, ...prevChat]));

        // Handling users list updates
        newSocket.on("update-users", ({ newusers, leftname }) => {
            if (Array.isArray(newusers)) {
                console.log(`Recieved: Users: ${newusers.length}, Left: ${leftname}`);
                setusers(newusers); // Overwriting users state with the new list
            } else {
                console.error("Received invalid newusers:", newusers);
            }
            setLeft(leftname);  // Setting the name of the person who left

        });

        // Handling file broadcast
        newSocket.on('fileBroadcast', (data) => {
            const { fileName, fileBuffer, name } = data;
            const blob = new Blob([fileBuffer], { type: getMimeType(fileName) });
            const downloadUrl = URL.createObjectURL(blob);
            setchat((prevChat) => [{ fileName, downloadUrl, name }, ...prevChat]);
        });

        // Cleanup on component unmou
        return () => {
            const currentName = nameRef.current;
            const currentCode = JSON.parse(localStorage.getItem("code"));
            console.log(`Leaving Room - Code: ${currentCode}, Name: ${currentName}`);
            if (currentCode && currentName) {
                newSocket.emit("user-left", { code: currentCode, name: currentName });
            } else {
                console.error("Code or name is not available, unable to emit user-left.");
            }

            localStorage.removeItem("code")
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (code && socket) joinRoom(Number(code));

        if (socket) {
            socket.on("assignedAttributes", (data) => {
                setname(data.name);
                nameRef.current = data.name;
            });
            socket.on("roomusers", (data) => setusers((prevUsers) => data));
        }
    }, [code, socket]);

    useEffect(() => {
        left && toast.error(`${left} left the room`)
    }, [left]);


    useEffect(() => {
        if (!stream || !socket) return;
      
        // When joining, signal existing users
        socket.on("all-users", users => {
          users.forEach(userID => {
            const peer = createPeer(userID, socket.id, stream,socket);
            peer.on("stream", remoteStream => {
              setPeerStreams(ps => [...ps, { id: userID, stream: remoteStream }]);
            });
            peersRef.current.push({ peerID: userID, peer });
          });
        });
      
        // When a new user joins
        socket.on("user-joined", payload => {
          const peer = addPeer(payload.signal, payload.callerID, stream, socket);
          peer.on("stream", remoteStream => {
            setPeerStreams(ps => [...ps, { id: payload.callerID, stream: remoteStream }]);
          });
          peersRef.current.push({ peerID: payload.callerID, peer });
        });
      
        // When someone answers your signal
        socket.on("receiving-returned-signal", payload => {
          const item = peersRef.current.find(p => p.peerID === payload.id);
          item?.peer.signal(payload.signal);
        });
      }, [stream, socket]);
      

    console.log(`left: ${left}`);

    return (

        <div className="flex justify-start h-fit w-full " onClick={() => options ? setoptions(false) : ""}>
            <div><Toaster /></div>
            <Sidebar
                code={code}
                users={users}
                name={name}
                newSocket={socket}
            />
            <div className="w-[85%] h-screen max-h-[90%] flex flex-col justify-center gap-10 md:justify-around md:items-center items-start">
                <Chatbox
                    name={name}
                    chat={chat}
                />
                <Inputs
                    socket={socket}
                    stream={stream}

                    mic={mic}
                    video={video}
                    toggleMic={toggleMic}
                    toggleCamera={toggleCamera}
                    code={code}
                    options={options}
                    setoptions={setoptions}
                    peerStreams={peerStreams}
                    activecalls = {activecalls}
                />
            </div>
        </div>
    );
}

export default Croom;
