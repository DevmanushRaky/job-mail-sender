const HrEmail = require("../model/HrEmailModel");

// ✅ Add HR Email
exports.addHREmail = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ message: "Name and Email are required" });
        }

        const existingEmail = await HrEmail.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const newEmail = new HrEmail({ name, email });
        await newEmail.save();

        // 🔥 Emit real-time update to all connected clients
        req.app.locals.io.emit("hrEmailAdded", newEmail);

        res.status(201).json({ message: "HR Email added successfully", email: newEmail });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};





// ✅ Bulk Add HR Emails
exports.bulkAddHREmails = async (req, res) => {
    try {
        const { emails } = req.body;

        if (!emails || !Array.isArray(emails) || emails.length === 0) {
            return res.status(400).json({ message: "Invalid email data" });
        }

        // Remove duplicates from the incoming list
        const uniqueEmails = [...new Map(emails.map((email) => [email.email, email])).values()];

        // Check existing emails to prevent duplication
        const existingEmails = await HrEmail.find({ email: { $in: uniqueEmails.map((e) => e.email) } });
        const existingEmailsSet = new Set(existingEmails.map((e) => e.email));

        // Filter out already existing emails
        const newEmails = uniqueEmails.filter((e) => !existingEmailsSet.has(e.email));

        if (newEmails.length === 0) {
            return res.status(400).json({ message: "All emails already exist" });
        }

        // Insert new emails
        const insertedEmails = await HrEmail.insertMany(newEmails);

        // 🔥 Emit real-time update for bulk insert
        req.app.locals.io.emit("bulkHREmailsAdded", insertedEmails);

        res.status(201).json({ message: `${insertedEmails.length} HR emails added successfully`, emails: insertedEmails });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// ✅ Update HR Email & Name
exports.updateHREmail = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, status } = req.body;

        if (!name || !email || !status) {
            return res.status(400).json({ message: "Name, Email, and Status are required" });
        }

        const updatedEmail = await HrEmail.findByIdAndUpdate(
            id,
            { name, email, status },
            { new: true, runValidators: true }
        );

        if (!updatedEmail) {
            return res.status(404).json({ message: "HR Email not found" });
        }

        // 🔥 Emit real-time update
        req.app.locals.io.emit("hrEmailUpdated", updatedEmail);

        res.status(200).json({ message: "HR Email updated successfully", email: updatedEmail });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Get All HR Emails
exports.getAllEmails = async (req, res) => {
    try {
        const emails = await HrEmail.find();
        res.status(200).json(emails);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Delete a Single HR Email
exports.deleteEmail = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEmail = await HrEmail.findByIdAndDelete(id);

        if (!deletedEmail) {
            return res.status(404).json({ message: "Email not found" });
        }

        // 🔥 Emit real-time delete event
        req.app.locals.io.emit("hrEmailDeleted", { id });

        res.status(200).json({ message: "Email deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Delete All HR Emails
exports.deleteAllEmails = async (req, res) => {
    try {
        await HrEmail.deleteMany();

        // 🔥 Emit real-time delete-all event
        req.app.locals.io.emit("allHREmailsDeleted");

        res.status(200).json({ message: "All HR emails deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
