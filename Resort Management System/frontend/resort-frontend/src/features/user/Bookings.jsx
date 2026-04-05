import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";


/* ================= UTIL UI ================= */

const randomImages = [
  "https://images.unsplash.com/photo-1501117716987-c8e1ecb210c7",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"
];

function Toast({ text, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, []);
  return <div style={styles.toast}>{text}</div>;
}

export default function Booking() {
  const userId = localStorage.getItem("userId");

  const [resorts, setResorts] = useState([]);
  const [selectedResort, setSelectedResort] = useState(null);

  const [amenities, setAmenities] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [images, setImages] = useState([]);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [booking, setBooking] = useState(null);

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [bookingId, setBookingId] = useState(null);
  const navigate = useNavigate();


  /* ================= LOAD RESORTS ================= */

  useEffect(() => {
    loadResorts();
  }, []);

  async function loadResorts() {
    const res = await api.get("/user/resort/getAllResort");
    setResorts(res.data || []);
    setLoading(false);
  }

  /* ================= LOAD RESORT DETAILS ================= */

  useEffect(() => {
    if (!selectedResort) return;

    const id = selectedResort.resortId;

    Promise.all([
      api.get(`/user/resort/getAmenityByResort?resortId=${id}`),
      api.get(`/user/resort/getResortImg?resortId=${id}`),
      api.get("/user/room/getAllAvail")
    ]).then(([a, i, r]) => {
      setAmenities(a.data || []);
      setImages(i.data || []);
      setRooms(r.data.filter(x => x.resort.resortId === id));
    });
  }, [selectedResort]);

  /* ================= BOOKING ================= */

  async function startBooking() {
    if (!checkIn || !checkOut) {
      setToast("📅 Please select check-in and check-out dates");
      return;
    }

    const res = await api.post("/user/bookings/initiateBooking", {
      checkInDate: checkIn,
      checkOutDate: checkOut,
      user: { userId },
      resort: { resortId: selectedResort.resortId }
    });

    setBooking(res.data);
    setBookingId(res.data.bookingId);
    setToast("🎉 Booking started! Choose your rooms");
  }

  async function addRoom(roomId) {
    await api.post(`/user/bookings/${booking.bookingId}/rooms`, {
      booking: { bookingId: booking.bookingId },
      room: { roomId }
    });
    setToast("🛏️ Room added successfully");
  }

  /* ================= UI ================= */

  if (loading) return <Center text="✨ Loading premium resorts..." />;

  return (
    <div style={styles.page}>

      {toast && <Toast text={toast} onClose={() => setToast("")} />}

      {/* ================= FESTIVE OFFER STRIP ================= */}
      <div style={styles.offerStrip}>
        🎁 Mega Holiday Sale! Flat <b>30% OFF</b> on Luxury Resorts — Limited Time Only!
      </div>

      {/* ================= TRUST BADGES ================= */}
      <div style={styles.trustRow}>
        <span>🔒 Secure Payments</span>
        <span>💯 Verified Resorts</span>
        <span>📞 24x7 Support</span>
        <span>⭐ 50,000+ Happy Guests</span>
      </div>

      {/* ================= RESORT LIST ================= */}
      {!selectedResort && (
        <>
          <div style={styles.heroBanner}>
            <h1 style={styles.heading}>Luxury Resort Bookings</h1>
            <p style={styles.subHeading}>
              Handpicked eco-friendly resorts • Trusted by 50,000+ travelers
            </p>
          </div>

          {/* ================= AD BANNER ================= */}
          <div style={styles.adBanner}>
            🏖️ Summer Escape Deals — Book 3 Nights & Pay for 2!
          </div>

          <div style={styles.resortGrid}>
            {resorts.map(r => (
              <div key={r.resortId} style={styles.resortCard}>
                <img
                  src={randomImages[r.resortId % randomImages.length]}
                  style={styles.cardImage}
                />

                <div style={styles.badges}>
                  <span style={styles.badge}>⭐ {r.rating}</span>
                  <span style={styles.badgeEco}>🌱 Eco</span>
                  <span style={styles.badgeHot}>🔥 Hot Deal</span>
                </div>

                <h3>{r.name}</h3>

                <p style={styles.city}>
                  📍 {r.location.city.cityName}, {r.location.city.state}
                </p>

                <p style={styles.desc}>{r.description}</p>

                <button
                  style={styles.primaryBtn}
                  onClick={() => setSelectedResort(r)}
                >
                  View Details & Book →
                </button>
              </div>
            ))}
          </div>

          {/* ================= TESTIMONIALS ================= */}
          <section style={styles.sectionAlt}>
            <h3>💬 What Our Guests Say</h3>
            <div style={styles.testimonialRow}>
              <div style={styles.testimonialCard}>“Absolutely magical stay!” ⭐⭐⭐⭐⭐</div>
              <div style={styles.testimonialCard}>“Best resort booking experience ever.” ⭐⭐⭐⭐⭐</div>
              <div style={styles.testimonialCard}>“Clean, green & luxurious.” ⭐⭐⭐⭐</div>
            </div>
          </section>
        </>
      )}

      {/* ================= BOOKING VIEW ================= */}
      {selectedResort && (
        <>
          <button
            style={styles.back}
            onClick={() => {
              setSelectedResort(null);
              setBooking(null);
            }}
          >
            ← Back to all resorts
          </button>

          <div style={styles.hero}>
            <h1>{selectedResort.name}</h1>
            <p>
              📍 {selectedResort.location.city.cityName},{" "}
              {selectedResort.location.city.state}
            </p>
            <p>⭐ {selectedResort.rating} • 🌱 Eco Score {selectedResort.ecoScore}</p>
          </div>

          {images.length > 0 && (
            <div style={styles.imageRow}>
              {images.map((img, i) => (
                <img key={i} src={img} style={styles.image} />
              ))}
            </div>
          )}

          <section style={styles.section}>
            <h3>✨ Amenities Included</h3>
            <div style={styles.amenityRow}>
              {amenities.map(a => (
                <span key={a.resortAmenityId} style={styles.amenity}>
                  ✔ {a.amenity.name}
                </span>
              ))}
            </div>
          </section>

          <section style={styles.section}>
            <h3>📅 Choose Your Dates</h3>
            <div style={styles.dateRow}>
              <input type="date" onChange={e => setCheckIn(e.target.value)} />
              <input type="date" onChange={e => setCheckOut(e.target.value)} />

              {!booking && (
                <button style={styles.primaryBtn} onClick={startBooking}>
                  Start Secure Booking
                </button>
              )}
            </div>
          </section>

          {booking && (
            <section style={styles.section}>
              <h3>🛏️ Available Rooms</h3>

              <div style={styles.roomGrid}>
                {rooms.map(r => (
                  <div key={r.roomId} style={styles.roomCard}>
                    <h4>{r.roomType.typeName}</h4>
                    <p>👨‍👩‍👧 Capacity: {r.roomType.capacity}</p>
                    <p>Room #{r.roomNumber}</p>
                    <p>Room Status : {r.status}</p>
                    <p style={styles.price}>₹ {r.basePrice} / Per Day 📅</p>

                    <button
                      style={styles.secondaryBtn}
                      onClick={() => addRoom(r.roomId)}
                    >
                      Add Room
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}


      {/* ================= BOOKING ACTION BAR ================= */}
    {bookingId && (
    <section style={{ ...styles.section, marginTop: 20 }}>
        <h3>🧾 Booking Actions</h3>

        <p style={{ color: "#475569", marginBottom: 14 }}>
        Rooms selected successfully. Continue to enhance your stay or complete payment.
        </p>

        <div style={{
        display: "flex",
        gap: 16,
        flexWrap: "wrap"
        }}>
        <button
            style={{
            flex: 1,
            padding: "14px",
            background: "#0f766e",
            color: "#fff",
            borderRadius: 12,
            border: "none",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer"
            }}
            onClick={() =>
            navigate(`/user/booking/${booking.bookingId}/services`)
            }
        >
            🛎️ Add Services (Food, Spa, Pickup)
        </button>

        <button
            style={{
            flex: 1,
            padding: "14px",
            background: "#1d4ed8",
            color: "#fff",
            borderRadius: 12,
            border: "none",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer"
            }}
            onClick={() =>
            navigate(`/user/booking/${booking.bookingId}/payment`)
            }
        >
            💳 Proceed to Secure Payment
        </button>
        </div>
    </section>
    )}



        

      {/* ================= FOOTER ================= */}
      <footer style={styles.footer}>
        <p>🌍 Explore • Relax • Repeat</p>
        <p>© 2026 Luxury Resort Booking Platform</p>
      </footer>
    </div>
  );
}

/* ================= HELPERS ================= */

function Center({ text }) {
  return (
    <div style={{
      height: "80vh",
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
  page: { maxWidth: 1200, margin: "auto", padding: 24 },

  offerStrip: {
    background: "linear-gradient(90deg,#f59e0b,#ef4444)",
    color: "#fff",
    padding: 12,
    borderRadius: 12,
    textAlign: "center",
    fontWeight: 700,
    marginBottom: 16
  },

  trustRow: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: 20,
    color: "#0f766e",
    fontWeight: 600
  },

  heroBanner: {
    textAlign: "center",
    marginBottom: 40,
    padding: 30,
    background: "linear-gradient(135deg,#0f766e,#115e59)",
    color: "#fff",
    borderRadius: 18
  },

  adBanner: {
    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
    color: "#fff",
    padding: 20,
    borderRadius: 16,
    textAlign: "center",
    marginBottom: 30,
    fontSize: 18,
    fontWeight: 700
  },

  sectionAlt: {
    marginTop: 40,
    padding: 30,
    background: "linear-gradient(135deg,#ecfeff,#f0fdf4)",
    borderRadius: 20
  },

  testimonialRow: {
    display: "flex",
    gap: 16,
    marginTop: 16
  },

  testimonialCard: {
    flex: 1,
    padding: 20,
    background: "#fff",
    borderRadius: 14,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
  },

  badgeHot: {
    background: "#fecaca",
    padding: "4px 8px",
    borderRadius: 12,
    fontSize: 12
  },

  footer: {
    marginTop: 60,
    padding: 24,
    textAlign: "center",
    background: "#0f766e",
    color: "#fff",
    borderRadius: 16
  },

  /* ===== EXISTING STYLES BELOW (UNCHANGED) ===== */

  heading: { fontSize: 36, fontWeight: 800 },
  subHeading: { opacity: 0.9 },

  resortGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
    gap: 24
  },

  resortCard: {
    background: "#fff",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
    transition: "all .3s",
  },

  cardImage: {
    width: "100%",
    height: 160,
    objectFit: "cover",
    borderRadius: 12,
    marginBottom: 10
  },

  badges: { display: "flex", gap: 8 },
  badge: {
    background: "#fde68a",
    padding: "4px 8px",
    borderRadius: 12,
    fontSize: 12
  },
  badgeEco: {
    background: "#bbf7d0",
    padding: "4px 8px",
    borderRadius: 12,
    fontSize: 12
  },

  city: { fontSize: 13, color: "#666" },
  desc: { fontSize: 14, color: "#555" },

  primaryBtn: {
    marginTop: 12,
    padding: "10px 18px",
    background: "#0f766e",
    color: "#fff",
    borderRadius: 10,
    border: "none",
    cursor: "pointer"
  },

  secondaryBtn: {
    padding: "8px 14px",
    border: "1px solid #0f766e",
    background: "#ecfeff",
    borderRadius: 8,
    cursor: "pointer"
  },

  back: {
    background: "none",
    border: "none",
    color: "#0f766e",
    marginBottom: 12,
    cursor: "pointer"
  },

  hero: {
    padding: 24,
    background: "linear-gradient(135deg,#0f766e,#134e4a)",
    color: "#fff",
    borderRadius: 18
  },

  imageRow: {
    display: "flex",
    gap: 12,
    overflowX: "auto",
    margin: "20px 0"
  },

  image: {
    height: 220,
    borderRadius: 14
  },

  section: {
    marginTop: 30,
    padding: 24,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
  },

  amenityRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  amenity: {
    background: "#f1f5f9",
    padding: "6px 14px",
    borderRadius: 20,
    fontSize: 13
  },

  dateRow: { display: "flex", gap: 12, alignItems: "center" },

  roomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
    gap: 18
  },

  roomCard: {
    padding: 16,
    border: "1px solid #e5e7eb",
    borderRadius: 14
  },

  price: { fontWeight: 800 },

  toast: {
    position: "fixed",
    bottom: 30,
    right: 30,
    background: "#0f766e",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: 12,
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
  }
};
