const multer = require("multer");

// Store file in memory instead of disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
