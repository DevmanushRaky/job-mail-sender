import PropTypes from "prop-types";
import { useState } from "react";

// Reusable FAQ Accordion Component
export const FaqAccordion = ({ faqs }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="accordion mt-4" id="faqAccordion">
      {faqs.map((faq, index) => (
        <div className="accordion-item" key={index}>
          <h2 className="accordion-header">
            <button
              className={`accordion-button ${activeIndex === index ? "" : "collapsed"}`}
              type="button"
              onClick={() => toggleAccordion(index)}
            >
              {faq.question}
            </button>
          </h2>
          <div
            className={`accordion-collapse collapse ${activeIndex === index ? "show" : ""}`}
            data-bs-parent="#faqAccordion"
          >
            <div className="accordion-body">{faq.answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ✅ Add Prop Types Validation
FaqAccordion.propTypes = {
  faqs: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
    })
  ).isRequired,
};

