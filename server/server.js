const express = require("express");
const cors = require("cors");
const http = require("http")
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");
const app = express();
const server = http.createServer(app)
const PORT = 5000
const Rooms = [{ user: 1, code: 11111 }, { user: 1, code: 39927 }]
const member = {}
const names = ["Pandit", "Ranga", "zulfu", "gingad", "Adwani", "Ambani", "Bishnoi", "Salman"];
const color = ["#FF4136", "#FF851B", "#FFDC00", "#2ECC40", "#0074D9", "#B10DC9", "#F012BE", "#7FDBFF", "#01FF70", "#F500F5"];


const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const random = () => {
    return Math.floor(10000 + Math.random() * 90000)
}

const assignRandomAttributes = (assignedUsers) => {
    let availableNames = names.filter(name => !assignedUsers.some(user => user.name === name));
    let availableColors = color.filter(color => !assignedUsers.some(user => user.color === color));

    const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];
    const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];

    return { name: randomName, color: randomColor };
}


app.use(express.json())
app.use(cors());

app.get("/create", (req, res) => {
    const code = random();
    const room = { user: 1, code: code }
    Rooms.push(room);
    res.status(201).json(code);
})


io.on('connection', (socket) => {
    socket.on('joinRoom', (roomId) => {
        const roomIdStr = String(roomId);
        if (!member[roomIdStr]) {
            member[roomIdStr] = []
        }

        const roomExists = Rooms.find((r) => r.code == roomIdStr);

        if (roomExists) {
            const userAttributes = assignRandomAttributes(member[roomIdStr]);
            member[roomIdStr].push({ socketId: socket.id, ...userAttributes });

            socket.join(roomIdStr);

            socket.emit('assignedAttributes', userAttributes);
            io.to(String(roomIdStr)).emit('roomusers', member[roomIdStr]);
        } else {
            console.log(`Room ${roomIdStr} does not exist, cannot join.`);
        }

        const clientsInRoom = io.sockets.adapter.rooms.get(roomIdStr);
    });


    // Handle when a user joins a video room
    socket.on("join-video-room", (roomId) => {
        const clients = io.sockets.adapter.rooms.get(roomId) || new Set();
        const existingUsers = Array.from(clients).filter(id => id !== socket.id);

        socket.join(roomId);
        socket.emit("all-users", existingUsers); // Notify new user of existing peers
    });

    // Handle offer signal from a user to another user
    socket.on("sending-signal", ({ userToSignal, callerID, signal }) => {
        io.to(userToSignal).emit("user-joined", {
            signal,
            callerID
        });
    });

    // Handle answer signal from callee back to the original caller
    socket.on("returning-signal", ({ callerID, signal }) => {
        io.to(callerID).emit("receiving-returned-signal", {
            signal,
            id: socket.id
        });
    });





    socket.on('message', (data) => {
        const user = member[String(data.roomId)].find((item) => item.socketId == socket.id)

        io.to(String(data.roomId)).emit('message', {
            message: data.message,
            name: user.name,
            color: user.color
        });
    });

    socket.on('send-file', (data) => {
        const user = member[String(data.roomId)].find((item) => item.socketId == socket.id)

        const { roomId, fileName, fileBuffer } = data;
        const buffer = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer, 'binary');

        const filePath = path.join(__dirname, 'uploads', fileName);
        if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
            fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
        }

        fs.writeFileSync(filePath, buffer);
        console.log(`File saved at ${filePath}`);
        io.to(String(roomId)).emit('fileBroadcast', { fileName, fileBuffer, name: user.name });
    });



    let roomCleanupTimeouts = {};  // Track cleanup timers for rooms

    socket.on('user-left', ({ code, name }) => {
        console.log(code, name);

        // Ensure the room exists and has members
        const roomMembers = member[String(code)];
        if (roomMembers) {
            // Remove the user who left the room
            member[String(code)] = roomMembers.filter(item => item.name !== name);

            // Emit updated user list to remaining users
            const newusers = member[String(code)];
            if (newusers && Array.isArray(newusers)) {
                io.to(String(code)).emit('update-users', { newusers, leftname: name });
            }

            // If the room is now empty, start a cleanup timer
            if (newusers.length === 0 && !roomCleanupTimeouts[code]) {
                // Set a timer to delete the room after a certain delay (e.g., 10 minutes)
                roomCleanupTimeouts[code] = setTimeout(() => {
                    console.log(`Room ${code} is empty. Cleaning up...`);

                    // Call the deleteRoom function to clean up the room
                    deleteRoom(code);

                    // Clear the timeout reference
                    delete roomCleanupTimeouts[code];
                }, 10 * 60 * 1000);  // Set delay time (10 minutes)
            }

        } else {
            console.error(`Room ${code} not found or no members available.`);
        }
    });






    // socket.on('user-left', ({ code, name }) => {
    //     console.log(code, name);

    //     // Ensure room exists
    //     const roomMembers = member[String(code)];
    //     console.log(member);
    //     if (roomMembers) {
    //         // Filter out the user who left
    //         member[String(code)] = roomMembers.filter(item => item.name !== name);

    //         // After filtering, make sure newusers is defined and an array
    //         const newusers = member[String(code)];

    //         if (newusers && Array.isArray(newusers)) {
    //             io.to(String(code)).emit('update-users', { newusers, leftname: name });
    //         } else {
    //             console.error(`Failed to update users in room ${code}:`, newusers);
    //         }
    //     } else {
    //         console.error(`Room ${code} not found or no members available.`);
    //     }
    // });

});



