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
  page: { padding: 20, fontSize: 12, fontFamily: "Helvetica" },
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
  note: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    fontStyle: "italic",
  },
  paymentSection: {
    marginBottom: 10,
    padding: 10,
    border: "1px solid #ddd",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
});

// Invoice PDF Component
const InvoicePDF = ({ order }) => {
  // Defensive checks
  const customer = order?.customerId || {};
  const billing = order?.billingDetails || {};
  const shipping = order?.shippingDetails || {};
  const payment = order?.paymentDetails || {};
  const cartItems = order?.cartItems || [];
  const subtotal = order?.subtotal ?? "N/A";
  const tax = order?.vat ?? "N/A";
  const shippingFee = order?.shippingFee ?? "N/A";
  const discount = order?.discount ?? 0;
  const total = order?.total ?? "N/A";
  const totalAfter14Percent =
    typeof total === "number"
      ? (total * 0.86).toFixed(2)
      : total !== "N/A"
      ? (parseFloat(total) * 0.86).toFixed(2)
      : "N/A";
  const note = order?.note;
  const notePostedAt = order?.notePostedAt;

  // Format order ID as in UI
  const formattedOrderId = `#${order?._id ? order._id.slice(-6) : ""}-${
    customer?.firstName || ""
  } ${customer?.lastName || ""}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.header}>Proof of Delivery Invoice</Text>

        {/* Order & Customer Details */}
        <View style={styles.section}>
          <Text style={styles.bold}>Order ID: {formattedOrderId}</Text>
          <Text>Status: {order?.orderStatus || "N/A"}</Text>
          <Text>
            Date:{" "}
            {order?.createdAt
              ? new Date(order.createdAt).toLocaleDateString()
              : "N/A"}
          </Text>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.bold}>Customer Information</Text>
          <Text>
            Name: {customer?.firstName || "N/A"} {customer?.lastName || ""}
          </Text>
          <Text>Email: {customer?.email || "N/A"}</Text>
          <Text>Phone: {billing?.phoneNumber || "N/A"}</Text>
        </View>

        {/* Billing & Shipping Details */}
        <View style={styles.section}>
          <Text style={styles.bold}>Billing Address</Text>
          <Text>{billing?.address || "N/A"}</Text>
          <Text>
            {billing?.country || "N/A"} - {billing?.zipCode || "N/A"}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.bold}>Shipping Address</Text>
          <Text>{shipping?.address || "N/A"}</Text>
          <Text>Label: {shipping?.label || "N/A"}</Text>
          <Text>
            Apt: {shipping?.apartment || "N/A"}, Floor:{" "}
            {shipping?.floor || "N/A"}
          </Text>
          <Text>
            {shipping?.country || "N/A"}, {shipping?.city || "N/A"}, Zip:{" "}
            {shipping?.zipCode || "N/A"}
          </Text>
        </View>

        {/* Payment Info */}
        <View style={styles.paymentSection}>
          <Text style={styles.bold}>Payment Information</Text>
          <Text>Method: {payment?.paymentMethod || "N/A"}</Text>
          <Text>
            Transaction ID: {payment?.transactionId || "Cash Dont Have ID"}
          </Text>
          <Text>Status: {payment?.paymentStatus || "N/A"}</Text>
        </View>

        {/* Notes */}
        {note && (
          <View style={styles.note}>
            <Text>Note: {note}</Text>
            {notePostedAt && (
              <Text>Posted at: {new Date(notePostedAt).toLocaleString()}</Text>
            )}
          </View>
        )}

        {/* Order Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={{ width: "25%" }}>Product</Text>
            <Text style={{ width: "10%" }}>Color</Text>
            <Text style={{ width: "10%" }}>Size</Text>
            <Text style={{ width: "10%" }}>Qty</Text>
            <Text style={{ width: "15%" }}>Status</Text>
            <Text style={{ width: "15%", textAlign: "right" }}>Total</Text>
          </View>
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={{ width: "25%" }}>{item?.name || "N/A"}</Text>
                <Text style={{ width: "10%" }}>
                  {item?.selectedColor || "Default"}
                </Text>
                <Text style={{ width: "10%" }}>
                  {item?.selectedSize || "Default"}
                </Text>
                <Text style={{ width: "10%" }}>{item?.quantity || 0}</Text>
                <Text style={{ width: "15%" }}>
                  {item?.subOrderStatus || "N/A"}
                </Text>
                <Text style={{ width: "15%", textAlign: "right" }}>
                  {item?.totalPrice ? `E£ ${item.totalPrice}` : "N/A"}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text>No products found for this order.</Text>
            </View>
          )}
        </View>

        {/* Totals */}
        <View style={{ marginTop: 20, alignItems: "flex-end" }}>
          <Text>Subtotal: {subtotal !== "N/A" ? `E£ ${subtotal}` : "N/A"}</Text>
          <Text>Tax (14%): {tax !== "N/A" ? `E£ ${tax}` : "N/A"}</Text>
          <Text>Discount: {discount !== 0 ? `E£ ${discount}` : "E£ 0"}</Text>
          <Text>
            Shipping Rate: {shippingFee !== "N/A" ? `E£ ${shippingFee}` : "N/A"}
          </Text>
          <Text style={styles.total}>
            Total: {total !== "N/A" ? `E£ ${total}` : "N/A"}
          </Text>
          <Text style={styles.total}>
            Total after 14% deduction:{" "}
            {totalAfter14Percent !== "N/A"
              ? `E£ ${totalAfter14Percent}`
              : "N/A"}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

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
