const express = require("express");
const authMiddleware = require("../middleware/auth");
const { DocumentType, Document } = require("../models");

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res, next) => {
  try {
    const types = await DocumentType.findAll({ order: [["name", "ASC"]] });
    return res.json(types);
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const type = await DocumentType.create({ name });
    return res.status(201).json(type);
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { name } = req.body;
    const type = await DocumentType.findByPk(req.params.id);
    if (!type) {
      return res.status(404).json({ message: "Document type not found" });
    }
    await type.update({ name });
    return res.json(type);
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const type = await DocumentType.findByPk(req.params.id);
    if (!type) {
      return res.status(404).json({ message: "Document type not found" });
    }

    const count = await Document.count({ where: { documentTypeId: type.id } });
    if (count > 0) {
      return res.status(409).json({ message: "Document type is in use" });
    }

    await type.destroy();
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
