import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Foods() {

  /* ===================== STATE ===================== */
  const [activeTab, setActiveTab] = useState("CATEGORY");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [foodOrders, setFoodOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [bookingId, setBookingId] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newFood, setNewFood] = useState({ name: "", price: "" });
  const [loading, setLoading] = useState(false);
  const [allFoods , setAllFoods] = useState([]);

  /* ===================== INIT LOAD ===================== */
  useEffect(() => {
    loadCategories();
    loadAllFood();
  }, []);

  /* ===================== CATEGORY APIs ===================== */
  async function loadCategories() {
    const res = await api.get("/user/foodOrder/getAllCategories");
    setCategories(Array.isArray(res.data) ? res.data : []);
  }

  async function addCategory() {
    if (!newCategory) return alert("Category name required");
    await api.post("/user/foodOrder/categories", { categoryName: newCategory });
    setNewCategory("");
    loadCategories();
  }

  /* ===================== FOOD ITEM APIs ===================== */
  async function loadFoodItems(category) {
    setSelectedCategory(category);
    setActiveTab("ITEM");
    const res = await api.get(`/user/foodOrder/items/category/${category.foodCategoryId}`);
    setFoodItems(Array.isArray(res.data) ? res.data : []);
  }

  async function loadAllFood() {
    const resFood = await api.get(`/user/foodOrder/getAllFoodItems`);
    setAllFoods(Array.isArray(resFood.data) ? resFood.data : []);
  }

  async function addFoodItem() {
    if (!selectedCategory || !newFood.name || !newFood.price) return alert("Complete food item details");
    await api.post("/user/foodOrder/items", {
      name: newFood.name,
      price: newFood.price,
      foodCategory: { foodCategoryId: selectedCategory.foodCategoryId }
    });
    setNewFood({ name: "", price: "" });
    loadFoodItems(selectedCategory);
  }

  async function deleteFoodItem(foodItemId) {
    await api.delete(`/user/foodOrder/items/${foodItemId}`);
    loadFoodItems(selectedCategory);
  }

  /* ===================== FOOD ORDER APIs ===================== */
  async function loadOrdersByBooking() {
    if (!bookingId) return alert("Booking ID required");
    setLoading(true);
    const res = await api.get(`/user/foodOrder/orders/booking/${bookingId}`);
    setFoodOrders(Array.isArray(res.data) ? res.data : []);
    setActiveTab("ORDER");
    setLoading(false);
  }

  async function updateOrderStatus(orderId, status) {
    await api.put(`/user/foodOrder/orders/${orderId}/status`, null, { params: { status } });
    loadOrdersByBooking();
  }

  async function cancelOrder(orderId) {
    await api.put(`/user/foodOrder/orders/${orderId}/cancel`);
    loadOrdersByBooking();
  }

  async function loadOrderBill(orderId) {
    const res = await api.get(`/user/foodOrder/orders/${orderId}/bill`);
    alert(`Order Bill: ₹ ${res.data}`);
  }

  const totalRevenue = foodOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  /* ===================== UI ===================== */
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🍽 Food Management</h1>

      {/* ===================== TAB BAR ===================== */}
      <div style={styles.tabs}>
        <Tab label="Categories" active={activeTab === "CATEGORY"} onClick={() => setActiveTab("CATEGORY")} />
        <Tab label="Food Items" active={activeTab === "ITEM"} onClick={() => setActiveTab("ITEM")} />
        <Tab label="Orders" active={activeTab === "ORDER"} onClick={() => setActiveTab("ORDER")} />
        <Tab label="Revenue" active={activeTab === "REVENUE"} onClick={() => setActiveTab("REVENUE")} />
        <Tab label="All Food Items" active={activeTab === "AllFood"} onClick={() => setActiveTab("AllFood")} />
      </div>

      {/* ===================== All Food ===================== */}
      {activeTab === "AllFood" && (
        <Section title="All Food Items">
          <div style={styles.grid}>
            {allFoods.map(food => (
              <div key={food.foodItemId} style={styles.card}>
                <div><b>ID:</b> {food.foodItemId}</div>
                <div><b>Category:</b> {food.foodCategory.categoryName}</div>
                <div><b>Name:</b> {food.name}</div>
                <div><b>Price:</b> ₹ {food.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ===================== CATEGORY ===================== */}
      {activeTab === "CATEGORY" && (
        <Section title="Food Categories">
          <div style={styles.grid}>
            {categories.map(c => (
              <Card key={c.foodCategoryId}>
                <b>{c.categoryName}</b>
                <button style={styles.iconBtn} onClick={() => loadFoodItems(c)}>View Items →</button>
              </Card>
            ))}
          </div>
          <div style={styles.form}>
            <input
              placeholder="New Category Name"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              style={styles.input}
            />
            <button style={styles.primaryBtn} onClick={addCategory}>Add Category</button>
          </div>
        </Section>
      )}

      {/* ===================== FOOD ITEMS ===================== */}
      {activeTab === "ITEM" && selectedCategory && (
        <Section title={`Food Items – ${selectedCategory.categoryName}`}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {foodItems.map(f => (
                <tr key={f.foodItemId}>
                  <td>{f.name}</td>
                  <td>₹ {f.price}</td>
                  <td>
                    <button style={styles.deleteBtn} onClick={() => deleteFoodItem(f.foodItemId)}>❌</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4>Add Food Item</h4>
          <div style={styles.form}>
            <input
              placeholder="Food Name"
              value={newFood.name}
              onChange={e => setNewFood({ ...newFood, name: e.target.value })}
              style={styles.input}
            />
            <input
              placeholder="Price"
              value={newFood.price}
              onChange={e => setNewFood({ ...newFood, price: e.target.value })}
              style={styles.input}
            />
            <button style={styles.primaryBtn} onClick={addFoodItem}>Add</button>
          </div>
        </Section>
      )}

      {/* ===================== FOOD ORDERS ===================== */}
      {activeTab === "ORDER" && (
        <Section title="Food Orders">
          <div style={styles.form}>
            <input
              placeholder="Booking ID"
              value={bookingId}
              onChange={e => setBookingId(e.target.value)}
              style={styles.input}
            />
            <button style={styles.primaryBtn} onClick={loadOrdersByBooking}>Load Orders</button>
          </div>

          {loading && <p>Loading…</p>}

          {foodOrders.map(o => (
            <Card key={o.foodOrderId}>
              <div style={styles.row}>
                <b>Order #{o.foodOrderId}</b>
                <StatusBadge status={o.orderStatus} />
              </div>
              <p>Total: ₹ {o.totalAmount}</p>
              <div style={styles.actionBar}>
                <button style={styles.secondaryBtn} onClick={() => loadOrderBill(o.foodOrderId)}>View Bill</button>
                <button style={styles.primaryBtn} onClick={() => updateOrderStatus(o.foodOrderId, "SERVED")}>Mark Served</button>
                <button style={styles.deleteBtn} onClick={() => cancelOrder(o.foodOrderId)}>Cancel</button>
              </div> 
            </Card>
          ))}
        </Section>
      )}

      {/* ===================== REVENUE ===================== */}
      {activeTab === "REVENUE" && (
        <Section title="Food Revenue">
          <div style={styles.revenue}>₹ {totalRevenue}</div>
          <p style={styles.centered}>Total revenue for loaded bookings</p>
        </Section>
      )}
    </div>
  );
}

/* ===================== COMPONENTS ===================== */
function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.tab,
        background: active ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : "#e5e7eb",
        color: active ? "#fff" : "#000"
      }}
    >
      {label}
    </button>
  );
}

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h3 style={{ marginBottom: 16 }}>{title}</h3>
      {children}
    </div>
  );
}

function Card({ children }) {
  return <div style={styles.card}>{children}</div>;
}

function StatusBadge({ status }) {
  return <span style={styles.badge(status)}>{status}</span>;
}

/* ===================== STYLES ===================== */
const styles = {
  page: { maxWidth: 1400, margin: "auto", padding: 32, background: "#f8fafc", minHeight: "100vh" },
  title: { fontSize: 36, fontWeight: 900, marginBottom: 20 },

  tabs: { display: "flex", gap: 12, marginBottom: 30, flexWrap: "wrap" },
  tab: { padding: "10px 20px", borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 700 },

  section: { background: "#fff", padding: 24, borderRadius: 18, marginBottom: 30, boxShadow: "0 12px 28px rgba(0,0,0,0.05)" },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 },
  card: { background: "#f1f5f9", padding: 16, borderRadius: 14, display: "flex", flexDirection: "column", gap: 8, transition: "transform 0.2s", cursor: "pointer" },

  form: { display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" },
  input: { padding: "10px 14px", borderRadius: 12, border: "1px solid #cbd5f5", flex: 1 },

  table: { width: "100%", marginTop: 16, borderCollapse: "collapse" },
  row: { display: "flex", justifyContent: "space-between" },
  actionBar: { display: "flex", gap: 10, marginTop: 10 },

  primaryBtn: { background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "#fff", border: "none", padding: "10px 16px", borderRadius: 12, fontWeight: 700, cursor: "pointer" },
  secondaryBtn: { background: "#64748b", color: "#fff", border: "none", padding: "10px 16px", borderRadius: 12, fontWeight: 700, cursor: "pointer" },
  deleteBtn: { background: "#ef4444", color: "#fff", border: "none", padding: "10px 16px", borderRadius: 12, cursor: "pointer" },
  iconBtn: { background: "#e5e7eb", border: "none", borderRadius: 10, padding: "8px 10px", cursor: "pointer" },

  badge: s => ({
    padding: "4px 12px",
    borderRadius: 20,
    background: s === "SERVED" ? "#16a34a" : s === "PREPARING" ? "#f59e0b" : "#ef4444",
    color: "#fff",
    fontWeight: 700
  }),

  revenue: { fontSize: 42, fontWeight: 900, color: "#16a34a", textAlign: "center" },
  centered: { textAlign: "center", marginTop: 8 }
};
