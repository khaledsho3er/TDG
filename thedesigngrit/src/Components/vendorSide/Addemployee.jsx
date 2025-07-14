import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  Select,
  Box,
  MenuItem,
  InputLabel,
  FormControl,
  InputAdornment,
  IconButton,
  ClickAwayListener,
  Popper,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useVendor } from "../../utils/vendorContext";

// Yup schema with strong password rules
const schema = yup.object().shape({
  firstname: yup.string().required("First name is required"),
  lastname: yup.string().required("Last name is required"),
  employeeNumber: yup.string().required("Employee number is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/\d/, "Must contain at least one number")
    .matches(/[\W_]/, "Must contain at least one special character")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  tier: yup.string().required("Authority level is required"),
});

const VendorSignup = ({ open, onClose, refreshList }) => {
  const { vendor } = useVendor();
  const [brandName, setBrandName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPopper, setShowPopper] = useState(false);
  const passwordRef = useRef(null);

  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstname: "",
      lastname: "",
      employeeNumber: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      tier: "",
    },
  });

  const passwordValue = watch("password");

  useEffect(() => {
    if (passwordValue) {
      setPasswordChecks({
        length: passwordValue.length >= 8,
        uppercase: /[A-Z]/.test(passwordValue),
        number: /\d/.test(passwordValue),
        special: /[\W_]/.test(passwordValue),
      });
    }
  }, [passwordValue]);

  useEffect(() => {
    if (vendor?.brandId) {
      axios
        .get(`https://api.thedesigngrit.com/api/brand/${vendor.brandId}`)
        .then((res) => setBrandName(res.data.brandName))
        .catch(() => setBrandName("Error fetching brand"));
    }
  }, [vendor?.brandId]);

  const onSubmit = async (data) => {
    const payload = {
      firstName: data.firstname,
      lastName: data.lastname,
      email: data.email,
      password: data.password,
      employeeNumber: data.employeeNumber,
      phoneNumber: data.phoneNumber,
      brandId: vendor.brandId,
      tier: data.tier,
    };

    try {
      await axios.post(
        "https://api.thedesigngrit.com/api/vendors/signup",
        payload
      );
      refreshList();
      onClose();
    } catch (error) {
      setError("email", {
        type: "manual",
        message: "Failed to sign up. Try again.",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: "bold", fontFamily: "Horizon" }}>
        Add New Employee
      </DialogTitle>
      <DialogContent>
        <Typography fontFamily="Montserrat" mb={2}>
          Brand: {brandName || "Loading..."}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {[
              "firstname",
              "lastname",
              "employeeNumber",
              "email",
              "phoneNumber",
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field}>
                <Controller
                  name={field}
                  control={control}
                  render={({ field: controllerField }) => (
                    <TextField
                      {...controllerField}
                      label={field
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                      fullWidth
                      error={!!errors[field]}
                      helperText={errors[field]?.message}
                    />
                  )}
                />
              </Grid>
            ))}

            {/* Password Field with Popper */}
            <Grid item xs={12} sm={6}>
              <ClickAwayListener onClickAway={() => setShowPopper(false)}>
                <Box sx={{ position: "relative" }}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Password"
                        fullWidth
                        type={showPassword ? "text" : "password"}
                        inputRef={passwordRef}
                        onFocus={() => setShowPopper(true)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword((prev) => !prev)}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                      />
                    )}
                  />
                  <Popper
                    open={showPopper}
                    anchorEl={passwordRef.current}
                    placement="right-start"
                    style={{ zIndex: 1500 }}
                  >
                    <Paper sx={{ p: 2 }}>
                      <Typography fontWeight="bold" mb={1}>
                        Password Requirements
                      </Typography>
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        <li
                          style={{
                            color: passwordChecks.length ? "green" : "red",
                          }}
                        >
                          At least 8 characters
                        </li>
                        <li
                          style={{
                            color: passwordChecks.uppercase ? "green" : "red",
                          }}
                        >
                          One uppercase letter
                        </li>
                        <li
                          style={{
                            color: passwordChecks.number ? "green" : "red",
                          }}
                        >
                          One number
                        </li>
                        <li
                          style={{
                            color: passwordChecks.special ? "green" : "red",
                          }}
                        >
                          One special character
                        </li>
                      </ul>
                    </Paper>
                  </Popper>
                </Box>
              </ClickAwayListener>
            </Grid>

            {/* Confirm Password */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Confirm Password"
                    fullWidth
                    type={showConfirmPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                  />
                )}
              />
            </Grid>

            {/* Tier Select */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.tier}>
                <InputLabel>Authority Level (Tier)</InputLabel>
                <Controller
                  name="tier"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Authority Level (Tier)">
                      <MenuItem value="1">Tier 1 - Basic Access</MenuItem>
                      <MenuItem value="2">Tier 2 - Advanced Access</MenuItem>
                      <MenuItem value="3">Tier 3 - Full Admin</MenuItem>
                    </Select>
                  )}
                />
                {errors.tier && (
                  <Typography color="error">{errors.tier.message}</Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className="btn-cancel">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="btn-save"
        >
          {isSubmitting ? "Adding..." : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VendorSignup;
