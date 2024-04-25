import { Sequelize } from "sequelize";


const sequelize = new Sequelize({
    dialect: "mysql",
    database: "reactcrud",
    username: "root",
    password: "",
    host: "localhost",
});

export default sequelize;
