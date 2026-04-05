import { useState } from "react";
import api from "../../api/axios";

export default function ChangePassword() {
  const userId = localStorage.getItem("userId");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleChangePassword() {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await api.put(
        `/user/changePassword/${userId}`,
        null,
        {
          params: {
            oldPassword,
            newPassword
          }
        }
      );

      alert("Password changed successfully 🎉");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      alert("Cannot change password. Old password may be incorrect.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🔐 Change Password</h1>
      <p style={styles.subtitle}>Keep your account secure</p>

      <section style={styles.card}>
        <Field
          label="Current Password"
          value={oldPassword}
          onChange={setOldPassword}
        />

        <Field
          label="New Password"
          value={newPassword}
          onChange={setNewPassword}
        />

        <Field
          label="Confirm New Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />

        <button
          style={styles.primaryBtn}
          disabled={loading}
          onClick={handleChangePassword}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </section>
    </div>
  );
}

/* ================= FIELD ================= */

function Field({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={styles.label}>{label}</label>
      <input
        type="password"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={styles.input}
      />
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    maxWidth: 480,
    margin: "auto",
    padding: 24
  },

  title: {
    fontSize: 30,
    fontWeight: 800
  },

  subtitle: {
    opacity: 0.7,
    marginBottom: 20
  },

  card: {
    background: "#fff",
    padding: 24,
    borderRadius: 16,
    boxShadow: "0 10px 25px rgba(0,0,0,.08)"
  },

  label: {
    fontWeight: 600,
    display: "block",
    marginBottom: 6
  },

  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #d1d5db"
  },

  primaryBtn: {
    marginTop: 12,
    width: "100%",
    padding: "12px",
    background: "#0f766e",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontWeight: 700,
    cursor: "pointer"
  }
};
