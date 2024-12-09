import React, { useState, useEffect } from "react";
import { fetchJobsData } from "../../utils/fetchJobsData";
import { Link } from "react-router-dom";

const CareerOpportunities = () => {
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("Top Positions");

  useEffect(() => {
    const getJobs = async () => {
      const data = await fetchJobsData();
      setJobs(data);
    };
    getJobs();
  }, []);

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
          Top Positions
        </button>
        <button
          className={`tab ${activeTab === "All Jobs" ? "active" : ""}`}
          onClick={() => handleTabClick("All Jobs")}
        >
          All Jobs
        </button>
      </div>
      <div className="job-list">
        {jobs.map((job, index) => (
          <Link
            to={`/job`}
            key={index}
            className="job-card"
            style={{ textDecoration: "none" }}
          >
            <div key={index} className="job-card">
              <h3 className="job-title">{job.title}</h3>
              <div className="job-tags">
                {job.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="job-tag">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="job-description">{job.description}</p>
              <p className="job-date">{job.date}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CareerOpportunities;
