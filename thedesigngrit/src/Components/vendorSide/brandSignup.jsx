import React, { useState, useEffect } from "react";
import { useVendor } from "../../utils/vendorContext";
import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  OutlinedInput,
} from "@mui/material";
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
  const [selectedTypeNames, setSelectedTypeNames] = useState([]);

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
  useEffect(() => {
    // Update selected type names whenever types or formData.type changes
    if (types.length > 0 && formData.type) {
      const names = formData.type
        .map((id) => {
          const type = types.find((t) => t._id === id);
          return type ? type.name : id;
        })
        .filter((name) => name); // Filter out any undefined names
      setSelectedTypeNames(names);
    }
  }, [types, formData.type]);
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
      const data = response.data;

      // Convert the concatenated type IDs string to an array
      let typeArray = [];
      if (data.type) {
        // If it's already an array, use it directly
        if (Array.isArray(data.type)) {
          typeArray = data.type;
        }
        // If it's a string of concatenated IDs (24 chars each)
        else if (typeof data.type === "string" && data.type.length > 0) {
          typeArray = data.type.match(/.{24}/g) || [];
        }
      }

      setFormData({
        ...data,
        type: typeArray,
      });
      setOriginalData({
        ...data,
        type: typeArray,
      });
    } catch (error) {
      console.error("Error fetching brand data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (event) => {
    const { value } = event.target;
    // Limit to maximum 3 types
    if (value.length <= 3) {
      setFormData((prev) => ({
        ...prev,
        type: value,
      }));
    }
  };

  const getTypeName = (typeId) => {
    const type = types.find((t) => t._id === typeId);
    return type ? type.name : typeId;
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
        } else if (key === "types") {
          formData.type.forEach((typeId) => {
            dataToSend.append("types", typeId); // Note plural "types" to match API
          });
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
              {formData.status
                ? `${formData.status
                    .charAt(0)
                    .toUpperCase()}${formData.status.slice(1)}`
                : "Status not set"}
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
                  <FormControl fullWidth>
                    <InputLabel id="type-select-label">Types</InputLabel>
                    <Select
                      labelId="type-select-label"
                      multiple
                      value={formData.type}
                      onChange={handleTypeChange}
                      input={<OutlinedInput label="Types" />}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => {
                            const type = types.find((t) => t._id === value);
                            return (
                              <Chip
                                key={value}
                                label={type ? type.name : value}
                                sx={{ backgroundColor: "#e0e0e0" }}
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {types.map((type) => (
                        <MenuItem key={type._id} value={type._id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <div>
                    {selectedTypeNames.length > 0 ? (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {selectedTypeNames.map((name, index) => (
                          <Chip
                            key={index}
                            label={name}
                            sx={{ backgroundColor: "#e0e0e0" }}
                          />
                        ))}
                      </Box>
                    ) : (
                      <p>Not Selected</p>
                    )}
                  </div>
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
