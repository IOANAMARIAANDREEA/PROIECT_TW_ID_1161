const express = require("express");
const authMiddleware = require("../middleware/auth");
const { Category, Document } = require("../models");

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      order: [["name", "ASC"]],
      include: [{ model: Category, as: "parent" }]
    });
    return res.json(categories);
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, parentId } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const category = await Category.create({
      name,
      parentId: parentId || null
    });
    return res.status(201).json(category);
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { name, parentId } = req.body;
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    await category.update({ name, parentId: parentId || null });
    return res.json(category);
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const count = await Document.count({ where: { categoryId: category.id } });
    if (count > 0) {
      return res.status(409).json({ message: "Category is in use" });
    }

    const childCount = await Category.count({ where: { parentId: category.id } });
    if (childCount > 0) {
      return res.status(409).json({ message: "Category has subcategories" });
    }

    await category.destroy();
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
