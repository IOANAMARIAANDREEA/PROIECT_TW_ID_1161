require("dotenv").config();
const app = require("./app");
const { sequelize, Category, DocumentType } = require("./models");

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    const shouldReset = process.env.RESET_DB === "true";
    await sequelize.sync(shouldReset ? { force: true } : { alter: true });
    const defaultCategories = [
      "Contract",
      "Factura",
      "Raport financiar",
      "Cerere angajat",
      "Document legal"
    ];
    for (const name of defaultCategories) {
      await Category.findOrCreate({ where: { name } });
    }
    const defaultTypes = ["Intern", "Extern", "Administrativ", "Diverse"];
    for (const name of defaultTypes) {
      await DocumentType.findOrCreate({ where: { name } });
    }
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
