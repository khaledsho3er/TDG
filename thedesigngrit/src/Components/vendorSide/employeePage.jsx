import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/system";
import { IconButton } from "@mui/material";
import { IoIosClose } from "react-icons/io";

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/employee/getAll"
        );
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleEditClick = (employee) => {
    setCurrentEmployee(employee);
    setEditPopupVisible(true);
  };

  const handleEditClose = () => {
    setEditPopupVisible(false);
    setCurrentEmployee(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/employee/employee/${currentEmployee._id}`,
        currentEmployee
      );
      setEditPopupVisible(false);
      fetchEmployees(); // Fetch updated employee list
    } catch (error) {
      console.error("Error updating employee", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/employee/employee/${currentEmployee._id}`
      );
      setEditPopupVisible(false);
      fetchEmployees(); // Fetch updated employee list
    } catch (error) {
      console.error("Error deleting employee", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/employee/getAll"
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };

  return (
    <div style={{ padding: "70px" }}>
      <section className="dashboard-lists-vendor">
        <div className="recent-orders-vendor">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ color: "#2d2d2d", textAlign: "left" }}>
              Employee List
            </h2>
            <table>
              <thead style={{ backgroundColor: "#f2f2f2", color: "#2d2d2d" }}>
                <tr style={{ backgroundColor: "#f2f2f2", color: "#2d2d2d" }}>
                  <th>Name</th>
                  <th>Employee Number</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Tier</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee._id}>
                    <td>{employee.name}</td>
                    <td>{employee.employeeNumber}</td>
                    <td>{employee.email}</td>
                    <td>{employee.phoneNumber}</td>
                    <td>{employee.tier}</td>
                    <td>
                      <button onClick={() => handleEditClick(employee)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </div>

        {/* Edit Popup */}
        {editPopupVisible && currentEmployee && (
          <div className="requestInfo-popup-overlay">
            <div className="requestInfo-popup">
              <div className="requestInfo-popup-header">
                <h2>Edit Employee</h2>
                <IconButton
                  onClick={handleEditClose}
                  sx={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    color: "#2d2d2d",
                  }}
                >
                  <IoIosClose size={30} />
                </IconButton>
              </div>
              <form onSubmit={handleFormSubmit} className="requestInfo-form">
                <div className="requestInfo-form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={currentEmployee.name}
                    onChange={(e) =>
                      setCurrentEmployee({
                        ...currentEmployee,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="requestInfo-form-group">
                  <label>Employee Number</label>
                  <input
                    type="text"
                    value={currentEmployee.employeeNumber}
                    onChange={(e) =>
                      setCurrentEmployee({
                        ...currentEmployee,
                        employeeNumber: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="requestInfo-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={currentEmployee.email}
                    onChange={(e) =>
                      setCurrentEmployee({
                        ...currentEmployee,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="requestInfo-form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={currentEmployee.phoneNumber}
                    onChange={(e) =>
                      setCurrentEmployee({
                        ...currentEmployee,
                        phoneNumber: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="requestInfo-form-group">
                  <label>Tier</label>
                  <input
                    type="text"
                    value={currentEmployee.tier}
                    onChange={(e) =>
                      setCurrentEmployee({
                        ...currentEmployee,
                        tier: e.target.value,
                      })
                    }
                  />
                </div>
                <button type="submit" className="requestInfo-submit-button">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="requestInfo-submit-button"
                  style={{ backgroundColor: "red" }}
                  onClick={handleDelete}
                >
                  Delete Employee
                </button>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default EmployeePage;
