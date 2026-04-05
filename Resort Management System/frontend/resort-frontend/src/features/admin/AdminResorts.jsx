import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function AdminResorts() {
  const navigate = useNavigate();

  const [resorts, setResorts] = useState([]);
  const [selectedResort, setSelectedResort] = useState(null);

  const [resortImages, setResortImages] = useState([]);
  const [resortAmenities, setResortAmenities] = useState([]);

  const [newResort, setNewResort] = useState({
    name: "",
    description: "",
    ecoScore: "",
    rating: "",
    location: { locationId: "" }
  });

  const [newImageUrl, setNewImageUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  /* ================= LOAD ALL RESORTS ================= */

  useEffect(() => {
    loadResorts();
  }, []);

  async function loadResorts() {
    try {
      setLoading(true);
      const res = await api.get("/user/resort/getAllResort");
      setResorts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to load resorts");
    } finally {
      setLoading(false);
    }
  }

  /* ================= SELECT RESORT ================= */

  async function selectResort(resort) {
    if (!resort?.resortId) return;

    setSelectedResort(resort);
    setResortImages([]);
    setResortAmenities([]);

    try {
      setDetailsLoading(true);

      const [imgRes, amenityRes] = await Promise.all([
        api.get("/user/resort/getResortImg", {
          params: { resortId: resort.resortId }
        }),
        api.get("/user/resort/getAmenityByResort", {
          params: { resortId: resort.resortId }
        })
      ]);

      setResortImages(Array.isArray(imgRes.data) ? imgRes.data : []);
      setResortAmenities(Array.isArray(amenityRes.data) ? amenityRes.data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to load resort details");
    } finally {
      setDetailsLoading(false);
    }
  }

  /* ================= ADD RESORT ================= */

  async function addResort() {
    if (!newResort.name || !newResort.location.locationId) {
      alert("Resort name and locationId are required");
      return;
    }

    try {
      const res = await api.post("/user/resort/addResort", newResort);
      alert("Resort created successfully");

      setNewResort({
        name: "",
        description: "",
        ecoScore: "",
        rating: "",
        location: { locationId: "" }
      });

      loadResorts();
      selectResort(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to create resort");
    }
  }

  /* ================= ADD IMAGE ================= */

  async function addImageToResort() {
    if (!selectedResort || !newImageUrl) {
      alert("Select resort and enter image URL");
      return;
    }

    try {
      await api.post("/user/resort/addImage", {
        imageUrl: newImageUrl,
        resort: { resortId: selectedResort.resortId }
      });

      alert("Image added successfully");
      setNewImageUrl("");
      selectResort(selectedResort);
    } catch (err) {
      console.error(err);
      alert("Failed to add image");
    }
  }

  /* ================= ACTIVATE / DEACTIVATE ================= */

  async function toggleResortStatus(resort) {
    try {
      if (resort.isActive) {
        await api.put("/user/resort/deactivateResort", null, {
          params: { resortId: resort.resortId }
        });
      } else {
        await api.put("/user/resort/activateResort", null, {
          params: { resortId: resort.resortId }
        });
      }

      setSelectedResort(null);
      loadResorts();
    } catch (err) {
      console.error(err);
      alert("Failed to update resort status");
    }
  }

  if (loading) return <Center text="Loading resorts..." />;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Resort Management</h1>

      {/* ================= ADD NEW RESORT ================= */}
      <section style={styles.sectionAlt}>
        <h3 style={styles.sectionTitle}>Add New Resort</h3>

        <div style={styles.formGrid}>
          <input style={styles.input} placeholder="Resort Name" value={newResort.name}
            onChange={e => setNewResort({ ...newResort, name: e.target.value })} />

          <input style={styles.input} placeholder="Description" value={newResort.description}
            onChange={e => setNewResort({ ...newResort, description: e.target.value })} />

          <input style={styles.input} placeholder="Eco Score" value={newResort.ecoScore}
            onChange={e => setNewResort({ ...newResort, ecoScore: e.target.value })} />

          <input style={styles.input} placeholder="Rating" value={newResort.rating}
            onChange={e => setNewResort({ ...newResort, rating: e.target.value })} />

          <input style={styles.input} placeholder="Location ID" value={newResort.location.locationId}
            onChange={e => setNewResort({ ...newResort, location: { locationId: e.target.value } })} />
        </div>

        <button style={styles.primaryBtn} onClick={addResort}>
          ➕ Add Resort
        </button>
      </section>

      {/* ================= RESORT LIST ================= */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>All Resorts</h3>

        {resorts.map(resort => (
          <div key={resort.resortId} style={styles.row}>
            <div>
              <b>{resort.name}</b>
              <div style={styles.badge(resort.isActive)}>
                {resort.isActive ? "ACTIVE" : "INACTIVE"}
              </div>
            </div>

            <div style={styles.actions}>
              <button style={styles.secondaryBtn} onClick={() => selectResort(resort)}>
                View
              </button>
              <button
                style={resort.isActive ? styles.warnBtn : styles.successBtn}
                onClick={() => toggleResortStatus(resort)}
              >
                {resort.isActive ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* ================= RESORT DETAILS ================= */}
      {selectedResort && (
        <section style={styles.sectionAlt}>
          <h3 style={styles.sectionTitle}>{selectedResort.name}</h3>

          {detailsLoading && <p style={styles.muted}>Loading details...</p>}

          {!detailsLoading && (
            <>
              <h4 style={styles.subTitle}>Images</h4>

              <div style={styles.imageGrid}>
                {resortImages.map((url, i) => (
                  <img key={i} src={url} alt="resort" style={styles.image} />
                ))}
              </div>

              <input
                style={styles.input}
                placeholder="New Image URL"
                value={newImageUrl}
                onChange={e => setNewImageUrl(e.target.value)}
              />

              <button style={styles.primaryBtn} onClick={addImageToResort}>
                ➕ Add Image
              </button>

              <h4 style={styles.subTitle}>Admin Actions</h4>

              <div style={styles.adminActions}>
                <button style={styles.secondaryBtn} onClick={() => navigate("/admin/bookings")}>Bookings</button>
                <button style={styles.secondaryBtn} onClick={() => navigate("/admin/master")}>Services</button>
                <button style={styles.secondaryBtn} onClick={() => navigate("/admin/master")}>Food</button>
                <button style={styles.secondaryBtn} onClick={() => navigate("/admin/master")}>Rooms</button>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}

/* ================= HELPERS ================= */

function Center({ text }) {
  return (
    <div style={{
      height: "70vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #f8fafc, #eef2ff)"
    }}>
      <h2 style={{ fontWeight: 700 }}>{text}</h2>
    </div>
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
    marginBottom: 16
  },

  subTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginTop: 24,
    marginBottom: 12
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    marginBottom: 12,
    transition: "transform .2s ease, box-shadow .2s ease"
  },

  actions: {
    display: "flex",
    gap: 10
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
    gap: 12,
    marginBottom: 16
  },

  input: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14
  },

  primaryBtn: {
    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: 8,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(37,99,235,.35)"
  },

  secondaryBtn: {
    background: "#f1f5f9",
    border: "1px solid #cbd5f5",
    padding: "8px 14px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600
  },

  warnBtn: {
    background: "#fee2e2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    padding: "8px 14px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600
  },

  successBtn: {
    background: "#dcfce7",
    border: "1px solid #86efac",
    color: "#166534",
    padding: "8px 14px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600
  },

  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))",
    gap: 12,
    marginBottom: 12
  },

  image: {
    width: "100%",
    height: 100,
    objectFit: "cover",
    borderRadius: 10,
    boxShadow: "0 6px 14px rgba(0,0,0,.15)"
  },

  adminActions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 10
  },

  muted: {
    color: "#64748b"
  },

  badge: active => ({
    marginTop: 6,
    padding: "2px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    background: active ? "#dcfce7" : "#fee2e2",
    color: active ? "#166534" : "#991b1b",
    display: "inline-block"
  })
};
