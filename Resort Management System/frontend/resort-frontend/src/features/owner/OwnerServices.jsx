import { useEffect, useState } from "react";
import api from "../../api/axios";
import { motion } from "framer-motion";

import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  Divider,
  CircularProgress
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptIcon from "@mui/icons-material/Receipt";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import KitchenIcon from "@mui/icons-material/Kitchen";
import RoomServiceIcon from "@mui/icons-material/RoomService";

/* ===================================================== */
/*                OWNER SERVICES PAGE                    */
/* ===================================================== */

export default function OwnerServices() {
  const ownerId = Number(localStorage.getItem("ownerId"));

  const [resorts, setResorts] = useState([]);
  const [selectedResortId, setSelectedResortId] = useState("");
  const [foodCategories, setFoodCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [foodItems, setFoodItems] = useState([]);
  const [foodOrders, setFoodOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openFoodDialog, setOpenFoodDialog] = useState(false);
  const [foodForm, setFoodForm] = useState({ name: "", price: "" });

  useEffect(() => {
    api
      .get("/owner/getResortsByOwnerId", { params: { ownerId } })
      .then(res => setResorts(res.data || []));
  }, [ownerId]);

  async function onSelectResort(resortId) {
    if (!resortId) return;
    setSelectedResortId(resortId);
    setLoading(true);
    try {
      const catRes = await api.get("/user/foodOrder/getAllCategories");
      setFoodCategories(catRes.data || []);
      setSelectedCategoryId("");
      setFoodItems([]);
      setFoodOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadFoodItems(categoryId) {
    setSelectedCategoryId(categoryId);
    const res = await api.get(`/user/foodOrder/items/category/${categoryId}`);
    setFoodItems(res.data || []);
  }

  async function addFoodItem() {
    if (!foodForm.name || !foodForm.price || !selectedCategoryId) return;
    await api.post("/user/foodOrder/items", {
      name: foodForm.name,
      price: Number(foodForm.price),
      foodCategory: { foodCategoryId: selectedCategoryId }
    });
    setFoodForm({ name: "", price: "" });
    setOpenFoodDialog(false);
    loadFoodItems(selectedCategoryId);
  }

  async function deleteFoodItem(foodItemId) {
    await api.delete(`/user/foodOrder/items/${foodItemId}`);
    loadFoodItems(selectedCategoryId);
  }

  async function loadFoodOrders() {
    setLoading(true);
    try {
      const res = await api.get("/user/foodOrder/getAllFoodOrder");
      const filtered = (res.data || []).filter(o =>
        o.booking?.resort?.resortId === Number(selectedResortId) &&
        o.booking?.resort?.owner?.ownerId === ownerId
      );
      setFoodOrders(filtered);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId, status) {
    await api.put(`/user/foodOrder/orders/${orderId}/status`, null, {
      params: { status }
    });
    loadFoodOrders();
  }

  async function viewBill(orderId) {
    const res = await api.get(`/user/foodOrder/orders/${orderId}/bill`);
    alert(`Food Bill: ₹${res.data}`);
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={{ p: 4, minHeight: "100vh", background: "#0f172a" }}>
      {/* HERO HEADER */}
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
        <Box
          sx={{
            mb: 4,
            p: 4,
            borderRadius: 4,
            color: "white",
            background:
              "linear-gradient(135deg,#ff6a00,#ee0979)",
            boxShadow: "0 20px 50px rgba(0,0,0,.4)"
          }}
        >
          <Typography variant="h3" fontWeight={900}>
            🍽 Food Operations Command Center
          </Typography>
          <Typography opacity={0.85}>
            Live menu control • Kitchen orders • Billing overview
          </Typography>
        </Box>
      </motion.div>

      {/* RESORT SELECT */}
      <Select
        fullWidth
        displayEmpty
        value={selectedResortId}
        onChange={e => onSelectResort(e.target.value)}
        sx={{
          mb: 4,
          background: "white",
          borderRadius: 2
        }}
      >
        <MenuItem value="">Select Resort</MenuItem>
        {resorts.map(r => (
          <MenuItem key={r.resortId} value={r.resortId}>
            🏨 {r.name}
          </MenuItem>
        ))}
      </Select>

      {selectedResortId && (
        <>
          {/* CATEGORIES */}
          <Typography color="white" fontWeight={800} mb={2}>
            Menu Categories
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {foodCategories.map(cat => (
              <Chip
                key={cat.foodCategoryId}
                icon={<RestaurantMenuIcon />}
                label={cat.categoryName}
                onClick={() => loadFoodItems(cat.foodCategoryId)}
                sx={{
                  bgcolor:
                    selectedCategoryId === cat.foodCategoryId
                      ? "#22c55e"
                      : "#1e293b",
                  color: "white",
                  fontWeight: 700,
                  "&:hover": { transform: "scale(1.05)" }
                }}
              />
            ))}
          </Stack>

          <Divider sx={{ my: 4, borderColor: "#334155" }} />

          {/* FOOD ITEMS */}
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography color="white" fontWeight={800}>
              Menu Items
            </Typography>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              sx={{ bgcolor: "#22c55e" }}
              onClick={() => setOpenFoodDialog(true)}
            >
              Add Item
            </Button>
          </Stack>

          <Grid container spacing={2}>
            {foodItems.map(item => (
              <Grid item xs={12} md={3} key={item.foodItemId}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg,#1e293b,#020617)",
                      color: "white"
                    }}
                  >
                    <LocalDiningIcon />
                    <Typography fontWeight={800}>
                      {item.name}
                    </Typography>
                    <Typography color="#22c55e">
                      ₹ {item.price}
                    </Typography>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => deleteFoodItem(item.foodItemId)}
                    >
                      Remove
                    </Button>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 4, borderColor: "#334155" }} />

          {/* FOOD ORDERS */}
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography color="white" fontWeight={800}>
              Kitchen Orders
            </Typography>
            <Button
              startIcon={<KitchenIcon />}
              onClick={loadFoodOrders}
              sx={{ color: "#22c55e" }}
            >
              Refresh
            </Button>
          </Stack>

          <Grid container spacing={2}>
            {foodOrders.map(order => (
              <Grid item xs={12} md={4} key={order.foodOrderId}>
                <motion.div whileHover={{ y: -6 }}>
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg,#020617,#1e293b)",
                      color: "white"
                    }}
                  >
                    <Typography fontWeight={900}>
                      Order #{order.foodOrderId}
                    </Typography>
                    <Typography opacity={0.7}>
                      Booking #{order.booking.bookingId}
                    </Typography>

                    <Chip
                      icon={<RoomServiceIcon />}
                      label={order.orderStatus}
                      sx={{
                        my: 1,
                        bgcolor: "#f59e0b",
                        color: "black",
                        fontWeight: 800
                      }}
                    />

                    <Stack spacing={1}>
                      <Button
                        variant="contained"
                        sx={{ bgcolor: "#22c55e" }}
                        onClick={() =>
                          updateOrderStatus(order.foodOrderId, "SERVED")
                        }
                      >
                        Mark Served
                      </Button>

                      <Button
                        startIcon={<ReceiptIcon />}
                        onClick={() => viewBill(order.foodOrderId)}
                        sx={{ color: "white" }}
                      >
                        View Bill
                      </Button>
                    </Stack>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* ADD FOOD */}
      <Dialog open={openFoodDialog} onClose={() => setOpenFoodDialog(false)}>
        <DialogTitle>Add Menu Item</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Food Name"
            margin="dense"
            onChange={e =>
              setFoodForm({ ...foodForm, name: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Price"
            type="number"
            margin="dense"
            onChange={e =>
              setFoodForm({ ...foodForm, price: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={addFoodItem} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/* ================= LOADER ================= */

function Loader() {
  return (
    <Box
      sx={{
        height: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "#020617"
      }}
    >
      <CircularProgress />
      <Typography color="white" mt={2}>
        Initializing food operations…
      </Typography>
    </Box>
  );
}






// import { useEffect, useState } from "react";
// import api from "../../api/axios";

// import {
//   Box,
//   Grid,
//   Card,
//   Typography,
//   Button,
//   Select,
//   MenuItem,
//   TextField,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Chip,
//   Stack,
//   Divider,
//   CircularProgress
// } from "@mui/material";

// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import ReceiptIcon from "@mui/icons-material/Receipt";

// /* ===================================================== */
// /*                OWNER SERVICES PAGE                    */
// /* ===================================================== */

// export default function OwnerServices() {
//   const ownerId = Number(localStorage.getItem("ownerId"));

//   /* ---------------- STATE ---------------- */

//   const [resorts, setResorts] = useState([]);
//   const [selectedResortId, setSelectedResortId] = useState("");

//   const [foodCategories, setFoodCategories] = useState([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState("");

//   const [foodItems, setFoodItems] = useState([]);
//   const [foodOrders, setFoodOrders] = useState([]);

//   const [loading, setLoading] = useState(false);

//   /* ---------------- DIALOGS ---------------- */

//   const [openFoodDialog, setOpenFoodDialog] = useState(false);
//   const [foodForm, setFoodForm] = useState({ name: "", price: "" });

//   /* ===================================================== */
//   /*                  INITIAL LOAD                        */
//   /* ===================================================== */

//   useEffect(() => {
//     api
//       .get("/owner/getResortsByOwnerId", { params: { ownerId } })
//       .then(res => setResorts(res.data || []))
//       .catch(() => setResorts([]));
//   }, [ownerId]);

//   /* ===================================================== */
//   /*               LOAD RESORT CONTEXT                     */
//   /* ===================================================== */

//   async function onSelectResort(resortId) {
//     if (!resortId) return;

//     setSelectedResortId(resortId);
//     setLoading(true);

//     try {
//       const catRes = await api.get("/user/foodOrder/getAllCategories");
//       setFoodCategories(catRes.data || []);

//       setSelectedCategoryId("");
//       setFoodItems([]);
//       setFoodOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   /* ===================================================== */
//   /*                   FOOD ITEMS                         */
//   /* ===================================================== */

//   async function loadFoodItems(categoryId) {
//     setSelectedCategoryId(categoryId);
//     const res = await api.get(
//       `/user/foodOrder/items/category/${categoryId}`
//     );
//     setFoodItems(res.data || []);
//   }

//   async function addFoodItem() {
//     if (!foodForm.name || !foodForm.price || !selectedCategoryId) {
//       alert("All fields are required");
//       return;
//     }

//     await api.post("/user/foodOrder/items", {
//       name: foodForm.name,
//       price: Number(foodForm.price),
//       foodCategory: { foodCategoryId: selectedCategoryId }
//     });

//     setFoodForm({ name: "", price: "" });
//     setOpenFoodDialog(false);
//     loadFoodItems(selectedCategoryId);
//   }

//   async function deleteFoodItem(foodItemId) {
//     await api.delete(`/user/foodOrder/items/${foodItemId}`);
//     loadFoodItems(selectedCategoryId);
//   }

//   /* ===================================================== */
//   /*                   FOOD ORDERS                        */
//   /* ===================================================== */

//   async function loadFoodOrders() {
//     if (!selectedResortId) {
//       alert("Select a resort first");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await api.get("/user/foodOrder/getAllFoodOrder");
//       const allOrders = res.data || [];

//       const filtered = allOrders.filter(o =>
//         o.booking?.resort?.resortId === Number(selectedResortId) &&
//         o.booking?.resort?.owner?.ownerId === ownerId
//       );

//       setFoodOrders(filtered);
//     } catch (err) {
//       console.error("Failed to load food orders", err);
//       setFoodOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function updateOrderStatus(orderId, status) {
//     await api.put(`/user/foodOrder/orders/${orderId}/status`, null, {
//       params: { status }
//     });
//     loadFoodOrders();
//   }

//   async function viewBill(orderId) {
//     const res = await api.get(
//       `/user/foodOrder/orders/${orderId}/bill`
//     );
//     alert(`Food Bill: ₹${res.data}`);
//   }

//   /* ===================================================== */
//   /*                        UI                             */
//   /* ===================================================== */

//   if (loading) {
//     return (
//       <Box textAlign="center" mt={8}>
//         <CircularProgress />
//         <Typography mt={2}>Loading data...</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 4 }}>
//       <Typography variant="h4" fontWeight={700} mb={3}>
//         Owner – Food & Orders Management
//       </Typography>

//       {/* ================= RESORT SELECT ================= */}

//       <Select
//         fullWidth
//         value={selectedResortId}
//         displayEmpty
//         onChange={e => onSelectResort(e.target.value)}
//       >
//         <MenuItem value="">Select Your Resort</MenuItem>
//         {resorts.map(r => (
//           <MenuItem key={r.resortId} value={r.resortId}>
//             {r.name}
//           </MenuItem>
//         ))}
//       </Select>

//       {selectedResortId && (
//         <>
//           {/* ================= FOOD CATEGORIES ================= */}

//           <Divider sx={{ my: 4 }} />
//           <Typography variant="h5" mb={2}>
//             Food Categories
//           </Typography>

//           <Stack direction="row" spacing={1} flexWrap="wrap">
//             {foodCategories.map(cat => (
//               <Chip
//                 key={cat.foodCategoryId}
//                 label={cat.categoryName}
//                 clickable
//                 color={
//                   selectedCategoryId === cat.foodCategoryId
//                     ? "primary"
//                     : "default"
//                 }
//                 onClick={() => loadFoodItems(cat.foodCategoryId)}
//               />
//             ))}
//           </Stack>

//           {/* ================= FOOD ITEMS ================= */}

//           <Divider sx={{ my: 4 }} />

//           <Stack direction="row" justifyContent="space-between" mb={2}>
//             <Typography variant="h5">Food Items</Typography>
//             <Button
//               startIcon={<AddIcon />}
//               disabled={!selectedCategoryId}
//               onClick={() => setOpenFoodDialog(true)}
//             >
//               Add Food
//             </Button>
//           </Stack>

//           {!selectedCategoryId && (
//             <Typography color="text.secondary">
//               Select a category to manage food items
//             </Typography>
//           )}

//           <Grid container spacing={2}>
//             {foodItems.map(item => (
//               <Grid item xs={12} md={3} key={item.foodItemId}>
//                 <Card sx={{ p: 2 }}>
//                   <Typography fontWeight={600}>
//                     {item.name}
//                   </Typography>
//                   <Typography>₹ {item.price}</Typography>
//                   <Button
//                     size="small"
//                     color="error"
//                     startIcon={<DeleteIcon />}
//                     onClick={() => deleteFoodItem(item.foodItemId)}
//                   >
//                     Delete
//                   </Button>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>

//           {/* ================= FOOD ORDERS ================= */}

//           <Divider sx={{ my: 4 }} />

//           <Stack direction="row" justifyContent="space-between" mb={2}>
//             <Typography variant="h5">Food Orders</Typography>
//             <Button onClick={loadFoodOrders}>Load Orders</Button>
//           </Stack>

//           {foodOrders.length === 0 && (
//             <Typography color="text.secondary">
//               No food orders for this resort
//             </Typography>
//           )}

//           <Grid container spacing={2}>
//             {foodOrders.map(order => (
//               <Grid item xs={12} md={4} key={order.foodOrderId}>
//                 <Card sx={{ p: 3 }}>
//                   <Typography fontWeight={600}>
//                     Order #{order.foodOrderId}
//                   </Typography>

//                   <Typography variant="body2">
//                     Booking #{order.booking.bookingId}
//                   </Typography>

//                   <Chip
//                     label={order.orderStatus}
//                     sx={{ my: 1 }}
//                   />

//                   <Stack spacing={1}>
//                     <Button
//                       onClick={() =>
//                         updateOrderStatus(
//                           order.foodOrderId,
//                           "SERVED"
//                         )
//                       }
//                     >
//                       Mark SERVED
//                     </Button>

//                     <Button
//                       startIcon={<ReceiptIcon />}
//                       onClick={() => viewBill(order.foodOrderId)}
//                     >
//                       View Bill
//                     </Button>
//                   </Stack>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </>
//       )}

//       {/* ================= ADD FOOD DIALOG ================= */}

//       <Dialog open={openFoodDialog} onClose={() => setOpenFoodDialog(false)}>
//         <DialogTitle>Add Food Item</DialogTitle>

//         <DialogContent>
//           <TextField
//             fullWidth
//             label="Food Name"
//             margin="dense"
//             value={foodForm.name}
//             onChange={e =>
//               setFoodForm({ ...foodForm, name: e.target.value })
//             }
//           />

//           <TextField
//             fullWidth
//             type="number"
//             label="Price"
//             margin="dense"
//             value={foodForm.price}
//             onChange={e =>
//               setFoodForm({ ...foodForm, price: e.target.value })
//             }
//           />
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={addFoodItem}>Add</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }
