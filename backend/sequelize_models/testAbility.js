import { DataTypes } from "sequelize";
import testSequelize from "./testIndex.js";
import TestSeqHero from "./testHero.js";


const TestSeqAbility = testSequelize.define("ability",
{
    AbilityID:
    {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    abilityName:
    {
        type: DataTypes.TEXT
    },
    abilityManaCost:
    {
        type: DataTypes.INTEGER
    },
    abilityCooldown:
    {
        type: DataTypes.INTEGER
    },
}, { tableName: "ability", primaryKey: "AbilityID", timestamps: false });

TestSeqAbility.belongsTo(TestSeqHero, { foreignKey: "heroID" });

export default TestSeqAbility;
