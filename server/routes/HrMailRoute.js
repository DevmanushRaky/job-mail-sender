const express = require("express");
const router = express.Router();
const {
  addHREmail,
  updateHREmail,
  getAllEmails,
  deleteEmail,
  deleteAllEmails,
  bulkAddHREmails,
} = require("../controllers/HrEmailController.js");

// ✅ Add HR Email
router.post("/add", addHREmail);

// ✅ Bulk Add HR Emails
router.post("/bulk-add", bulkAddHREmails);

// ✅ Update HR Email
router.put("/update/:id", updateHREmail);

// ✅ Get All Emails
router.get("/all", getAllEmails);

// ✅ Delete Single Email
router.delete("/delete/:id", deleteEmail);

// ✅ Delete All Emails
router.delete("/delete-all", deleteAllEmails);

module.exports = router;
