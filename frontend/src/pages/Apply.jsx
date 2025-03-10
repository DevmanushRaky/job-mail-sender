/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendApplication, socket as backendSocket } from "../api";
import { updateProgress, decrementRemainingTime, stopProcess, startSending } from "../redux/emailSlice";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ToolbarPlugin } from "./ToolbarPlugin";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const socket = backendSocket; // Connect to backend socket

export const Apply = () => {
  const dispatch = useDispatch();

  // 🔥 Redux state now persists when changing routes
  const { isSending, showStatus, showStopButton, totalEmails, sentCount, failedCount, statusMessage, remainingTime } =
    useSelector((state) => state.email);

  const [userEmail, setUserEmail] = useState("");
  const [appPassword, setAppPassword] = useState("")
  const [subject, setSubject] = useState("");
  const [editorState, setEditorState] = useState("");
  const [attachment, setAttachment] = useState(null);

  useEffect(() => {
    socket.on("progress", (data) => {
      console.log("📡 Received socket data:", data);
      toast.info(data.message);
      dispatch(updateProgress(data));
    });

    return () => {
      socket.off("progress");
    };
  }, [dispatch]);

  // Countdown Timer for Remaining Time
  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        dispatch(decrementRemainingTime());
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [remainingTime, dispatch]);


  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      toast.error("❌ Only PDF attachments are allowed!");
      return;
    }
    setAttachment(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail.trim() || !appPassword.trim() || !subject.trim() || !editorState.trim() || !attachment) {
      toast.warning("⚠️ Please fill in all required fields.");
      return;
    }

    dispatch(startSending()); // 🔥 This state will now persist

    const formData = new FormData();
    formData.append("userEmail", userEmail);
    formData.append("appPassword", appPassword);
    formData.append("subject", subject);
    formData.append("message", editorState);
    if (attachment) formData.append("attachment", attachment);

    try {
      const response = await sendApplication(formData);
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.error);
        dispatch(stopProcess());
      }
    } catch (error) {
      toast.error("❌ Error sending application.");
      dispatch(stopProcess());
    }
  };

  const handleStopProcess = () => {
    toast.warning("🚫 Stopping email process...");
    socket.emit("stopMailSending");

    socket.on("progress", (data) => {
      if (data.status === "stopped") {
        dispatch(stopProcess());
      }
    });
  };

  const onChange = (editorState) => {
    editorState.read(() => {
      const htmlContent = document.querySelector(".editor-input").innerHTML;
      setEditorState(htmlContent);
    });
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="container mt-2">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="card shadow-lg p-4 border-0 rounded">
              <h2 className="text-center fw-bold text-primary mb-4">Apply for a Job</h2>
              <p className="text-center text-muted">
                Fill out the details and apply instantly to your dream company.
              </p>

              <form onSubmit={handleSubmit}>
                {/* User Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">📧 Your Email:</label>
                  <input
                    type="userEmail"
                    className="form-control p-2"
                    placeholder="Enter your Gmail address"
                    autoComplete="off"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </div>

                {/* App Password */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">🔑 App Password:</label>
                  <input
                    type="password"
                    className="form-control p-2"
                    placeholder="Enter your Gmail App Password"
                    autoComplete="off"
                    value={appPassword}
                    onChange={(e) => setAppPassword(e.target.value)}
                  />
                  <small className="text-muted">
                    <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer">
                      Generate App Password (Click Here)
                    </a>
                  </small>
                </div>
                {/* Subject */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">📌 Subject:</label>
                  <input
                    type="text"
                    className="form-control p-2"
                    placeholder="Enter job role or subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">✍️ Message:</label>
                  <div className="editor-wrapper border p-2 rounded">
                    <LexicalComposer initialConfig={{ namespace: "MessageEditor", theme: {}, onError: (error) => console.error("error in text lexical", error) }}>
                      <div>
                        <ToolbarPlugin />
                        <RichTextPlugin contentEditable={<ContentEditable className="form-control p-3 editor-input" />} />
                        <OnChangePlugin onChange={onChange} />
                        <HistoryPlugin />
                        <AutoFocusPlugin />
                      </div>
                    </LexicalComposer>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">📎 Attachment (PDF only):</label>
                  <input type="file" className="form-control" accept="application/pdf"  onChange={handleAttachmentChange} />
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-primary btn-lg fw-bold px-4" disabled={isSending}>
                    {isSending ? "⏳ Processing..." : "🚀 Send Application"}
                  </button>
                </div>

                {showStatus && (
                  <div className="mt-4 p-3 border rounded bg-light">
                    <h5 className="text-center text-primary">📊 Email Sending Status</h5>
                    <p><strong>Total HR Emails:</strong> {totalEmails}</p>
                    <p><strong>✅ Successfully Sent:</strong> {sentCount}</p>
                    <p><strong>❌ Failed to Send:</strong> {failedCount}</p>
                    <p><strong>🕒 Estimated Time Left:</strong> {remainingTime}s</p>
                    <p><strong>📢 Status:</strong> {statusMessage}</p>
                  </div>
                )}

                {showStopButton && (
                  <div className="text-center mt-3">
                    <button type="button" className="btn btn-danger fw-bold" onClick={handleStopProcess}>
                      ⏹️ Stop Sending
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
