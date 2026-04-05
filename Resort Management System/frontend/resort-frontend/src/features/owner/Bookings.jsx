// import { useEffect, useState } from "react";
// import api from "../../api/axios";

// import {
//   Box,
//   Grid,
//   Card,
//   Typography,
//   Select,
//   MenuItem,
//   Stack,
//   Divider,
//   Chip,
//   Button,
//   Collapse,
//   CircularProgress
// } from "@mui/material";

// import HotelIcon from "@mui/icons-material/Hotel";
// import PersonIcon from "@mui/icons-material/Person";
// import RestaurantIcon from "@mui/icons-material/Restaurant";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// /* ===================================================== */
// /*                OWNER BOOKINGS PAGE                    */
// /* ===================================================== */

// export default function Bookings() {
//   const ownerId = Number(localStorage.getItem("ownerId"));

//   /* ---------------- STATE ---------------- */

//   const [resorts, setResorts] = useState([]);
//   const [selectedResortId, setSelectedResortId] = useState("");

//   const [bookings, setBookings] = useState([]);
//   const [expandedBookingId, setExpandedBookingId] = useState(null);

//   const [foodBillMap, setFoodBillMap] = useState({});
//   const [loading, setLoading] = useState(false);

//   /* ===================================================== */
//   /*                  LOAD OWNER RESORTS                  */
//   /* ===================================================== */

//   useEffect(() => {
//     api
//       .get("/owner/getResortsByOwnerId", { params: { ownerId } })
//       .then(res => setResorts(res.data || []));
//   }, [ownerId]);

//   /* ===================================================== */
//   /*                 LOAD BOOKINGS                        */
//   /* ===================================================== */

//   async function loadBookings(resortId) {
//     setSelectedResortId(resortId);
//     setLoading(true);

//     try {
//       const res = await api.get(`/user/bookings/resort/${resortId}`);
//       setBookings(res.data || []);
//       setExpandedBookingId(null);
//     } finally {
//       setLoading(false);
//     }
//   }

//   /* ===================================================== */
//   /*              FOOD BILL PER BOOKING                   */
//   /* ===================================================== */

//   async function loadFoodBill(bookingId) {
//     if (foodBillMap[bookingId] !== undefined) return;

//     const res = await api.get(
//       `/user/foodOrder/booking/${bookingId}/food-bill`
//     );

//     setFoodBillMap(prev => ({
//       ...prev,
//       [bookingId]: res.data
//     }));
//   }

//   /* ===================================================== */
//   /*                        UI                             */
//   /* ===================================================== */

//   if (loading) {
//     return (
//       <Box textAlign="center" mt={8}>
//         <CircularProgress />
//         <Typography mt={2}>Loading bookings...</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 4 }}>
//       <Typography variant="h4" fontWeight={700} mb={3}>
//         📖 Bookings Management
//       </Typography>

//       {/* ================= RESORT SELECT ================= */}

//       <Select
//         fullWidth
//         displayEmpty
//         value={selectedResortId}
//         onChange={e => loadBookings(e.target.value)}
//       >
//         <MenuItem value="">Select Resort</MenuItem>
//         {resorts.map(r => (
//           <MenuItem key={r.resortId} value={r.resortId}>
//             {r.name}
//           </MenuItem>
//         ))}
//       </Select>

//       {selectedResortId && (
//         <>
//           <Divider sx={{ my: 4 }} />

//           {bookings.length === 0 && (
//             <Typography color="text.secondary">
//               No bookings found for this resort
//             </Typography>
//           )}

//           <Grid container spacing={3}>
//             {bookings.map(b => (
//               <Grid item xs={12} key={b.bookingId}>
//                 <Card sx={{ p: 3 }}>
//                   {/* -------- HEADER -------- */}
//                   <Stack
//                     direction="row"
//                     justifyContent="space-between"
//                     alignItems="center"
//                   >
//                     <Stack spacing={1}>
//                       <Typography fontWeight={600}>
//                         Booking #{b.bookingId}
//                       </Typography>

//                       <Stack direction="row" spacing={2}>
//                         <Chip
//                           icon={<HotelIcon />}
//                           label={b.bookingStatus}
//                           color={
//                             b.bookingStatus === "CONFIRMED"
//                               ? "success"
//                               : b.bookingStatus === "CANCELLED"
//                               ? "error"
//                               : "default"
//                           }
//                         />

//                         <Chip
//                           icon={<PersonIcon />}
//                           label={b.user.fullName}
//                         />
//                       </Stack>
//                     </Stack>

//                     <Button
//                       onClick={() =>
//                         setExpandedBookingId(
//                           expandedBookingId === b.bookingId
//                             ? null
//                             : b.bookingId
//                         )
//                       }
//                       startIcon={
//                         expandedBookingId === b.bookingId
//                           ? <ExpandLessIcon />
//                           : <ExpandMoreIcon />
//                       }
//                     >
//                       Details
//                     </Button>
//                   </Stack>

//                   {/* -------- COLLAPSIBLE DETAILS -------- */}
//                   <Collapse in={expandedBookingId === b.bookingId}>
//                     <Divider sx={{ my: 2 }} />

//                     <Stack spacing={1}>
//                       <Typography>
//                         📅 {b.checkInDate} → {b.checkOutDate}
//                       </Typography>

//                       <Typography>
//                         💰 Room Amount: ₹ {b.totalAmount}
//                       </Typography>

//                       <Button
//                         startIcon={<RestaurantIcon />}
//                         onClick={() => loadFoodBill(b.bookingId)}
//                       >
//                         View Food Bill
//                       </Button>

//                       {foodBillMap[b.bookingId] !== undefined && (
//                         <Typography>
//                           🍽️ Food Amount: ₹{" "}
//                           {foodBillMap[b.bookingId]}
//                         </Typography>
//                       )}

//                       {foodBillMap[b.bookingId] !== undefined && (
//                         <Typography fontWeight={600}>
//                           🧾 Total Revenue: ₹{" "}
//                           {b.totalAmount +
//                             foodBillMap[b.bookingId]}
//                         </Typography>
//                       )}
//                     </Stack>
//                   </Collapse>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </>
//       )}
//     </Box>
//   );
// }
