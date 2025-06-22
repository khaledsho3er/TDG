import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import NavBar from "../Components/navBar";
import Footer from "../Components/Footer";
import { Helmet } from "react-helmet-async";

function FAQs() {
  const [activeTab, setActiveTab] = useState("popular");
  const [activeIndex, setActiveIndex] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("https://api.thedesigngrit.com/api/faqs/");
        if (!response.ok) {
          throw new Error("Failed to fetch FAQs");
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };

    fetchQuestions();
  }, []);

  const toggleAnswer = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <Box className="job-Page">
      <Helmet>
        <title>Frequently Asked Questions (FAQs) | TheDesignGrit</title>
        <meta
          name="description"
          content="Find answers to common questions about TheDesignGrit. Learn about shopping, shipping, returns, and more in our FAQ section."
        />
        <meta
          name="keywords"
          content="TheDesignGrit FAQs, customer support, furniture delivery, shopping guide, returns policy"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://thedesigngrit.com/faqs" />

        {/* Open Graph */}
        <meta property="og:title" content="FAQs | TheDesignGrit" />
        <meta
          property="og:description"
          content="Need help? Explore frequently asked questions about orders, returns, and shopping at TheDesignGrit."
        />
        <meta property="og:url" content="https://thedesigngrit.com/faqs" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://thedesigngrit.com/Assets/faq-cover.webp"
        />

        {/* Twitter Card (optional) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FAQs | TheDesignGrit" />
        <meta
          name="twitter:description"
          content="Explore frequently asked questions about orders, returns, and more at TheDesignGrit."
        />
        <meta
          name="twitter:image"
          content="https://thedesigngrit.com/Assets/faq-cover.webp"
        />
      </Helmet>

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
          {questions.map((item, index) => (
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
