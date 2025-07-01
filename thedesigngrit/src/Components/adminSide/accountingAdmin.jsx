import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  CircularProgress,
  Typography,
  TableSortLabel,
} from "@mui/material";
import axios from "axios";

const columns = [
  { id: "orderId", label: "Order ID" },
  { id: "brand", label: "Brand" },
  { id: "total", label: "Total (EGP)", money: true },
  { id: "vat", label: "VAT", money: true },
  { id: "shippingFee", label: "Shipping", money: true },
  { id: "paymobFee", label: "Paymob Fee", money: true },
  { id: "commission", label: "Commission", money: true },
  { id: "brandPayout", label: "Brand Payout", money: true },
  { id: "netAdminProfit", label: "Admin Profit", money: true },
  { id: "date", label: "Date" },
];

const sortOptions = [
  { value: "total", label: "Total (EGP)" },
  { value: "netAdminProfit", label: "Admin Profit" },
  { value: "brandPayout", label: "Brand Payout" },
  { value: "date", label: "Date" },
];

function formatMoney(value) {
  if (value === null || value === undefined || value === "N/A") return "N/A";
  return `${Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} E£`;
}

const MoneyCell = ({ value }) =>
  value === "N/A" ? (
    <span>N/A</span>
  ) : (
    <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {formatMoney(value)}
    </span>
  );

const calculatorOptions = [
  { value: "brandPayout", label: "Brand Payout" },
  { value: "total", label: "Total Sales" },
  { value: "commission", label: "Commission" },
];

