const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const http = require("http");
const httpServer = http.Server(app);
const io = require("socket.io")(httpServer);


app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


/**********************************/ 
let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
    const response = new Date();
    // Emitting a new message. Will be consumed by the client
    socket.emit("FromAPI", response);
  };

/**********************************/ 

const users=[
    {"email":"umit@gmail.com", "username": "umit", "id": 111, "password":"123456"},
    {"email":"ahmet@gmail.com", "username": "ahmet", "id": 222, "password":"123456"},
    {"email":"mehmet@gmail.com", "username": "mehmet", "id": 222, "password":"123456"}
]

app.get("/api", (req, res) => {
    res.json({
        message: "Hello there this is first route"
    })
})

app.post("/api/login", (req, res) => {
    console.log("req data", req.body.password, req.body.email);
    users.filter(user => {
        if(user.email === req.body.email){
            if(user.password === req.body.password){
                console.log(user)

                const payload = {
                    "id": user.id
                }

                jwt.sign(payload, 'shhh', {expiresIn: "10h"}, (err, token) => {
                    res.json({
                        token:token,
                    })
                })
            }
        }
    })
})

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, "shhh", (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else{
            res.json({
                message: "blog posted!",
                authData: authData
            })
        }
    })
})

function verifyToken(req, res, next){
    const bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader !== "undefined"){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

httpServer.listen(3000, () => {
    console.log("server started on port 3000");
})