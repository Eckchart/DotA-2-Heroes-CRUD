import { Sequelize } from "sequelize";


const testSequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:"
});

export default testSequelize;

