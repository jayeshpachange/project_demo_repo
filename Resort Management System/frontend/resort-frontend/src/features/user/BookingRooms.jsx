import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function BookingRooms() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [availableRooms, setAvailableRooms] = useState([]);
  const [bookingRooms, setBookingRooms] = useState([]);
  const [brId, setBrId] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    loadData();
  }, [bookingId]);

  async function loadData() {
    try {
      setLoading(true);

      const [availRes, bookingRoomRes , brsId] = await Promise.all([
        api.get("/user/room/getAllAvail"),
        api.get(`/user/bookings/roomByBookingId/${bookingId}`),
        api.get(`/user/bookings/getBookingRoomByBookingId/${bookingId}`)
      ]);

      setAvailableRooms(availRes.data || []);
      setBrId(brsId.data)

      // backend sometimes returns single object instead of list
      if (Array.isArray(bookingRoomRes.data)) {
        setBookingRooms(bookingRoomRes.data);
      } else if (bookingRoomRes.data) {
        setBookingRooms([bookingRoomRes.data]);
      } else {
        setBookingRooms([]);
      }

    } catch (err) {
      console.error(err);
      alert("Failed to load room data");
    } finally {
      setLoading(false);
    }
  }

  /* ================= ADD ROOM TO BOOKING ================= */
    async function addRoom(roomId, pricePerNight) {
    try {
        await api.post(`/user/bookings/${bookingId}/rooms`, {
        room: { roomId: roomId },
        pricePerNight: pricePerNight
        });

        loadData(); // refresh booking info
    } catch (err) {
        console.error(err);
        const msg = err.response?.data?.error || "Failed to add room";
        alert(msg);
    }
    }




  /* ================= REMOVE ROOM FROM BOOKING ================= */

    async function removeRoom(id) {
    if (!id) {
        alert("Booking Room ID missing");
        return;
    }
    try {
        const response = await api.get(`/user/bookings/getBookingRoomByBookingId/${id}`);
        const adss = response.data;
        await api.delete(`/user/bookings/rooms/${adss[0]?.bookingRoomId}`);
        loadData();
    } catch (err) {
        console.error(err);
        alert("Failed to remove room");
    }
    }


  if (loading) return <Center text="Loading rooms..." />;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🛏 Manage Rooms</h1>

      {/* ===== ROOMS ADDED TO BOOKING ===== */}
      <section style={styles.sectionAlt}>
        <h3>Rooms in this Booking</h3>

        {bookingRooms.length === 0 && (
          <p>No rooms added yet</p>
        )}

        {bookingRooms.map((br , index) => (
          <div key={br.bookingRoomId || br.roomId || index} style={styles.row}>
            <div>
                <b>{(br.room?.roomType || br.roomType)?.typeName}</b>
                <div>Room #{br.room?.roomNumber || br.roomNumber}</div>
                <small>₹ {br.room?.basePrice || br.basePrice}</small>

            </div>

            <button
              style={styles.removeBtn}
              onClick={() => removeRoom(bookingId)}
            >
              ❌ Remove
            </button>
          </div>
        ))}
      </section>

      {/* ===== AVAILABLE ROOMS ===== */}
      <section style={styles.section}>
        <h3>Available Rooms</h3>

        {availableRooms.length === 0 && (
          <p>No rooms available</p>
        )}

        {availableRooms.map(r => (
          <div key={r.roomId} style={styles.row}>
            <div>
              <b>{r.roomType.typeName}</b>
              <div>Room #{r.roomNumber}</div>
              <small>₹ {r.basePrice}</small>
            </div>

            <button
              style={styles.addBtn}
              onClick={() => addRoom(r.roomId , r.basePrice)}
            >
              ➕ Add
            </button>

          </div>
        ))}
      </section>

      {/* ===== ACTIONS ===== */}
      <div style={styles.actions}>
        <button
          style={styles.secondaryBtn}
          onClick={() =>
            navigate(`/user/booking/${bookingId}/services`)
          }
        >
          Next → Services
        </button>

        <button
          style={styles.primaryBtn}
          onClick={() => navigate("/user/existing-bookings")}
        >
          Back
        </button>
      </div>
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

/* ================= STYLES ================= */

const styles = {
  page: { maxWidth: 900, margin: "auto", padding: 24 },
  title: { fontSize: 32, fontWeight: 800 },

  section: {
    background: "#fff",
    padding: 20,
    borderRadius: 14,
    marginBottom: 30
  },

  sectionAlt: {
    background: "#f8fafc",
    padding: 20,
    borderRadius: 14,
    marginBottom: 30
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb"
  },

  addBtn: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6
  },

  removeBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6
  },

  actions: {
    display: "flex",
    justifyContent: "space-between"
  },

  primaryBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: 10
  },

  secondaryBtn: {
    background: "#e5e7eb",
    border: "none",
    padding: "10px 18px",
    borderRadius: 10
  }
};
