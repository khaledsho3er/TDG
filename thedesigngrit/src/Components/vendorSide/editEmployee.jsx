import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [name, setName] = useState("");
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [tier, setTier] = useState("1");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `https://tdg-db.onrender.com/api/employee/getAll/${id}`
        );
        setEmployee(response.data);
        setName(response.data.name);
        setEmployeeNumber(response.data.employeeNumber);
        setEmail(response.data.email);
        setPhoneNumber(response.data.phoneNumber);
        setTier(response.data.tier);
      } catch (error) {
        console.error("Error fetching employee", error);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://tdg-db.onrender.com/api/employee/update/${id}`, {
        name,
        employeeNumber,
        email,
        phoneNumber,
        tier,
      });
      navigate.push("/edit-employee");
    } catch (error) {
      console.error("Error updating employee", error);
    }
  };

  if (!employee) return <p>Loading employee data...</p>;

  return (
    <div>
      <h2>Edit Employee</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Employee Number"
          value={employeeNumber}
          onChange={(e) => setEmployeeNumber(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <select value={tier} onChange={(e) => setTier(e.target.value)}>
          <option value="1">Tier 1</option>
          <option value="2">Tier 2</option>
          <option value="3">Tier 3</option>
        </select>
        <button type="submit">Update Employee</button>
      </form>
    </div>
  );
};

export default EditEmployee;
