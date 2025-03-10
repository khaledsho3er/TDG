import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
} from "@mui/material";

const TagsTable = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchTags();
    fetchCategories();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get("https://tdg-db.onrender.com/api/tags");
      setTags(response.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://tdg-db.onrender.com/api/categories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleEditClick = (tag) => {
    setSelectedTag(tag);
    setSelectedCategory(tag.category || "");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTag(null);
  };

  return (
    <div style={{ padding: "70px" }}>
      <section className="dashboard-lists-vendor">
        <div className="recent-orders-vendor">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2 style={{ color: "#2d2d2d", textAlign: "left" }}>Tags List</h2>
            <table>
              <thead style={{ backgroundColor: "#f2f2f2", color: "#2d2d2d" }}>
                <tr>
                  <th>Id</th>
                  <th>Tag Name</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              {loading ? (
                <tbody>
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center" }}>
                      <CircularProgress style={{ color: "#6b7b58" }} />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {tags.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ textAlign: "center" }}>
                        No tags found
                      </td>
                    </tr>
                  ) : (
                    tags.map((tag) => (
                      <tr key={tag._id}>
                        <td>{tag.id}</td>
                        <td>{tag.name}</td>
                        <td>{tag.category || "Uncategorized"}</td>
                        <td>
                          <button
                            onClick={() => handleEditClick(tag)}
                            style={{
                              color: "#e3e3e3",
                              backgroundColor: "#6a8452",
                            }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              )}
            </table>
          </Box>
        </div>
      </section>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Tag</DialogTitle>
        <DialogContent>
          <p>Tag Name: {selectedTag?.name}</p>
          <label>Category:</label>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            fullWidth
          >
            {categories.map((category) => (
              <MenuItem key={category._id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TagsTable;
