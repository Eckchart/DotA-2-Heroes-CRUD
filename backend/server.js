import express from "express"
import router from "./routes.js";
import cors from "cors";
import sequelize from "./sequelize_models/index.js";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

const server = createServer(app);
export const socketIoServer = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Access-Control-Allow-Origin"]
    }
});

sequelize.sync()
         .then(() =>
         {
             console.log("Models synchronized with database.");
         })
         .catch(error =>
         {
             console.error("Error synchronizing models:", error);
         });

socketIoServer.on('connect', socket =>
{
    console.log("A user connected.");

    socket.on('message', data =>
        {
            console.log("Message from user: " + data);
        }
    )
});

server.listen(process.env.PORT || 3306, () =>
{
    console.log(`Server is running on port ${process.env.PORT || 3306}.`);
})
