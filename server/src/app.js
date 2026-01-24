const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth");
const documentRoutes = require("./routes/documents");
const registrationRoutes = require("./routes/registrations");
const categoryRoutes = require("./routes/categories");
const documentTypeRoutes = require("./routes/documentTypes");
const dropboxRoutes = require("./routes/dropbox");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/document-types", documentTypeRoutes);
app.use("/api/dropbox", dropboxRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Server error" });
});

module.exports = app;
