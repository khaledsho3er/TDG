import React, { useState, useEffect } from "react";
import { useVendor } from "../../utils/vendorContext";
import {
  Box,
  Select,
  MenuItem,
  Chip,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Container,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaTiktok,
  FaGlobe,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

const BrandSignup = () => {
  const { vendor } = useVendor();
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const platformIcons = {
    instagramURL: <FaInstagram />,
    facebookURL: <FaFacebook />,
    linkedinURL: <FaLinkedin />,
    tiktokURL: <FaTiktok />,
    websiteURL: <FaGlobe />,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchTypes();
        if (vendor?.brandId) {
          await fetchBrandData(vendor.brandId);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vendor]);

  const fetchTypes = async () => {
    try {
      const { data } = await axios.get(
        "https://api.thedesigngrit.com/api/types/getAll"
      );
      setTypes(data || []);
    } catch (error) {
      console.error("Error fetching types:", error);
      throw error;
    }
  };

  const fetchBrandData = async (brandId) => {
    try {
      const response = await axios.get(
        `https://api.thedesigngrit.com/api/brand/${brandId}`
      );
      setFormData(response.data);
      setOriginalData(response.data);
    } catch (error) {
      console.error("Error fetching brand data:", error);
      throw error;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e) => {
    const { value } = e.target;
    // Limit to maximum 3 types
    if (value.length <= 3) {
      setFormData((prev) => ({
        ...prev,
        selectedTypes: value,
      }));
    }
  };

  const handleEdit = () => {
    // Create a selectedTypes array from the types objects
    const selectedTypeIds = formData.types?.map((type) => type._id) || [];
    setFormData((prev) => ({
      ...prev,
      selectedTypes: selectedTypeIds,
    }));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      setSaveError(null);
      setSaveSuccess(false);

      const dataToSend = new FormData();

      // Add all regular fields
      Object.keys(formData).forEach((key) => {
        if (
          key !== "types" &&
          key !== "selectedTypes" &&
          key !== "_id" &&
          key !== "createdAt" &&
          key !== "updatedAt" &&
          key !== "__v" &&
          key !== "brandlogo" &&
          key !== "coverPhoto" &&
          key !== "digitalCopiesLogo" &&
          key !== "catalogues" &&
          key !== "documents" &&
          formData[key] !== null &&
          formData[key] !== undefined
        ) {
          dataToSend.append(key, formData[key]);
        }
      });

      // Add selected types
      if (formData.selectedTypes && Array.isArray(formData.selectedTypes)) {
        formData.selectedTypes.forEach((typeId) => {
          if (typeId) dataToSend.append("types", typeId);
        });
      }

      const response = await axios.put(
        `https://api.thedesigngrit.com/api/brand/${vendor.brandId}`,
        dataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Update the data with the response
      setFormData(response.data);
      setOriginalData(response.data);
      setSaveSuccess(true);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating brand data:", error);
      setSaveError(error.response?.data?.message || "Failed to update brand");
    } finally {
      setSaveLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return { backgroundColor: "#FAD5A5", color: "#FF5F1F" };
      case "active":
        return { backgroundColor: "#def9bf", color: "#6b7b58" };
      case "deactivated":
        return { backgroundColor: "#ffcccc", color: "#cc0000" };
      default:
        return { backgroundColor: "#e0e0e0", color: "#666666" };
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        {/* Header with status and brand info */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {formData.brandName || "Brand Information"}
            </Typography>

            <Box
              sx={{
                display: "inline-block",
                px: 2,
                py: 0.5,
                borderRadius: 1,
                ...getStatusStyle(formData.status),
              }}
            >
              {formData.status
                ? `${formData.status
                    .charAt(0)
                    .toUpperCase()}${formData.status.slice(1)}`
                : "Status not set"}
            </Box>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            {formData.brandlogo ? (
              <img
                src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${formData.brandlogo}`}
                alt="Brand Logo"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "contain",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No logo
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {saveSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Brand information updated successfully!
          </Alert>
        )}

        {saveError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {saveError}
          </Alert>
        )}

        {/* Brand Information */}
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ borderBottom: "1px solid #eee", pb: 1 }}
            >
              Basic Information
            </Typography>

            <Grid container spacing={2}>
              {[
                "brandName",
                "commercialRegisterNo",
                "taxNumber",
                "companyAddress",
                "phoneNumber",
                "email",
                "bankAccountNumber",
              ].map((field) => (
                <Grid item xs={12} key={field}>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {field
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </Typography>

                    {isEditing ? (
                      <TextField
                        fullWidth
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleInputChange}
                        size="small"
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="body1">
                        {formData[field] || "Not provided"}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Online Presence */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ borderBottom: "1px solid #eee", pb: 1 }}
            >
              Online Presence
            </Typography>

            <Grid container spacing={2}>
              {[
                "websiteURL",
                "instagramURL",
                "facebookURL",
                "tiktokURL",
                "linkedinURL",
              ].map((field) => (
                <Grid item xs={12} key={field}>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {field
                        .replace(/URL$/, "")
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </Typography>

                    {isEditing ? (
                      <TextField
                        fullWidth
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleInputChange}
                        size="small"
                        variant="outlined"
                        InputProps={{
                          startAdornment: platformIcons[field],
                        }}
                      />
                    ) : (
                      <Typography variant="body1">
                        {formData[field] ? (
                          <a
                            href={
                              formData[field].startsWith("http")
                                ? formData[field]
                                : `https://${formData[field]}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              color: "#1976d2",
                              textDecoration: "none",
                            }}
                          >
                            <Box sx={{ mr: 1 }}>{platformIcons[field]}</Box>
                            {formData[field]}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Additional Information */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ borderBottom: "1px solid #eee", pb: 1, mt: 2 }}
            >
              Additional Information
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Shipping Policy
                  </Typography>

                  {isEditing ? (
                    <TextField
                      fullWidth
                      name="shippingPolicy"
                      value={formData.shippingPolicy || ""}
                      onChange={handleInputChange}
                      size="small"
                      variant="outlined"
                    />
                  ) : (
                    <Typography variant="body1">
                      {formData.shippingPolicy || "Not provided"}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Brand Description
                  </Typography>

                  {isEditing ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      name="brandDescription"
                      value={formData.brandDescription || ""}
                      onChange={handleInputChange}
                      size="small"
                      variant="outlined"
                    />
                  ) : (
                    <Typography variant="body1">
                      {formData.brandDescription || "Not provided"}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Fees
                  </Typography>

                  {isEditing ? (
                    <TextField
                      fullWidth
                      name="fees"
                      type="number"
                      value={formData.fees || ""}
                      onChange={handleInputChange}
                      size="small"
                      variant="outlined"
                    />
                  ) : (
                    <Typography variant="body1">
                      {formData.fees || "Not provided"}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Types
                  </Typography>

                  {isEditing ? (
                    <Select
                      multiple
                      fullWidth
                      size="small"
                      value={formData.selectedTypes || []}
                      onChange={handleTypeChange}
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
                                size="small"
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
                  ) : (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {formData.types && formData.types.length > 0 ? (
                        formData.types.map((type, index) => (
                          <Chip
                            key={index}
                            label={type.name}
                            size="small"
                            sx={{ bgcolor: "#f0f0f0" }}
                          />
                        ))
                      ) : (
                        <Typography variant="body1">
                          No types selected
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box
          sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          {isEditing ? (
            <>
              <Button
                variant="outlined"
                color="error"
                onClick={handleCancel}
                startIcon={<FaTimes />}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={saveLoading}
                startIcon={
                  saveLoading ? <CircularProgress size={20} /> : <FaSave />
                }
              >
                {saveLoading ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleEdit}
              startIcon={<FaEdit />}
            >
              Edit Information
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default BrandSignup;
