import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

/* ================= PROFILE COMPONENT ================= */

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    phone: ""
  });

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      const res = await api.get("/user/me");
      setUser(res.data);

      setForm({
        fullName: res.data.fullName || "",
        phone: res.data.phone || ""
      });
    } catch (err) {
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  /* ================= UPDATE PROFILE ================= */
  async function updateProfile() {
    if (!form.fullName || !form.phone) {
      alert("All fields are required");
      return;
    }

    try {
      setSaving(true);
      await api.put(`/user/update?userId=${user.userId}`, {
        ...user,
        fullName: form.fullName,
        phone: form.phone
      });

      alert("Profile updated successfully");
      setEditMode(false);
      loadProfile();
    } catch (err) {
      alert("Profile update failed");
    } finally {
      setSaving(false);
    }
  }

  /* ================= UI ================= */
  if (loading) return <Center text="Loading profile..." />;

  // Generate random avatar image
  const avatarUrl = `https://i.pravatar.cc/150?u=${user.userId}`;

  return (
    <div style={styles.page}>
      {/* ===== HEADER ===== */}
      <div style={styles.header}>
        <img src={avatarUrl} alt="avatar" style={styles.avatar} />
        <div>
          <h1 style={styles.title}>👤 {user.fullName || "My Profile"}</h1>
          <p style={styles.subtitle}>Manage your personal information</p>
        </div>
      </div>

      {/* ===== PROFILE CARD ===== */}
      <section style={styles.card}>
        {/* ===== BASIC INFO ===== */}
        <Row label="User ID" value={user.userId} />
        <Row label="Email" value={user.email} />
        <Row label="Role" value={user.role} />
        <Row label="Status" value={user.status} />
        <Row
          label="Joined On"
          value={new Date(user.createdAt).toLocaleDateString()}
        />

        <hr style={styles.divider} />

        {/* ===== EDITABLE FIELDS ===== */}
        {!editMode ? (
          <>
            <Row label="Full Name" value={user.fullName} />
            <Row label="Phone" value={user.phone} />

            <div style={styles.actionRow}>
              <button
                style={styles.primaryBtn}
                onClick={() => setEditMode(true)}
              >
                ✏️ Edit Profile
              </button>

              <button
                style={styles.changePasswordBtn}
                onClick={() => navigate("/user/change-password")}
              >
                🔐 Change Password
              </button>
            </div>
          </>
        ) : (
          <>
            <Input
              label="Full Name"
              value={form.fullName}
              onChange={e =>
                setForm({ ...form, fullName: e.target.value })
              }
            />

            <Input
              label="Phone"
              value={form.phone}
              onChange={e =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <div style={styles.actionRow}>
              <button
                style={styles.saveBtn}
                disabled={saving}
                onClick={updateProfile}
              >
                {saving ? "Saving..." : "💾 Save Changes"}
              </button>

              <button
                style={styles.cancelBtn}
                onClick={() => {
                  setEditMode(false);
                  setForm({
                    fullName: user.fullName,
                    phone: user.phone
                  });
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

/* ================= HELPERS ================= */
function Row({ label, value }) {
  return (
    <div style={styles.row}>
      <span style={styles.label}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={styles.label}>{label}</label>
      <input
        value={value}
        onChange={onChange}
        style={styles.input}
        placeholder={`Enter ${label}`}
      />
    </div>
  );
}

function Center({ text }) {
  return (
    <div
      style={{
        height: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 24,
        color: "#0f766e",
        fontWeight: 600
      }}
    >
      {text}
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: { maxWidth: 700, margin: "auto", padding: 24 },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 24
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    border: "3px solid #16a34a",
    transition: "transform 0.3s",
    cursor: "pointer"
  },
  title: { fontSize: 32, fontWeight: 800 },
  subtitle: { opacity: 0.7, marginBottom: 20 },

  card: {
    background: "linear-gradient(145deg, #f0fdf4, #e0f7f1)",
    padding: 24,
    borderRadius: 16,
    boxShadow: "0 12px 28px rgba(0,0,0,.12)",
    transition: "all 0.3s ease",
    animation: "fadeIn 0.6s"
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    fontSize: 16
  },

  label: {
    fontWeight: 600,
    color: "#065f46"
  },

  input: {
    width: "100%",
    padding: 12,
    marginTop: 6,
    borderRadius: 10,
    border: "1px solid #9ca3af",
    outline: "none",
    transition: "all 0.2s",
    fontSize: 15
  },

  actionRow: {
    display: "flex",
    gap: 12,
    marginTop: 16,
    flexWrap: "wrap"
  },

  primaryBtn: {
    padding: "10px 16px",
    background: "linear-gradient(90deg,#0f766e,#14b8a6)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
  },

  changePasswordBtn: {
    padding: "10px 16px",
    background: "linear-gradient(90deg,#d97706,#f59e0b)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
  },

  saveBtn: {
    padding: "10px 16px",
    background: "linear-gradient(90deg,#16a34a,#4ade80)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
  },

  cancelBtn: {
    padding: "10px 16px",
    background: "#f3f4f6",
    color: "#374151",
    border: "none",
    borderRadius: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  },

  divider: {
    border: "0",
    height: "1px",
    background: "#d1fae5",
    margin: "16px 0"
  }
};
