const express = require("express");
const authMiddleware = require("../middleware/auth");
const { Registration, Document } = require("../models");

const router = express.Router();

router.use(authMiddleware);

router.get("/:id", async (req, res, next) => {
  try {
    const registration = await Registration.findByPk(req.params.id, {
      include: [{ model: Document }]
    });
    if (!registration || registration.Document.ownerId !== req.user.id) {
      return res.status(404).json({ message: "Registration not found" });
    }
    return res.json(registration);
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const registration = await Registration.findByPk(req.params.id, {
      include: [{ model: Document }]
    });
    if (!registration || registration.Document.ownerId !== req.user.id) {
      return res.status(404).json({ message: "Registration not found" });
    }

    const { registrationNumber, status } = req.body;
    await registration.update({ registrationNumber, status });
    return res.json(registration);
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const registration = await Registration.findByPk(req.params.id, {
      include: [{ model: Document }]
    });
    if (!registration || registration.Document.ownerId !== req.user.id) {
      return res.status(404).json({ message: "Registration not found" });
    }

    await registration.destroy();
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
