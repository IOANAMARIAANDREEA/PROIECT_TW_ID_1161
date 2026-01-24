const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DocumentFile = sequelize.define(
  "DocumentFile",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    documentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dropboxPath: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "document_files",
    timestamps: true
  }
);

module.exports = DocumentFile;
