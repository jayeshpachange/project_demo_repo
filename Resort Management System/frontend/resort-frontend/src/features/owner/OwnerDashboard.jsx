import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  Avatar,
  CircularProgress,
  Chip,
  Fade,
  Stack,
} from "@mui/material";

import HotelIcon from "@mui/icons-material/Hotel";
import BookIcon from "@mui/icons-material/Book";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import AddIcon from "@mui/icons-material/Add";
import StarIcon from "@mui/icons-material/Star";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const ownerId = localStorage.getItem("ownerId");

  const [resorts, setResorts] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ownerId) return;
    loadOwnerDashboard();
  }, [ownerId]);

  async function loadOwnerDashboard() {
    try {
      setLoading(true);

      const resortRes = await api.get(`/owner/getResortsByOwnerId`, {
        params: { ownerId },
      });

      const resortList = resortRes.data || [];

      const enriched = await Promise.all(
        resortList.map(async (r) => {
          let bookings = [];
          let revenue = 0;

          try {
            const bookingRes = await api.get(`/user/bookings/resort/${r.resortId}`);
            bookings = bookingRes.data || [];

            for (const b of bookings) {
              try {
                const payRes = await api.get(`/user/payments/booking/${b.bookingId}`);
                revenue += payRes.data?.reduce((s, p) => s + (p.amount || 0), 0);
              } catch {}
            }
          } catch {}

          let img = "";
          try {
            const imgRes = await api.get(`/user/resort/getResortImg`, {
              params: { resortId: r.resortId },
            });
            img = imgRes.data?.[0] || "";
          } catch {}

          return { ...r, bookingsCount: bookings.length, revenue, img };
        })
      );

      setResorts(enriched);

      setStats({
        totalBookings: enriched.reduce((s, r) => s + r.bookingsCount, 0),
        totalRevenue: enriched.reduce((s, r) => s + r.revenue, 0),
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Center text="Loading owner dashboard..." loading />;
  }

  return (
    <Box sx={{ maxWidth: 1300, mx: "auto", p: 3 }}>
      {/* HEADER */}
      <Typography
        variant="h4"
        fontWeight={700}
        mb={1}
        sx={{
          background: "linear-gradient(90deg, #0f2027, #203a43, #2c5364)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Owner Dashboard
      </Typography>
      <Typography color="text.secondary" mb={4}>
        Manage resorts, bookings, rooms, food & revenue
      </Typography>

      {/* QUICK STATS */}
      <Grid container spacing={3} mb={5}>
        <Stat
          title="Total Resorts"
          value={resorts.length}
          icon={<HotelIcon />}
          color="linear-gradient(135deg, #667eea, #764ba2)"
        />
        <Stat
          title="Total Bookings"
          value={stats.totalBookings}
          icon={<BookIcon />}
          color="linear-gradient(135deg, #f7971e, #ffd200)"
        />
        <Stat
          title="Total Revenue (₹)"
          value={stats.totalRevenue.toFixed(2)}
          icon={<AttachMoneyIcon />}
          color="linear-gradient(135deg, #56ab2f, #a8e063)"
        />
      </Grid>

      {/* ACTIONS */}
      <Grid container spacing={2} mb={4}>
        <Action text="Add Resort" icon={<AddIcon />} onClick={() => navigate("/owner/resorts")} />
        <Action text="Add Rooms" icon={<MeetingRoomIcon />} onClick={() => navigate("/owner/rooms")} />
        <Action text="Food & Services" icon={<RestaurantIcon />} onClick={() => navigate("/owner/services")} />
        <Action text="View Bookings" icon={<BookIcon />} onClick={() => navigate("/owner/bookings")} />
        <Action text="Revenue" icon={<BookIcon />} onClick={() => navigate("/owner/revenue")} />
        <Action text="Profile" icon={<BookIcon />} onClick={() => navigate("/owner/profile")} />

      </Grid>

      {/* RESORT LIST */}
      <Section title="My Resorts">
        {resorts.length === 0 ? (
          <Empty text="No resorts added yet" />
        ) : (
          resorts.map((r) => (
            <Fade in key={r.resortId}>
              <Card
                sx={{
                  display: "flex",
                  p: 2,
                  mb: 2,
                  borderRadius: 3,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    boxShadow: 12,
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <Avatar
                  variant="rounded"
                  src={r.img}
                  sx={{
                    width: 120,
                    height: 90,
                    mr: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={600} sx={{ mb: 0.5, display: "flex", alignItems: "center" }}>
                    {r.name}{" "}
                    <StarIcon sx={{ fontSize: 18, color: "#FFD700", ml: 1 }} />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {r.location?.city?.cityName}, {r.location?.city?.state}
                  </Typography>

                  <Stack direction="row" spacing={2} mt={1}>
                    <Chip label={`Bookings: ${r.bookingsCount}`} color="primary" />
                    <Chip label={`Revenue: ₹${r.revenue.toFixed(2)}`} color="success" icon={<TrendingUpIcon />} />
                    <Chip
                      label={r.isActive}
                      color={r.isActive === "ACTIVE" ? "success" : "error"}
                    />
                  </Stack>
                </Box>

                <Stack spacing={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(`/owner/bookings?resortId=${r.resortId}`)}
                  >
                    View Bookings
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(`/owner/rooms?resortId=${r.resortId}`)}
                  >
                    Rooms
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(`/owner/services?resortId=${r.resortId}`)}
                  >
                    Food
                  </Button>
                </Stack>
              </Card>
            </Fade>
          ))
        )}
      </Section>
    </Box>
  );
}

/* ================= UI HELPERS ================= */

function Center({ text, loading }) {
  return (
    <Box
      sx={{
        height: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {loading && <CircularProgress sx={{ mb: 2 }} color="secondary" />}
      <Typography variant="h6" sx={{ color: "#555" }}>
        {text}
      </Typography>
    </Box>
  );
}

function Stat({ title, value, icon, color }) {
  return (
    <Grid item xs={12} sm={4}>
      <Card
        sx={{
          p: 2,
          display: "flex",
          gap: 2,
          alignItems: "center",
          borderRadius: 3,
          background: color,
          color: "#fff",
          boxShadow: 3,
          transition: "transform 0.3s",
          "&:hover": { transform: "scale(1.05)" },
        }}
      >
        <Avatar sx={{ bgcolor: "rgba(255,255,255,0.3)" }}>{icon}</Avatar>
        <Box>
          <Typography fontSize={14} sx={{ opacity: 0.9 }}>
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            {value}
          </Typography>
        </Box>
      </Card>
    </Grid>
  );
}

function Action({ text, icon, onClick }) {
  return (
    <Grid item xs={6} sm={3}>
      <Button
        fullWidth
        variant="contained"
        startIcon={icon}
        onClick={onClick}
        sx={{
          py: 2,
          borderRadius: 2,
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          "&:hover": {
            background: "linear-gradient(135deg, #764ba2, #667eea)",
          },
          boxShadow: 3,
          transition: "all 0.3s",
        }}
      >
        {text}
      </Button>
    </Grid>
  );
}

function Section({ title, children }) {
  return (
    <Box mb={5}>
      <Typography
        variant="h6"
        fontWeight={600}
        mb={2}
        sx={{
          borderBottom: "2px solid #e0e0e0",
          pb: 1,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function Empty({ text }) {
  return (
    <Typography
      color="text.secondary"
      sx={{
        textAlign: "center",
        py: 5,
        fontStyle: "italic",
        color: "#999",
      }}
    >
      {text}
    </Typography>
  );
}
