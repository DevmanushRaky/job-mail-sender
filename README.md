# Job Mail Sender

## 📌 About the Project
Job Mail Sender is a powerful and easy-to-use platform that allows job seekers to send bulk job applications to HR contacts with minimal effort. It provides real-time email tracking, a rich-text editor, and status updates to enhance the job application process.

## 🚀 Features
- Bulk email sending with real-time updates
- Rich text formatting for email messages
- PDF attachment support
- Secure authentication (email & app password)
- Email status tracking (sent, failed, stopped)
- Stop button to halt the process anytime
- Mail log to review sent applications log only

## 🏗 Tech Stack
**Frontend:** React (Vite), Bootstrap (via CDN), Redux, Socket.io
**Backend:** Node.js, Express, MongoDB
**Server:** Deployed on AWS with Nginx

**AWS hosted :**http://13.235.82.106:5000/** 

## 🛠 Installation Guide
Follow these steps to set up and run this project on your local machine:

### 1️⃣ Clone the Repository
```sh
  git clone https://github.com/your-username/job-mail-sender.git
  cd job-mail-sender
```

### 2️⃣ Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ````
4. Start the backend server:
   ```sh
   npm start
   ```

### 3️⃣ Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React development server:
   ```sh
   npm run dev
   ```

### 4️⃣ Access the App
Once both servers are running:
- Open **http://localhost:5173/** in your browser.
- Login and start sending applications!

## 📜 Environment Variables
- Ensure you configure your `.env` files correctly for both backend and frontend to avoid issues.

## 📝 Usage Instructions
1. Upload your HR email list.
2. Enter your email credentials (email & app password).
3. Write your cover letter using the rich-text editor.
4. Attach a PDF resume (if needed).
5. Click **Send** and track real-time updates.

## ❓ FAQ
**Q: Is my email password stored?**
A: No, we only use it for sending applications and do not store it.

**Q: Can I stop sending emails midway?**
A: Yes! Just click the **Stop Sending** button.

**Q: What happens if an email fails?**
A: The system logs the failure, and you can retry sending.

## 📌 Contributing
Want to improve this project? Feel free to fork the repo and submit a PR!


## 🌟 Show Your Support
If you like this project, please ⭐ the repository!

