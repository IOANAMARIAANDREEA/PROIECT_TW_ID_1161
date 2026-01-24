const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Document = sequelize.define(
  "Document",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    registrationNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    documentType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    documentTypeId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    dropboxPath: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dropboxFileName: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: "documents",
    timestamps: true
  }
);

module.exports = Document;
