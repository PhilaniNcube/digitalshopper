import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { formatCurrency } from "@/lib/utils";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 12,
    color: "#333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
  },
  invoiceNumber: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1e293b",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  column: {
    flexDirection: "column",
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1px solid #cbd5e1",
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #f1f5f9",
    paddingVertical: 8,
  },
  col1: { width: "40%" },
  col2: { width: "20%", textAlign: "right" },
  col3: { width: "20%", textAlign: "right" },
  col4: { width: "20%", textAlign: "right" },
  bold: { fontWeight: "bold" },
  totalSection: {
    marginTop: 20,
    borderTop: "2px solid #cbd5e1",
    paddingTop: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTop: "1px solid #cbd5e1",
  },
  grandTotalText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export const InvoiceDocument = ({ order }: { order: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={styles.invoiceNumber}>Order #{order.id}</Text>
          <Text style={{ marginTop: 4, color: "#64748b" }}>
            Date: {new Date(order.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>Digital Shopper</Text>
          <Text>123 Store Address</Text>
          <Text>City, Province, 1234</Text>
          <Text>support@digitalshopper.com</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 30 }}>
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>Bill To:</Text>
          <Text style={styles.bold}>{order.firstName} {order.lastName}</Text>
          <Text>{order.email}</Text>
          <Text>{order.phone}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>Ship To:</Text>
          <Text>{order.addressLine1}</Text>
          {order.addressLine2 && <Text>{order.addressLine2}</Text>}
          <Text>{order.city}, {order.province} {order.postalCode}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.col1, styles.bold]}>Item</Text>
          <Text style={[styles.col2, styles.bold]}>Unit Price</Text>
          <Text style={[styles.col3, styles.bold]}>Qty</Text>
          <Text style={[styles.col4, styles.bold]}>Line Total</Text>
        </View>
        
        {order.items.map((item: any) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={styles.col1}>{item.title}</Text>
            <Text style={styles.col2}>{formatCurrency(item.price)}</Text>
            <Text style={styles.col3}>{item.quantity}</Text>
            <Text style={styles.col4}>{formatCurrency(item.price * item.quantity)}</Text>
          </View>
        ))}
      </View>

      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }} />
        <View style={{ flex: 1, ...styles.totalSection }}>
          <View style={styles.totalRow}>
            <Text>Subtotal</Text>
            <Text>{formatCurrency(order.subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Shipping</Text>
            <Text>{formatCurrency(order.shipping)}</Text>
          </View>
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalText}>Total</Text>
            <Text style={styles.grandTotalText}>{formatCurrency(order.total)}</Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 50, borderTop: "1px solid #e2e8f0", paddingTop: 20 }}>
        <Text style={{ textAlign: "center", color: "#64748b", fontSize: 10 }}>
          Thank you for your business!
        </Text>
      </View>
    </Page>
  </Document>
);
