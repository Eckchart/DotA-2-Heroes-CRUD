import { DataTypes } from "sequelize";
import testSequelize from "./testIndex.js";


const TestSeqHero = testSequelize.define("hero",
{
    heroID:
    {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    heroName:
    {
        type: DataTypes.TEXT
    },
    baseStr:
    {
        type: DataTypes.DOUBLE
    },
    baseAgi:
    {
        type: DataTypes.DOUBLE
    },
    baseInt:
    {
        type: DataTypes.DOUBLE
    },
    baseMs:
    {
        type: DataTypes.INTEGER
    }
}, { tableName: "hero", primaryKey: "heroID", timestamps: false });

export default TestSeqHero;
