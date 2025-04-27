import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingScreen from "../../Pages/loadingScreen";

const CareerOpportunities = () => {
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("Top Positions");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getJobs = async () => {
      try {
        const response = await fetch(
          "https://api.thedesigngrit.com/api/jobdesc"
        ); // Update this URL as needed
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching job data:", error);
        setJobs([]); // Ensure you handle errors and set jobs to an empty array on failure
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 4000);
      }
    };
    getJobs();
  }, []);
  if (loading) {
    return <LoadingScreen />;
  }
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // Filter or adjust logic for 'Top Positions' or 'All Jobs' as needed
  };

  return (
    <div className="career-container">
      <div className="career-tabs">
        <button
          className={`tab ${activeTab === "Top Positions" ? "active" : ""}`}
          onClick={() => handleTabClick("Top Positions")}
        >
          All Jobs
        </button>
        {/* <button
          className={`tab ${activeTab === "All Jobs" ? "active" : ""}`}
          onClick={() => handleTabClick("All Jobs")}
        >
          All Jobs
        </button> */}
      </div>

      <div className="job-list">
        {jobs.map((job, index) => (
          <Link
            to={`/jobdesc/${job._id}`} // Use the job's _id for the URL to view the detailed job
            key={index}
            className="job-card"
            style={{ textDecoration: "none" }}
          >
            <div className="job-card">
              <h3 className="job-title">{job.jobTitle}</h3>
              <div className="job-tags">
                {/* Displaying tags based on department or type if needed */}
                <span className="job-tag">{job.department}</span>
                <span className="job-tag">{job.type}</span>
              </div>
              <p className="job-description">{job.description}</p>
              <p className="job-location">{job.location}</p>
              <p className="job-date">
                {new Date(job.createdAt).toLocaleDateString()}
              </p>{" "}
              {/* Display the job post date */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CareerOpportunities;
