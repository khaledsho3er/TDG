import React, { useState, useEffect } from "react";
import { useVendor } from "../../utils/vendorContext";
import { Box } from "@mui/material";
import axios from "axios";
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaTiktok,
  FaGlobe,
} from "react-icons/fa";

const BrandSignup = () => {
  const { vendor } = useVendor();
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [types, setTypes] = useState([]);

  const platformIcons = {
    instagramURL: (
      <FaInstagram style={{ marginRight: "10px", color: "black" }} />
    ),
    facebookURL: <FaFacebook style={{ marginRight: "10px", color: "black" }} />,
    linkedinURL: <FaLinkedin style={{ marginRight: "10px", color: "black" }} />,
    tiktokURL: <FaTiktok style={{ marginRight: "10px", color: "black" }} />,
    websiteURL: <FaGlobe style={{ marginRight: "10px", color: "black" }} />,
  };

  useEffect(() => {
    fetchTypes();
    if (vendor?.brandId) fetchBrandData(vendor.brandId);
  }, [vendor]);

  const fetchTypes = async () => {
    try {
      const { data } = await axios.get(
        "https://tdg-db.onrender.com/api/types/getAll"
      );
      setTypes(data);
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const fetchBrandData = async (brandId) => {
    try {
      const { data } = await axios.get(
        `https://tdg-db.onrender.com/api/brand/${brandId}`
      );
      setFormData(data);
      setOriginalData(data);
    } catch (error) {
      console.error("Error fetching brand data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "types") {
      setFormData((prev) => ({ ...prev, types: [value] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "types" && Array.isArray(value)) {
          dataToSend.append("types", value[0] || "");
        } else {
          dataToSend.append(key, value);
        }
      });

      const { data } = await axios.put(
        `https://tdg-db.onrender.com/api/brand/${vendor.brandId}`,
        dataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setOriginalData(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating brand data:", error);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return { backgroundColor: "#FAD5A5", color: "#FF5F1F" };
      case "active":
        return { backgroundColor: "#def9bf", color: "#6b7b58" };
      case "deactivated":
        return { backgroundColor: "red", color: "white" };
      default:
        return {};
    }
  };

  return (
    <div className="brand-signup-form">
      <div className="brand-header">
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <div className="status paid" style={getStatusStyle(formData.status)}>
            {formData.status || "Status not set"}
          </div>
        </Box>

        <Box>
          <h2>{formData.brandName || "Brand Information"}</h2>
          <div className="brand-logo">
            {formData.brandlogo ? (
              <img
                src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${formData.brandlogo}`}
                alt="Brand Logo"
                width="150"
              />
            ) : (
              <p>No brand logo available</p>
            )}
          </div>
        </Box>
      </div>

      <div className="brand-info">
        {Object.entries(formData)
          .filter(
            ([key]) =>
              ![
                "_id",
                "createdAt",
                "updatedAt",
                "__v",
                "coverPhoto",
                "digitalCopiesLogo",
                "status",
                "brandlogo",
                "catalogues",
                "documents",
              ].includes(key)
          )
          .map(([key, value]) => (
            <div className="form-field" key={key}>
              <label>{key.replace(/([A-Z])/g, " $1")}</label>
              {key.endsWith("URL") ? (
                isEditing ? (
                  <input
                    type="text"
                    name={key}
                    value={value || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="display-content">
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "blue", textDecoration: "underline" }}
                    >
                      {platformIcons[key]} {value || "No URL provided"}
                    </a>
                  </div>
                )
              ) : key === "types" ? (
                isEditing ? (
                  <select
                    name="types"
                    value={formData.types?.[0] || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Type</option>
                    {types.map((type) => (
                      <option key={type._id} value={type._id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p>
                    {types.find((t) => t._id === formData.types?.[0])?.name ||
                      "Not Selected"}
                  </p>
                )
              ) : isEditing ? (
                <input
                  type="text"
                  name={key}
                  value={value || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{value || "N/A"}</p>
              )}
            </div>
          ))}
      </div>

      <div className="button-group">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="btn-save">
              Save
            </button>
            <button onClick={handleCancel} className="btn-cancel">
              Cancel
            </button>
          </>
        ) : (
          <button onClick={handleEdit} className="btn-edit">
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default BrandSignup;
