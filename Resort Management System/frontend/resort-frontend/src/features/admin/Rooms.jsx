import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Rooms() {

  /* ================= STATE ================= */

  const [resorts, setResorts] = useState([]);
  const [selectedResort, setSelectedResort] = useState(null);

  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);

  const [search, setSearch] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [editRoom, setEditRoom] = useState(null);

  const [form, setForm] = useState({
    roomNumber: "",
    basePrice: "",
    roomTypeId: "",
    status: "AVAILABLE"
  });

  const [loading, setLoading] = useState(false);

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    loadResorts();
    loadAvailableRooms();
  }, []);

  async function loadResorts() {
    const res = await api.get("/user/resort/getAllResort");
    setResorts(Array.isArray(res.data) ? res.data : []);
  }

  async function loadAvailableRooms() {
    const res = await api.get("/user/room/getAllAvail");
    setAvailableRooms(Array.isArray(res.data) ? res.data : []);
  }

  /* ================= RESORT SELECT ================= */

  function selectResort(resort) {
    setSelectedResort(resort);
    setRooms(
      availableRooms.filter(r => r.resort?.resortId === resort.resortId)
    );
    setShowAddForm(false);
    setEditRoom(null);
  }

  /* ================= ADD ROOM ================= */

  async function addRoom() {
    if (!selectedResort) return alert("Select resort first");

    try {
      await api.post("/user/room/addRoom", {
        roomNumber: form.roomNumber,
        basePrice: form.basePrice,
        status: form.status,
        resort: { resortId: selectedResort.resortId },
        roomType: { roomTypeId: form.roomTypeId }
      });

      resetForm();
      loadAvailableRooms();
      alert("Room added successfully");
    } catch (err) {
      alert("Failed to add room");
    }
  }

  /* ================= UPDATE ROOM ================= */

  async function updateRoom() {
    try {
      await api.put("/user/room/updateRoom", editRoom, {
        params: { roomId: editRoom.roomId }
      });

      setEditRoom(null);
      loadAvailableRooms();
      alert("Room updated");
    } catch {
      alert("Failed to update room");
    }
  }

  /* ================= CHANGE STATUS ================= */

  async function changeStatus(roomId, status) {
    try {
      await api.put("/user/room/changeStatus", null, {
        params: { roomId, status }
      });
      loadAvailableRooms();
    } catch {
      alert("Failed to change status");
    }
  }

  function resetForm() {
    setForm({
      roomNumber: "",
      basePrice: "",
      roomTypeId: "",
      status: "AVAILABLE"
    });
    setShowAddForm(false);
  }

  /* ================= FILTER ================= */

  const visibleRooms = rooms.filter(r =>
    String(r.roomNumber).includes(search)
  );

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🛏 Room Management</h1>
      <p style={styles.subtitle}>Manage resort rooms, pricing & availability</p>

      {/* ================= RESORT LIST ================= */}
      <section style={styles.card}>
        <h3 style={styles.sectionTitle}>🏨 Select Resort</h3>

        <div style={styles.resortGrid}>
          {resorts.map(r => (
            <button
              key={r.resortId}
              onClick={() => selectResort(r)}
              style={{
                ...styles.resortBtn,
                background:
                  selectedResort?.resortId === r.resortId
                    ? "linear-gradient(135deg,#2563eb,#1d4ed8)"
                    : "#e5e7eb",
                color:
                  selectedResort?.resortId === r.resortId ? "#fff" : "#000",
                transform:
                  selectedResort?.resortId === r.resortId
                    ? "scale(1.05)"
                    : "scale(1)"
              }}
            >
              🏝 {r.name}
            </button>
          ))}
        </div>
      </section>

      {/* ================= ROOMS ================= */}
      {selectedResort && (
        <section style={styles.cardAlt}>
          <h3 style={styles.sectionTitle}>
            🏠 Rooms — {selectedResort.name}
          </h3>

          <div style={styles.controls}>
            <input
              style={styles.input}
              placeholder="🔍 Search by room number"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button
              style={styles.primaryBtn}
              onClick={() => setShowAddForm(true)}
            >
              ➕ Add Room
            </button>
          </div>

          {visibleRooms.length === 0 && (
            <p style={styles.muted}>No rooms found</p>
          )}

          {visibleRooms.map(room => (
            <div key={room.roomId} style={styles.roomRow}>
              <div>
                <b>Room #{room.roomNumber}</b>
                <div style={styles.muted}>
                  🏷 Type: {room.roomType?.typeName}
                </div>
                <div style={styles.price}>₹ {room.basePrice}</div>
              </div>

              <div style={styles.actions}>
                <span style={styles.status(room.status)}>
                  {room.status}
                </span>

                <button
                  style={styles.iconBtn}
                  onClick={() => setEditRoom(room)}
                >
                  ✏️
                </button>

                <select
                  style={styles.select}
                  onChange={e => changeStatus(room.roomId, e.target.value)}
                >
                  <option>Change Status</option>
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="BOOKED">BOOKED</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ================= ADD ROOM FORM ================= */}
      {showAddForm && (
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>➕ Add New Room</h3>

          <div style={styles.form}>
            <input
              style={styles.input}
              placeholder="Room Number"
              value={form.roomNumber}
              onChange={e => setForm({ ...form, roomNumber: e.target.value })}
            />
            <input
              style={styles.input}
              placeholder="Base Price"
              value={form.basePrice}
              onChange={e => setForm({ ...form, basePrice: e.target.value })}
            />
            <input
              style={styles.input}
              placeholder="Room Type ID"
              value={form.roomTypeId}
              onChange={e => setForm({ ...form, roomTypeId: e.target.value })}
            />

            <button style={styles.primaryBtn} onClick={addRoom}>Save</button>
            <button style={styles.secondaryBtn} onClick={resetForm}>Cancel</button>
          </div>
        </section>
      )}

      {/* ================= EDIT ROOM ================= */}
      {editRoom && (
        <section style={styles.cardAlt}>
          <h3 style={styles.sectionTitle}>
            ✏️ Edit Room #{editRoom.roomNumber}
          </h3>

          <div style={styles.form}>
            <input
              style={styles.input}
              value={editRoom.basePrice}
              onChange={e =>
                setEditRoom({ ...editRoom, basePrice: e.target.value })
              }
            />
            <button style={styles.primaryBtn} onClick={updateRoom}>Update</button>
            <button
              style={styles.secondaryBtn}
              onClick={() => setEditRoom(null)}
            >
              Cancel
            </button>
          </div>
        </section>
      )}
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
    color: "#0f172a"
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
    background: "#fff",
    padding: 26,
    borderRadius: 18,
    marginBottom: 30,
    boxShadow: "0 12px 30px rgba(15,23,42,0.08)"
  },

  cardAlt: {
    background: "#f1f5f9",
    padding: 26,
    borderRadius: 18,
    marginBottom: 30
  },

  resortGrid: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap"
  },

  resortBtn: {
    padding: "12px 20px",
    borderRadius: 14,
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all .25s ease"
  },

  controls: {
    display: "flex",
    gap: 12,
    marginBottom: 14,
    flexWrap: "wrap"
  },

  roomRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "16px 0",
    borderBottom: "1px solid #e5e7eb"
  },

  actions: {
    display: "flex",
    gap: 10,
    alignItems: "center"
  },

  form: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap"
  },

  input: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid #cbd5f5"
  },

  select: {
    padding: "8px 12px",
    borderRadius: 10
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
    padding: "10px 18px",
    borderRadius: 12,
    cursor: "pointer"
  },

  iconBtn: {
    border: "none",
    background: "#e5e7eb",
    padding: "8px 10px",
    borderRadius: 10,
    cursor: "pointer"
  },

  price: {
    fontWeight: 800,
    marginTop: 4
  },

  muted: {
    color: "#64748b",
    fontSize: 14
  },

  status: s => ({
    padding: "6px 16px",
    borderRadius: 999,
    background:
      s === "AVAILABLE" ? "#16a34a" :
      s === "BOOKED" ? "#f59e0b" :
      "#ef4444",
    color: "#fff",
    fontWeight: 700
  })
};
