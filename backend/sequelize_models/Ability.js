import { DataTypes } from "sequelize";
import sequelize from "./index.js";
import SeqHero from "./Hero.js";


const SeqAbility = sequelize.define("ability",
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

SeqAbility.belongsTo(SeqHero, { foreignKey: "heroID" });

export default SeqAbility;
