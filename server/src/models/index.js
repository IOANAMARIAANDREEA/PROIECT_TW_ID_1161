const sequelize = require("../config/database");
const User = require("./User");
const Document = require("./Document");
const Registration = require("./Registration");
const Category = require("./Category");
const DocumentType = require("./DocumentType");
const DocumentFile = require("./DocumentFile");

User.hasMany(Document, { foreignKey: "ownerId", onDelete: "CASCADE" });
Document.belongsTo(User, { foreignKey: "ownerId" });

Category.hasMany(Document, { foreignKey: "categoryId", onDelete: "SET NULL" });
Document.belongsTo(Category, { foreignKey: "categoryId" });

DocumentType.hasMany(Document, { foreignKey: "documentTypeId", onDelete: "SET NULL" });
Document.belongsTo(DocumentType, { foreignKey: "documentTypeId" });

Category.hasMany(Category, { foreignKey: "parentId", as: "subcategories" });
Category.belongsTo(Category, { foreignKey: "parentId", as: "parent" });

Document.hasMany(Registration, { foreignKey: "documentId", onDelete: "CASCADE" });
Registration.belongsTo(Document, { foreignKey: "documentId" });

Document.hasMany(DocumentFile, { foreignKey: "documentId", onDelete: "CASCADE" });
DocumentFile.belongsTo(Document, { foreignKey: "documentId" });

module.exports = {
  sequelize,
  User,
  Document,
  Registration,
  Category,
  DocumentType,
  DocumentFile
};
