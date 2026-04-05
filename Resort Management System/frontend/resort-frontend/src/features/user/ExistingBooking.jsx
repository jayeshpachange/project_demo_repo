import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function ExistingBooking() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD BOOKINGS ================= */

  useEffect(() => {
    if (!userId) return;
    loadBookings();
  }, [userId]);

  async function loadBookings() {
    try {
      setLoading(true);
      const res = await api.get(`/user/bookings/user/${userId}`);

      // ✅ Existing / Pending bookings only
      const pending = (res.data || []).filter(
        b => b.bookingStatus !== "CANCELLED"
      );

      setBookings(pending);
    } catch (err) {
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  /* ================= Cancel BOOKING (BROKEN - KEPT AS IS) ================= */
  async function cancelBookingBroken() {
    if (!bookings.bookingId) {
      alert("Booking not found");
      return;
    }

    const ok = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!ok) return;

    try {
      await api.put(`/user/bookings/${bookings.bookingId}/cancel`);
      alert("Booking cancelled successfully");
      loadBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking");
    }
  }

  /* ================= ACTIONS ================= */

  async function confirmBooking(bookingId) {
    try {
      await api.put(`/user/bookings/${bookingId}/confirm`);
      alert("Booking confirmed");
      loadBookings();
    } catch {
      alert("Cannot confirm booking");
    }
  }

  async function cancelBooking(bookingId) {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await api.put(`/user/bookings/${bookingId}/cancel`);
      alert("Booking cancelled");
      loadBookings();
    } catch {
      alert("Cannot cancel booking");
    }
  }

  /* ================= UI ================= */

  if (loading) return <Center text="Loading existing bookings..." />;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>📘 Existing Bookings</h1>
      <p style={styles.subtitle}>
        Manage bookings created but not yet completed
      </p>

      {bookings.length === 0 && (
        <p style={{ opacity: 0.6 }}>No existing bookings</p>
      )}

      {bookings.map(b => (
        <section key={b.bookingId} style={styles.card}>
          {/* HEADER */}
          <div style={styles.header}>
            <div>
              <h3>{b.resort?.name}</h3>
              <p>
                {b.checkInDate} → {b.checkOutDate}
              </p>
            </div>

            <span style={badge(b.bookingStatus)}>
              {b.bookingStatus}
            </span>
          </div>

          {/* DETAILS */}
          <p><b>Booking ID:</b> {b.bookingId}</p>
          <p><b>Location:</b> {b.resort?.location?.locationName}</p>

          {/* ACTIONS */}
          <div style={styles.actions}>
            <button
              style={styles.secondaryBtn}
              onClick={() =>
                navigate(`/user/booking/${b.bookingId}`)
              }
            >
              🛏 Manage Rooms
            </button>

            <button
              style={styles.secondaryBtn}
              onClick={() =>
                navigate(`/user/booking/${b.bookingId}/services`)
              }
            >
              🧺 Services
            </button>

            <button
              style={styles.primaryBtn}
              onClick={() => {
                localStorage.setItem("currentBookingId", b.bookingId);
                navigate("/user/payments");
              }}
            >
              💳 Payment
            </button>

            {/* ✅ EXISTING LOGIC (CREATED) */}
            {b.bookingStatus === "CREATED" && (
              <>
                <button
                  style={styles.confirmBtn}
                  onClick={() => confirmBooking(b.bookingId)}
                >
                  ✅ Confirm
                </button>

                <button
                  style={styles.cancelBtn}
                  onClick={() => cancelBooking(b.bookingId)}
                >
                  ❌ Cancel
                </button>
              </>
            )}

            {/* ✅ ADDED: CANCEL FOR PENDING */}
            {b.bookingStatus === "PENDING" && (
              <button
                style={styles.cancelBtn}
                onClick={() => cancelBooking(b.bookingId)}
              >
                ❌ Cancel Booking
              </button>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

/* ================= HELPERS ================= */

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

function badge(status) {
  return {
    padding: "6px 12px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 700,
    background:
      status === "CONFIRMED"
        ? "#dcfce7"
        : status === "CREATED"
        ? "#fef9c3"
        : "#fee2e2",
    color:
      status === "CONFIRMED"
        ? "#166534"
        : status === "CREATED"
        ? "#854d0e"
        : "#991b1b"
  };
}

/* ================= STYLES ================= */

const styles = {
  page: { maxWidth: 900, margin: "auto", padding: 24 },

  title: { fontSize: 32, fontWeight: 800 },
  subtitle: { opacity: 0.7, marginBottom: 20 },

  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    boxShadow: "0 10px 25px rgba(0,0,0,.08)"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14
  },

  primaryBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 8,
    fontWeight: 700
  },

  secondaryBtn: {
    background: "#e5e7eb",
    border: "none",
    padding: "8px 14px",
    borderRadius: 8
  },

  confirmBtn: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 8
  },

  cancelBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 8
  }
};
