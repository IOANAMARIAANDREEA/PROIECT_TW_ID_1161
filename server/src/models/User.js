const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dropboxAccessToken: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dropboxAccountEmail: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: "users",
    timestamps: true
  }
);

module.exports = User;
