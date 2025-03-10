import { useEffect, useState } from "react";
import { getAllMails, getMailById, deleteMail } from "../api"; // Import API functions

export const MailLog = () => {
  const [mails, setMails] = useState([]);
  const [filteredMails, setFilteredMails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("subject"); // Default search by subject
  const [selectedMail, setSelectedMail] = useState(null);

  useEffect(() => {
    fetchMails();
  }, []);

  const fetchMails = async () => {
    const response = await getAllMails();
    if (response.success === false) {
      console.error(response.error);
    } else {
      setMails(response);
      setFilteredMails(response);
    }
  };

  const handleView = async (id) => {
    const response = await getMailById(id);
    if (response.success === false) {
      console.error(response.error);
    } else {
      setSelectedMail(response);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this mail?");
    if (confirmDelete) {
      const response = await deleteMail(id);
      if (response.success) {
        fetchMails(); // Refresh list after deletion
      } else {
        console.error(response.error);
      }
    }
  };

  // 🔍 Handle Search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    setFilteredMails(
      mails.filter((mail) => {
        if (searchType === "subject") return mail.subject.toLowerCase().includes(value);
        if (searchType === "recipient")
          return mail.recipients.some((email) => email.toLowerCase().includes(value));
        if (searchType === "message") return mail.message.toLowerCase().includes(value);
        return false;
      })
    );
  };

  

  return (

    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="container mt-1">
        <h2>Mail Logs</h2>

        {/* 🔍 Search Bar & Filter */}
        <div className="mb-3 row">
          <div className="col-md-4">
            <select className="form-select" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
              <option value="subject">Search by Subject</option>
              <option value="recipient">Search by Recipient Email</option>
              <option value="message">Search by Message Content</option>
            </select>
          </div>
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder={`Search by ${searchType}...`}
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* 📌 Mail Table */}
        <div className="table-responsive maildatatable">
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Sender</th>
                <th>Subject</th>
                <th>Total Recipients</th>
                <th>Sent</th>
                <th>Failed</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMails.length > 0 ? (
                filteredMails.map((mail, index) => (
                  <tr key={mail._id}>
                    <td>{index + 1}</td>
                    <td>{mail.sender}</td>
                    <td>{mail.subject}</td>
                    <td>{mail.totalRecipients}</td>
                    <td>{mail.successCount}</td>
                    <td>{mail.failedCount}</td>
                    <td>{mail.totalRecipients - mail.successCount - mail.failedCount}</td>
                    <td><span
                      className={`badge ${mail.status === "sent"
                          ? "bg-success"
                          : mail.status === "failed"
                            ? "bg-danger"
                            : "bg-warning"
                        }`}
                    >{mail.status.toUpperCase()}
                    </span></td>
                    <td><div className="d-flex gap-2">
                        <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#mailModal"onClick={() => handleView(mail._id)}>👁</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(mail._id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">No mails found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 📌 View Mail Modal */}
        <div
          className="modal fade"
          id="mailModal"
          tabIndex="-1"
          aria-labelledby="mailModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="mailModalLabel">Mail Details</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {selectedMail && (
                  <div>
                    <p><strong>Sender:</strong> {selectedMail.sender}</p>
                    <p><strong>Subject:</strong> {selectedMail.subject}</p>
                    <p><strong>Message:</strong></p>
                    <div
                      className="border p-3"
                      dangerouslySetInnerHTML={{ __html: selectedMail.message }}
                    ></div>
                    <p>
                      <strong>Recipients:</strong>{" "}
                      {selectedMail.recipients.length > 3
                        ? selectedMail.recipients.slice(0, 3).join(", ") + "..."
                        : selectedMail.recipients.join(", ")}
                    </p>
                    <p><strong>Total Recipients:</strong> {selectedMail.totalRecipients}</p>
                    <p><strong>Sent:</strong> {selectedMail.successCount}</p>
                    <p><strong>Failed:</strong> {selectedMail.failedCount}</p>
                    <p><strong>Remaining:</strong> {selectedMail.totalRecipients - selectedMail.successCount - selectedMail.failedCount}</p> {/* Fixed remaining count */}
                    <p><strong>Status:</strong> {selectedMail.status.toUpperCase()}</p>

                    {selectedMail.attachment && (
                      <p>
                        <strong>Attachment:</strong>{" "}
                        <a href={selectedMail.attachment} target="_blank" rel="noopener noreferrer">
                          View Attachment
                        </a>
                      </p>
                    )}

                    {selectedMail.errorMessage && (
                      <p className="text-danger"><strong>Error:</strong> {selectedMail.errorMessage}</p>
                    )}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