function exportToCSV(data, brandName) {
  if (!data.length) return;
  const headers = [
    "Order ID",
    "Brand",
    "Total (EGP)",
    "VAT",
    "Shipping",
    "Paymob Fee",
    "Commission",
    "Brand Payout",
    "Admin Profit",
    "Date",
  ];
  const rows = data.map((log) => [
    log.orderId?._id || "N/A",
    log.brandId?.brandName || "N/A",
    log.total ?? "N/A",
    log.vat ?? "N/A",
    log.shippingFee ?? "N/A",
    log.paymobFee ?? "N/A",
    log.commission ?? "N/A",
    log.brandPayout ?? "N/A",
    log.netAdminProfit ?? "N/A",
    log.date ? new Date(log.date).toLocaleDateString() : "N/A",
  ]);

  // Calculate totals for each money column
  const sum = (key) =>
    data.reduce((acc, log) => acc + (Number(log[key]) || 0), 0);
  const totalsRow = [
    "", // Order ID
    "TOTAL", // Brand
    sum("total"),
    sum("vat"),
    sum("shippingFee"),
    sum("paymobFee"),
    sum("commission"),
    sum("brandPayout"),
    sum("netAdminProfit"),
    "", // Date
  ].map((val, idx) => {
    // Format money columns
    if ([2, 3, 4, 5, 6, 7, 8].includes(idx) && typeof val === "number") {
      return val.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return val;
  });

  let csvContent = headers.join(",") + "\n";
  rows.forEach((row) => {
    csvContent += row.join(",") + "\n";
  });
  csvContent += totalsRow.join(",") + "\n";

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `${brandName || "all_brands"}_financials.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const AccountingAdmin = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brandFilter, setBrandFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Calculator states
  const [calcBrand, setCalcBrand] = useState("");
  const [calcType, setCalcType] = useState("brandPayout");
  const [calcResult, setCalcResult] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://api.thedesigngrit.com/api/admin-financials/getall-logs")
      .then((res) => {
        setLogs(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  }, []);

  // Extract unique brands for filter dropdown
  const brands = useMemo(() => {
    const brandSet = new Set();
    logs.forEach((log) => {
      if (log.brandId && log.brandId.brandName) {
        brandSet.add(log.brandId.brandName);
      }
    });
    return Array.from(brandSet);
  }, [logs]);

  // Filtering
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Brand filter
      if (brandFilter && log.brandId?.brandName !== brandFilter) return false;
      // Date filter
      if (dateFrom && new Date(log.date) < new Date(dateFrom)) return false;
      if (dateTo && new Date(log.date) > new Date(dateTo)) return false;
      return true;
    });
  }, [logs, brandFilter, dateFrom, dateTo]);

  // Sorting
  const sortedLogs = useMemo(() => {
    const sorted = [...filteredLogs];
    sorted.sort((a, b) => {
      let aValue, bValue;
      if (sortBy === "date") {
        aValue = new Date(a.date);
        bValue = new Date(b.date);
      } else {
        aValue = a[sortBy] ?? 0;
        bValue = b[sortBy] ?? 0;
      }
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredLogs, sortBy, sortOrder]);

  // Calculator logic
  const handleCalculate = () => {
    if (!calcBrand) {
      setCalcResult("Please select a brand.");
      return;
    }
    const brandLogs = logs.filter(
      (log) => log.brandId?.brandName === calcBrand
    );
    if (!brandLogs.length) {
      setCalcResult("No data for this brand.");
      return;
    }
    const sum = brandLogs.reduce(
      (acc, log) => acc + (Number(log[calcType]) || 0),
      0
    );
    setCalcResult(
      `${
        calculatorOptions.find((opt) => opt.value === calcType).label
      } for ${calcBrand}: ${formatMoney(sum)}`
    );
  };

  // Calculator export logic
  const handleExport = () => {
    if (!calcBrand) return;
    const brandLogs = logs.filter(
      (log) => log.brandId?.brandName === calcBrand
    );
    exportToCSV(brandLogs, calcBrand);
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );

  return (
    <Box p={3}>
      {/* Calculator Section */}
      <Box
        mb={4}
        p={2}
        sx={{
          background: "#f5f5f5",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Brand</InputLabel>
          <Select
            value={calcBrand}
            label="Brand"
            onChange={(e) => setCalcBrand(e.target.value)}
          >
            <MenuItem value="">Select Brand</MenuItem>
            {brands.map((brand) => (
              <MenuItem key={brand} value={brand}>
                {brand}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Calculation</InputLabel>
          <Select
            value={calcType}
            label="Calculation"
            onChange={(e) => setCalcType(e.target.value)}
          >
            {calculatorOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          style={{ backgroundColor: "#2d2d2d", color: "white" }}
          onClick={handleCalculate}
        >
          Calculate
        </Button>
        <Button
          variant="outlined"
          style={{ marginLeft: 8 }}
          onClick={handleExport}
          disabled={!calcBrand}
        >
          Export CSV
        </Button>
        {calcResult && (
          <Typography sx={{ ml: 2, fontWeight: 600, color: "#2d2d2d" }}>
            {calcResult}
          </Typography>
        )}
      </Box>
      {/* Filters and Table Section */}
      <Box
        mb={4}
        p={2}
        sx={{
          background: "#fff",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Brand</InputLabel>
          <Select
            value={brandFilter}
            label="Brand"
            onChange={(e) => setBrandFilter(e.target.value)}
          >
            <MenuItem value="">All Brands</MenuItem>
            {brands.map((brand) => (
              <MenuItem key={brand} value={brand}>
                {brand}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="From"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <TextField
          label="To"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel>Order</InputLabel>
          <Select
            value={sortOrder}
            label="Order"
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <MenuItem value="desc">High to Low</MenuItem>
            <MenuItem value="asc">Low to High</MenuItem>
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          style={{
            backgroundColor: "#2d2d2d",
            color: "white",
            marginLeft: "10px",
          }}
          onClick={() => {
            setBrandFilter("");
            setDateFrom("");
            setDateTo("");
            setSortBy("date");
            setSortOrder("desc");
          }}
        >
          Reset Filters
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  sx={{ fontWeight: 700, fontFamily: "Montserrat" }}
                >
                  {col.label}
                  {sortBy === col.id && (
                    <TableSortLabel
                      active
                      direction={sortOrder === "asc" ? "asc" : "desc"}
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedLogs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>{log.orderId?._id || "N/A"}</TableCell>
                <TableCell>{log.brandId?.brandName || "N/A"}</TableCell>
                <TableCell>
                  <MoneyCell value={log.total} />
                </TableCell>
                <TableCell>
                  <MoneyCell value={log.vat} />
                </TableCell>
                <TableCell>
                  <MoneyCell value={log.shippingFee} />
                </TableCell>
                <TableCell>
                  <MoneyCell value={log.paymobFee} />
                </TableCell>
                <TableCell>
                  <MoneyCell value={log.commission} />
                </TableCell>
                <TableCell>
                  <MoneyCell value={log.brandPayout} />
                </TableCell>
                <TableCell>
                  <MoneyCell value={log.netAdminProfit} />
                </TableCell>
                <TableCell>
                  {log.date ? new Date(log.date).toLocaleDateString() : "N/A"}
                </TableCell>
              </TableRow>
            ))}
            {sortedLogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AccountingAdmin;
