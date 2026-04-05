import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  Stack,
  Divider
} from "@mui/material";

import HotelIcon from "@mui/icons-material/Hotel";
import SecurityIcon from "@mui/icons-material/Security";
import BusinessIcon from "@mui/icons-material/Business";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import InsightsIcon from "@mui/icons-material/Insights";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

export default function Home() {
  const navigate = useNavigate();
  const navItems = [
  { label: "Home", path: "/" },
  { label: "Resorts", path: "/resorts" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" }// add more here
];


  return (
    <Box sx={{ bgcolor: "#f8fafc", color: "#1f2937" }}>

      {/* ================= NAVBAR ================= */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #e5e7eb"
        }}
      >
        <Toolbar sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
          <Typography variant="h6" fontWeight={900} sx={{ flexGrow: 1 }}>
            Resort<span style={{ color: "#10b981" }}>Hub</span>
          </Typography>

        <Stack direction="row" spacing={3} sx={{ display: { xs: "none", md: "flex" } }}>
          {navItems.map((item) => (
            <Button
              key={item.label}
              onClick={() => navigate(item.path)}
              sx={{
                color: "#111827",
                fontWeight: 500,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  width: "0%",
                  height: "2px",
                  bgcolor: "#10b981",
                  transition: "0.3s"
                },
                "&:hover::after": { width: "100%" },
                "&:hover": { backgroundColor: "transparent" }
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>


          <Stack direction="row" spacing={2} ml={3}>
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{
                borderColor: "#10b981",
                color: "#10b981",
                "&:hover": { bgcolor: "#ecfdf5" }
              }}
            >
              Login
            </Button>

            <Button
              variant="contained"
              onClick={() => navigate("/register")}
              sx={{
                bgcolor: "#10b981",
                boxShadow: "0 10px 30px rgba(16,185,129,0.35)",
                "&:hover": { bgcolor: "#059669", transform: "translateY(-2px)" }
              }}
            >
              Sign Up
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* ================= HERO ================= */}
      <Box
        sx={{
          pt: 18,
          pb: 20,
          background: "radial-gradient(circle at top, #020617, #0f172a)",
          color: "white"
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={10} alignItems="center">

            {/* LEFT HERO */}
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <Typography variant="h3" fontWeight={900} lineHeight={1.15}>
                  Enterprise-Ready <br />
                  <span style={{ color: "#34d399" }}>Resort Booking & Management</span>
                </Typography>

                <Typography variant="h6" sx={{ mt: 3, color: "#c7d2fe", maxWidth: 540 }}>
                  A unified platform connecting customers, resort owners, and admins through secure bookings, real-time operations, and intelligent insights.
                </Typography>

                <Stack direction="row" spacing={2} mt={6}>
                  <motion.div whileHover={{ y: -4 }}>
                    <Button
                      size="large"
                      variant="contained"
                      startIcon={<HotelIcon />}
                      onClick={() => navigate("/resorts")}
                      sx={{ bgcolor: "#10b981", px: 4, "&:hover": { bgcolor: "#059669" } }}
                    >
                      Explore Resorts
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ y: -4 }}>
                    <Button
                      size="large"
                      variant="outlined"
                      color="inherit"
                      onClick={() => navigate("/login")}
                      sx={{ borderColor: "rgba(255,255,255,0.4)", color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.08)" } }}
                    >
                      Business Login
                    </Button>
                  </motion.div>
                </Stack>
              </motion.div>
            </Grid>

            {/* RIGHT HERO INFO */}
            <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
              <motion.div initial={{ opacity: 0, y: 70 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                <Box
                  sx={{
                    bgcolor: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(20px)",
                    borderRadius: 4,
                    p: 4,
                    border: "1px solid rgba(255,255,255,0.15)"
                  }}
                >
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Built for Scale & Security
                  </Typography>

                  <Stack spacing={2} mt={3} color="#e5e7eb">
                    <Line icon={<SecurityIcon />} text="JWT-based role security" />
                    <Line icon={<VerifiedUserIcon />} text="Isolated USER / OWNER / ADMIN flows" />
                    <Line icon={<InsightsIcon />} text="Operational analytics & reports" />
                    <Line icon={<AdminPanelSettingsIcon />} text="Audit-ready administration tools" />
                  </Stack>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ================= TRUST METRICS ================= */}
      <Container maxWidth="lg" sx={{ py: 14 }}>
        <Grid container spacing={4} textAlign="center">
          <Metric value="500+" label="Verified Resorts" />
          <Metric value="20K+" label="Monthly Bookings" />
          <Metric value="99.9%" label="System Uptime" />
          <Metric value="Secure" label="JWT Auth Platform" />
        </Grid>
      </Container>

      {/* ================= HOW IT WORKS ================= */}
      <Box sx={{ py: 16 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" maxWidth={720} mx="auto">
            <Typography variant="h4" fontWeight={800}>How ResortHub Powers Your Business</Typography>
            <Typography color="text.secondary" mt={2}>
              From discovery to booking to operations — everything flows through a single, secure, intelligent system.
            </Typography>
          </Box>

          <Grid container spacing={6} mt={8}>
            <WorkStep icon={<HotelIcon />} title="Discover & Onboard Resorts" desc="Resorts are onboarded with verified details, locations, rooms, amenities, and pricing." />
            <WorkStep icon={<VerifiedUserIcon />} title="Secure User & Role Access" desc="JWT authentication ensures isolated access for Customers, Resort Owners, and Admins." />
            <WorkStep icon={<BusinessIcon />} title="Real-Time Booking Operations" desc="Bookings, room availability, services, and payments are handled in real time." />
            <WorkStep icon={<InsightsIcon />} title="Monitor, Analyze & Scale" desc="Admins and owners get access to booking trends, revenue insights, occupancy data, and audit logs." />
          </Grid>
        </Container>
      </Box>

      {/* ================= STAKEHOLDERS ================= */}
      <Box sx={{ bgcolor: "#f8fafc", py: 16 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" maxWidth={720} mx="auto">
            <Typography variant="h4" fontWeight={800}>One Platform. Multiple Business Roles.</Typography>
            <Typography color="text.secondary" mt={2}>
              Designed to serve different stakeholders without compromising security, performance, or usability.
            </Typography>
          </Box>

          <Grid container spacing={4} mt={6}>
            <StakeCard icon={<HotelIcon />} title="Customers" desc="Browse verified resorts, manage bookings, payments, and reviews." />
            <StakeCard icon={<BusinessIcon />} title="Resort Owners" desc="Manage resorts, rooms, pricing, services, and track revenue." />
            <StakeCard icon={<AdminPanelSettingsIcon />} title="Administrators" desc="Control users, master data, pricing rules, audits, and governance." />
          </Grid>
        </Container>
      </Box>

      {/* ================= FOOTER ================= */}
      <Box sx={{ bgcolor: "#020617", color: "#9ca3af", py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography color="white" fontWeight={600}>ResortHub</Typography>
              <Typography mt={2} variant="body2">Enterprise-grade resort booking & management platform.</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography color="white" fontWeight={600}>Platform</Typography>
              <Stack spacing={1} mt={2}><span>Resorts</span><span>Security</span><span>Architecture</span></Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography color="white" fontWeight={600}>Business Access</Typography>
              <Stack spacing={1} mt={2}><span>Owner Login</span><span>Admin Login</span><span>System Status</span></Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="caption">© 2026 ResortHub. All rights reserved By Shreyash❤️.</Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

/* ================= SMALL COMPONENTS ================= */
function Line({ icon, text }) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Box sx={{ color: "#34d399" }}>{icon}</Box>
      <Typography variant="body2">{text}</Typography>
    </Stack>
  );
}

function Metric({ value, label }) {
  return (
    <Grid item xs={6} md={3}>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" fontWeight={900} color="#10b981">{value}</Typography>
        <Typography color="text.secondary">{label}</Typography>
      </motion.div>
    </Grid>
  );
}

function WorkStep({ icon, title, desc }) {
  return (
    <Grid item xs={12} md={6}>
      <motion.div whileHover={{ x: 6 }}>
        <Stack direction="row" spacing={3} alignItems="flex-start">
          <Box sx={{ minWidth: 56, height: 56, borderRadius: "14px", bgcolor: "#ecfdf5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>{title}</Typography>
            <Typography color="text.secondary" mt={1}>{desc}</Typography>
          </Box>
        </Stack>
      </motion.div>
    </Grid>
  );
}

function StakeCard({ icon, title, desc }) {
  return (
    <Grid item xs={12} md={4}>
      <motion.div whileHover={{ y: -8 }}>
        <Card sx={{ p: 4, height: "100%", borderRadius: 4, boxShadow: "0 20px 40px rgba(0,0,0,0.08)", transition: "0.3s" }}>
          <Box sx={{ fontSize: 42, color: "#10b981" }}>{icon}</Box>
          <Typography variant="h6" fontWeight={700} mt={2}>{title}</Typography>
          <Typography color="text.secondary" mt={2}>{desc}</Typography>
        </Card>
      </motion.div>
    </Grid>
  );
}




// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";

// import {
//   AppBar,
//   Toolbar,
//   Box,
//   Container,
//   Typography,
//   Button,
//   Grid,
//   Card,
//   Stack,
//   Divider
// } from "@mui/material";

// import HotelIcon from "@mui/icons-material/Hotel";
// import SecurityIcon from "@mui/icons-material/Security";
// import BusinessIcon from "@mui/icons-material/Business";
// import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
// import InsightsIcon from "@mui/icons-material/Insights";
// import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

// export default function Home() {
//   const navigate = useNavigate();

//   return (
//     <Box sx={{ bgcolor: "#ffffff", color: "#1f2937" }}>

//       {/* ================= NAVBAR ================= */}
//       <AppBar
//         position="fixed"
//         elevation={0}
//         sx={{
//           bgcolor: "rgba(255,255,255,0.9)",
//           backdropFilter: "blur(16px)",
//           borderBottom: "1px solid #e5e7eb"
//         }}
//       >
//         <Toolbar sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
//           <Typography variant="h6" fontWeight={900} sx={{ flexGrow: 1 }}>
//             Resort<span style={{ color: "#10b981" }}>Hub</span>
//           </Typography>

//           <Stack direction="row" spacing={3} sx={{ display: { xs: "none", md: "flex" } }}>
//             {["Home", "Resorts", "About", "Contact"].map((item) => (
//               <Button
//                 key={item}
//                 onClick={() => item === "Resorts" && navigate("/resorts")}
//                 sx={{
//                   color: "#111827",
//                   fontWeight: 500,
//                   position: "relative",
//                   "&::after": {
//                     content: '""',
//                     position: "absolute",
//                     left: 0,
//                     bottom: 0,
//                     width: "0%",
//                     height: "2px",
//                     bgcolor: "#10b981",
//                     transition: "0.3s"
//                   },
//                   "&:hover::after": { width: "100%" },
//                   "&:hover": { backgroundColor: "transparent" }
//                 }}
//               >
//                 {item}
//               </Button>
//             ))}
//           </Stack>

//           <Stack direction="row" spacing={2} ml={3}>
//             <Button
//               variant="outlined"
//               onClick={() => navigate("/login")}
//               sx={{
//                 borderColor: "#10b981",
//                 color: "#10b981",
//                 "&:hover": {
//                   bgcolor: "#ecfdf5"
//                 }
//               }}
//             >
//               Login
//             </Button>

//             <Button
//               variant="contained"
//               onClick={() => navigate("/register")}
//               sx={{
//                 bgcolor: "#10b981",
//                 boxShadow: "0 10px 30px rgba(16,185,129,0.35)",
//                 "&:hover": {
//                   bgcolor: "#059669",
//                   transform: "translateY(-2px)"
//                 }
//               }}
//             >
//               Sign Up
//             </Button>
//           </Stack>
//         </Toolbar>
//       </AppBar>

//       {/* ================= HERO ================= */}
//       <Box
//         sx={{
//           pt: 18,
//           pb: 20,
//           background: "radial-gradient(circle at top, #020617, #0f172a)",
//           color: "white"
//         }}
//       >
//         <Container maxWidth="lg">
//           <Grid container spacing={10} alignItems="center">

//             {/* LEFT */}
//             <Grid item xs={12} md={6}>
//               <motion.div
//                 initial={{ opacity: 0, y: 50 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.7 }}
//               >
//                 <Typography variant="h3" fontWeight={900} lineHeight={1.15}>
//                   Enterprise-Ready <br />
//                   <span style={{ color: "#34d399" }}>
//                     Resort Booking & Management
//                   </span>
//                 </Typography>

//                 <Typography
//                   variant="h6"
//                   sx={{ mt: 3, color: "#c7d2fe", maxWidth: 540 }}
//                 >
//                   A unified platform that connects customers, resort owners,
//                   and administrators through secure bookings, real-time
//                   operations, and intelligent insights.
//                 </Typography>

//                 <Stack direction="row" spacing={2} mt={6}>
//                   <motion.div whileHover={{ y: -4 }}>
//                     <Button
//                       size="large"
//                       variant="contained"
//                       startIcon={<HotelIcon />}
//                       onClick={() => navigate("/resorts")}
//                       sx={{
//                         bgcolor: "#10b981",
//                         px: 4,
//                         "&:hover": { bgcolor: "#059669" }
//                       }}
//                     >
//                       Explore Resorts
//                     </Button>
//                   </motion.div>

//                   <motion.div whileHover={{ y: -4 }}>
//                     <Button
//                       size="large"
//                       variant="outlined"
//                       color="inherit"
//                       onClick={() => navigate("/login")}
//                       sx={{
//                         borderColor: "rgba(255,255,255,0.4)",
//                         color: "white",
//                         "&:hover": {
//                           bgcolor: "rgba(255,255,255,0.08)"
//                         }
//                       }}
//                     >
//                       Business Login
//                     </Button>
//                   </motion.div>
//                 </Stack>
//               </motion.div>
//             </Grid>

//             {/* RIGHT */}
//             <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
//               <motion.div
//                 initial={{ opacity: 0, y: 70 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.7, delay: 0.2 }}
//               >
//                 <Box
//                   sx={{
//                     bgcolor: "rgba(255,255,255,0.08)",
//                     backdropFilter: "blur(20px)",
//                     borderRadius: 4,
//                     p: 4,
//                     border: "1px solid rgba(255,255,255,0.15)"
//                   }}
//                 >
//                   <Typography variant="h6" fontWeight={600} gutterBottom>
//                     Built for Scale & Security
//                   </Typography>

//                   <Stack spacing={2} mt={3} color="#e5e7eb">
//                     <Line icon={<SecurityIcon />} text="JWT-based role security" />
//                     <Line icon={<VerifiedUserIcon />} text="Isolated USER / OWNER / ADMIN flows" />
//                     <Line icon={<InsightsIcon />} text="Operational analytics & reports" />
//                     <Line icon={<AdminPanelSettingsIcon />} text="Audit-ready administration tools" />
//                   </Stack>
//                 </Box>
//               </motion.div>
//             </Grid>
//           </Grid>
//         </Container>
//       </Box>

//       {/* ================= TRUST METRICS ================= */}
//       <Container maxWidth="lg" sx={{ py: 14 }}>
//         <Grid container spacing={4} textAlign="center">
//           <Metric value="500+" label="Verified Resorts" />
//           <Metric value="20K+" label="Monthly Bookings" />
//           <Metric value="99.9%" label="System Uptime" />
//           <Metric value="Secure" label="JWT Auth Platform" />
//         </Grid>
//       </Container>

//       {/* ================= HOW IT WORKS ================= */}
//       <Box sx={{ py: 16 }}>
//         <Container maxWidth="lg">
//           <Box textAlign="center" maxWidth={720} mx="auto">
//             <Typography variant="h4" fontWeight={800}>
//               How ResortHub Powers Your Business
//             </Typography>
//             <Typography color="text.secondary" mt={2}>
//               From discovery to booking to operations — everything flows through
//               a single, secure, intelligent system.
//             </Typography>
//           </Box>

//           <Grid container spacing={6} mt={8}>
//             <WorkStep {...{ icon: <HotelIcon />, title: "Discover & Onboard Resorts", desc: "Resorts are onboarded with verified details, locations, rooms, amenities, and pricing — ensuring trust and consistency across the platform." }} />
//             <WorkStep {...{ icon: <VerifiedUserIcon />, title: "Secure User & Role Access", desc: "JWT-based authentication ensures isolated access for Customers, Resort Owners, and Administrators with strict role boundaries." }} />
//             <WorkStep {...{ icon: <BusinessIcon />, title: "Real-Time Booking Operations", desc: "Bookings, room availability, services, and payments are handled in real time — reducing conflicts and manual errors." }} />
//             <WorkStep {...{ icon: <InsightsIcon />, title: "Monitor, Analyze & Scale", desc: "Admins and owners get access to booking trends, revenue insights, occupancy data, and audit logs to drive decisions." }} />
//           </Grid>
//         </Container>
//       </Box>

//       {/* ================= STAKEHOLDERS ================= */}
//       <Box sx={{ bgcolor: "#f8fafc", py: 16 }}>
//         <Container maxWidth="lg">
//           <Box textAlign="center" maxWidth={720} mx="auto">
//             <Typography variant="h4" fontWeight={800}>
//               One Platform. Multiple Business Roles.
//             </Typography>
//             <Typography color="text.secondary" mt={2}>
//               Designed to serve different stakeholders without compromising
//               security, performance, or usability.
//             </Typography>
//           </Box>

//           <Grid container spacing={4} mt={6}>
//             <StakeCard icon={<HotelIcon />} title="Customers" desc="Browse verified resorts, manage bookings, payments, and reviews with confidence." />
//             <StakeCard icon={<BusinessIcon />} title="Resort Owners" desc="Manage resorts, rooms, pricing, services, and track occupancy & revenue." />
//             <StakeCard icon={<AdminPanelSettingsIcon />} title="Administrators" desc="Control users, master data, pricing rules, audits, and platform governance." />
//           </Grid>
//         </Container>
//       </Box>

//         {/* ================= FOOTER ================= */}
//         <Box sx={{ bgcolor: "#020617", color: "#9ca3af", py: 8 }}>
//         <Container maxWidth="lg">
//             <Grid container spacing={4}>
//             <Grid item xs={12} md={4}>
//                 <Typography color="white" fontWeight={600}>
//                 ResortHub
//                 </Typography>
//                 <Typography mt={2} variant="body2">
//                 Enterprise-grade resort booking & management platform.
//                 </Typography>
//             </Grid>

//             <Grid item xs={12} md={4}>
//                 <Typography color="white" fontWeight={600}>
//                 Platform
//                 </Typography>
//                 <Stack spacing={1} mt={2}>
//                 <span>Resorts</span>
//                 <span>Security</span>
//                 <span>Architecture</span>
//                 </Stack>
//             </Grid>

//             <Grid item xs={12} md={4}>
//                 <Typography color="white" fontWeight={600}>
//                 Business Access
//                 </Typography>
//                 <Stack spacing={1} mt={2}>
//                 <span>Owner Login</span>
//                 <span>Admin Login</span>
//                 <span>System Status</span>
//                 </Stack>
//             </Grid>
//             </Grid>

//             <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />

//             <Box sx={{ textAlign: "center" }}>
//             <Typography variant="caption">
//                 © 2026 ResortHub. All rights reserved By Shreyash ❤️.
//             </Typography>
//             </Box>
//         </Container>
//         </Box>


//     </Box>
//   );
// }

// /* ================= SMALL COMPONENTS ================= */

// function Line({ icon, text }) {
//   return (
//     <Stack direction="row" spacing={2} alignItems="center">
//       <Box sx={{ color: "#34d399" }}>{icon}</Box>
//       <Typography variant="body2">{text}</Typography>
//     </Stack>
//   );
// }

// function Metric({ value, label }) {
//   return (
//     <Grid item xs={6} md={3}>
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <Typography variant="h4" fontWeight={900} color="#10b981">
//           {value}
//         </Typography>
//         <Typography color="text.secondary">{label}</Typography>
//       </motion.div>
//     </Grid>
//   );
// }

// function WorkStep({ icon, title, desc }) {
//   return (
//     <Grid item xs={12} md={6}>
//       <motion.div whileHover={{ x: 6 }}>
//         <Stack direction="row" spacing={3} alignItems="flex-start">
//           <Box
//             sx={{
//               minWidth: 56,
//               height: 56,
//               borderRadius: "14px",
//               bgcolor: "#ecfdf5",
//               color: "#10b981",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: 28
//             }}
//           >
//             {icon}
//           </Box>

//           <Box>
//             <Typography variant="h6" fontWeight={700}>
//               {title}
//             </Typography>
//             <Typography color="text.secondary" mt={1}>
//               {desc}
//             </Typography>
//           </Box>
//         </Stack>
//       </motion.div>
//     </Grid>
//   );
// }

// function StakeCard({ icon, title, desc }) {
//   return (
//     <Grid item xs={12} md={4}>
//       <motion.div whileHover={{ y: -8 }}>
//         <Card
//           sx={{
//             p: 4,
//             height: "100%",
//             borderRadius: 4,
//             boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
//             transition: "0.3s"
//           }}
//         >
//           <Box sx={{ fontSize: 42, color: "#10b981" }}>{icon}</Box>
//           <Typography variant="h6" fontWeight={700} mt={2}>
//             {title}
//           </Typography>
//           <Typography color="text.secondary" mt={2}>
//             {desc}
//           </Typography>
//         </Card>
//       </motion.div>
//     </Grid>
//   );
// }
