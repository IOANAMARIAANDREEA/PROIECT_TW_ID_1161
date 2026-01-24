const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DocumentType = sequelize.define(
  "DocumentType",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "document_types",
    timestamps: true
  }
);

module.exports = DocumentType;
