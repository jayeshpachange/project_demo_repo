import { useEffect, useState, useRef } from "react";
import api from "../../api/axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Payment() {
  const userId = localStorage.getItem("userId");

  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [priceDetails, setPriceDetails] = useState(null);
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [foodPrice , setFoodPrice] = useState();
  const [foodAndRoomBill , setFoodAndRoomBill] = useState();

  const invoiceRef = useRef();

  useEffect(() => {
    if (!userId) return;
    loadData();
  }, [userId]);

  async function loadData() {
    try {
      setLoading(true);
      const [bookingRes, paymentRes] = await Promise.all([
        api.get(`/user/bookings/user/${userId}`),
        api.get(`/user/payments/user/${userId}`)
      ]);
      setBookings(bookingRes.data || []);
      setPayments(paymentRes.data || []);
    } catch (err) {
      alert("Failed to load payment data");
    } finally {
      setLoading(false);
    }
  }

  async function loadPrice(bookingId) {
    setSelectedBooking(bookingId);
    setPriceDetails(null);
    
    try {
      const res = await api.get(
        `/user/bookings/getBookingPriceDetails/${bookingId}`
      );
      
      setPriceDetails(res.data);

      const resFood = await api.get(
        `/user/foodOrder/booking/${bookingId}/food-bill`
      );
      setFoodPrice(resFood.data);
      setFoodAndRoomBill(res.data.grandTotal + resFood.data);
    } catch (err) {
      console.error(err);
      alert(
        "Price not available.\nMake sure booking is confirmed and room is added."
      );
    }
  }

  async function downloadInvoice(payment) {
    try {
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = 190;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
      const invoiceNo = `INV-${payment.paymentId}-${new Date()
        .toISOString()
        .slice(0, 10)}`;
      pdf.save(`${payment.booking.user.fullName}-${invoiceNo}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Failed to download invoice");
    }
  }

  async function startPayment() {
    if (!selectedBooking) {
      alert("Select a booking first");
      return;
    }

    console.log("PAYMENT REQUEST", {
      booking: { bookingId: selectedBooking },
      paymentMode
    });

    try {
      setProcessing(true);
      await api.post(`/user/payments/booking/${selectedBooking}`, {
        booking: { bookingId: selectedBooking },
        paymentMode
      });
      alert("Payment initiated successfully");
      loadData();
    } catch (err) {
      console.error(err);
      alert("Payment initiation failed");
    } finally {
      setProcessing(false);
    }
  }

  async function confirmPayment(paymentId) {
    await api.put(`/user/payments/${paymentId}/confirm`);
    loadData();
  }

  async function cancelPayment(paymentId) {
    await api.put(`/user/payments/${paymentId}/cancel`);
    loadData();
  }

  if (loading) return <Center text="⏳ Loading payments..." />;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>💳 Payments</h1>
      <p style={styles.subtitle}>Secure & transparent billing</p>

      {/* ===== SELECT BOOKING ===== */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Select Booking</h3>

        {bookings.map((b) => (
          <div key={b.bookingId} style={styles.bookingCard}>
            <div style={styles.cardHeader}>
              <b>Booking ID: {b.bookingId}</b>
              <span style={styles.statusBadge}>
                {b.bookingStatus === "CONFIRMED"
                  ? "✅ Confirmed"
                  : b.bookingStatus === "PENDING"
                  ? "⏳ Pending"
                  : "❌ Cancelled"}
              </span>
            </div>
            <p style={styles.resortName}>🏨 {b.resort.name}</p>
            <p>
              📅 {b.checkInDate} → {b.checkOutDate}
            </p>
            <p>
              💰 Payment Status:{" "}
              {payments.find((p) => p.booking.bookingId === b.bookingId)
                ?.paymentStatus || "Pending"}
            </p>
            <button
              style={styles.primaryBtn}
              onClick={() => loadPrice(b.bookingId)}
            >
              View Bill 🧾
            </button>
          </div>
        ))}
      </section>

      {/* ===== PRICE BREAKDOWN ===== */}
      {priceDetails && (
        <section style={styles.sectionAlt}>
          <h3 style={styles.sectionTitle}>🧾 Price Breakdown</h3>

          <Row label="Room Total" value={`₹ ${priceDetails.roomTotal}`} />
          <Row label="Service Total" value={`₹ ${priceDetails.serviceTotal}`} />
          <Row label="Nights" value={priceDetails.nights} />
          <Row label="Food Bill" value={foodPrice} />
          <hr style={styles.divider} />

          <Row label="Grand Total" value={`₹ ${priceDetails.grandTotal}`} bold />
          <Row label="Also Food Price" value={`₹ ${foodPrice}`} bold />
          <hr style={styles.divider} />
          <Row label="Total" value={`₹ ${foodAndRoomBill} `} bold />

          <div style={{ marginTop: 12 }}>
            <label>Payment Mode</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              style={styles.select}
            >
              <option value="CASH">💵 Cash</option>
              <option value="ONLINE">🌐 Online</option>
              <option value="CARD">💳 Card</option>
              <option value="UPI">📲 UPI</option>
            </select>
          </div>

          <button
            style={styles.payBtn}
            disabled={processing}
            onClick={startPayment}
          >
            {processing ? "Processing..." : "Pay Now 💸"}
          </button>
        </section>
      )}

      {/* ===== PAYMENT HISTORY ===== */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>📜 Payment History</h3>

        {payments.map((p) => (
          <div key={p.paymentId} style={styles.paymentRow}>
            <div>
              <p>
                <b>Amount:</b> ₹ {p.amount}
              </p>
              <p>
                <b>Payment Mode:</b> {p.paymentMode}
              </p>
              <p>
                <b>Payment Status:</b> {p.paymentStatus}
              </p>
              <p>
                <b>Booking ID:</b> {p.booking.bookingId}
              </p>
              <p>
                <b>Transaction ID:</b> {p.transactionId}
              </p>
            </div>

            <div style={styles.paymentActions}>
              {p.paymentStatus === "PENDING" && (
                <>
                  <button
                    style={styles.confirmBtn}
                    onClick={() => confirmPayment(p.paymentId)}
                  >
                    ✅ Confirm
                  </button>
                  <button
                    style={styles.cancelBtn}
                    onClick={() => cancelPayment(p.paymentId)}
                  >
                    ❌ Cancel
                  </button>
                </>
              )}

              {p.paymentStatus === "SUCCESS" && (
                <>
                  <span>✔ Paid</span>
                  <button
                    style={{ ...styles.confirmBtn, marginLeft: 10 }}
                    onClick={() => downloadInvoice(p)}
                  >
                    ⬇ Invoice
                  </button>
                </>
              )}

              {p.paymentStatus === "CANCELLED" && <span>✖ Cancelled</span>}
            </div>
          </div>
        ))}
      </section>

      {/* ===== HIDDEN INVOICE TEMPLATE (FOR PDF ONLY) ===== */}
      <div style={{ position: "absolute", left: "-9999px", top: 0,  background: "#fff",  padding: 20, width: 600 }}>
        <div ref={invoiceRef}>
          <h2>Resort Booking Invoice</h2>
          {priceDetails && (
            <>
              <p>Booking ID: {selectedBooking}</p>
              <p>User ID: {userId}</p>
              <hr />
              <p>Room Total: ₹ {priceDetails.roomTotal}</p>
              <p>Service Total: ₹ {priceDetails.serviceTotal}</p>
              <p>Nights: {priceDetails.nights}</p>
              <h3>Total: ₹ {priceDetails.grandTotal}</h3>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function Row({ label, value, bold }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontWeight: bold ? 800 : 500,
        padding: "4px 0"
      }}
    >
      <span>{label}</span>
      <span>{value}</span>
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
        fontWeight: 600
      }}
    >
      {text}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    maxWidth: 900,
    margin: "auto",
    padding: 24,
    fontFamily: "'Segoe UI', sans-serif",
    background:
      "linear-gradient(135deg, #fef3c7 0%, #d1fae5 50%, #f0fdf4 100%)"
  },
  title: { fontSize: 36, fontWeight: 800, marginBottom: 4 },
  subtitle: { opacity: 0.7, marginBottom: 24 },

  section: {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
    transition: "transform 0.2s",
  },

  sectionAlt: {
    background:
      "linear-gradient(135deg, #d1fae5 0%, #f0fdf4 100%)",
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
  },

  sectionTitle: {
    fontSize: 22,
    marginBottom: 12,
    borderBottom: "2px solid #10b981",
    display: "inline-block",
    paddingBottom: 4
  },

  bookingCard: {
    borderBottom: "1px solid #e5e7eb",
    padding: "12px 0",
    transition: "all 0.3s ease",
    borderRadius: 10,
    marginBottom: 8,
    cursor: "pointer",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  statusBadge: {
    padding: "2px 8px",
    borderRadius: 6,
    fontSize: 12,
    background: "#e0f2fe",
    color: "#0284c7"
  },

  resortName: { fontSize: 18, fontWeight: 600 },

  paymentRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb",
    transition: "background 0.2s",
  },

  paymentActions: { display: "flex", alignItems: "center" },

  primaryBtn: {
    marginTop: 8,
    padding: "8px 16px",
    background: "linear-gradient(to right, #0f766e, #14b8a6)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },

  payBtn: {
    marginTop: 16,
    padding: "12px",
    background: "linear-gradient(to right, #16a34a, #4ade80)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    width: "100%",
    cursor: "pointer",
    fontWeight: 600,
    transition: "transform 0.2s, box-shadow 0.2s",
  },

  confirmBtn: {
    marginRight: 8,
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
  },

  cancelBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
  },

  select: {
    width: "100%",
    padding: 8,
    marginTop: 6,
    borderRadius: 6,
    border: "1px solid #d1d5db",
    transition: "border 0.2s",
  },

  divider: {
    margin: "12px 0",
    borderColor: "#10b981"
  }
};
