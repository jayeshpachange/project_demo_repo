import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  CircularProgress,
  Chip,
  Avatar,
  Stack,
  Fade
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import BookIcon from "@mui/icons-material/Book";
import PaymentIcon from "@mui/icons-material/Payment";
import StarIcon from "@mui/icons-material/Star";
import RecommendIcon from "@mui/icons-material/ThumbUp";
import PlaceIcon from "@mui/icons-material/Place";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";

export default function Dashboard() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }
    loadDashboard();
  }, [userId]);

 async function loadDashboard() {
  try {
    setLoading(true);
    setError("");

    // fetch bookings and payments
    const [bookingRes, paymentRes] = await Promise.all([
      api.get(`/user/bookings/user/${userId}`),
      api.get(`/user/payments/user/${userId}`)
    ]);

    const bookingsData = bookingRes.data || [];
    let paymentsData = paymentRes.data || []; // use let so we can reassign

    // fetch resort images for each booking
    const bookingsWithImages = await Promise.all(
      bookingsData.map(async (b) => {
        if (b.resort?.resortId) {
          try {
            const imgRes = await api.get(`/user/resort/getResortImg`, {
              params: { resortId: b.resort.resortId }
            });
            return { ...b, resortImg: imgRes.data?.[0] || "" };
          } catch (err) {
            console.error("Failed to fetch resort image", err);
            return { ...b, resortImg: "" };
          }
        }
        return { ...b, resortImg: "" };
      })
    );

    // fetch resort images for each payment
    paymentsData = await Promise.all(
      paymentsData.map(async (p) => {
        if (p.booking?.resort?.resortId) {
          try {
            const imgRes = await api.get(`/user/resort/getResortImg`, {
              params: { resortId: p.booking.resort.resortId }
            });
            return { ...p, resortImg: imgRes.data?.[0] || "" };
          } catch (err) {
            console.error("Failed to fetch resort image for payment", err);
            return { ...p, resortImg: "" };
          }
        }
        return { ...p, resortImg: "" };
      })
    );

    // update state
    setBookings(bookingsWithImages);
    setPayments(paymentsData);
  } catch (err) {
    console.error("Dashboard load failed", err);
    setError("Unable to load dashboard data");
  } finally {
    setLoading(false);
  }
}

  const confirmedBookings = bookings.filter(b => b.bookingStatus === "CONFIRMED").length;
  const totalSpent = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  if (loading) {
    return <PageCenter text="Loading your dashboard..." loading />;
  }

  if (error) {
    return <PageCenter text={error} error />;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      {/* ===== HEADER ===== */}
      <Box mb={4} textAlign="center">
        <Typography variant="h4" fontWeight={700} sx={{ color: "#1976d2" }}>
          Welcome Back!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" mt={1}>
          Here’s a quick overview of your bookings, payments & activities
        </Typography>
      </Box>

      {/* ===== QUICK ACTIONS ===== */}
      <Grid container spacing={2} mb={4}>
        <ActionButton icon={<PersonIcon />} text="My Profile" onClick={() => navigate("/user/profile")} />
        <ActionButton icon={<BookIcon />} text="My Bookings" onClick={() => navigate("/user/bookings")} />
        <ActionButton icon={<PaymentIcon />} text="My Payments" onClick={() => navigate("/user/payments")} />
        <ActionButton icon={<StarIcon />} text="Reviews" onClick={() => navigate("/user/reviews")} />
        <ActionButton icon={<RecommendIcon />} text="Recommendations" onClick={() => navigate("/user/recommendations")} />
        <ActionButton text="Booking History" onClick={() => navigate("/user/bookingsHistory")} />
        <ActionButton text="Existing Booking" onClick={() => navigate("/user/existing-bookings")} />      
        <ActionButton text="Order Food" onClick={() => navigate("/user/foodOrder")} />      
      </Grid>

      {/* ===== STATS ===== */}
      <Grid container spacing={3} mb={5}>
        <StatCard title="Total Bookings" value={bookings.length} color="#ff8a65" icon={<BookIcon />} />
        <StatCard title="Confirmed Bookings" value={confirmedBookings} color="#4db6ac" icon={<CheckCircleIcon />} />
        <StatCard title="Total Payments" value={payments.length} color="#ba68c8" icon={<PaymentIcon />} />
        <StatCard title="Total Spent (₹)" value={totalSpent.toFixed(2)} color="#fbc02d" icon={<AttachMoneyIcon />} />
      </Grid>

      {/* ===== RECENT BOOKINGS ===== */}
      <Section title="Recent Bookings">
        {bookings.length === 0 ? <Empty text="No bookings found" /> :
          bookings.slice(0, 3).map(b => (
            <Fade in key={b.bookingId}>
              <Card sx={{
                display: "flex",
                p: 2,
                mb: 2,
                borderLeft: "5px solid #1976d2",
                "&:hover": { boxShadow: 6 },
                transition: "0.3s"
              }}>
                <Avatar
                  variant="rounded"
                  src={b.resortImg || ""}
                  sx={{ width: 100, height: 80, mr: 2 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={600} fontSize={16}>{b.resort?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    <PlaceIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {b.resort?.location?.city?.cityName}, {b.resort?.location?.city?.state}
                  </Typography>
                  <Typography variant="body2">
                    <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {b.checkInDate} → {b.checkOutDate}
                  </Typography>
                  <Chip
                    label={b.bookingStatus}
                    color={b.bookingStatus === "CONFIRMED" ? "success" : b.bookingStatus === "PENDING" ? "warning" : "error"}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Card>
            </Fade>
          ))
        }
      </Section>

      {/* ===== RECENT PAYMENTS ===== */}
<Section title="Recent Payments">
  {payments.length === 0 ? (
    <Empty text="No payments found" />
  ) : (
    payments.slice(0, 3).map(p => (
      <Fade in key={p.paymentId}>
        <Card
          sx={{
            display: "flex",
            p: 2,
            mb: 2,
            borderLeft: "5px solid #f57c00",
            "&:hover": { boxShadow: 6, transform: "translateY(-2px)" },
            transition: "0.3s",
          }}
        >
          {/* Resort Image */}
          <Avatar
            variant="rounded"
            src={p.resortImg || ""}
            sx={{
              width: 100,
              height: 80,
              mr: 2,
              borderRadius: 2,
              boxShadow: 1,
            }}
          />

          {/* Payment Details */}
          <Box sx={{ flex: 1 }}>
            {/* Amount */}
            <Typography fontWeight={600} fontSize={16} display="flex" alignItems="center">
              ₹ {p.amount} <AttachMoneyIcon fontSize="small" sx={{ ml: 0.5, color: "#4caf50" }} />
            </Typography>

            {/* Resort Name */}
            <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" sx={{ mt: 0.5 }}>
              <BookIcon fontSize="small" sx={{ mr: 0.5, color: "#ff9800" }} />
              {p.booking?.resort?.name || "Unknown Resort"}
            </Typography>

            {/* Payment Status */}
            <Typography variant="body2" sx={{ mt: 0.5, display: "flex", alignItems: "center" }}>
              Status:
              <Chip
                label={p.paymentStatus}
                color={
                  p.paymentStatus === "SUCCESS"
                    ? "success"
                    : p.paymentStatus === "PENDING"
                    ? "warning"
                    : "error"
                }
                size="small"
                sx={{ ml: 1 }}
                icon={
                  p.paymentStatus === "SUCCESS" ? (
                    <CheckCircleIcon fontSize="small" />
                  ) : p.paymentStatus === "FAILED" ? (
                    <CancelIcon fontSize="small" />
                  ) : (
                    <PendingIcon fontSize="small" />
                  )
                }
              />
            </Typography>

            {/* Payment Mode */}
            <Typography variant="body2" display="flex" alignItems="center" sx={{ mt: 0.5 }}>
              <CreditCardIcon fontSize="small" sx={{ mr: 0.5, color: "#1976d2" }} />
              {p.paymentMode || "N/A"}
            </Typography>
            <Typography variant="body2" display="flex" alignItems="center" sx={{ mt: 0.5 }}>
              💵💰💳 Transaction ID: {p.transactionId}
            </Typography>

            {/* Extra Info Line */}
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
              Payment ID: {p.paymentId} • Booking ID: {p.booking?.bookingId} 
            </Typography>
          </Box>
        </Card>
      </Fade>
    ))
  )}
</Section>

    </Box>
  );
}

/* ================= SMALL COMPONENTS ================= */

function PageCenter({ text, error, loading }) {
  return (
    <Box sx={{
      height: "60vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column"
    }}>
      {loading && <CircularProgress color="primary" sx={{ mb: 2 }} />}
      <Typography variant="h6" color={error ? "error" : "text.primary"}>{text}</Typography>
    </Box>
  );
}

function ActionButton({ text, icon, onClick }) {
  return (
    <Grid item xs={6} sm={4} md={2}>
      <Button
        onClick={onClick}
        variant="contained"
        startIcon={icon}
        sx={{
          width: "100%",
          py: 2,
          bgcolor: "linear-gradient(135deg, #42a5f5, #478ed1)",
          "&:hover": { bgcolor: "linear-gradient(135deg, #478ed1, #42a5f5)" },
          borderRadius: 2,
          fontWeight: 600,
          transition: "0.3s"
        }}
      >
        {text}
      </Button>
    </Grid>
  );
}

function StatCard({ title, value, color, icon }) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card sx={{
        p: 2,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${color}33, ${color}99)`,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 1,
        transition: "0.3s",
        "&:hover": { transform: "translateY(-4px)", boxShadow: 6 }
      }}>
        {icon && <Avatar sx={{ bgcolor: "#fff", color, width: 36, height: 36 }}>{icon}</Avatar>}
        <Box>
          <Typography fontSize={14} fontWeight={600}>{title}</Typography>
          <Typography variant="h5" fontWeight={700}>{value}</Typography>
        </Box>
      </Card>
    </Grid>
  );
}

function Section({ title, children }) {
  return (
    <Box mb={5}>
      <Typography variant="h6" fontWeight={600} mb={2}>{title}</Typography>
      {children}
    </Box>
  );
}

function Empty({ text }) {
  return <Typography color="text.secondary" fontStyle="italic">{text}</Typography>;
}
