import React, { useState, useEffect } from "react";
import NavBar from "../Components/navBar";
import ApplicationForm from "../Components/JobDesc/jobForm";
import { Box } from "@mui/material";
import Footer from "../Components/Footer";
import { fetchJobDescriptionData } from "../utils/fetchJobsData"; // Ensure correct import path

function JobDesc() {
  const [jobDetails, setJobDetails] = useState([]); // or use {} instead of null depending on your data structure

  useEffect(() => {
    const getJobDetails = async () => {
      const data = await fetchJobDescriptionData();
      setJobDetails(data); // Assuming `data` is an object or array
    };
    getJobDetails();
  }, []);

  if (!jobDetails) {
    return <div>Loading...</div>; // Display loading state if data isn't available
  }

  return (
    <Box className="job-Page">
      <NavBar />
      <div className="hero-job-container">
        <div className="hero-text">
          <h1 className="hero-title">Job Description</h1>
          <p className="hero-subtitle">Come Join us, Build the future</p>
        </div>
      </div>
      <Box className="Description">
        <Box className="description-title">
          <h2>{jobDetails.title || "Product Manager"}</h2>
          <p>{jobDetails.department || "Business Development"}</p>
          <p>{jobDetails.location || "Cairo, EG"}</p>
        </Box>
        <Box className="description-content">
          <Box className="description-content-1">
            <h2>Job Description</h2>
            <p>{jobDetails.description}</p>
          </Box>
          <Box className="description-content-1">
            <h2>Responsibilities</h2>
            <p>
              <ul>
                {jobDetails.responsibilities?.map((responsibility, index) => (
                  <li key={index}>{responsibility}</li>
                )) || "No responsibilities listed"}
              </ul>
            </p>
          </Box>
          <Box className="description-content-1">
            <h2>Requirements</h2>
            <p>
              <ul>
                {jobDetails.requirements?.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                )) || "No requirements listed"}
              </ul>
            </p>
          </Box>
          <Box className="description-content-1">
            <h2>What we offer</h2>
            <p>
              <ul>
                {jobDetails.whatWeOffer?.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                )) || "No benefits listed"}
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