// app.post("/delete", (req, res) => {
//     try {
//         const code = req.body.code;
//         let index = -1
//         Rooms.forEach((item, i) => {
//             if (item.code == code) {
//                 item.user = item.user - 1;
//             }
//             if (item.user == 0) {
//                 index = i
//             }
//         })
//         if (index !== -1) {

//             const roomDirectoryPath = path.join(__dirname, 'uploads', code);

//             if (fs.existsSync(roomDirectoryPath)) {
//                 const files = fs.readdirSync(roomDirectoryPath); // Read files in the room's folder
//                 files.forEach((file) => {
//                     const filePath = path.join(roomDirectoryPath, file);
//                     fs.unlinkSync(filePath); // Delete each file
//                 });

//                 // After deleting the files, remove the room directory if it's empty
//                 fs.rmdirSync(roomDirectoryPath);
//                 console.log(`Removed all files and directory for room ${code}`);
//             }

//             Rooms.splice(index, 1);
//             delete member[code]
//         }
//         res.sendStatus(201);
//     } catch (error) {
//         res.sendStatus(400);
//     }
// });

// Function to delete a room
const deleteRoom = (code) => {
    try {
        const roomDirectoryPath = path.join(__dirname, 'uploads', code);

        // Delete all files related to the room
        if (fs.existsSync(roomDirectoryPath)) {
            const files = fs.readdirSync(roomDirectoryPath);  // Get all files in the room directory
            files.forEach((file) => {
                const filePath = path.join(roomDirectoryPath, file);
                fs.unlinkSync(filePath);  // Delete each file
            });

            // Remove the room's directory
            fs.rmdirSync(roomDirectoryPath);
            console.log(`Removed all files and directory for room ${code}`);
        }

        // Remove the room from the list and member data
        const roomIndex = Rooms.findIndex((room) => room.code == code);
        if (roomIndex !== -1) {
            Rooms.splice(roomIndex, 1);  // Remove the room from the Rooms array
            delete member[code];  // Remove member data for this room
            console.log(`Room ${code} has been deleted.`);
        }
    } catch (error) {
        console.error(`Error deleting room ${code}:`, error);
    }
};




app.post("/join", (req, res) => {
    const code = req.body.code;
    if (Rooms.length == 0) {
        res.status(400).send({ message: "Room doesnt exist" });
    }
    else {
        const result = Rooms.filter((item) => item.code == code)
        if (result.length !== 0) {
            result[0].user += 1;
            res.status(200).send({ message: "Room exist you are added to it" });
        }
        else {
            res.status(400).send({ message: "Room doesnt exist" });
        }
    }
})


server.listen(PORT, "0.0.0.0", () => {
    console.log("im HIGH On PORT : - 5000")
});