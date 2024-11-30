import React from "react";
import NavBar from "../Components/navBar";
import ApplicationForm from "../Components/JobDesc/jobForm";
import { Box } from "@mui/material";
import Footer from "../Components/Footer";
function JobDesc() {
  return (
    <Box className="job-Page">
      <NavBar />
      <div className="hero-job-container">
        <div className="hero-text">
          <h1 className="hero-title">Job Description</h1>
          <p className="hero-subtitle">Come Join us , Build the future</p>
        </div>
      </div>
      <Box className="Description">
        <Box className="description-title">
          <h2>Product Manager</h2>
          <p>Business Development</p>
          <p>Cairo, EG</p>
        </Box>
        <Box className="description-content">
          <Box className="description-content-1">
            <h2>Job Description</h2>
            <p>
              At The Design Grit (TDG), we’re revolutionizing the e-commerce
              furniture market by connecting customers with premium products
              from multiple vendors. We’re seeking a passionate and strategic
              Product Manager to join our team and help shape the future of
              online furniture shopping.
            </p>
          </Box>
          <Box className="description-content-1">
            <h2>Responsibilities</h2>
            <p>
              <ul>
                <li>
                  Define and own the product vision, strategy, and roadmap in
                  alignment with company goals.
                </li>
                <li>
                  Work closely with design, engineering, marketing, and vendor
                  teams to create seamless and user-friendly experiences.
                </li>
                <li>
                  Conduct research to understand customer needs, market trends,
                  and competitor strategies to guide product development.
                </li>
                <li>
                  Translate business goals into detailed feature requirements
                  and user stories, ensuring clear communication with
                  development teams.
                </li>
                <li>
                  Use analytics and customer feedback to prioritize features and
                  measure product success.
                </li>
                <li>
                  Ensure timely delivery of product updates, manage project
                  timelines, and communicate progress to stakeholders.
                </li>
                <li>
                  Optimize the platform for smooth onboarding and management of
                  furniture vendors.
                </li>
              </ul>
            </p>
          </Box>
          <Box className="description-content-1">
            <h2>Requirements</h2>
            <p>
              <ul>
                <li>
                  <strong>Experience: </strong>3+ years of product management
                  experience, preferably in e-commerce or a similar field.
                </li>
                <li>
                  <strong> Education:</strong> Bachelor’s degree in business,
                  computer science, or a related field.
                </li>
                <li>
                  <strong> Skills: </strong>Strong analytical and
                  problem-solving skills.
                </li>
                <li>
                  Excellent communication and stakeholder management abilities.
                </li>
                <li>
                  Proficiency in project management tools and data analytics
                  platforms.
                </li>
                <li>
                  Experience with Agile methodologies and product lifecycle
                  management.
                </li>
                <li>
                  <strong> Bonus:</strong> Experience working with vendor-driven
                  marketplaces or knowledge of the furniture industry.
                </li>
              </ul>
            </p>
          </Box>
          <Box className="description-content-1">
            <h2>What we offer </h2>
            <p>
              <ul>
                <li>Competitive salary and performance-based bonuses.</li>
                <li>
                  Flexible working options, including remote and hybrid setups.
                </li>
                <li>
                  A collaborative, innovative, and supportive work environment.
                </li>
                <li>
                  Opportunities for career growth and professional development.
                </li>
                <li>
                  Exclusive employee discounts on premium furniture and home
                  décor.
                </li>
                <li>Comprehensive health insurance and wellness programs.</li>
                <li>
                  Paid time off to recharge and pursue personal interests.
                </li>
              </ul>
            </p>
          </Box>
        </Box>
        <ApplicationForm />
      </Box>
      <Footer />
    </Box>
  );
}
export default JobDesc;
