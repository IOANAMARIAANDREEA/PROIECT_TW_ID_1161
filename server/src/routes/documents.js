const express = require("express");
const multer = require("multer");
const { Op } = require("sequelize");
const authMiddleware = require("../middleware/auth");
const { Document, Registration, Category, User, DocumentType, DocumentFile } = require("../models");
const { getDropboxClient, resolveDropboxToken } = require("../services/dropboxClient");

const router = express.Router();
const upload = multer();

function buildRegistrationNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `DOC-${timestamp}-${random}`;
}

router.use(authMiddleware);

router.get("/", async (req, res, next) => {
  try {
    const where = { ownerId: req.user.id };
    if (req.query.categoryId) {
      where.categoryId = req.query.categoryId;
    }
    if (req.query.registrationNumber) {
      where.registrationNumber = { [Op.like]: `%${req.query.registrationNumber}%` };
    }
    if (req.query.title) {
      where.title = { [Op.like]: `%${req.query.title}%` };
    }

    const documents = await Document.findAll({
      where,
      include: [
        { model: Registration },
        { model: Category, include: [{ model: Category, as: "parent" }] },
        { model: DocumentType }
      ],
      order: [["createdAt", "DESC"]]
    });
    return res.json(documents);
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, categoryId, description, registrationNumber, documentTypeId } = req.body;
    if (!title || !categoryId || !documentTypeId) {
      return res.status(400).json({ message: "Title, categoryId and documentTypeId are required" });
    }

    const parsedCategoryId = Number(categoryId);
    if (!Number.isInteger(parsedCategoryId)) {
      return res.status(400).json({ message: "Invalid categoryId" });
    }

    const parsedTypeId = Number(documentTypeId);
    if (!Number.isInteger(parsedTypeId)) {
      return res.status(400).json({ message: "Invalid documentTypeId" });
    }

    const category = await Category.findByPk(parsedCategoryId);
    if (!category) {
      return res.status(400).json({ message: "Invalid categoryId" });
    }

    const type = await DocumentType.findByPk(parsedTypeId);
    if (!type) {
      return res.status(400).json({ message: "Invalid documentTypeId" });
    }

    let finalRegistrationNumber = registrationNumber || buildRegistrationNumber();
    let exists = await Document.findOne({ where: { registrationNumber: finalRegistrationNumber } });
    if (registrationNumber && exists) {
      return res.status(409).json({ message: "Registration number already in use" });
    }
    while (exists) {
      finalRegistrationNumber = buildRegistrationNumber();
      exists = await Document.findOne({ where: { registrationNumber: finalRegistrationNumber } });
    }

    const document = await Document.create({
      title,
      category: category.name,
      categoryId: parsedCategoryId,
      description,
      ownerId: req.user.id,
      registrationNumber: finalRegistrationNumber,
      documentType: type.name,
      documentTypeId: parsedTypeId
    });

    return res.status(201).json(document);
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const document = await Document.findOne({
      where: { id: req.params.id, ownerId: req.user.id },
      include: [
        { model: Registration },
        { model: Category, include: [{ model: Category, as: "parent" }] },
        { model: DocumentType },
        { model: DocumentFile }
      ],
      order: [[DocumentFile, "createdAt", "ASC"]]
    });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    return res.json(document);
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const document = await Document.findOne({
      where: { id: req.params.id, ownerId: req.user.id }
    });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const { title, categoryId, description, registrationNumber, documentTypeId } = req.body;
    let categoryName = document.category;
    let documentTypeName = document.documentType;
    let documentTypeIdValue = document.documentTypeId;
    if (categoryId) {
      const parsedCategoryId = Number(categoryId);
      if (!Number.isInteger(parsedCategoryId)) {
        return res.status(400).json({ message: "Invalid categoryId" });
      }
      const category = await Category.findByPk(parsedCategoryId);
      if (!category) {
        return res.status(400).json({ message: "Invalid categoryId" });
      }
      categoryName = category.name;
    }

    if (documentTypeId) {
      const parsedTypeId = Number(documentTypeId);
      if (!Number.isInteger(parsedTypeId)) {
        return res.status(400).json({ message: "Invalid documentTypeId" });
      }
      const type = await DocumentType.findByPk(parsedTypeId);
      if (!type) {
        return res.status(400).json({ message: "Invalid documentTypeId" });
      }
      documentTypeName = type.name;
      documentTypeIdValue = parsedTypeId;
    }

    if (registrationNumber && registrationNumber !== document.registrationNumber) {
      const exists = await Document.findOne({ where: { registrationNumber } });
      if (exists) {
        return res.status(409).json({ message: "Registration number already in use" });
      }
    }

    await document.update({
      title,
      categoryId: categoryId ? Number(categoryId) : document.categoryId,
      category: categoryName,
      description,
      registrationNumber,
      documentType: documentTypeName,
      documentTypeId: documentTypeIdValue
    });

    return res.json(document);
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const document = await Document.findOne({
      where: { id: req.params.id, ownerId: req.user.id }
    });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    await document.destroy();
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

router.get("/:id/registrations", async (req, res, next) => {
  try {
    const document = await Document.findOne({
      where: { id: req.params.id, ownerId: req.user.id },
      include: [{ model: Registration }]
    });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    return res.json(document.Registrations);
  } catch (error) {
    return next(error);
  }
});

router.post("/:id/registrations", async (req, res, next) => {
  try {
    const { registrationNumber, status } = req.body;
    if (!registrationNumber) {
      return res.status(400).json({ message: "registrationNumber is required" });
    }

    const document = await Document.findOne({
      where: { id: req.params.id, ownerId: req.user.id }
    });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const registration = await Registration.create({
      registrationNumber,
      status: status || "active",
      documentId: document.id
    });

    return res.status(201).json(registration);
  } catch (error) {
    return next(error);
  }
});

router.post("/:id/upload", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "file is required" });
    }

    const document = await Document.findOne({
      where: { id: req.params.id, ownerId: req.user.id }
    });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const user = await User.findByPk(req.user.id);
    const accessToken = resolveDropboxToken(user);
    if (!accessToken) {
      return res.status(400).json({ message: "Dropbox not connected" });
    }

    const client = getDropboxClient(accessToken);
    const dropboxPath = `/documents/${document.id}/${req.file.originalname}`;

    try {
      await client.filesUpload({
        path: dropboxPath,
        contents: req.file.buffer,
        mode: "overwrite"
      });
    } catch (dropboxError) {
      const status = dropboxError?.status;
      const summary = dropboxError?.error?.error_summary || "";
      if (status === 401 || summary.includes("expired_access_token")) {
        return res.status(401).json({ message: "Dropbox token expirat. Reconnecteaza Dropbox si reincearca." });
      }
      throw dropboxError;
    }

    await document.update({
      dropboxPath,
      dropboxFileName: req.file.originalname
    });

    const version = (await DocumentFile.count({ where: { documentId: document.id } })) + 1;
    await DocumentFile.create({
      documentId: document.id,
      version,
      fileName: req.file.originalname,
      dropboxPath
    });

    return res.json({ message: "File uploaded", dropboxPath });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id/download", async (req, res, next) => {
  try {
    const document = await Document.findOne({
      where: { id: req.params.id, ownerId: req.user.id }
    });
    if (!document || !document.dropboxPath) {
      return res.status(404).json({ message: "File not found" });
    }

    const user = await User.findByPk(req.user.id);
    const accessToken = resolveDropboxToken(user);
    if (!accessToken) {
      return res.status(400).json({ message: "Dropbox not connected" });
    }

    const client = getDropboxClient(accessToken);
    try {
      const response = await client.filesGetTemporaryLink({ path: document.dropboxPath });
      return res.json({ link: response.result.link });
    } catch (dropboxError) {
      const status = dropboxError?.status;
      const summary = dropboxError?.error?.error_summary || "";
      if (status === 401 || summary.includes("expired_access_token")) {
        return res.status(401).json({ message: "Dropbox token expirat. Reconnecteaza Dropbox si reincearca." });
      }
      throw dropboxError;
    }
  } catch (error) {
    return next(error);
  }
});

router.get("/:id/files/:fileId/download", async (req, res, next) => {
  try {
    const document = await Document.findOne({
      where: { id: req.params.id, ownerId: req.user.id }
    });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const file = await DocumentFile.findOne({
      where: { id: req.params.fileId, documentId: document.id }
    });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const user = await User.findByPk(req.user.id);
    const accessToken = resolveDropboxToken(user);
    if (!accessToken) {
      return res.status(400).json({ message: "Dropbox not connected" });
    }

    const client = getDropboxClient(accessToken);
    try {
      const response = await client.filesGetTemporaryLink({ path: file.dropboxPath });
      return res.json({ link: response.result.link });
    } catch (dropboxError) {
      const status = dropboxError?.status;
      const summary = dropboxError?.error?.error_summary || "";
      if (status === 401 || summary.includes("expired_access_token")) {
        return res.status(401).json({ message: "Dropbox token expirat. Reconnecteaza Dropbox si reincearca." });
      }
      throw dropboxError;
    }
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
