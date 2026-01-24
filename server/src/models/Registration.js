const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Registration = sequelize.define(
  "Registration",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    registrationNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active"
    }
  },
  {
    tableName: "registrations",
    timestamps: true
  }
);

module.exports = Registration;
