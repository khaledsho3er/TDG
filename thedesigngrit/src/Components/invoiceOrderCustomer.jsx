import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: { padding: 20 },
  section: { marginBottom: 10 },
  header: { fontSize: 20, marginBottom: 10, textAlign: "center" },
  boldText: { fontSize: 12, fontWeight: "bold" },
  text: { fontSize: 12 },
  table: { display: "flex", flexDirection: "column", marginTop: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    borderBottom: "1px solid #ccc",
  },
});

const InvoicePDF = ({ order }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Invoice</Text>
        <Text style={styles.boldText}>Order ID: {order._id}</Text>
        <Text style={styles.text}>
          Order Date: {new Date(order.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.text}>Customer: {order.customerId.name}</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.boldText}>Item</Text>
          <Text style={styles.boldText}>Quantity</Text>
          <Text style={styles.boldText}>Price</Text>
        </View>
        {order.cartItems.map((item) => (
          <View style={styles.row} key={item._id}>
            <Text>{item.productId.name}</Text>
            <Text>{item.quantity}</Text>
            <Text>{item.totalPrice} E£</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.boldText}>Subtotal: {order.subtotal} E£</Text>
        <Text style={styles.boldText}>Shipping: {order.shippingFee} E£</Text>
        <Text style={styles.boldText}>Total: {order.total} E£</Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
