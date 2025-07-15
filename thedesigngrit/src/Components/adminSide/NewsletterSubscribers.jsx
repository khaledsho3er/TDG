import React, { useState, useEffect } from "react";
import { Box, CircularProgress, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UnsubscribeIcon from "@mui/icons-material/Unsubscribe";
import axios from "axios";

const API_BASE = "https://api.thedesigngrit.com/api/newsletter";

const NewsletterSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(""); // id of row being acted on
  const subscribersPerPage = 8;

  const fetchSubscribers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_BASE + "/");
      setSubscribers(res.data);
    } catch (err) {
      setError("Failed to fetch subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleUnsubscribe = async (id) => {
    setActionLoading(id + "-unsubscribe");
    try {
      await axios.patch(`${API_BASE}/unsubscribe/${id}`);
      setSubscribers((prev) =>
        prev.map((s) => (s._id === id ? { ...s, subscribed: false } : s))
      );
    } catch (err) {
      alert("Failed to unsubscribe");
    } finally {
      setActionLoading("");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subscriber?"))
      return;
    setActionLoading(id + "-delete");
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setSubscribers((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert("Failed to delete subscriber");
    } finally {
      setActionLoading("");
    }
  };

  const indexOfLastSubscriber = currentPage * subscribersPerPage;
  const indexOfFirstSubscriber = indexOfLastSubscriber - subscribersPerPage;
  const currentSubscribers = subscribers.slice(
    indexOfFirstSubscriber,
    indexOfLastSubscriber
  );
  const totalPages = Math.ceil(subscribers.length / subscribersPerPage);

  return (
    <div className="dashboard-vendor">
      <header className="dashboard-header-vendor">
        <div className="dashboard-header-title">
          <h2>Newsletter Subscribers</h2>
          <p>Home &gt; Newsletter Subscribers</p>
        </div>
      </header>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          gap: "20px",
          marginBottom: "1rem",
        }}
      >
        {/* Add future filters here if needed */}
      </Box>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
          }}
        >
          <CircularProgress size={60} thickness={4} sx={{ color: "#6b7b58" }} />
        </Box>
      ) : error ? (
        <Box sx={{ color: "red", textAlign: "center", minHeight: "300px" }}>
          {error}
        </Box>
      ) : (
        <div className="recent-purchases">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <h2>Subscribers List</h2>
          </Box>
          <hr />
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Subscribed</th>
                <th>Subscribed At</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentSubscribers.map((subscriber) => (
                <tr key={subscriber._id}>
                  <td>{subscriber.email}</td>
                  <td>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        borderRadius: "5px",
                        backgroundColor: subscriber.subscribed
                          ? "#d4edda"
                          : "#f8d7da",
                        color: subscriber.subscribed ? "#155724" : "#721c24",
                        fontWeight: "500",
                        textAlign: "center",
                        minWidth: "80px",
                      }}
                    >
                      {subscriber.subscribed ? "Subscribed" : "Unsubscribed"}
                    </span>
                  </td>
                  <td>
                    {subscriber.subscribedAt
                      ? new Date(subscriber.subscribedAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    {subscriber.createdAt
                      ? new Date(subscriber.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <IconButton
                      aria-label="unsubscribe"
                      title="Unsubscribe"
                      disabled={
                        !subscriber.subscribed ||
                        actionLoading === subscriber._id + "-unsubscribe"
                      }
                      onClick={() => handleUnsubscribe(subscriber._id)}
                      size="small"
                    >
                      {actionLoading === subscriber._id + "-unsubscribe" ? (
                        <CircularProgress size={18} />
                      ) : (
                        <UnsubscribeIcon
                          color={subscriber.subscribed ? "warning" : "disabled"}
                        />
                      )}
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      title="Delete"
                      disabled={actionLoading === subscriber._id + "-delete"}
                      onClick={() => handleDelete(subscriber._id)}
                      size="small"
                    >
                      {actionLoading === subscriber._id + "-delete" ? (
                        <CircularProgress size={18} />
                      ) : (
                        <DeleteIcon color="error" />
                      )}
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => setCurrentPage(index + 1)}
            disabled={loading}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NewsletterSubscribers;
