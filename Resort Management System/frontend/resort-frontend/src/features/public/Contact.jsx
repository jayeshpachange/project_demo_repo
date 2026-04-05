import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "@mui/icons-material";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submitForm(e) {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      alert("Please fill all required fields");
      return;
    }

    // Backend integration can be added later
    alert("Thank you for contacting us. Our team will reach out shortly.");

    setForm({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  }

  return (
    <div style={{ ...styles.page, position: "relative", overflow: "hidden" }}>
      {/* ================= DECORATIVE SHAPES ================= */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        style={{
          position: "absolute",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "#2563eb33",
          top: -60,
          left: -80,
          zIndex: 0,
        }}
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: "#fbbf2444",
          bottom: -40,
          right: -60,
          zIndex: 0,
        }}
      />

      {/* ================= HEADER ================= */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        style={styles.header}
      >
        <h1 style={{ ...styles.title, background: "linear-gradient(90deg,#6a11cb,#2575fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Contact Us
        </h1>
        <p style={styles.subtitle}>
          We’d love to hear from you. Reach out for support, partnerships,
          or product inquiries.
        </p>
      </motion.section>

      {/* ================= CONTENT ================= */}
      <section style={styles.content}>
        {/* -------- LEFT INFO -------- */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={styles.infoBox}
        >
          <h3>📍 Company Information</h3>
          <p><b>Company:</b> Resort Management System</p>
          <p><b>Location:</b> Bhiwandi, Maharashtra, India</p>
          <p><b>Email:</b> support@resortms.com</p>
          <p><b>Business Hours:</b> Mon – Sat (10:00 AM – 7:00 PM)</p>

          <hr style={{ margin: "20px 0" }} />

          <h4>🤝 Business & Partnerships</h4>
          <p>
            Interested in using our platform for your resort or hotel?
            Contact us for demos, pricing, and integrations.
          </p>

          <h4 style={{ marginTop: 16 }}>🛠 Technical Support</h4>
          <p>
            Facing an issue or need assistance?
            Our technical team is here to help.
          </p>
        </motion.div>

        {/* -------- CONTACT FORM -------- */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={styles.formBox}
        >
          <h3>✉ Send Us a Message</h3>

          <form onSubmit={submitForm} style={styles.form}>
            <motion.input
              type="text"
              name="name"
              placeholder="Your Name *"
              value={form.name}
              onChange={handleChange}
              style={styles.input}
              whileFocus={{ scale: 1.02, borderColor: "#2563eb" }}
            />

            <motion.input
              type="email"
              name="email"
              placeholder="Your Email *"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
              whileFocus={{ scale: 1.02, borderColor: "#2563eb" }}
            />

            <motion.input
              type="text"
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              style={styles.input}
              whileFocus={{ scale: 1.02, borderColor: "#2563eb" }}
            />

            <motion.textarea
              name="message"
              placeholder="Your Message *"
              rows={5}
              value={form.message}
              onChange={handleChange}
              style={styles.textarea}
              whileFocus={{ scale: 1.02, borderColor: "#2563eb" }}
            />

            <motion.button
              type="submit"
              style={styles.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>
      </section>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    maxWidth: 1200,
    margin: "auto",
    padding: 30
  },

  header: {
    textAlign: "center",
    marginBottom: 50
  },

  title: {
    fontSize: 42,
    fontWeight: 900
  },

  subtitle: {
    marginTop: 10,
    fontSize: 18,
    color: "#475569"
  },

  content: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 40
  },

  infoBox: {
    background: "#f8fafc",
    padding: 30,
    borderRadius: 20,
    lineHeight: 1.7,
    position: "relative",
    zIndex: 1
  },

  formBox: {
    background: "#ffffff",
    padding: 30,
    borderRadius: 20,
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    position: "relative",
    zIndex: 1
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    marginTop: 10
  },

  input: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    fontSize: 15,
    outline: "none"
  },

  textarea: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    fontSize: 15,
    resize: "vertical",
    outline: "none"
  },

  button: {
    marginTop: 10,
    padding: "12px",
    borderRadius: 12,
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer"
  }
};
