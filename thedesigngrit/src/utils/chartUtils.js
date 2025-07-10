import { format } from "date-fns";

export function formatMoney(value) {
  if (value === null || value === undefined || value === "N/A") return "N/A";
  return `${Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} E£`;
}

export const chartPeriods = [
  { value: "week", label: "Weeks" },
  { value: "month", label: "Months" },
  { value: "year", label: "Years" },
];

export function groupLogsByPeriod(logs, period) {
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
    result[label] += Number(log.total || log.sales) || 0;
  });
  // Sort labels
  return Object.entries(result)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, total]) => ({ label, total: Number(total.toFixed(2)) }));
}

export function getMonthYearLabel(label) {
  // Only parse if label matches YYYY-MM
  if (!label || !/^[0-9]{4}-[0-9]{2}$/.test(label)) return label;
  const [year, month] = label.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return format(date, "MMM yyyy");
}

export function getWeekLabel(label) {
  // label: '2025-W23' => 'W23 2025'
  if (!label) return "";
  const [year, week] = label.split("-W");
  if (!year || !week) return label;
  return `W${week} ${year}`;
}

export function getXAxisLabel(label, period) {
  if (period === "month") return getMonthYearLabel(label);
  if (period === "week") return getWeekLabel(label);
  return label;
}

export function getAvailableMonths(data) {
  // Returns array of { value: '2025-06', label: 'Jun 2025' }
  return data.map((d) => ({
    value: d.label,
    label: getMonthYearLabel(d.label),
  }));
}
