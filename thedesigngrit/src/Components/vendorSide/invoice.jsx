import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// PDF Styles
const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  header: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 10,
    padding: 10,
    border: "1px solid #ddd",
    borderRadius: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  bold: { fontWeight: "bold" },
  table: { marginTop: 10 },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1px solid black",
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  total: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 10,
  },
});

// Invoice PDF Component
const InvoicePDF = ({ order }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <Text style={styles.header}>Invoice</Text>

      {/* Order & Customer Details */}
      <View style={styles.section}>
        <Text style={styles.bold}>Order ID: {order._id}</Text>
        <Text>Status: {order.orderStatus}</Text>
        <Text>Date: {order.createdAt || "N/A"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Customer Information</Text>
        <Text>Name: {order.customerId.firstName}</Text>
        <Text>Email: {order.customerId.email}</Text>
        <Text>Phone: {order.customerId.phoneNumber}</Text>
      </View>

      {/* Billing & Shipping Details */}
      <View style={styles.section}>
        <Text style={styles.bold}>Billing Address</Text>
        <Text>{order.billingDetails.address}</Text>
        <Text>
          {order.billingDetails.country} - {order.billingDetails.zipCode}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Shipping Address</Text>
        <Text>{order.shippingDetails.address}</Text>
        <Text>
          {order.shippingDetails.label}, Apt: {order.shippingDetails.apartment},
          Floor: {order.shippingDetails.floor}
        </Text>
      </View>

      {/* Order Items Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={{ width: "50%" }}>Product</Text>
          <Text style={{ width: "20%" }}>Qty</Text>
          <Text style={{ width: "30%", textAlign: "right" }}>Price</Text>
        </View>
        {order.cartItems.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={{ width: "50%" }}>{item.name}</Text>
            <Text style={{ width: "20%" }}>{item.quantity}</Text>
            <Text style={{ width: "30%", textAlign: "right" }}>
              ${item.price}
            </Text>
          </View>
        ))}
      </View>

      {/* Total Amount */}
      <Text style={styles.total}>Total: ${order.total}</Text>
    </Page>
  </Document>
);

// Button to Generate & Download PDF
const InvoiceDownload = ({ order }) => (
  <PDFDownloadLink
    document={<InvoicePDF order={order} />}
    fileName={`invoice_${order._id}.pdf`}
  >
    {({ loading }) => (
      <button
        style={{
          padding: "10px 15px",
          background: "#007bff",
          color: "white",
          borderRadius: 5,
        }}
      >
        {loading ? "Generating PDF..." : "Download Invoice"}
      </button>
    )}
  </PDFDownloadLink>
);

export default InvoiceDownload;
