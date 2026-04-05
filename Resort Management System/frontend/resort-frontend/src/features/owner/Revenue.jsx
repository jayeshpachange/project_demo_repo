import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { motion } from "framer-motion";

import {
  Box,
  Grid,
  Card,
  Typography,
  Select,
  MenuItem,
  Stack,
  Divider,
  CircularProgress,
  Chip
} from "@mui/material";

import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import HotelIcon from "@mui/icons-material/Hotel";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

/* ===================================================== */
/*                    REVENUE PAGE                       */
/* ===================================================== */

export default function Revenue() {
  const ownerId = Number(localStorage.getItem("ownerId"));

  const [resorts, setResorts] = useState([]);
  const [selectedResortId, setSelectedResortId] = useState("ALL");
  const [bookings, setBookings] = useState([]);
  const [foodOrders, setFoodOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    api
      .get("/owner/getResortsByOwnerId", { params: { ownerId } })
      .then(res => setResorts(res.data || []));
  }, [ownerId]);

  /* ================= LOAD REVENUE ================= */

  useEffect(() => {
    if (resorts.length === 0) return;

    setLoading(true);

    async function loadRevenue() {
      try {
        const bookingPromises = resorts.map(r =>
          api.get(`/user/bookings/resort/${r.resortId}`)
        );

        const bookingResponses = await Promise.all(bookingPromises);
        const allBookings = bookingResponses.flatMap(r => r.data || []);

        const foodRes = await api.get("/user/foodOrder/getAllFoodOrder");

        const ownerFoodOrders = (foodRes.data || []).filter(
          o => o.booking?.resort?.owner?.ownerId === ownerId
        );

        setBookings(allBookings);
        setFoodOrders(ownerFoodOrders);
      } finally {
        setLoading(false);
      }
    }

    loadRevenue();
  }, [resorts, ownerId]);

  /* ================= CALCULATIONS ================= */

  const revenueByResort = useMemo(() => {
    const map = {};

    resorts.forEach(r => {
      map[r.resortId] = {
        resortName: r.name,
        roomRevenue: 0,
        foodRevenue: 0
      };
    });

    bookings.forEach(b => {
      if (!map[b.resort.resortId]) return;
      map[b.resort.resortId].roomRevenue += b.totalAmount || 0;
    });

    foodOrders.forEach(o => {
      const rid = o.booking.resort.resortId;
      if (!map[rid]) return;
      map[rid].foodRevenue += o.totalAmount || 0;
    });

    return map;
  }, [resorts, bookings, foodOrders]);

  const filteredResorts = useMemo(() => {
    if (selectedResortId === "ALL") return Object.values(revenueByResort);
    return [revenueByResort[selectedResortId]];
  }, [selectedResortId, revenueByResort]);

  const totalRoomRevenue = filteredResorts.reduce(
    (sum, r) => sum + r.roomRevenue,
    0
  );

  const totalFoodRevenue = filteredResorts.reduce(
    (sum, r) => sum + r.foodRevenue,
    0
  );

  /* ================= UI ================= */

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={{ p: 4, minHeight: "100vh", background: "#020617" }}>
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Box
          sx={{
            mb: 5,
            p: 4,
            borderRadius: 4,
            color: "white",
            background:
              "linear-gradient(135deg,#0f766e,#22c55e)",
            boxShadow: "0 20px 40px rgba(0,0,0,.4)"
          }}
        >
          <Typography variant="h3" fontWeight={900}>
            💰 Revenue Intelligence Dashboard
          </Typography>
          <Typography opacity={0.85}>
            Real-time earnings across rooms & food services
          </Typography>
        </Box>
      </motion.div>

      {/* FILTER */}
      <Select
        value={selectedResortId}
        onChange={e => setSelectedResortId(e.target.value)}
        sx={{
          mb: 4,
          minWidth: 300,
          bgcolor: "white",
          borderRadius: 2
        }}
      >
        <MenuItem value="ALL">🌐 All Resorts</MenuItem>
        {resorts.map(r => (
          <MenuItem key={r.resortId} value={r.resortId}>
            🏨 {r.name}
          </MenuItem>
        ))}
      </Select>

      {/* SUMMARY */}
      <Grid container spacing={3}>
        <SummaryCard
          title="Room Revenue"
          value={totalRoomRevenue}
          icon={<HotelIcon />}
          color="#38bdf8"
        />
        <SummaryCard
          title="Food Revenue"
          value={totalFoodRevenue}
          icon={<RestaurantIcon />}
          color="#f59e0b"
        />
        <SummaryCard
          title="Total Revenue"
          value={totalRoomRevenue + totalFoodRevenue}
          icon={<MonetizationOnIcon />}
          color="#22c55e"
          highlight
        />
      </Grid>

      <Divider sx={{ my: 6, borderColor: "#334155" }} />

      {/* PER RESORT */}
      <Typography color="white" variant="h5" fontWeight={800} mb={3}>
        Resort-wise Financial Breakdown
      </Typography>

      <Grid container spacing={3}>
        {filteredResorts.map((r, index) => (
          <Grid item xs={12} md={4} key={index}>
            <motion.div whileHover={{ y: -8 }}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background:
                    "linear-gradient(135deg,#020617,#1e293b)",
                  color: "white",
                  boxShadow: "0 15px 30px rgba(0,0,0,.4)"
                }}
              >
                <Typography fontWeight={800} mb={2}>
                  🏨 {r.resortName}
                </Typography>

                <Stack spacing={1}>
                  <Chip
                    icon={<HotelIcon />}
                    label={`Rooms: ₹ ${r.roomRevenue}`}
                    sx={{ bgcolor: "#0ea5e9", color: "white" }}
                  />
                  <Chip
                    icon={<RestaurantIcon />}
                    label={`Food: ₹ ${r.foodRevenue}`}
                    sx={{ bgcolor: "#f59e0b", color: "black" }}
                  />
                  <Chip
                    icon={<TrendingUpIcon />}
                    label={`Total: ₹ ${r.roomRevenue + r.foodRevenue}`}
                    sx={{
                      bgcolor: "#22c55e",
                      color: "black",
                      fontWeight: 800
                    }}
                  />
                </Stack>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

/* ================= COMPONENTS ================= */

function Loader() {
  return (
    <Box
      sx={{
        height: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background: "#020617"
      }}
    >
      <CircularProgress />
      <Typography color="white" mt={2}>
        Crunching financial data…
      </Typography>
    </Box>
  );
}

function SummaryCard({ title, value, icon, color, highlight }) {
  return (
    <Grid item xs={12} md={4}>
      <motion.div whileHover={{ scale: 1.05 }}>
        <Card
          sx={{
            p: 4,
            borderRadius: 4,
            color: "white",
            background: highlight
              ? `linear-gradient(135deg,${color},#15803d)`
              : "linear-gradient(135deg,#020617,#1e293b)",
            boxShadow: "0 20px 40px rgba(0,0,0,.4)"
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ color }}>{icon}</Box>
            <Box>
              <Typography opacity={0.8}>{title}</Typography>
              <Typography variant="h4" fontWeight={900}>
                ₹ {value}
              </Typography>
            </Box>
          </Stack>
        </Card>
      </motion.div>
    </Grid>
  );
}
