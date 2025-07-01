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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import axios from "axios";
import { format } from "date-fns";
import {
  FaMoneyBillWave,
  FaPiggyBank,
  FaCreditCard,
  FaHandHoldingUsd,
  FaChartBar,
} from "react-icons/fa";

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

const chartPeriods = [
  { value: "week", label: "Weeks" },
  { value: "month", label: "Months" },
  { value: "year", label: "Years" },
];

function groupLogsByPeriod(logs, period) {
  // Returns [{ label, total }]
  if (!logs.length) return [];
  const result = {};
  logs.forEach((log) => {
    if (!log.date) return;
    const date = new Date(log.date);
    let label = "";
    if (period === "week") {
      // Week of year: YYYY-WW
      const year = date.getFullYear();
      const firstJan = new Date(date.getFullYear(), 0, 1);
      const week = Math.ceil(
        ((date - firstJan) / 86400000 + firstJan.getDay() + 1) / 7
      );
      label = `${year}-W${week}`;
    } else if (period === "month") {
      label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    } else if (period === "year") {
      label = `${date.getFullYear()}`;
    }
    if (!result[label]) result[label] = 0;
    result[label] += Number(log.total) || 0;
  });
  // Sort labels
  return Object.entries(result)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, total]) => ({ label, total: Number(total.toFixed(2)) }));
}

function getMonthYearLabel(label) {
  // Only parse if label matches YYYY-MM
  if (!label || !/^[0-9]{4}-[0-9]{2}$/.test(label)) return label;
  const [year, month] = label.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return format(date, "MMM yyyy");
}

function getWeekLabel(label) {
  // label: '2025-W23' => 'W23 2025'
  if (!label) return "";
  const [year, week] = label.split("-W");
  if (!year || !week) return label;
  return `W${week} ${year}`;
}

function getXAxisLabel(label, period) {
  if (period === "month") return getMonthYearLabel(label);
  if (period === "week") return getWeekLabel(label);
  return label;
}

function getAvailableMonths(data) {
  // Returns array of { value: '2025-06', label: 'Jun 2025' }
  return data.map((d) => ({
    value: d.label,
    label: getMonthYearLabel(d.label),
  }));
}

