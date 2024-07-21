import { DataTypes } from "sequelize";
import sequelize from "./index.js";


const SeqUser = sequelize.define("user",
{
    userID:
    {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username:
    {
        type: DataTypes.TEXT
    },
    password:
    {
        type: DataTypes.TEXT
    }
}, { tableName: "user", primaryKey: "userID", timestamps: false });

export default SeqUser;
