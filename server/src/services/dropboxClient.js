const { Dropbox } = require("dropbox");

function getDropboxClient(accessToken) {
  return new Dropbox({ accessToken });
}

function resolveDropboxToken(user) {
  return user?.dropboxAccessToken || process.env.DROPBOX_ACCESS_TOKEN || null;
}

module.exports = {
  getDropboxClient,
  resolveDropboxToken
};