const ROWS_PER_PAGE = 12;

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

  // Chart states
  const [chartPeriod, setChartPeriod] = useState("month");
  const [chartBrand, setChartBrand] = useState("");
  const [chartDateFrom, setChartDateFrom] = useState("");
  const [chartDateTo, setChartDateTo] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

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
    // If calcBrand is empty string, calculate for all brands
    const brandLogs = !calcBrand
      ? logs
      : logs.filter((log) => log.brandId?.brandName === calcBrand);
    if (!brandLogs.length) {
      setCalcResult("No data for this brand.");
      return;
    }
    const sum = brandLogs.reduce(
      (acc, log) => acc + (Number(log[calcType]) || 0),
      0
    );
    setCalcResult(
      `${calculatorOptions.find((opt) => opt.value === calcType).label} for ${
        calcBrand || "All Brands"
      }: ${formatMoney(sum)}`
    );
  };

  // Calculator export logic
  const handleExport = () => {
    const brandLogs = !calcBrand
      ? logs
      : logs.filter((log) => log.brandId?.brandName === calcBrand);
    exportToCSV(brandLogs, calcBrand || "all_brands");
  };

  // Chart filtered logs
  const chartFilteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (chartBrand && log.brandId?.brandName !== chartBrand) return false;
      if (chartDateFrom && new Date(log.date) < new Date(chartDateFrom))
        return false;
      if (chartDateTo && new Date(log.date) > new Date(chartDateTo))
        return false;
      return true;
    });
  }, [logs, chartBrand, chartDateFrom, chartDateTo]);

  const chartData = useMemo(
    () => groupLogsByPeriod(chartFilteredLogs, chartPeriod),
    [chartFilteredLogs, chartPeriod]
  );

  // Filter chartData by selectedMonth if in months mode
  const displayedChartData = useMemo(() => {
    if (chartPeriod === "month" && selectedMonth) {
      return chartData.filter((d) => d.label === selectedMonth);
    }
    return chartData;
  }, [chartData, chartPeriod, selectedMonth]);

  // Available months for select menu
  const availableMonths = useMemo(() => {
    if (chartPeriod !== "month") return [];
    return getAvailableMonths(chartData).filter((m) =>
      /^[0-9]{4}-[0-9]{2}$/.test(m.value)
    );
  }, [chartData, chartPeriod]);

  // Pagination logic
  const totalPages = Math.ceil(sortedLogs.length / ROWS_PER_PAGE);
  const indexOfLastRow = currentPage * ROWS_PER_PAGE;
  const indexOfFirstRow = indexOfLastRow - ROWS_PER_PAGE;
  const currentRows = sortedLogs.slice(indexOfFirstRow, indexOfLastRow);

  // Reset to first page if filters change and current page is out of range
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  // Totals from filtered logs (sortedLogs)
  const totalVat = useMemo(
    () => sortedLogs.reduce((acc, log) => acc + (Number(log.vat) || 0), 0),
    [sortedLogs]
  );
  const totalProfit = useMemo(
    () =>
      sortedLogs.reduce(
        (acc, log) => acc + (Number(log.netAdminProfit) || 0),
        0
      ),
    [sortedLogs]
  );
  const totalPaymob = useMemo(
    () =>
      sortedLogs.reduce((acc, log) => acc + (Number(log.paymobFee) || 0), 0),
    [sortedLogs]
  );
  const totalBrandPayout = useMemo(
    () =>
      sortedLogs.reduce((acc, log) => acc + (Number(log.brandPayout) || 0), 0),
    [sortedLogs]
  );
  const totalSales = useMemo(
    () => sortedLogs.reduce((acc, log) => acc + (Number(log.total) || 0), 0),
    [sortedLogs]
  );

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
      {/* Summary Cards Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 3,
          mb: 4,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            flex: 1,
            minWidth: 180,
            background: "#fff",
            borderRadius: 2,
            boxShadow: 1,
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <FaMoneyBillWave size={28} style={{ color: "#6b7b58" }} />
          <Box>
            <h4 style={{ margin: 0, fontSize: "1.1em", fontWeight: 700 }}>
              Total Taxes
            </h4>
            <p style={{ margin: 0, fontWeight: 600, fontSize: "1.1em" }}>
              {totalVat.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              E£
            </p>
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            minWidth: 180,
            background: "#fff",
            borderRadius: 2,
            boxShadow: 1,
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <FaPiggyBank size={28} style={{ color: "#6b7b58" }} />
          <Box>
            <h4 style={{ margin: 0, fontSize: "1.1em", fontWeight: 700 }}>
              Total Profit
            </h4>
            <p style={{ margin: 0, fontWeight: 600, fontSize: "1.1em" }}>
              {totalProfit.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              E£
            </p>
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            minWidth: 180,
            background: "#fff",
            borderRadius: 2,
            boxShadow: 1,
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <FaCreditCard size={28} style={{ color: "#6b7b58" }} />
          <Box>
            <h4 style={{ margin: 0, fontSize: "1.1em", fontWeight: 700 }}>
              Total Paymob Fees
            </h4>
            <p style={{ margin: 0, fontWeight: 600, fontSize: "1.1em" }}>
              {totalPaymob.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              E£
            </p>
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            minWidth: 180,
            background: "#fff",
            borderRadius: 2,
            boxShadow: 1,
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <FaHandHoldingUsd size={28} style={{ color: "#6b7b58" }} />
          <Box>
            <h4 style={{ margin: 0, fontSize: "1.1em", fontWeight: 700 }}>
              Total Brand Payout
            </h4>
            <p style={{ margin: 0, fontWeight: 600, fontSize: "1.1em" }}>
              {totalBrandPayout.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              E£
            </p>
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            minWidth: 180,
            background: "#fff",
            borderRadius: 2,
            boxShadow: 1,
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <FaChartBar size={28} style={{ color: "#6b7b58" }} />
          <Box>
            <h4 style={{ margin: 0, fontSize: "1.1em", fontWeight: 700 }}>
              Total Sales
            </h4>
            <p style={{ margin: 0, fontWeight: 600, fontSize: "1.1em" }}>
              {totalSales.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              E£
            </p>
          </Box>
        </Box>
      </Box>
      {/* Chart Section */}
      <Box mb={4} p={2} sx={{ background: "#fff", borderRadius: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2} flexWrap="wrap">
          <Typography
            variant="h6"
            fontWeight={700}
            fontFamily="Montserrat"
            sx={{ flex: 1 }}
          >
            Sales Overview
          </Typography>
          {chartPeriods.map((period) => (
            <Button
              key={period.value}
              variant={chartPeriod === period.value ? "outlined" : "text"}
              size="small"
              sx={{
                borderColor: "#2d2d2d",
                color: chartPeriod === period.value ? "#2d2d2d" : "#888",
                fontWeight: 600,
                borderRadius: 2,
                minWidth: 70,
                px: 1.5,
                background:
                  chartPeriod === period.value ? "#f5f5f5" : "transparent",
                boxShadow: "none",
                textTransform: "none",
                "&:hover": {
                  background: "none",
                  color: chartPeriod === period.value ? "#2d2d2d" : "#888",
                },
              }}
              onClick={() => {
                setChartPeriod(period.value);
                setSelectedMonth("");
              }}
            >
              {period.label}
            </Button>
          ))}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Brand</InputLabel>
            <Select
              value={chartBrand}
              label="Brand"
              onChange={(e) => setChartBrand(e.target.value)}
            >
              <MenuItem value="">All Brands</MenuItem>
              {brands.map((brand) => (
                <MenuItem key={brand} value={brand}>
                  {brand}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {chartPeriod === "month" && availableMonths.length > 0 && (
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Month</InputLabel>
              <Select
                value={selectedMonth}
                label="Month"
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <MenuItem value="">All Months</MenuItem>
                {availableMonths.map((m) => (
                  <MenuItem key={m.value} value={m.value}>
                    {m.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <TextField
            label="From"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={chartDateFrom}
            onChange={(e) => setChartDateFrom(e.target.value)}
            sx={{ minWidth: 120 }}
          />
          <TextField
            label="To"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={chartDateTo}
            onChange={(e) => setChartDateTo(e.target.value)}
            sx={{ minWidth: 120 }}
          />
        </Box>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={displayedChartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              style={{ fontFamily: "Montserrat" }}
              tickFormatter={(label) => getXAxisLabel(label, chartPeriod)}
            />
            <YAxis
              style={{ fontFamily: "Montserrat" }}
              tickFormatter={(value) => value.toLocaleString("en-US")}
            />
            <Tooltip
              formatter={(value) => formatMoney(value)}
              labelFormatter={(label) => getXAxisLabel(label, chartPeriod)}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              name="Total Sales"
              stroke="#2d2d2d"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      {/* Calculator Section */}
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
            value={calcBrand}
            label="Brand"
            onChange={(e) => setCalcBrand(e.target.value)}
          >
            <MenuItem value="">All Brands</MenuItem>
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
          disabled={calcBrand === null}
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
            {currentRows.map((log) => (
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
            {currentRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination */}
      <Box
        className="pagination"
        sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 1 }}
      >
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? "active" : ""}
            style={{
              border: "1px solid #2d2d2d",
              background: currentPage === index + 1 ? "#2d2d2d" : "#fff",
              color: currentPage === index + 1 ? "#fff" : "#2d2d2d",
              borderRadius: 4,
              padding: "4px 12px",
              fontWeight: 600,
              cursor: "pointer",
              margin: "0 2px",
              outline: "none",
              minWidth: 32,
            }}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </Box>
    </Box>
  );
};

export default AccountingAdmin;
