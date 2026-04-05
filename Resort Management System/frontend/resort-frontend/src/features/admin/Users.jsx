import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  /* ================= LOAD ALL USERS ================= */

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      // ADMIN: get all users → you already expose user management APIs
      const res = await api.get("/user/getAllUsers"); // ⚠️ SEE NOTE BELOW
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  /* ================= SELECT USER ================= */

  async function selectUser(user) {
    setSelectedUser(user);
    setBookings([]);
    setPayments([]);

    try {
      setDetailsLoading(true);

      const [bookingRes, paymentRes] = await Promise.all([
        api.get(`/user/bookings/user/${user.userId}`),
        api.get(`/user/payments/user/${user.userId}`)
      ]);

      setBookings(bookingRes.data || []);
      setPayments(paymentRes.data || []);

    } catch (err) {
      console.error(err);
      alert("Failed to load user details");
    } finally {
      setDetailsLoading(false);
    }
  }

  /* ================= DELETE USER ================= */

  async function deleteUser(userId) {
    if (!window.confirm("Are you sure you want to DELETE this user?")) return;

    try {
      await api.delete(`/user/delete`, { params: { userId } });
      alert("User deleted successfully");
      setSelectedUser(null);
      loadUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  }

  if (loading) return <Center text="Loading users..." />;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>👥 User Management</h1>

      {/* ===== USERS LIST ===== */}
      <section style={styles.section}>
        <h3>All Users</h3>

        {users.length === 0 && <p>No users found</p>}

        {users.map(u => (
          <div
            key={u.userId}
            style={{
              ...styles.row,
              background:
                selectedUser?.userId === u.userId ? "#f1f5f9" : "#fff"
            }}
          >
            <div>
              <b>{u.fullName}</b>
              <div>{u.email}</div>
              <small>Status: {u.status}</small>
            </div>

            <div style={styles.actions}>
              <button
                style={styles.viewBtn}
                onClick={() => selectUser(u)}
              >
                View
              </button>

              <button
                style={styles.deleteBtn}
                onClick={() => deleteUser(u.userId)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* ===== USER DETAILS ===== */}
      {selectedUser && (
        <section style={styles.sectionAlt}>
          <h3>👤 User Profile</h3>

          <p><b>Name:</b> {selectedUser.fullName}</p>
          <p><b>Email:</b> {selectedUser.email}</p>
          <p><b>Phone:</b> {selectedUser.phone}</p>
          <p><b>Status:</b> {selectedUser.status}</p>
          <p><b>Role:</b> {selectedUser.role}</p>

          {detailsLoading && <p>Loading details...</p>}

          {!detailsLoading && (
            <>
              {/* ===== USER BOOKINGS ===== */}
              <h4 style={{ marginTop: 20 }}>📅 Bookings</h4>

              {bookings.length === 0 && <p>No bookings</p>}

              {bookings.map(b => (
                <div key={b.bookingId} style={styles.subRow}>
                  <div>
                    Booking #{b.bookingId} — {b.bookingStatus}
                  </div>
                  <div>₹ {b.totalAmount}</div>
                </div>
              ))}

              {/* ===== USER PAYMENTS ===== */}
              <h4 style={{ marginTop: 20 }}>💳 Payments</h4>

              {payments.length === 0 && <p>No payments</p>}

              {payments.map(p => (
                <div key={p.paymentId} style={styles.subRow}>
                  <div>
                    Payment #{p.paymentId} — {p.paymentStatus}
                  </div>
                  <div>₹ {p.amount}</div>
                </div>
              ))}
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
      justifyContent: "center",
      alignItems: "center"
    }}>
      <h2>{text}</h2>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    maxWidth: 1000,
    margin: "auto",
    padding: 24
  },

  title: {
    fontSize: 32,
    fontWeight: 800,
    marginBottom: 30
  },

  section: {
    background: "#fff",
    padding: 20,
    borderRadius: 14,
    marginBottom: 30
  },

  sectionAlt: {
    background: "#f8fafc",
    padding: 20,
    borderRadius: 14
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 0",
    borderBottom: "1px solid #e5e7eb"
  },

  subRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px dashed #e5e7eb"
  },

  actions: {
    display: "flex",
    gap: 10
  },

  viewBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "6px 14px",
    borderRadius: 6
  },

  deleteBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "6px 14px",
    borderRadius: 6
  }
};
