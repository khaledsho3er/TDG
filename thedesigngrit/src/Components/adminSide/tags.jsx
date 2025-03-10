import { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

const categories = [
  "Color",
  "Style",
  "Material",
  "Finish",
  "Size",
  "Shape",
  "Functionality/Special Features",
];

const TagsTable = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState({ name: "", category: categories[0] });
  const [editingTag, setEditingTag] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  // Fetch all tags
  const fetchTags = async () => {
    try {
      const response = await axios.get("https://tdg-db.onrender.com/api/tags");
      setTags(response.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  // Add a new tag
  const handleAddTag = async () => {
    if (!newTag.name.trim()) return;
    try {
      const response = await axios.post(
        "https://tdg-db.onrender.com/api/tags",
        newTag
      );
      setTags([...tags, response.data]);
      setNewTag({ name: "", category: categories[0] });
      setOpenDialog(false);
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };

  // Edit a tag
  const handleEditTag = async (_id, updatedTag) => {
    try {
      await axios.put(`/api/tags/${_id}`, updatedTag);
      setTags(tags.map((tag) => (tag._id === _id ? updatedTag : tag)));
      setEditingTag(null);
    } catch (error) {
      console.error("Error updating tag:", error);
    }
  };

  // Delete a tag
  const handleDeleteTag = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this tag?")) return;
    try {
      await axios.delete(`https://tdg-db.onrender.com/api/tags/${_id}`);
      setTags(tags.filter((tag) => tag._id !== _id));
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  return (
    <div>
      <h2>Tags Management</h2>

      {/* Table */}
      <table border="1" w_idth="100%">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => (
            <tr key={tag._id}>
              <td>{tag.id}</td>
              <td>
                {editingTag === tag._id ? (
                  <TextField
                    value={tag.name}
                    onChange={(e) =>
                      setTags(
                        tags.map((t) =>
                          t._id === tag._id ? { ...t, name: e.target.value } : t
                        )
                      )
                    }
                    variant="outlined"
                    size="small"
                  />
                ) : (
                  tag.name
                )}
              </td>
              <td>
                {editingTag === tag._id ? (
                  <Select
                    value={tag.category}
                    onChange={(e) =>
                      setTags(
                        tags.map((t) =>
                          t._id === tag._id
                            ? { ...t, category: e.target.value }
                            : t
                        )
                      )
                    }
                    size="small"
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  tag.category
                )}
              </td>
              <td>
                {editingTag === tag._id ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditTag(tag._id, tag)}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setEditingTag(tag._id)}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteTag(tag._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Tag Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenDialog(true)}
        style={{ marginTop: "10px" }}
      >
        Add New Tag
      </Button>

      {/* Dialog for Adding New Tag */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Tag</DialogTitle>
        <DialogContent>
          <TextField
            label="Tag Name"
            value={newTag.name}
            onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
            fullW_idth
            margin="normal"
          />
          <Select
            value={newTag.category}
            onChange={(e) => setNewTag({ ...newTag, category: e.target.value })}
            fullW_idth
            margin="normal"
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddTag} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TagsTable;
