const express = require("express");
const { sendMail, getAllMails, getMailById, deleteMail } = require("../controllers/MailContoller");
const multer = require("multer");

const router = express.Router();

// Multer Storage for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Mail Routes
router.post("/send", upload.single("attachment"), sendMail);
router.get("/", getAllMails);
router.get("/:id", getMailById);
router.delete("/:id", deleteMail);

module.exports = router;
