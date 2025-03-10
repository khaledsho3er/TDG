import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://tdg-db.onrender.com/api/tags"; // Change to your actual API URL
const categories = [
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
  const [newTag, setNewTag] = useState({ name: "", category: categories[0] });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get(API_URL);
      setTags(response.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleAddTag = async () => {
    if (!newTag.name.trim()) return;
    try {
      const response = await axios.post(API_URL, newTag);
      setTags([...tags, response.data]);
      setNewTag({ name: "", category: categories[0] });
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };

  const handleEditTag = async (id, updatedTag) => {
    try {
      await axios.put(`${API_URL}/${id}`, updatedTag);
      setTags(tags.map((tag) => (tag._id === id ? updatedTag : tag)));
    } catch (error) {
      console.error("Error updating tag:", error);
    }
  };

  const handleDeleteTag = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTags(tags.filter((tag) => tag._id !== id));
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  return (
    <div>
      <h2>Manage Tags</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => (
            <tr key={tag._id}>
              <td>{tag._id}</td>
              <td>
                <input
                  type="text"
                  value={tag.name}
                  onChange={(e) =>
                    handleEditTag(tag._id, { ...tag, name: e.target.value })
                  }
                />
              </td>
              <td>
                <select
                  value={tag.category}
                  onChange={(e) =>
                    handleEditTag(tag._id, { ...tag, category: e.target.value })
                  }
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button onClick={() => handleDeleteTag(tag._id)}>Delete</button>
              </td>
            </tr>
          ))}
          <tr>
            <td>New</td>
            <td>
              <input
                type="text"
                value={newTag.name}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
              />
            </td>
            <td>
              <select
                value={newTag.category}
                onChange={(e) =>
                  setNewTag({ ...newTag, category: e.target.value })
                }
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <button onClick={handleAddTag}>Add</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TagsTable;
