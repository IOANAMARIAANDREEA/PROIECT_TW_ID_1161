const express = require("express");
const { Dropbox } = require("dropbox");
const authMiddleware = require("../middleware/auth");
const { User } = require("../models");
const { getDropboxClient, resolveDropboxToken } = require("../services/dropboxClient");

const router = express.Router();

router.get("/auth-url", authMiddleware, async (req, res, next) => {
  try {
    const appKey = process.env.DROPBOX_APP_KEY;
    const redirectUri = process.env.DROPBOX_REDIRECT_URI;

    if (!appKey || !redirectUri) {
      return res.status(400).json({ message: "Dropbox app key or redirect URI missing" });
    }

    const dbx = new Dropbox({ clientId: appKey });
    const authUrl = dbx.auth.getAuthenticationUrl(redirectUri, undefined, "code", "offline", undefined, undefined, true);

    return res.json({ authUrl });
  } catch (error) {
    return next(error);
  }
});

router.get("/callback", async (req, res) => {
  res.send("Dropbox auth code received. Copy the code and exchange it in your client app.");
});

router.post("/connect", authMiddleware, async (req, res, next) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) {
      return res.status(400).json({ message: "accessToken is required" });
    }

    const client = getDropboxClient(accessToken);
    let accountEmail = null;
    try {
      const account = await client.usersGetCurrentAccount();
      accountEmail = account?.result?.email || null;
    } catch (err) {
      accountEmail = null;
    }

    await User.update(
      { dropboxAccessToken: accessToken, dropboxAccountEmail: accountEmail },
      { where: { id: req.user.id } }
    );

    return res.json({ message: "Dropbox connected" });
  } catch (error) {
    return next(error);
  }
});

router.get("/status", authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    const accessToken = resolveDropboxToken(user);
    if (!accessToken) {
      return res.json({ connected: false });
    }

    const dbx = getDropboxClient(accessToken);
    try {
      const account = await dbx.usersGetCurrentAccount();
      const email = account?.result?.email || user.dropboxAccountEmail || null;
      if (email && email !== user.dropboxAccountEmail) {
        await user.update({ dropboxAccountEmail: email });
      }
      return res.json({ connected: true, email });
    } catch (err) {
      return res.json({ connected: false });
    }
  } catch (error) {
    return next(error);
  }
});

router.get("/list", authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    const accessToken = resolveDropboxToken(user);
    if (!accessToken) {
      return res.status(400).json({ message: "Dropbox not connected" });
    }

    const dbx = getDropboxClient(accessToken);
    const response = await dbx.filesListFolder({ path: "" });
    return res.json(response.result.entries);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
