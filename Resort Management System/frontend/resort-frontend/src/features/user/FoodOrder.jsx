import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { motion } from "framer-motion"; // For animations
import { FaUtensils, FaShoppingCart, FaTrashAlt, FaSmile } from "react-icons/fa"; // Icons

export default function FoodOrder() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD CONFIRMED BOOKINGS ================= */
  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const res = await api.get(`/user/bookings/user/${userId}`);
      const confirmed = res.data.filter(
        b => b.bookingStatus === "CONFIRMED"
      );
      setBookings(confirmed);
    } catch (err) {
      console.error(err);
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  /* ================= LOAD FOOD DATA AFTER BOOKING SELECT ================= */
  async function selectBooking(booking) {
    setSelectedBooking(booking);
    setCart([]);
    setItems([]);
    setActiveCategory(null);
    try {
      const [catRes, orderRes] = await Promise.all([
        api.get("/user/foodOrder/getAllCategories"),
        api.get(`/user/foodOrder/orders/booking/${booking.bookingId}`)
      ]);
      setCategories(catRes.data || []);
      const ordersData = Array.isArray(orderRes.data)
        ? orderRes.data
        : Array.isArray(orderRes.data.orders)
        ? orderRes.data.orders
        : [];
      setOrders(ordersData);
    } catch (err) {
      console.error(err);
      alert("Failed to load food data");
    }
  }

  /* ================= LOAD ITEMS BY CATEGORY ================= */
  async function loadItems(categoryId) {
    try {
      setActiveCategory(categoryId);
      const res = await api.get(
        `/user/foodOrder/items/category/${categoryId}`
      );
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load food items");
    }
  }

  /* ================= CART LOGIC ================= */
  function addToCart(item) {
    const found = cart.find(i => i.foodItemId === item.foodItemId);
    if (found) {
      setCart(
        cart.map(i =>
          i.foodItemId === item.foodItemId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  }

  function updateQty(id, qty) {
    if (qty <= 0) {
      setCart(cart.filter(i => i.foodItemId !== id));
    } else {
      setCart(
        cart.map(i =>
          i.foodItemId === id ? { ...i, quantity: qty } : i
        )
      );
    }
  }

  const subtotal = cart.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const gst = subtotal * 0.05;
  const serviceCharge = subtotal * 0.1;
  const total = subtotal + gst + serviceCharge;

  /* ================= PLACE ORDER ================= */
  async function placeOrder() {
    if (!selectedBooking) {
      alert("Select booking first");
      return;
    }
    if (cart.length === 0) {
      alert("Add food items");
      return;
    }
    try {
      const orderRes = await api.post(
        `/user/foodOrder/orders/booking/${selectedBooking.bookingId}`
      );
      const orderId = orderRes.data.foodOrderId;
      for (let item of cart) {
        await api.post(
          `/user/foodOrder/orders/${orderId}/items/${item.foodItemId}`,
          null,
          { params: { quantity: item.quantity } }
        );
      }
      alert("🍽 Food order placed successfully");
      setCart([]);
      selectBooking(selectedBooking);
    } catch (err) {
      console.error(err);
      alert("Failed to place food order");
    }
  }

  /* ================= CANCEL ORDER ================= */
  async function cancelOrder(orderId) {
    if (!window.confirm("Cancel this food order?")) return;
    try {
      await api.put(`/user/foodOrder/orders/${orderId}/cancel`);
      alert("Order cancelled");
      selectBooking(selectedBooking);
    } catch (err) {
      console.error(err);
      alert("Failed to cancel order");
    }
  }

  if (loading) return <Center text="Loading bookings..." />;

  /* ================= NO CONFIRMED BOOKINGS ================= */
  if (bookings.length === 0) {
    return (
      <Center text="⚠ No confirmed bookings found. Please book a resort first." />
    );
  }

  return (
    <div style={styles.page}>
      <motion.h1
        style={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaUtensils /> Food Ordering
      </motion.h1>

      {/* ===== SELECT BOOKING ===== */}
      <section style={styles.sectionAlt}>
        <h3>Select Booking</h3>
        <select
          style={styles.select}
          onChange={e =>
            selectBooking(
              bookings.find(b => b.bookingId == e.target.value)
            )
          }
        >
          <option value="">-- Select Booking --</option>
          {bookings.map(b => (
            <option key={b.bookingId} value={b.bookingId}>
              Booking #{b.bookingId} | {b.resort?.name}
            </option>
          ))}
        </select>
      </section>

      {!selectedBooking && (
        <p style={{ textAlign: "center", fontSize: 18 }}>
          👆 Select a booking to order food <FaSmile />
        </p>
      )}

      {selectedBooking && (
        <>
          {/* ===== CATEGORIES ===== */}
          <section style={styles.sectionAlt}>
            <h3>Food Categories</h3>
            <div style={styles.categoryWrap}>
              {categories.map(c => (
                <motion.button
                  key={c.foodCategoryId}
                  style={{
                    ...styles.categoryBtn,
                    background:
                      activeCategory === c.foodCategoryId
                        ? "#2563eb"
                        : "#e5e7eb",
                    color:
                      activeCategory === c.foodCategoryId ? "#fff" : "#000"
                  }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => loadItems(c.foodCategoryId)}
                >
                  {c.categoryName}
                </motion.button>
              ))}
            </div>
          </section>

          {/* ===== FOOD ITEMS ===== */}
          <section style={styles.section}>
            <h3>Menu</h3>
            {items.length === 0 && <p>Select category</p>}
            {items.map(i => (
              <motion.div
                key={i.foodItemId}
                style={styles.row}
                whileHover={{ backgroundColor: "#f0f9ff" }}
              >
                <div>
                  <b>{i.name}</b>
                  <div>₹ {i.price}</div>
                  <img
                    src={`https://source.unsplash.com/80x80/?food,${i.name}`}
                    alt="food"
                    style={{ width: 60, borderRadius: 10, marginTop: 4 }}
                  />
                </div>
                <button
                  style={styles.addBtn}
                  onClick={() => addToCart(i)}
                >
                  ➕ Add
                </button>
              </motion.div>
            ))}
          </section>

          {/* ===== CART ===== */}
          <section style={styles.sectionAlt}>
            <h3>
              <FaShoppingCart /> Order Summary
            </h3>
            {cart.length === 0 && <p>No items added</p>}
            {cart.map(i => (
              <motion.div
                key={i.foodItemId}
                style={styles.row}
                whileHover={{ scale: 1.02 }}
              >
                <div>{i.name}</div>
                <input
                  type="number"
                  min="0"
                  value={i.quantity}
                  onChange={e =>
                    updateQty(i.foodItemId, +e.target.value)
                  }
                  style={styles.qty}
                />
              </motion.div>
            ))}
            <hr />
            <p>Subtotal: ₹ {subtotal.toFixed(2)}</p>
            <p>GST (5%): ₹ {gst.toFixed(2)}</p>
            <p>Service Charge: ₹ {serviceCharge.toFixed(2)}</p>
            <h3>Total: ₹ {total.toFixed(2)}</h3>
            <button
              style={styles.primaryBtn}
              onClick={placeOrder}
              onMouseEnter={e =>
                (e.target.style.background = "#1d4ed8")
              }
              onMouseLeave={e =>
                (e.target.style.background = "#2563eb")
              }
            >
              Place Food Order
            </button>
          </section>

          {/* ===== ORDER HISTORY ===== */}
          <section style={styles.section}>
            <h3>📜 Food Order History</h3>
            {orders.length === 0 && <p>No food orders yet</p>}
            {orders.map(o => (
              <motion.div
                key={o.foodOrderId}
                style={styles.historyCard}
                whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}
              >
                <div>
                  <b>Order #{o.foodOrderId}</b>
                  <div>Status: {o.orderStatus}</div>
                  <div>₹ {o.totalAmount}</div>
                </div>
                {o.orderStatus !== "CANCELLED" &&
                  o.orderStatus !== "DELIVERED" && (
                    <button
                      style={styles.removeBtn}
                      onClick={() => cancelOrder(o.foodOrderId)}
                    >
                      <FaTrashAlt /> Cancel
                    </button>
                  )}
              </motion.div>
            ))}
          </section>
        </>
      )}
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
        alignItems: "center",
        fontSize: 20,
        color: "#2563eb",
      }}
    >
      <h2>{text}</h2>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: { maxWidth: 900, margin: "auto", padding: 24, fontFamily: "'Poppins', sans-serif" },
  title: { fontSize: 36, fontWeight: 800, marginBottom: 20, color: "#1e40af" },
  section: { background: "#fff", padding: 20, borderRadius: 14, marginBottom: 30, transition: "all 0.3s ease" },
  sectionAlt: { background: "#f8fafc", padding: 20, borderRadius: 14, marginBottom: 30, transition: "all 0.3s ease" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #e5e7eb" },
  categoryWrap: { display: "flex", gap: 10, flexWrap: "wrap" },
  categoryBtn: { border: "none", padding: "8px 14px", borderRadius: 20, cursor: "pointer", fontWeight: 500 },
  addBtn: { background: "#16a34a", color: "#fff", border: "none", padding: "6px 14px", borderRadius: 6, cursor: "pointer", transition: "transform 0.2s" },
  removeBtn: { background: "#ef4444", color: "#fff", border: "none", padding: "6px 14px", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 },
  primaryBtn: { background: "#2563eb", color: "#fff", border: "none", padding: "10px 18px", borderRadius: 10, cursor: "pointer", fontWeight: 600, transition: "background 0.2s" },
  qty: { width: 60, padding: 4, borderRadius: 6, border: "1px solid #d1d5db" },
  historyCard: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14, border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 12, transition: "all 0.2s ease" },
  select: { width: "100%", padding: 10, borderRadius: 8, border: "1px solid #d1d5db" },
};
