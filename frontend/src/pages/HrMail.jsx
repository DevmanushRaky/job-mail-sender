/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  addHREmail,
  getAllEmails,
  updateHREmail,
  deleteEmail,
  deleteAllEmails,
  bulkHREmail,
  socket,
} from "../api";

export const HrMail = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("active");
  const [emails, setEmails] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkEmails, setBulkEmails] = useState("");

  // Fetch emails from backend on mount
  useEffect(() => {
    fetchEmails();

    // Listen for real-time updates
    socket.on("hrEmailAdded", (newEmail) => {
      setEmails((prev) => [...prev, newEmail]);
      toast.success("New HR email added!");
    });

    socket.on("hrEmailUpdated", (updatedEmail) => {
      setEmails((prev) =>
        prev.map((email) => (email._id === updatedEmail._id ? updatedEmail : email))
      );
      toast.success("HR email updated!");
    });

    socket.on("hrEmailDeleted", ({ id }) => {
      setEmails((prev) => prev.filter((email) => email._id !== id));
      toast.success("HR email deleted!");
    });

    socket.on("allHREmailsDeleted", () => {
      setEmails([]);
      toast.success("All HR emails deleted!");
    });

    return () => {
      socket.off("hrEmailAdded");
      socket.off("hrEmailUpdated");
      socket.off("hrEmailDeleted");
      socket.off("allHREmailsDeleted");
      socket.off("bulkHREmailsAdded");
    };
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await getAllEmails();
      setEmails(response);
    } catch (error) {
      toast.error("Failed to fetch emails: ");
    }
  };


  const handleSaveEmail = async () => {
    if (!name || !email || (editingId && !status)) {
      toast.warning("Please fill in all required fields");
      return;
    }
    try {
      // Check for duplicate email only when adding a new one
      if (!editingId && emails.some((e) => e.email.toLowerCase() === email.toLowerCase())) {
        toast.error("This HR email is already added!");
        return;
      }
      if (editingId) {
        await updateHREmail(editingId, { name, email, status });
      } else {
        await addHREmail({ name, email });
      }
      setName("");
      setEmail("");
      setStatus("active");
      setEditingId(null);
      fetchEmails();
    } catch (error) {
      toast.error("Failed to save HR email: ");
    }
  };

  const handleBulkAdd = async () => {
    if (!bulkEmails.trim()) {
      toast.warning("Please enter HR emails");
      return;
    }

    const emailsArray = bulkEmails
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.includes("@")) // Ensure it's a valid email line
      .map((line) => {
        const parts = line.split(",").map((val) => val.trim());
        if (parts.length === 2) {
          return { name: parts[0], email: parts[1] };
        }
        return { name: "Unknown", email: parts[0] };
      });

    if (emailsArray.length === 0) {
      toast.warning("Invalid email format. Use: Name, Email per line.");
      return;
    }

    try {
      await bulkHREmail(emailsArray);
      toast.success("Bulk HR emails added successfully");
      setBulkEmails("");
      fetchEmails();
    } catch (error) {
      toast.error("Failed to add bulk HR emails: ");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmail(id);
      fetchEmails();
    } catch (error) {
      toast.error("Failed to delete email: ");
    }
  };

  const handleDeleteAll = async () => {
    if (!emails.length) {
      toast.warning("No emails to delete");
      return;
    }
    if (!window.confirm("Are you sure you want to delete all emails?")) return;

    try {
      await deleteAllEmails();
      fetchEmails();
    } catch (error) {
      toast.error("Failed to delete all emails: ");
    }
  };

  const handleEdit = (hr) => {
    setName(hr.name);
    setEmail(hr.email);
    setStatus(hr.status || "active");
    setEditingId(hr._id);
  };

  const filteredEmails = emails.filter(
    (hr) =>
      hr.name.toLowerCase().includes(search.toLowerCase()) ||
      hr.email.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.email.localeCompare(b.email)); // Sort alphabetically by email

  return (
    <div>
      <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 bg-light py-5">
        <div className="container p-4 shadow rounded bg-white">
          <h2 className="text-center fw-bold text-primary mb-3">🎯 HR Email Management</h2>
          <p className="text-center text-muted">Add HR emails and send job applications instantly!</p>

          <div className="form-check form-switch d-flex align-items-center justify-content-center mb-3">
            <input className="form-check-input me-2" type="checkbox" id="bulkModeSwitch" checked={bulkMode} onChange={() => setBulkMode(!bulkMode)} />
            <label className="form-check-label" htmlFor="bulkModeSwitch">Bulk Add Mode</label>
          </div>

          {!bulkMode ? (
            <div className="mb-4">
              <h4 className="text-center">{editingId ? "Edit HR Email" : "Add HR Email"}</h4>
              <input type="text" className="form-control mb-2" placeholder="HR Name" value={name} onChange={(e) => setName(e.target.value)} />
              <input type="email" className="form-control mb-2" placeholder="HR Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              {editingId && (
                <select className="form-control mb-2" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select>
              )}
              <button className="btn btn-success w-100" onClick={handleSaveEmail}>{editingId ? "Update HR" : "Add HR"}</button>
            </div>
          ) : (
            <div className="mb-4">
              <h4 className="text-center">Bulk Add HR Emails</h4>
              <textarea className="form-control" rows="4" placeholder="Paste HR emails (one per line)" value={bulkEmails} onChange={(e) => setBulkEmails(e.target.value)}></textarea>
              <button className="btn btn-primary mt-3 w-100" onClick={handleBulkAdd}>Submit Bulk Emails</button>
            </div>
          )}

          <input type="text" className="form-control mb-3" placeholder="🔍 Search HR by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />

          {filteredEmails.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered text-center mt-2">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmails.map((hr, index) => (
                    <tr key={hr._id}>
                      <td>{index + 1}</td>
                      <td>{hr.name}</td>
                      <td>{hr.email}</td>
                      <td>{hr.status}</td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button className="btn btn-sm btn-primary" onClick={() => handleEdit(hr)}>✏️</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(hr._id)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (<p className="text-center mt-3">No HR emails found</p>)}

          {emails.length > 0 && (
            <div className="text-center mt-3">
              <button className="btn btn-warning" onClick={handleDeleteAll}>Delete All</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

