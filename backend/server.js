import express from "express"
import router from "./routes.js";
import cors from "cors";
import sequelize from "./sequelize_models/index.js";

const app = express();
app.use(cors());
app.use(express.json());

sequelize.sync()
         .then(() =>
         {
             console.log("Models synchronized with database.");
         })
         .catch(error =>
         {
             console.error("Error synchronizing models:", error);
         });

app.use("/api", router);

app.listen(3001, () =>
{
    console.log("Server is running on port 3001.");
})
