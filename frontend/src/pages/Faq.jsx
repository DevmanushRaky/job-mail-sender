import { FaQuestionCircle } from "react-icons/fa";
import { FaqAccordion } from "./FaqAccordion";

// FAQ Component
export const Faq = () => {
  const faqData = [
    {
      question: "How does this platform work?",
      answer:
        "You can fill in your details, enter your email ID, app password, subject, message, attach files, and send applications in bulk to HR contacts with real-time updates.",
    },
    {
      question: "Is my email password secure?",
      answer:
        "Yes, we only use your email to send applications. Your mail credentials are not stored on our servers.",
    },
    {
      question: "Can I stop the email process once started?",
      answer:
        "Yes! There is a 'Stop Sending' button to halt the process at any time.",
    },
    {
      question: "What file types can I attach?",
      answer: "Currently, only PDF files are supported.",
    },
    {
      question: "How many emails can I send at once?",
      answer:
        "There is no hard limit, but to avoid spam detection, emails are sent with a **40-second delay** between each one.",
    },
    {
      question: "Can I track which emails were successfully sent?",
      answer:
        "Yes! The platform provides a **mail log** where you can check the status of each sent application, including success and failure counts.",
    },
    {
      question: "What happens if an email fails to send?",
      answer:
        "If an email fails, it will be logged in the **Mail Log** section. The failure may be due to an invalid email address, incorrect app password, or server restrictions.",
    },
    {
      question: "Can I edit my email before sending it?",
      answer:
        "Yes! The platform includes a **rich text editor** where you can format your cover letter, apply bold, italic, underline styles, and adjust text alignment.",
    },
    {
      question: "Is there a way to personalize each email?",
      answer:
        "Currently, the emails are sent as bulk messages with the same content. However, you can manually adjust the message before sending.",
    },
    {
      question: "Do I need a specific email provider to use this platform?",
      answer:
        "No, you can use any email provider that supports **app passwords** (e.g., Gmail, Outlook, Yahoo). Ensure that you enable 'Less Secure Apps' or use an app password.",
    },
    {
      question: "Can I use my work email to send applications?",
      answer:
        "Yes, but it depends on your organization's email policies. Some corporate email providers may block bulk sending.",
    },
    {
      question: "How do I get an app password for my email?",
      answer:
        "For Gmail, go to your Google Account settings > Security > App Passwords and generate one. For other providers, check their support pages.",
    },
    {
      question: "Will my emails go to spam?",
      answer:
        "To reduce spam risk, we recommend using a professional email address, writing personalized messages, and avoiding excessive attachments.",
    },
  ];

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card shadow-lg p-4 border-0 rounded">
            <h2 className="text-center fw-bold text-primary">
              <FaQuestionCircle className="me-2" /> Frequently Asked Questions
            </h2>
            <FaqAccordion faqs={faqData} />
          </div>
        </div>
      </div>
    </div>
  );
};
