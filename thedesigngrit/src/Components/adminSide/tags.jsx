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
  TextField,
} from "@mui/material";
import { CiCirclePlus } from "react-icons/ci";

const TAG_CATEGORIES = [
  "Color",
  "Style",
  "Material",
  "Finish",
  "Size",
  "Shape",
  "Functionality",
];

const TagsTable = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [tagName, setTagName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get(
        "https://api.thedesigngrit.com/api/tags"
      );
      setTags(response.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (tag) => {
    setSelectedTag(tag);
    setSelectedCategory(tag.category);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTag(null);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setTagName("");
    setSelectedCategory("");
  };

  const handleSaveTag = async () => {
    if (!tagName || !selectedCategory) {
      alert("Please enter a tag name and select a category.");
      return;
    }

    try {
      await axios.post("https://api.thedesigngrit.com/api/tags", {
        name: tagName,
        category: selectedCategory,
      });
      fetchTags();
      handleCloseAddDialog();
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };

  return (
    <div>
      <header className="dashboard-header-vendor">
        <div className="dashboard-header-title">
          <h2>Tags</h2>
          <p>Home &gt; Tags</p>
        </div>
        <div className="dashboard-date-vendor">
          <button
            onClick={() => setOpenAddDialog(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              backgroundColor: "#2d2d2d",
              color: "white",
              padding: "15px 15px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            <CiCirclePlus /> Add Tag
          </button>
        </div>
      </header>

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
                        <td>{tag.category}</td>
                        <td
                          style={{
                            display: "flex",
                            gap: "10px",
                            flexDirection: "row",
                          }}
                        >
                          <button
                            onClick={() => handleEditClick(tag)}
                            style={{
                              color: "#e3e3e3",
                              backgroundColor: "#6a8452",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleEditClick(tag)}
                            style={{
                              color: "#e3e3e3",
                              backgroundColor: "#6a8452",
                            }}
                          >
                            Delete
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

      {/* Add Tag Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Add New Tag</DialogTitle>
        <DialogContent>
          <TextField
            label="Tag Name"
            fullWidth
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            margin="dense"
          />
          <label style={{ display: "block", marginTop: "10px" }}>
            Category:
          </label>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            fullWidth
          >
            {TAG_CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveTag} color="primary">
            Add{" "}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Tag</DialogTitle>
        <DialogContent>
          <label style={{ display: "block" }}>Tag Name:</label>
          <TextField
            label="Tag Name"
            fullWidth
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            margin="dense"
          />
          <label style={{ display: "block", marginTop: "10px" }}>
            Category:
          </label>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            fullWidth
          >
            {TAG_CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button color="primary">Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TagsTable;
