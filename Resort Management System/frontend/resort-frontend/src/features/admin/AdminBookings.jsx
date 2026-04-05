import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminBookings() {

  const [resorts, setResorts] = useState([]);
  const [selectedResortId, setSelectedResortId] = useState("");

  const [allBookings, setAllBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);

  const [activeFilter, setActiveFilter] = useState("ALL");

  const [loading, setLoading] = useState(false);

  /* ================= LOAD RESORTS ================= */

  useEffect(() => {
    loadResorts();
  }, []);

  async function loadResorts() {
    try {
      const res = await api.get("/user/resort/getAllResort");
      setResorts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to load resorts");
    }
  }

  /* ================= LOAD BOOKINGS BY RESORT ================= */

  async function loadBookingsByResort(resortId) {
    if (!resortId) return;

    try {
      setLoading(true);
      const res = await api.get(`/user/bookings/resort/${resortId}`);
      const bookings = Array.isArray(res.data) ? res.data : [];
      setAllBookings(bookings);
      setFilteredBookings(bookings);
      setActiveFilter("ALL");
    } catch (err) {
      console.error(err);
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  /* ================= FILTER BOOKINGS ================= */

  function filterBookings(status) {
    setActiveFilter(status);

    if (status === "ALL") {
      setFilteredBookings(allBookings);
      return;
    }

    const filtered = allBookings.filter(
      b => b.bookingStatus === status
    );

    setFilteredBookings(filtered);
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Booking Management</h1>

      {/* ================= RESORT SELECT ================= */}
      <section style={styles.sectionAlt}>
        <h3 style={styles.sectionTitle}>Select Resort</h3>

        <select
          value={selectedResortId}
          onChange={(e) => {
            setSelectedResortId(e.target.value);
            loadBookingsByResort(e.target.value);
          }}
          style={styles.select}
        >
          <option value="">-- Select Resort --</option>
          {resorts.map(r => (
            <option key={r.resortId} value={r.resortId}>
              {r.name}
            </option>
          ))}
        </select>
      </section>

      {/* ================= FILTER BUTTONS ================= */}
      {selectedResortId && (
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Filter Bookings</h3>

          <div style={styles.filterBar}>
            <FilterButton label="All" active={activeFilter === "ALL"} onClick={() => filterBookings("ALL")} />
            <FilterButton label="Confirmed" active={activeFilter === "CONFIRMED"} onClick={() => filterBookings("CONFIRMED")} />
            <FilterButton label="Pending" active={activeFilter === "CREATED"} onClick={() => filterBookings("CREATED")} />
            <FilterButton label="Cancelled" active={activeFilter === "CANCELLED"} onClick={() => filterBookings("CANCELLED")} />
            <FilterButton label="Completed" active={activeFilter === "COMPLETED"} onClick={() => filterBookings("COMPLETED")} />
          </div>
        </section>
      )}

      {/* ================= BOOKINGS LIST ================= */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Bookings</h3>

        {loading && <p style={styles.muted}>Loading bookings...</p>}

        {!loading && filteredBookings.length === 0 && (
          <p style={styles.muted}>No bookings found</p>
        )}

        {!loading && filteredBookings.map(b => (
          <div key={b.bookingId} style={styles.row}>
            <div>
              <b>Booking #{b.bookingId}</b>
              <div style={styles.muted}>
                User ID: {b.user?.userId ?? b.userId}
              </div>
              <div style={styles.dateRange}>
                {b.checkInDate} → {b.checkOutDate}
              </div>
            </div>

            <div style={styles.statusBox(b.bookingStatus)}>
              {b.bookingStatus}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

/* ================= SMALL COMPONENT ================= */

function FilterButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.filterBtn,
        ...(active ? styles.filterBtnActive : {})
      }}
    >
      {label}
    </button>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    maxWidth: 1100,
    margin: "auto",
    padding: 32,
    fontFamily: "Inter, system-ui, sans-serif",
    background: "#f1f5f9"
  },

  title: {
    fontSize: 34,
    fontWeight: 800,
    marginBottom: 30
  },

  section: {
    background: "#ffffff",
    padding: 24,
    borderRadius: 16,
    marginBottom: 30,
    boxShadow: "0 12px 25px rgba(0,0,0,0.05)"
  },

  sectionAlt: {
    background: "#ffffff",
    padding: 24,
    borderRadius: 16,
    marginBottom: 30,
    boxShadow: "0 12px 25px rgba(0,0,0,0.05)"
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 14
  },

  select: {
    padding: "10px 14px",
    borderRadius: 10,
    minWidth: 300,
    border: "1px solid #d1d5db",
    fontSize: 15,
    background: "#f8fafc"
  },

  filterBar: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap"
  },

  filterBtn: {
    border: "1px solid #d1d5db",
    padding: "8px 18px",
    borderRadius: 999,
    cursor: "pointer",
    background: "#f1f5f9",
    fontWeight: 600,
    transition: "all 0.2s ease"
  },

  filterBtnActive: {
    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
    color: "#fff",
    borderColor: "#2563eb",
    boxShadow: "0 6px 16px rgba(37,99,235,.35)"
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    marginBottom: 12,
    transition: "transform .2s ease, box-shadow .2s ease",
    background: "#ffffff"
  },

  dateRange: {
    fontSize: 14,
    marginTop: 4
  },

  muted: {
    color: "#64748b",
    fontSize: 14
  },

  statusBox: status => ({
    padding: "6px 14px",
    borderRadius: 999,
    fontWeight: 700,
    fontSize: 13,
    textTransform: "uppercase",
    background:
      status === "CONFIRMED" ? "#dcfce7" :
      status === "CREATED" ? "#fef3c7" :
      status === "CANCELLED" ? "#fee2e2" :
      status === "COMPLETED" ? "#dbeafe" :
      "#e5e7eb",
    color:
      status === "CONFIRMED" ? "#166534" :
      status === "CREATED" ? "#92400e" :
      status === "CANCELLED" ? "#991b1b" :
      status === "COMPLETED" ? "#1e3a8a" :
      "#374151"
  })
};
