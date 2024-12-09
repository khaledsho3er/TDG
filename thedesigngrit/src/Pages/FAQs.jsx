import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import NavBar from "../Components/navBar";
import Footer from "../Components/Footer";
function FAQs() {
  const [activeTab, setActiveTab] = useState("popular");
  const [activeIndex, setActiveIndex] = useState(null);
  const [questions, setQuestions] = useState({
    popularQuestions: [],
    allQuestions: [],
  });

  // Fetch questions data
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/json/faqs.json"); // Path to your JSON file
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  // Determine which questions to show based on the active tab
  const displayedQuestions =
    activeTab === "popular"
      ? questions.popularQuestions
      : questions.allQuestions;

  const toggleAnswer = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };
  return (
    <Box className="job-Page">
      <NavBar />
      <Box className="hero-job-container-faq">
        <Box className="hero-text-faq">
          <h1 className="hero-title-faq">FAQ</h1>
          <p className="hero-subtitle-faq">
            Your go-to resource for everything you need to know about shopping,
            shipping, and more at The Design Grit (TDG).
          </p>
        </Box>
      </Box>
      <div className="faq-container">
        {/* Tabs */}
        <div className="faq-tabs">
          <button
            className={`faq-tab ${activeTab === "popular" ? "active" : ""}`}
            onClick={() => setActiveTab("popular")}
          >
            Popular QA
          </button>
          <button
            className={`faq-tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            ALL Questions
          </button>
        </div>

        {/* Questions */}
        <div className="faq-content">
          {displayedQuestions.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
              onClick={() => toggleAnswer(index)}
            >
              <div className="faq-question">
                {item.question}
                <span className="faq-toggle-icon">
                  {activeIndex === index ? "-" : "+"}
                </span>
              </div>
              {activeIndex === index && (
                <div className="faq-answer">{item.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </Box>
  );
}
export default FAQs;