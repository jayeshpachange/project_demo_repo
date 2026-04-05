import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function BookingServices() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [allServices, setAllServices] = useState([]);
  const [bookingServices, setBookingServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(null);
  const [bookedRoom, setBookedRoom] = useState(null);
  const [bookingRooms, setBookingRooms] = useState([]);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    loadData();
  }, [bookingId]);

  async function loadData() {
    try {
      setLoading(true);

      const [catalogRes, bookingRes, roomRes, bookingResFull] =
        await Promise.all([
          api.get("/user/bookings/service/getAll"),
          api.get(`/user/bookings/services/${bookingId}`),
          api.get(`/user/bookings/roomByBookingId/${bookingId}`),
          api.get(`/user/bookings/getbookingDetailsById/${bookingId}`)
        ]);

      setAllServices(catalogRes.data || []);
      setBookingServices(bookingRes.data || []);

      // ✅ roomByBookingId returns SINGLE room object
      if (roomRes.data && roomRes.data.roomId) {
        setBookedRoom(roomRes.data);
        setBookingRooms([roomRes.data]); // keeping your existing logic safe
      } else {
        setBookedRoom(null);
        setBookingRooms([]);
      }

      setBooking(bookingResFull.data || null);
    } catch (err) {
      console.error(err);
      setError("Failed to load services");
    } finally {
      setLoading(false);
    }
  }

  /* ================= ADD SERVICE ================= */

  async function addService(serviceId) {
    try {
      await api.post(`/user/bookings/${bookingId}/services`, {
        service: { serviceId },
        serviceCount: 1
      });

      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to add service");
    }
  }

  /* ================= REMOVE SERVICE ================= */

  async function removeService(bookingServiceId) {
    try {
      await api.delete(`/user/bookings/services/${bookingServiceId}`);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to remove service");
    }
  }

  /* ================= CONFIRM BOOKING ================= */

 async function confirmBooking() {
  if (!bookedRoom) {
    alert("Please add at least one room before confirming booking");
    return;
  }

  try {

    const priceRes = await api.get(
      `/user/bookings/getBookingPriceDetails/${bookingId}`
    );

    const price = priceRes.data;

    await api.put(`/user/bookings/${bookingId}/confirm`);

    confirm(
      `🎉 Booking Confirmed!\n\n` +
      `🛏️ Rooms Total: ₹${price.roomTotal}\n` +
      `🧺 Services Total: ₹${price.serviceTotal}\n` +
      `🌙 Nights: ${price.nights}\n\n` +
      `💰 Grand Total: ₹${price.grandTotal}`
    );

    navigate("/user/bookings");
  } catch (err) {
    console.error(err);
    alert("Cannot confirm booking");
  }
}


  /* ================= UI ================= */

  if (loading) return <Center text="Loading services..." />;
  if (error) return <Center text={error} />;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🧾 Booking Services</h1>
      <p style={styles.subtitle}>Enhance your stay with premium services</p>

      {/* ===== ROOM STATUS ===== */}
      <div
        style={{
          background: bookingRooms.length > 0 ? "#ecfdf5" : "#fff1f2",
          padding: 16,
          borderRadius: 14,
          marginBottom: 30,
          boxShadow: "0 8px 20px rgba(0,0,0,.08)"
        }}
      >
        {bookingRooms.length === 0 ? (
          <>
            <h3>⚠️ No Room Added</h3>
            <p>You must add at least one room to continue.</p>

            <button
              style={styles.primaryBtn}
              onClick={() => navigate(`/user/booking/${bookingId}`)}
            >
              ➕ Add Room
            </button>
          </>
        ) : (
          <>
            <h3>🛏️ Room Added</h3>

            <div style={{ marginTop: 10 }}>
              <b>{bookedRoom.roomType.typeName}</b> — Room #
              {bookedRoom.roomNumber}
              <br />
              Capacity: {bookedRoom.roomType.capacity} | ₹{" "}
              {bookedRoom.basePrice} / night
            </div>
          </>
        )}
      </div>

      {/* ===== AVAILABLE SERVICES ===== */}
      <section style={styles.section}>
        <h3>➕ Available Services</h3>

        <div style={styles.grid}>
          {allServices.map(s => (
            <div key={s.serviceId} style={styles.card}>
              <h4>{s.service.serviceName}</h4>
              <p>₹ {s.service.price}</p>

              <button
                style={styles.primaryBtn}
                onClick={() => addService(s.service.serviceId)}
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ADDED SERVICES ===== */}
      <section style={styles.sectionAlt}>
        <h3>🧺 Added to Booking</h3>

        {bookingServices.length === 0 && (
          <p style={{ opacity: 0.6 }}>No services added yet</p>
        )}

        {bookingServices.map(bs => (
          <div key={bs.bookingServiceId} style={styles.row}>
            <div>
              <b>{bs.service.name}</b>
              <div>Qty: {bs.serviceCount}</div>
            </div>

            <div>
              ₹ {bs.service.price * bs.serviceCount}
              <button
                style={styles.removeBtn}
                onClick={() => removeService(bs.bookingServiceId)}
              >
                ✖
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* ===== ACTIONS ===== */}
      <div style={styles.actions}>
        <button
          style={{
            ...styles.confirmBtn,
            opacity: bookingRooms.length === 0 ? 0.5 : 1,
            cursor:
              bookingRooms.length === 0 ? "not-allowed" : "pointer"
          }}
          disabled={bookingRooms.length === 0}
          onClick={confirmBooking}
        >
          Confirm Booking ✅
        </button>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function Center({ text }) {
  return (
    <div
      style={{
        height: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <h2>{text}</h2>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: { maxWidth: 900, margin: "auto", padding: 24 },

  title: { fontSize: 32, fontWeight: 800 },
  subtitle: { opacity: 0.7, marginBottom: 20 },

  section: {
    background: "#fff",
    padding: 20,
    borderRadius: 14,
    marginBottom: 30,
    boxShadow: "0 10px 25px rgba(0,0,0,.08)"
  },

  sectionAlt: {
    background: "#f8fafc",
    padding: 20,
    borderRadius: 14,
    marginBottom: 30
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
    gap: 16
  },

  card: {
    padding: 16,
    border: "1px solid #e5e7eb",
    borderRadius: 12
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb"
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 30
  },

  primaryBtn: {
    marginTop: 10,
    padding: "8px 14px",
    background: "#0f766e",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer"
  },

  confirmBtn: {
    padding: "12px 22px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontWeight: 700
  },

  removeBtn: {
    marginLeft: 12,
    background: "none",
    border: "none",
    color: "#ef4444",
    cursor: "pointer"
  }
};
