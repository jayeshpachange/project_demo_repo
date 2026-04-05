import { useEffect, useState } from "react";
import api from "../../api/axios";

import {
  Box,
  Card,
  Typography,
  CircularProgress,
  Chip,
  Stack,
  Button,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneAllIcon from "@mui/icons-material/DoneAll";

export default function OwnerBookings() {
  const ownerId = localStorage.getItem("ownerId");

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (!ownerId) {
      setLoading(false);
      return;
    }
    loadBookings();
  }, [ownerId]);

  async function loadBookings() {
    try {
      setLoading(true);

      const resortRes = await api.get("/owner/getResortsByOwnerId", {
        params: { ownerId },
      });

      const resorts = resortRes.data || [];

      let allBookings = [];

      for (const r of resorts) {
        const bookingRes = await api
          .get(`/user/bookings/resort/${r.resortId}`)
          .then((r) => r.data)
          .catch(() => []);

        bookingRes.forEach((b) => {
          allBookings.push({
            ...b,
            resortName: r.name,
          });
        });
      }

      setBookings(allBookings);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(bookingId, action) {
    try {
      await api.put(`/user/bookings/${bookingId}/${action}`);
      loadBookings();
    } catch {
      alert("Failed to update booking status");
    }
  }

  const filteredBookings =
    filter === "ALL"
      ? bookings
      : bookings.filter((b) => b.bookingStatus === filter);

  if (loading) {
    return (
      <Center>
        <CircularProgress sx={{ color: "#0072ff" }} />
        <Typography mt={2} color="#555">
          Loading bookings...
        </Typography>
      </Center>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", p: 3, backgroundColor: "#f7f8fc", minHeight: "100vh" }}>
      {/* HEADER */}
      <Typography
        variant="h3"
        fontWeight={700}
        mb={1}
        sx={{
          background: "linear-gradient(90deg, #00c6ff, #0072ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Resort Bookings
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Manage all bookings across your resorts
      </Typography>

      {/* FILTER */}
      <Box mb={4}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Filter Status</InputLabel>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Filter Status"
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="CONFIRMED">Confirmed</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredBookings.length === 0 ? (
        <Typography
          color="text.secondary"
          sx={{ textAlign: "center", py: 5, fontStyle: "italic", color: "#999" }}
        >
          No bookings found.
        </Typography>
      ) : (
        filteredBookings.map((b) => (
          <Card
            key={b.bookingId}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": { transform: "translateY(-5px)", boxShadow: "0 10px 20px rgba(0,0,0,0.12)" },
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Typography fontWeight={600} variant="h6">
                  {b.resortName}
                </Typography>

                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  👤 {b.user?.fullName} ({b.user?.email})
                </Typography>

                <Typography variant="body2" sx={{ mt: 0.5 }}>
                📱 Phone No.  {b.user.phone}
                </Typography>

                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  📅 {b.checkInDate} → {b.checkOutDate}
                </Typography>

                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  💰 ₹ {b.totalAmount}
                </Typography>


                <Chip
                  label={b.bookingStatus}
                  sx={{ mt: 1, fontWeight: 600 }}
                  icon={
                    b.bookingStatus === "CONFIRMED" ? (
                      <CheckCircleIcon />
                    ) : b.bookingStatus === "PENDING" ? (
                      <PendingIcon />
                    ) : b.bookingStatus === "CANCELLED" ? (
                      <CancelIcon />
                    ) : (
                      <DoneAllIcon />
                    )
                  }
                  color={
                    b.bookingStatus === "CONFIRMED"
                      ? "success"
                      : b.bookingStatus === "PENDING"
                      ? "warning"
                      : b.bookingStatus === "CANCELLED"
                      ? "error"
                      : "info"
                  }
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                  {b.bookingStatus === "PENDING" && (
                    <>
                      <Button
                        variant="contained"
                        sx={{
                          background: "linear-gradient(135deg, #00c6ff, #0072ff)",
                          "&:hover": { background: "linear-gradient(135deg, #0072ff, #00c6ff)" },
                          fontWeight: 600,
                        }}
                        onClick={() => updateStatus(b.bookingId, "confirm")}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        sx={{ fontWeight: 600 }}
                        onClick={() => updateStatus(b.bookingId, "cancel")}
                      >
                        Cancel
                      </Button>
                    </>
                  )}

                  {b.bookingStatus === "CONFIRMED" && (
                    <Button
                      variant="contained"
                      sx={{
                        background: "linear-gradient(135deg, #43cea2, #185a9d)",
                        "&:hover": { background: "linear-gradient(135deg, #185a9d, #43cea2)" },
                        fontWeight: 600,
                      }}
                      onClick={() => updateStatus(b.bookingId, "complete")}
                    >
                      Complete
                    </Button>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Card>
        ))
      )}
    </Box>
  );
}

/* ================= HELPERS ================= */

function Center({ children }) {
  return (
    <Box
      sx={{
        height: "60vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </Box>
  );
}
