import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {

  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ================= LOAD DASHBOARD DATA ================= */

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const [bookingRes, paymentRes] = await Promise.all([
        api.get("/user/bookings/getAllBooking"),
        api.get("/user/payments/getAllPayments")
      ]);

      setBookings(bookingRes.data || []);
      setPayments(paymentRes.data || []);

    } catch (err) {
      console.error(err);
      alert("Failed to load owner dashboard data");
    } finally {
      setLoading(false);
    }
  }

  /* ================= METRICS ================= */

  const totalBookings = bookings.length;

  const confirmedBookings = bookings.filter(
    b => b.bookingStatus === "CONFIRMED"
  ).length;

  const completedBookings = bookings.filter(
    b => b.bookingStatus === "COMPLETED"
  ).length;

  const cancelledBookings = bookings.filter(
    b => b.bookingStatus === "CANCELLED"
  ).length;

  const totalRevenue = payments
    .filter(p => p.paymentStatus === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (loading) return <Center text="Loading owner dashboard..." />;

  return (
    <div style={styles.page}>

      {/* ===== ANIMATION STYLES ===== */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
      `}</style>

      <h1 style={styles.title}>🏨 Owner Dashboard</h1>


      {/* ===== ADMIN QUICK NAVIGATION ===== */}
      <div style={styles.navBar}>
        <button style={styles.navBtn} onClick={() => navigate("/admin/master")}>
          🗂 Master Data
        </button>

        <button style={styles.navBtn} onClick={() => navigate("/admin/users")}>
          👥 Users
        </button>

        <button style={styles.navBtn} onClick={() => navigate("/admin/resorts")}>
          🏨 Resorts
        </button>

        <button style={styles.navBtn} onClick={() => navigate("/admin/bookings")}>
          📅 Bookings
        </button>

        <button style={styles.navBtn} onClick={() => navigate("/admin/payments")}>
          💳 Payments
        </button>

        <button style={styles.navBtn} onClick={() => navigate("/admin/room")}>
          🛏️ Rooms
        </button>

        <button style={styles.navBtn} onClick={() => navigate("/admin/food")}>
          🍴 Food
        </button>

        <button style={styles.navBtn} onClick={() => navigate("/admin/pricing")}>
          💰 Pricing
        </button>

        <button style={styles.navBtn} onClick={() => navigate("/admin/audit-logs")}>
          🧾 Audit Logs
        </button>
      </div>


      {/* ===== METRIC CARDS ===== */}
      <div style={styles.cardGrid}>

        <MetricCard
          title="Total Bookings"
          value={totalBookings}
          color="#2563eb"
        />

        <MetricCard
          title="Active Bookings"
          value={confirmedBookings}
          color="#16a34a"
        />

        <MetricCard
          title="Completed"
          value={completedBookings}
          color="#0f766e"
        />

        <MetricCard
          title="Cancelled"
          value={cancelledBookings}
          color="#dc2626"
        />

        <MetricCard
          title="Total Revenue"
          value={`₹ ${totalRevenue.toFixed(2)}`}
          color="#7c3aed"
        />

      </div>

      {/* ===== RECENT BOOKINGS ===== */}
      <section style={styles.section}>
        <h3>📋 Recent Bookings</h3>

        {recentBookings.length === 0 && (
          <p>No bookings available</p>
        )}

        {recentBookings.map(b => (
          <div key={b.bookingId} style={styles.row}>
            <div>
              <b>Booking #{b.bookingId}</b>
              <div>Status: {b.bookingStatus}</div>
              <small>
                {b.checkInDate} → {b.checkOutDate}
              </small>
            </div>

            <div style={styles.amount}>
              ₹ {b.totalAmount}
            </div>
          </div>
        ))}
      </section>

      {/* ===== INSIGHT SECTION ===== */}
      <section style={styles.sectionAlt}>
        <h3>📊 Owner Insights</h3>

        <ul style={styles.insights}>
          <li>
            {confirmedBookings > 0
              ? "✔ You have active guests staying currently."
              : "⚠ No active bookings at the moment."}
          </li>

          <li>
            {cancelledBookings > completedBookings
              ? "⚠ High cancellation rate detected."
              : "✔ Booking completion rate is healthy."}
          </li>

          <li>
            {totalRevenue > 0
              ? "💰 Revenue is being generated successfully."
              : "⚠ No successful payments yet."}
          </li>
        </ul>
      </section>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function MetricCard({ title, value, color }) {
  return (
    <div
      style={{
        ...styles.card,
        borderLeft: `6px solid ${color}`,
        animation: "fadeUp 0.6s ease"
      }}
    >
      <div style={styles.cardTitle}>{title}</div>
      <div style={{ ...styles.cardValue, color }}>{value}</div>
    </div>
  );
}

function Center({ text }) {
  return (
    <div style={{
      height: "70vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <h2>{text}</h2>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    maxWidth: 1100,
    margin: "auto",
    padding: 24
  },
navBar: {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
  marginBottom: 30,
  animation: "fadeUp 0.4s ease"
},

navBtn: {
  background: "#1f2937",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 600,
  transition: "all 0.25s ease"
}
,
  title: {
    fontSize: 34,
    fontWeight: 800,
    marginBottom: 30
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20,
    marginBottom: 40
  },

  card: {
    background: "#ffffff",
    padding: 20,
    borderRadius: 14,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    transition: "transform 0.3s ease",
    cursor: "default"
  },

  cardTitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8
  },

  cardValue: {
    fontSize: 26,
    fontWeight: 800
  },

  section: {
    background: "#ffffff",
    padding: 22,
    borderRadius: 16,
    marginBottom: 30,
    animation: "fadeUp 0.7s ease"
  },

  sectionAlt: {
    background: "#f8fafc",
    padding: 22,
    borderRadius: 16,
    animation: "fadeUp 0.8s ease"
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 0",
    borderBottom: "1px solid #e5e7eb"
  },

  amount: {
    fontWeight: 700
  },

  insights: {
    listStyle: "none",
    paddingLeft: 0,
    lineHeight: "1.8"
  }
};
