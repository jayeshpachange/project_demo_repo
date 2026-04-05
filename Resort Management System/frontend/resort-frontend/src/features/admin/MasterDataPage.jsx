import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function MasterDataPage() {

  /* ===================== STATE ===================== */
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [foodRevenue, setFoodRevenue] = useState(0);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===================== LOADERS ===================== */
  async function loadBookings() {
    const res = await api.get("/user/bookings/getAllBooking");
    setBookings(Array.isArray(res.data) ? res.data : []);
  }

  async function loadPayments() {
    const res = await api.get("/user/payments/getAllPayments");
    setPayments(Array.isArray(res.data) ? res.data : []);
  }

  async function loadRecommendations() {
    const res = await api.get("/user/recommendations/getAll");
    setRecommendations(Array.isArray(res.data) ? res.data : []);
  }

  async function loadFoodRevenue() {
    if (!selectedBookingId) return alert("Booking ID required");
    setLoading(true);
    const res = await api.get(`/user/foodOrder/booking/${selectedBookingId}/food-bill`);
    setFoodRevenue(res.data || 0);
    setLoading(false);
  }

  /* ===================== METRICS ===================== */
  const bookingStats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.bookingStatus === "CONFIRMED").length,
    cancelled: bookings.filter(b => b.bookingStatus === "CANCELLED").length,
    completed: bookings.filter(b => b.bookingStatus === "COMPLETED").length
  };

  const paymentRevenue = payments
    .filter(p => p.paymentStatus === "SUCCESS")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const paymentStatusCount = status => payments.filter(p => p.paymentStatus === status).length;

  /* ===================== UI ===================== */
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🧠 Admin Master Data & Insights</h1>

      {/* ===================== ACTION BAR ===================== */}
      <div style={styles.actionBar}>
        <button style={styles.primaryBtn} onClick={loadBookings}>📅 Load Bookings</button>
        <button style={styles.primaryBtn} onClick={loadPayments}>💳 Load Payments</button>
        <button style={styles.primaryBtn} onClick={loadRecommendations}>🤖 Load Recommendations</button>
      </div>

      {/* ===================== KPI CARDS ===================== */}
      <div style={styles.kpiGrid}>
        <KPI label="Total Bookings" value={bookingStats.total} />
        <KPI label="Confirmed" value={bookingStats.confirmed} />
        <KPI label="Cancelled" value={bookingStats.cancelled} />
        <KPI label="Completed" value={bookingStats.completed} />
        <KPI label="Payment Revenue" value={`₹ ${paymentRevenue}`} />
        <KPI label="Recommendations" value={recommendations.length} />
      </div>

      {/* ===================== PAYMENT INSIGHTS ===================== */}
      <section style={styles.section}>
        <h3>💳 Payment Status Overview</h3>
        <div style={styles.statusRow}>
          <StatusBox label="SUCCESS" count={paymentStatusCount("SUCCESS")} color="#16a34a" />
          <StatusBox label="PENDING" count={paymentStatusCount("PENDING")} color="#f59e0b" />
          <StatusBox label="FAILED" count={paymentStatusCount("FAILED")} color="#ef4444" />
          <StatusBox label="CANCELLED" count={paymentStatusCount("CANCELLED")} color="#64748b" />
        </div>
      </section>

      {/* ===================== FOOD REVENUE ===================== */}
      <section style={styles.sectionAlt}>
        <h3>🍽 Food Revenue (Booking-wise)</h3>
        <div style={styles.form}>
          <input
            placeholder="Enter Booking ID"
            value={selectedBookingId}
            onChange={e => setSelectedBookingId(e.target.value)}
            style={styles.input}
          />
          <button style={styles.primaryBtn} onClick={loadFoodRevenue}>Get Food Revenue</button>
        </div>

        {loading && <p>Loading…</p>}

        {!loading && foodRevenue > 0 && (
          <div style={styles.revenueBox}>₹ {foodRevenue}</div>
        )}
      </section>

      {/* ===================== SYSTEM LOGS (PLACEHOLDER) ===================== */}
      <section style={styles.section}>
        <h3>System & Audit Logs</h3>
        <p>All This System is created By Mr. Shreyash. </p>
        <small style={{ color: "#64748b" }}>(System Is Checked by Shreyash)</small>
      </section>
    </div>
  );
}

/* ===================== SMALL COMPONENTS ===================== */
function KPI({ label, value }) {
  return (
    <div style={styles.kpiCard}>
      <div style={styles.kpiValue}>{value}</div>
      <div style={styles.kpiLabel}>{label}</div>
    </div>
  );
}

function StatusBox({ label, count, color }) {
  return (
    <div style={{ ...styles.statusBox, borderLeft: `6px solid ${color}` }}>
      <b>{label}</b>
      <span>{count}</span>
    </div>
  );
}

/* ===================== STYLES ===================== */
const styles = {
  page: { maxWidth: 1400, margin: "auto", padding: 32, background: "#f8fafc", minHeight: "100vh" },
  title: { fontSize: 36, fontWeight: 900, marginBottom: 20 },

  actionBar: { display: "flex", gap: 12, marginBottom: 30, flexWrap: "wrap" },
  primaryBtn: { background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "#fff", border: "none", padding: "10px 16px", borderRadius: 12, fontWeight: 700, cursor: "pointer" },

  kpiGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 20, marginBottom: 30 },
  kpiCard: { background: "#ffffff", padding: 24, borderRadius: 18, textAlign: "center", boxShadow: "0 12px 28px rgba(0,0,0,0.06)", transition: "transform 0.2s", cursor: "default" },
  kpiValue: { fontSize: 28, fontWeight: 800, color: "#2563eb" },
  kpiLabel: { marginTop: 8, color: "#475569" },

  section: { background: "#ffffff", padding: 24, borderRadius: 18, marginBottom: 30, boxShadow: "0 8px 20px rgba(0,0,0,0.05)" },
  sectionAlt: { background: "#f1f5f9", padding: 24, borderRadius: 18, marginBottom: 30, boxShadow: "0 8px 20px rgba(0,0,0,0.05)" },

  statusRow: { display: "flex", gap: 16, flexWrap: "wrap" },
  statusBox: { background: "#ffffff", padding: 20, borderRadius: 14, minWidth: 160, display: "flex", justifyContent: "space-between", boxShadow: "0 6px 20px rgba(0,0,0,0.05)", fontWeight: 700 },

  form: { display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" },
  input: { padding: "10px 14px", borderRadius: 12, border: "1px solid #cbd5f5", flex: 1 },

  revenueBox: { marginTop: 20, fontSize: 42, fontWeight: 900, color: "#16a34a", textAlign: "center" }
};
