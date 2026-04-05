import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { motion } from "framer-motion";

import {
  Box,
  Card,
  Typography,
  Grid,
  Select,
  MenuItem,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  LinearProgress,
  FormControl,
  InputLabel
} from "@mui/material";

import HotelIcon from "@mui/icons-material/Hotel";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import BuildIcon from "@mui/icons-material/Build";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AddIcon from "@mui/icons-material/Add";

export default function OwnerRooms() {
  const ownerId = localStorage.getItem("ownerId");

  const [resorts, setResorts] = useState([]);
  const [resortId, setResortId] = useState("");
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openAdd, setOpenAdd] = useState(false);
  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    basePrice: "",
    roomTypeId: ""
  });

  /* ================= LOAD OWNER RESORTS ================= */
  useEffect(() => {
    if (!ownerId) return;
    loadResorts();
  }, [ownerId]);

  async function loadResorts() {
    const res = await api.get("/owner/getResortsByOwnerId", {
      params: { ownerId }
    });
    setResorts(res.data || []);
    setLoading(false);
  }

 /* ================= LOAD ROOMS + BOOKINGS ================= */
async function loadResortData(id) {
  setResortId(id);
  setLoading(true);

  // 1️⃣ Get all rooms of the resort (DIRECT & CORRECT)
  const roomList = await api
    .get("/user/room/getRoomsByResortId", {
      params: { resortId: id }
    })
    .then(r => r.data)
    .catch(() => []);

  // 2️⃣ Get all bookings of the resort
  const bookingRes = await api
    .get(`/user/bookings/resort/${id}`)
    .then(r => r.data)
    .catch(() => []);

  // 3️⃣ Map latest booking per room
  const lastBookingByRoom = new Map();

  for (const b of bookingRes) {
    const bookingRooms = await api
      .get(`/user/bookings/getBookingRoomByBookingId/${b.bookingId}`)
      .then(r => r.data)
      .catch(() => []);

    bookingRooms.forEach(br => {
      lastBookingByRoom.set(br.room.roomId, b);
    });
  }

  // 4️⃣ Enrich rooms with booking intelligence
  const enrichedRooms = roomList.map(room => ({
    ...room,
    lastBooking: lastBookingByRoom.get(room.roomId) || null
  }));

  setBookings(bookingRes);
  setRooms(enrichedRooms);
  setLoading(false);
}


  /* ================= ANALYTICS ================= */
  const stats = useMemo(() => {
    const total = rooms.length;
    const available = rooms.filter(r => r.status === "AVAILABLE").length;
    const booked = rooms.filter(r => r.status === "BOOKED").length;
    const maintenance = rooms.filter(r => r.status === "MAINTENANCE").length;
    const occupancy = total === 0 ? 0 : Math.round((booked / total) * 100);
    return { total, available, booked, maintenance, occupancy };
  }, [rooms]);

  /* ================= ACTIONS ================= */
  async function changeStatus(roomId, status) {
    await api.put("/user/room/changeStatus", null, {
      params: { roomId, status }
    });
    loadResortData(resortId);
  }

  async function addRoom() {
    await api.post("/user/room/addRoom", {
      roomNumber: newRoom.roomNumber,
      basePrice: newRoom.basePrice,
      status: "AVAILABLE",
      resort: { resortId },
      roomType: { roomTypeId: newRoom.roomTypeId }
    });
    setOpenAdd(false);
    loadResortData(resortId);
  }

  /* ================= UI ================= */
  if (loading) {
    return <Loader text="Loading room intelligence..." />;
  }

  return (
    <Box sx={{ maxWidth: 1450, mx: "auto", p: 4, backgroundColor: "#f4f6fa", minHeight: "100vh" }}>
      {/* HEADER */}
      <Box
        sx={{
          mb: 4,
          p: 4,
          borderRadius: 4,
          color: "white",
          background: "linear-gradient(135deg,#1e3c72,#2a5298)"
        }}
      >
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{ mb: 1 }}
        >
          🛏️ Room Intelligence Center
        </Typography>
        <Typography opacity={0.9}>
          Monitor occupancy, availability & operational health
        </Typography>
      </Box>

      {/* RESORT SELECT */}
      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel>Select Resort</InputLabel>
        <Select
          value={resortId}
          onChange={(e) => loadResortData(e.target.value)}
        >
          <MenuItem value="">Select Resort</MenuItem>
          {resorts.map(r => (
            <MenuItem key={r.resortId} value={r.resortId}>
              {r.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {resortId && (
        <>
          {/* KPIs */}
          <Grid container spacing={3} mb={3}>
            <KPI title="Total Rooms" value={stats.total} icon={<HotelIcon fontSize="large" />} />
            <KPI title="Available" value={stats.available} icon={<EventAvailableIcon fontSize="large" />} color="success" />
            <KPI title="Booked" value={stats.booked} icon={<MeetingRoomIcon fontSize="large" />} color="warning" />
            <KPI title="Maintenance" value={stats.maintenance} icon={<BuildIcon fontSize="large" />} color="error" />
            <KPI title="Occupancy %" value={`${stats.occupancy}%`} icon={<EventAvailableIcon fontSize="large" />} />
          </Grid>

          <LinearProgress
            variant="determinate"
            value={stats.occupancy}
            sx={{
              height: 12,
              borderRadius: 6,
              mb: 4,
              backgroundColor: "#e0e0e0",
              "& .MuiLinearProgress-bar": { borderRadius: 6, background: "linear-gradient(90deg, #00c6ff, #0072ff)" }
            }}
          />

          <Button
            startIcon={<AddIcon />}
            variant="contained"
            sx={{
              mb: 3,
              background: "linear-gradient(135deg, #00c6ff, #0072ff)",
              fontWeight: 600,
              "&:hover": { background: "linear-gradient(135deg, #0072ff, #00c6ff)" }
            }}
            onClick={() => setOpenAdd(true)}
          >
            Add New Room
          </Button>

          {/* ROOMS */}
          <Grid container spacing={3}>
            {rooms.map(r => (
              <Grid item xs={12} md={4} key={r.roomId}>
                <motion.div whileHover={{ scale: 1.04 }}>
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": { transform: "translateY(-5px)", boxShadow: "0 10px 20px rgba(0,0,0,0.12)" }
                    }}
                  >
                    <Typography fontWeight={700} variant="h6">
                      Room #{r.roomNumber}
                    </Typography>

                    <Typography color="text.secondary">₹ {r.basePrice}</Typography>

                    <Chip
                      label={r.status}
                      icon={
                        r.status === "AVAILABLE" ? <EventAvailableIcon /> :
                        r.status === "BOOKED" ? <MeetingRoomIcon /> :
                        <BuildIcon />
                      }
                      color={
                        r.status === "AVAILABLE" ? "success" :
                        r.status === "BOOKED" ? "warning" :
                        "error"
                      }
                      variant="outlined"
                      sx={{ mt: 1, fontWeight: 600 }}
                    />

                    <Divider sx={{ my: 2 }} />

                    {r.lastBooking && (
                      <Typography variant="body2">
                        Last booking:<br />
                        {r.lastBooking.checkInDate} → {r.lastBooking.checkOutDate}
                      </Typography>
                    )}

                    <Stack spacing={1} mt={2}>
                      {r.status !== "AVAILABLE" && (
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            background: "linear-gradient(135deg,#43cea2,#185a9d)",
                            "&:hover": { background: "linear-gradient(135deg,#185a9d,#43cea2)" },
                            fontWeight: 600
                          }}
                          onClick={() => changeStatus(r.roomId, "AVAILABLE")}
                        >
                          Mark Available
                        </Button>
                      )}
                      {r.status !== "MAINTENANCE" && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          sx={{ fontWeight: 600 }}
                          onClick={() => changeStatus(r.roomId, "MAINTENANCE")}
                        >
                          Maintenance
                        </Button>
                      )}
                    </Stack>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* ADD ROOM MODAL */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ background: "#0072ff", color: "#fff" }}>Add New Room</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            label="Room Number"
            fullWidth
            sx={{ mb: 2 }}
            onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
          />
          <TextField
            label="Base Price"
            type="number"
            fullWidth
            sx={{ mb: 2 }}
            onChange={(e) => setNewRoom({ ...newRoom, basePrice: e.target.value })}
          />
          <TextField
            label="Room Type ID"
            fullWidth
            onChange={(e) => setNewRoom({ ...newRoom, roomTypeId: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #00c6ff, #0072ff)",
              "&:hover": { background: "linear-gradient(135deg, #0072ff, #00c6ff)" },
              fontWeight: 600
            }}
            onClick={addRoom}
          >
            Add Room
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/* ================= COMPONENTS ================= */
function Loader({ text }) {
  return (
    <Box
      sx={{
        height: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
      <CircularProgress sx={{ color: "#0072ff" }} />
      <Typography mt={2}>{text}</Typography>
    </Box>
  );
}

function KPI({ title, value, icon, color = "primary" }) {
  return (
    <Grid item xs={6} md={2.4}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1
          }}
        >
          {icon && <Box sx={{ color: `${color}.main`, fontSize: 30 }}>{icon}</Box>}
          <Typography fontSize={14}>{title}</Typography>
          <Typography variant="h5" fontWeight={700}>{value}</Typography>
        </Card>
      </motion.div>
    </Grid>
  );
}
