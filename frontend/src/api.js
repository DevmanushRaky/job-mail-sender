import axios from "axios";

import io from "socket.io-client"; // Import Socket.io client
// //  Development API Links 
const BACKEND_URL="http://localhost:5000/"
const HR_API_URL = "http://localhost:5000/api/v1/hr-emails"; 
const USER_API_URL = "http://localhost:5000/api/v1/user-emails"; 



export const socket = io(BACKEND_URL); // Connect to backend socket


// -------------------------
// HR MAIL
// -------------------------

// ✅ Fetch all HR emails
export const getAllEmails = async () => {
  const response = await axios.get(`${HR_API_URL}/all`);
  return response.data;
};

// ✅ Add HR Email
export const addHREmail = async (hrData) => {
  await axios.post(`${HR_API_URL}/add`, hrData);
};

// ✅ Update HR Email
export const updateHREmail = async (id, updatedData) => {
  await axios.put(`${HR_API_URL}/update/${id}`, updatedData);
};

// ✅ Delete HR Email
export const deleteEmail = async (id) => {
  await axios.delete(`${HR_API_URL}/delete/${id}`);
};

// ✅ Delete All HR Emails
export const deleteAllEmails = async () => {
  await axios.delete(`${HR_API_URL}/delete-all`);
};

// ✅ Add Bulk HR Emails
export const bulkHREmail = async (emails) => {
  try {
    const response = await axios.post(`${HR_API_URL}/bulk-add`, {
       emails 
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding emails:", error);
    throw error;
  }
};

// -------------------------
//  User mail 
// -------------------------



// 📌 Send Mail API
export const sendApplication = async (formData) => {
  console.log("form data:", formData)
  try {
    const response = await axios.post(`${USER_API_URL}/send`, formData, {
      headers: { "Content-Type": "multipart/form-data" }, // Required for file upload
    });
console.log(response)
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || "Error sending mail" };
  }
};

// 📌 Get All Mails
export const getAllMails = async () => {
  try {
    const response = await axios.get(USER_API_URL);
    return response.data;
  } catch (error) {
    console.log("Error :", error)
    return { success: false, error: "Failed to fetch emails."};
  }
};

// 📌 Get Single Mail by ID
export const getMailById = async (id) => {
  try {
    const response = await axios.get(`${USER_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error :", error)
    return { success: false, error: "Mail not found." };
  }
};

// 📌 Delete Mail
export const deleteMail = async (id) => {
  try {
    const response = await axios.delete(`${USER_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error :", error)
    return { success: false, error: "Failed to delete mail." };
  }
};


