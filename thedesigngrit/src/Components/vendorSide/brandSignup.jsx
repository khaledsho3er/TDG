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
  const [formData, setFormData] = useState({
    brandName: "",
    commercialRegisterNo: "",
    taxNumber: "",
    companyAddress: "",
    phoneNumber: "",
    email: "",
    bankAccountNumber: "",
    websiteURL: "",
    instagramURL: "",
    facebookURL: "",
    linkedinURL: "",
    tiktokURL: "",
    shippingPolicy: "",
    brandlogo: "",
    type: [], // Updated: now an array for multiple selections
    status: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});
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
        "https://api.thedesigngrit.com/api/types/getAll"
      );
      setTypes(data);
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const fetchBrandData = async (brandId) => {
    try {
      const response = await axios.get(
        `https://api.thedesigngrit.com/api/brand/${brandId}`
      );
      setFormData({
        ...response.data,
        type: Array.isArray(response.data.type)
          ? response.data.type
          : [response.data.type].filter(Boolean),
      });
      setOriginalData(response.data);
    } catch (error) {
      console.error("Error fetching brand data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value
    );
    setFormData((prev) => ({ ...prev, type: selectedOptions }));
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setFormData({
      ...originalData,
      type: Array.isArray(originalData.type)
        ? originalData.type
        : [originalData.type].filter(Boolean),
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "type") {
          formData.type.forEach((item) => dataToSend.append("type", item)); // send as multiple values
        } else {
          dataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.put(
        `https://api.thedesigngrit.com/api/brand/${vendor.brandId}`,
        dataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setOriginalData(response.data);
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
          <Box>
            <div
              className="status paid"
              style={getStatusStyle(formData.status)}
            >
              {formData.status || "Status not set"}
            </div>
          </Box>
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
        {Object.keys(formData)
          .filter(
            (key) =>
              ![
                "_id",
                "createdAt",
                "updatedAt",
                "__v",
                "coverPhoto",
                "digitalCopiesLogo",
                "catalogues",
                "documents",
                "status",
                "brandlogo",
              ].includes(key)
          )
          .map((key) => (
            <div className="form-field" key={key}>
              <label>{key.replace(/([A-Z])/g, " $1")}</label>
              {key.endsWith("URL") ? (
                isEditing ? (
                  <input
                    type="text"
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="display-content">
                    <a
                      href={formData[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "blue", textDecoration: "underline" }}
                    >
                      {platformIcons[key]} {formData[key] || "No URL provided"}
                    </a>
                  </div>
                )
              ) : key === "type" ? (
                isEditing ? (
                  <select
                    multiple
                    value={formData.type}
                    onChange={handleTypeChange}
                  >
                    {types.map((type) => (
                      <option key={type._id} value={type._id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <ul>
                    {formData.type.length > 0 ? (
                      formData.type.map((id) => {
                        const type = types.find((t) => t._id === id);
                        return <li key={id}>{type ? type.name : id}</li>;
                      })
                    ) : (
                      <li>Not Selected</li>
                    )}
                  </ul>
                )
              ) : isEditing ? (
                <input
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{formData[key] || "N/A"}</p>
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
