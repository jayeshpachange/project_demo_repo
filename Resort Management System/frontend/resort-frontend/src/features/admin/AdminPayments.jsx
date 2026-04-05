import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminPayments() {

  /* ================= STATE ================= */

  const [payments, setPayments] = useState([]);
  const [viewPayments, setViewPayments] = useState([]);

  const [resorts, setResorts] = useState([]);

  const [statusFilter, setStatusFilter] = useState("");
  const [resortFilter, setResortFilter] = useState("");

  const [search, setSearch] = useState("");

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [userId, setUserId] = useState("");
  const [userPayments, setUserPayments] = useState([]);

  const [loading, setLoading] = useState(false);

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    loadResorts();
  }, []);

  async function loadResorts() {
    const res = await api.get("/user/resort/getAllResort");
    setResorts(Array.isArray(res.data) ? res.data : []);
  }

  /* ================= LOAD PAYMENTS ================= */

  async function loadAllPayments() {
    try {
      setLoading(true);
      const res = await api.get("/user/payments/getAllPayments");
      const data = Array.isArray(res.data) ? res.data : [];
      setPayments(data);
      setViewPayments(data);
    } catch {
      alert("Failed to load payments");
    } finally {
      setLoading(false);
    }
  }

  /* ================= FILTER ACTIONS ================= */

  function filterByStatus(status) {
    setStatusFilter(status);
    const filtered = payments.filter(p => p.paymentStatus === status);
    setViewPayments(filtered);
  }

  function filterByResort(resortId) {
    setResortFilter(resortId);
    const filtered = payments.filter(
      p => p.booking?.resort?.resortId === Number(resortId)
    );
    setViewPayments(filtered);
  }

  function searchPayments() {
    const key = search.toLowerCase();

    const filtered = payments.filter(p =>
      String(p.booking?.bookingId || "").includes(key) ||
      String(p.booking?.user?.userId || "").includes(key) ||
      p.booking?.user?.fullName?.toLowerCase().includes(key)
    );

    setViewPayments(filtered);
  }

  /* ================= USER PAYMENTS ================= */

  async function loadPaymentsByUser() {
    if (!userId) return alert("Enter User ID");

    try {
      const res = await api.get(`/user/payments/user/${userId}`);
      setUserPayments(Array.isArray(res.data) ? res.data : []);
    } catch {
      alert("Failed to fetch user payments");
    }
  }

  /* ================= REVENUE ================= */

  const totalRevenue = viewPayments
    .filter(p => p.paymentStatus === "SUCCESS")
    .reduce((s, p) => s + (p.amount || 0), 0);

  const monthlyRevenue = viewPayments
    .filter(p => {
      if (!p.paymentDate || p.paymentStatus !== "SUCCESS") return false;
      const d = new Date(p.paymentDate);
      return d.getMonth() + 1 === Number(month) &&
             d.getFullYear() === Number(year);
    })
    .reduce((s, p) => s + (p.amount || 0), 0);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>💳 Payments Control Center</h1>
      <p style={styles.subtitle}>Monitor, filter and analyze all resort transactions</p>

      {/* ================= CONTROLS ================= */}
      <section style={styles.card}>
        <h3 style={styles.sectionTitle}>🎛 Payment Controls</h3>

        <div style={styles.flex}>
          <button onClick={loadAllPayments} style={styles.primaryBtn}>
            🚀 Load All Payments
          </button>

          {["PENDING","SUCCESS","FAILED","CANCELLED","REFUNDED"].map(s => (
            <button
              key={s}
              onClick={() => filterByStatus(s)}
              style={styles.badgeBtn}
            >
              {s}
            </button>
          ))}
        </div>

        <div style={styles.flex}>
          <select style={styles.select} onChange={e => filterByResort(e.target.value)}>
            <option value="">🏨 Filter by Resort</option>
            {resorts.map(r => (
              <option key={r.resortId} value={r.resortId}>{r.name}</option>
            ))}
          </select>

          <input
            style={styles.input}
            placeholder="🔍 User ID / Name / Booking ID"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <button style={styles.secondaryBtn} onClick={searchPayments}>
            Search
          </button>
        </div>
      </section>

      {/* ================= REVENUE ================= */}
      <section style={styles.card}>
        <h3 style={styles.sectionTitle}>📊 Revenue Summary</h3>

        <div style={styles.revenueBox}>
          <div>
            <span style={styles.label}>Total Revenue</span>
            <div style={styles.amount}>₹ {totalRevenue}</div>
          </div>
        </div>

        <div style={styles.flex}>
          <input style={styles.inputSmall} placeholder="MM" value={month} onChange={e => setMonth(e.target.value)} />
          <input style={styles.inputSmall} placeholder="YYYY" value={year} onChange={e => setYear(e.target.value)} />
          <button style={styles.secondaryBtn}>Calculate</button>
        </div>

        <p>
          <b>Monthly Revenue:</b>{" "}
          <span style={styles.amountInline}>
            ₹ {month && year ? monthlyRevenue : "—"}
          </span>
        </p>
      </section>

      {/* ================= PAYMENTS LIST ================= */}
      <section style={styles.card}>
        <h3 style={styles.sectionTitle}>💼 Payment Records</h3>

        {loading && <p style={styles.muted}>⏳ Loading payments...</p>}
        {!loading && viewPayments.length === 0 && <p style={styles.muted}>No payments found</p>}

        {viewPayments.map(p => (
          <div key={p.paymentId} style={styles.paymentRow}>
            <div>
              <b>Payment #{p.paymentId}</b>
              <div style={styles.muted}>
                👤 {p.booking?.user?.fullName} (ID: {p.booking?.user?.userId})
              </div>
              <div style={styles.muted}>📘 Booking ID: {p.booking?.bookingId}</div>
              <div style={styles.amountInline}>₹ {p.amount}</div>
            </div>
            <span style={styles.status(p.paymentStatus)}>
              {p.paymentStatus}
            </span>
          </div>
        ))}
      </section>

      {/* ================= USER PAYMENTS ================= */}
      <section style={styles.cardAlt}>
        <h3 style={styles.sectionTitle}>👤 User Payment History</h3>

        <div style={styles.flex}>
          <input
            style={styles.input}
            placeholder="Enter User ID"
            value={userId}
            onChange={e => setUserId(e.target.value)}
          />
          <button style={styles.secondaryBtn} onClick={loadPaymentsByUser}>
            Fetch
          </button>
        </div>

        {userPayments.map(p => (
          <div key={p.paymentId} style={styles.paymentRow}>
            <div>
              <b>Payment #{p.paymentId}</b>
              <div style={styles.muted}>Booking ID: {p.booking?.bookingId}</div>
              <div style={styles.amountInline}>₹ {p.amount}</div>
            </div>
            <span style={styles.status(p.paymentStatus)}>
              {p.paymentStatus}
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    maxWidth: 1300,
    margin: "auto",
    padding: 32,
    background: "linear-gradient(135deg,#f8fafc,#eef2ff)",
    minHeight: "100vh"
  },

  title: {
    fontSize: 36,
    fontWeight: 900,
    marginBottom: 6,
    color: "#1e293b"
  },

  subtitle: {
    color: "#64748b",
    marginBottom: 28
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 800,
    marginBottom: 14
  },

  card: {
    background: "#ffffff",
    padding: 26,
    borderRadius: 18,
    marginBottom: 30,
    boxShadow: "0 12px 30px rgba(15,23,42,0.08)"
  },

  cardAlt: {
    background: "#f1f5f9",
    padding: 26,
    borderRadius: 18
  },

  flex: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 12
  },

  primaryBtn: {
    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer"
  },

  secondaryBtn: {
    background: "#0f172a",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 12,
    cursor: "pointer"
  },

  badgeBtn: {
    background: "#e5e7eb",
    border: "none",
    padding: "8px 14px",
    borderRadius: 999,
    cursor: "pointer",
    fontWeight: 600
  },

  select: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid #cbd5f5"
  },

  input: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid #cbd5f5",
    minWidth: 260
  },

  inputSmall: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid #cbd5f5",
    width: 90
  },

  revenueBox: {
    background: "linear-gradient(135deg,#22c55e,#16a34a)",
    color: "#052e16",
    padding: 20,
    borderRadius: 16,
    marginBottom: 14
  },

  label: {
    fontSize: 13,
    opacity: 0.9
  },

  amount: {
    fontSize: 28,
    fontWeight: 900
  },

  amountInline: {
    fontWeight: 800
  },

  paymentRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "16px 0",
    borderBottom: "1px solid #e5e7eb"
  },

  muted: {
    color: "#64748b",
    fontSize: 14
  },

  status: s => ({
    padding: "6px 16px",
    borderRadius: 999,
    background:
      s === "SUCCESS" ? "#16a34a" :
      s === "PENDING" ? "#f59e0b" :
      s === "FAILED" ? "#dc2626" :
      s === "REFUNDED" ? "#3b82f6" :
      "#6b7280",
    color: "#fff",
    fontWeight: 700
  })
};
