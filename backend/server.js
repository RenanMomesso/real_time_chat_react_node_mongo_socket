const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require('multer')
const fs = require('fs')

const app = express();

const expressValidator = require("express-validator");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
require("dotenv").config();

//connect to database
const connect = mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB WORKING"))
  .catch((err) => console.log("DB ERROR: " + err));

// import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const Chat = require("./models/Chat");
const chatRoutes = require('./routes/Chat')

//app midlewares
app.use(expressValidator());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
if ((process.env.NODE_ENV = "development")) {
  app.use(cors({ origin: "http://localhost:3000" }));
}
app.use(cors());

// middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use('/api',chatRoutes)


var storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,'uploads/')
  },
  filename:function(req,file,cb){
    cb(null,`${Date.now()}_${file.originalname}`)
  }
})

var upload = multer({storage:storage}).single('file')

app.post('/api/chat/uploadfiles', (req,res)=>{
  upload(req,res,err=>{
    console.log(res.req.file.path)
    if(err){
      return res.json({success:false, err})
    }
    return res.json({success:true, url:res.req.file.path})
  })
})

io.on("connection", (socket) => {
  socket.on("newMessage", (msg) => {
    connect.then((db) => {
      try {
        let chat = new Chat({
          message: msg.chatMessage,
          sender: msg.userId,
          type: msg.type,
        });
        chat.save((err, doc) => {
          console.log(doc);
          if (err)
            return res
              .status(400)
              .json({ error: "Não foi possivel guardar msg", err });
          Chat.find({ _id: doc._id })
            .populate("sender")
            .exec((err, doc) => {
              console.log("Doc of output from backend", doc)
              return io.emit("Output That Message", doc);
            });
        });
      } catch (err) {
        console.log(error);
      }
    });
  });
});

app.use('/uploads', express.static('uploads'));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {

  // Set static folder
  app.use(express.static("client/build"));

  // index.html for all page routes
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log("API is running on port " + port);
});
