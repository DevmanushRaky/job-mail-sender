const Mail = require("../model/MailModel");
const HRModel = require("../model/HrEmailModel");
const nodemailer = require("nodemailer");
require("dotenv").config();





// 📌 Send Mails to HR
exports.sendMail = async (req, res) => {
  const io = req.app.locals.io;
  const getStopFlag = () => req.app.locals.stopMailSending; // ✅ Get stop flag as a function
  const { subject, message: rawMessage ,userEmail, appPassword} = req.body;
  const attachment = req.file;
  const sender = process.env.EMAIL_USER;

  console.log(req.body)

  if (!sender) {
    return res.status(500).json({ error: "Sender email is missing in configuration." });
  }

  let message;
  try {
    message = JSON.parse(rawMessage);
  } catch (error) {
    message = rawMessage;
  }

  const hrEmails = await HRModel.find({}, "email");
  const recipients = hrEmails.map(hr => hr.email);

  if (recipients.length === 0) {
    return res.status(400).json({ error: "No HR emails found." });
  }

    // ✅ Create transporter with user-provided credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: userEmail,
        pass: appPassword,
      },
    });

  let successCount = 0,
    failedCount = 0;

  req.app.locals.stopMailSending = false; // ✅ Reset flag when new mail process starts

  console.log("📨 Starting email process...");
  io.emit("progress", {
    message: `📨 Sending emails... Total: ${recipients.length}`,
    totalEmails: recipients.length,
    successCount,
    failedCount,
  });

  for (let i = 0; i < recipients.length; i++) {
    console.log(`📌 Checking stopMail before sending email #${i + 1}:`, getStopFlag());

    if (getStopFlag()) {
      console.log("🛑 Stop detected before sending the next email.");
      const remainingCount = recipients.length - i;
      io.emit("progress", {
        message: "🚫 Stopping email process...",
        status: "stopping",
        totalEmails: recipients.length,
        successCount,
        failedCount,
        remainingCount,
      });
      await new Mail({
        sender,
        recipients,
        totalRecipients: recipients.length,
        successCount,
        failedCount,
        remainingCount,
        subject,
        message,
        status: "stopped",
        errorMessage: "Process stopped by user.",
      }).save();
      return res.json({ success: false, message: "Process stopped by user." });
    }

    let mailOptions = { from: sender, to: recipients[i], subject, html: message };
    if (attachment) {
      mailOptions.attachments = [{ filename: attachment.originalname, path: attachment.path }];
    }

    try {
      await transporter.sendMail(mailOptions);
      successCount++;
      console.log(`✅ Mail sent to: ${recipients[i]}`);
      io.emit("progress", {
        message: `✅ Mail sent to ${recipients[i]}`,
        status: "sent",
        totalEmails: recipients.length,
        successCount,
        failedCount,
      });
    } catch (error) {
      failedCount++;
      console.log(`❌ Failed to send mail to: ${recipients[i]}`, error.message);
      io.emit("progress", {
        message: `❌ Failed to send mail to ${recipients[i]}`,
        status: "failed",
        totalEmails: recipients.length,
        successCount,
        failedCount,
      });
    }

    console.log(`📌 Checking stopMail AFTER sending email #${i + 1}:`, getStopFlag());

    if (getStopFlag()) {
      console.log("🛑 Stop detected after sending an email. Stopping process...");
      const remainingCount = recipients.length - i - 1;
      io.emit("progress", {
        message: "🚫 Stopping email process...",
        status: "stopping",
        totalEmails: recipients.length,
        successCount,
        failedCount,
        remainingCount,
      });

      await new Mail({
        sender,
        recipients,
        totalRecipients: recipients.length,
        successCount,
        failedCount,
        remainingCount,
        subject,
        message,
        status: "stopped",
        errorMessage: "Process stopped by user.",
      }).save();

      return res.json({ success: false, message: "Process stopped by user." });
    }

    console.log(`⏳ Waiting 40 seconds before next email...`);
    for (let j = 0; j < 40; j++) {
      if (getStopFlag()) {
        console.log("🚨 Email sending stopped during delay.");
        return res.json({ success: false, message: "Process stopped by user." });
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log("✅ All emails processed.");
  const finalStatus = failedCount === 0 ? "sent" : "failed";
  await new Mail({
    sender,
    recipients,
    totalRecipients: recipients.length,
    successCount,
    failedCount,
    remainingCount: 0,
    subject,
    message,
    status: finalStatus,
    errorMessage: failedCount > 0 ? "Some emails failed to send." : null,
  }).save();

  io.emit("progress", {
    message: "🎉 All emails sent!",
    status: "completed",
    totalEmails: recipients.length,
    successCount,
    failedCount,
  });

  res.json({ success: true, message: "All emails processed.", successCount, failedCount });
};

// 📌 Get All Mails
exports.getAllMails = async (req, res) => {
  try {
    const mails = await Mail.find().sort({ sentAt: -1 });
    res.status(200).json(mails);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch emails." });
  }
};

// 📌 Get Single Mail by ID
exports.getMailById = async (req, res) => {
  try {
    const mail = await Mail.findById(req.params.id);
    if (!mail) {
      return res.status(404).json({ error: "Mail not found." });
    }
    res.status(200).json(mail);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch mail." });
  }
};

// 📌 Delete Mail
exports.deleteMail = async (req, res) => {
  try {
    const mail = await Mail.findByIdAndDelete(req.params.id);
    if (!mail) {
      return res.status(404).json({ error: "Mail not found." });
    }
    res.status(200).json({ success: true, message: "Mail deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete mail." });
  }
};
