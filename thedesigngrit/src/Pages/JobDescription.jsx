import React, { useState, useEffect } from "react";
import NavBar from "../Components/navBar";
import ApplicationForm from "../Components/JobDesc/jobForm";
import { Box } from "@mui/material";
import Footer from "../Components/Footer";
import { useParams } from "react-router-dom";
import LoadingScreen from "./loadingScreen";

function JobDesc() {
  const [jobDetails, setJobDetails] = useState(null); // Initialize as null to show loading state
  const { jobId } = useParams(); // Get jobId from the URL
  const [loading, setLoading] = useState(true); // Initialize as true to show loading state

  useEffect(() => {
    const getJobDetails = async () => {
      try {
        console.log("Fetching job details for jobId:", jobId); // Debug log to see the jobId
        const response = await fetch(
          `https://tdg-db.onrender.com/api/jobdesc/${jobId}`
        );

        if (!response.ok) {
          // Handle non-OK responses (e.g., 404 or 500)
          throw new Error("Failed to fetch job details");
        }

        const data = await response.json();
        console.log("Fetched job details:", data); // Debug log to see the fetched data
        setJobDetails(data); // Set job details to state
      } catch (error) {
        console.error("Error fetching job details:", error); // Log any errors
        setJobDetails(null); // Set to null if there's an error
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 5000);
      }
    };

    if (jobId) {
      getJobDetails(); // Fetch job details only if jobId is available
    }
  }, [jobId]);

  if (loading) {
    return <LoadingScreen />;
  }
  // Show loading message while job details are being fetched
  if (jobDetails === null) {
    return <LoadingScreen />;
  }

  // Check if jobDetails is an empty object or has invalid properties
  if (!jobDetails || Object.keys(jobDetails).length === 0) {
    return <div>Error: Job not found</div>;
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
          <h2>{jobDetails.jobTitle || "Software Engineer"}</h2>
          <p>{jobDetails.department || "IT"}</p>
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
