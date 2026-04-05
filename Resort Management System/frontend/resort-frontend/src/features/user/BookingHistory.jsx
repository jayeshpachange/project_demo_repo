import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/* ================= BOOKING HISTORY COMPONENT ================= */

export default function BookingHistory() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      const res = await api.get(`/user/bookings/user/${userId}`);
      setBookings(res.data || []);
    } catch (err) {
      alert("Failed to load booking history");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Center text="Loading bookings..." />;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>📜 Booking History</h1>
      <p style={styles.subtitle}>Your past and active stays</p>

      {bookings.length === 0 && <p style={styles.noBooking}>No bookings found 😔</p>}

      {bookings.map((b) => {
        // Random resort image
        
        const imgUrl =  (axios.get(`http://localhost:8080/user/resort/getResortImg`, {
          params: { resortId: b.resort.resortId }
        })).data?.[0];

        return (
          <section key={b.bookingId} style={styles.card}>
            <div style={styles.cardHeader}>
              <img src={imgUrl} alt="resort" style={styles.resortImg} />
              <h3 style={styles.resortName}>{b.resort.name}</h3>
            </div>

            <Row label="Booking ID" value={b.bookingId} />
            <Row label="Stay" value={`${b.checkInDate} → ${b.checkOutDate}`} />
            <Row
              label="Status"
              value={
                <span style={{...styles.status, ...statusColors[b.bookingStatus]}}>
                  {b.bookingStatus === "CONFIRMED" ? "✅ " : "⏳ "} {b.bookingStatus}
                </span>
              }
            />
            <Row label="Total Amount" value={`₹ ${b.totalAmount || "-"}`} />

            <div style={styles.actions}>
              <button
                style={styles.secondaryBtn}
                onClick={() =>
                  navigate(`/user/booking/${b.bookingId}/services`)
                }
              >
                🛎 Services
              </button>

              <button
                style={styles.primaryBtn}
                onClick={() => {
                  localStorage.setItem("currentBookingId", b.bookingId);
                  navigate("/user/payments");
                }}
              >
                💳 Payments
              </button>
            </div>
          </section>
        );
      })}
    </div>
  );
}

/* ================= HELPERS ================= */
function Row({ label, value }) {
  return (
    <div style={styles.row}>
      <span style={styles.rowLabel}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Center({ text }) {
  return (
    <div
      style={{
        height: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 24,
        color: "#0f766e",
        fontWeight: 600
      }}
    >
      {text}
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: { maxWidth: 900, margin: "auto", padding: 24 },
  title: { fontSize: 32, fontWeight: 800, marginBottom: 4 },
  subtitle: { opacity: 0.8, marginBottom: 24, fontSize: 17 },
  noBooking: { textAlign: "center", color: "#9ca3af", fontSize: 16 },

  card: {
    background: "linear-gradient(145deg, #ffffff, #e0f2fe)",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "pointer"
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 12
  },

  resortImg: {
    width: 80,
    height: 60,
    borderRadius: 10,
    objectFit: "cover",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    transition: "transform 0.3s"
  },

  resortName: { fontSize: 20, fontWeight: 700, margin: 0, color: "#065f46" },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
    fontSize: 15
  },

  rowLabel: { fontWeight: 600, color: "#047857" },

  status: { fontWeight: 600 },

  actions: {
    marginTop: 16,
    display: "flex",
    gap: 12,
    flexWrap: "wrap"
  },

  primaryBtn: {
    background: "linear-gradient(90deg,#16a34a,#4ade80)",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
  },

  secondaryBtn: {
    background: "linear-gradient(90deg,#fcd34d,#f59e0b)",
    color: "#1f2937",
    padding: "8px 16px",
    border: "none",
    borderRadius: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
  }
};

/* ================= STATUS COLORS ================= */
const statusColors = {
  CONFIRMED: { color: "#16a34a" },
  PENDING: { color: "#f59e0b" },
  CANCELLED: { color: "#ef4444" }
};
