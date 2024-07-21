import { Sequelize } from "sequelize";


const sequelize = new Sequelize("database", "user", "password", {
    dialect: "mysql",
    dialectOptions:
    {
        socketPath: "/cloudsql/'SQL_CONNECTION_NAME'",
        timestamps: false
    }
});

export default sequelize;
