const { Sequelize } = require("sequelize");

const storage = process.env.DATABASE_STORAGE || "./data/database.sqlite";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage,
  logging: false
});

module.exports = sequelize;
