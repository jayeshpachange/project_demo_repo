import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Button,
  Rating,
  Stack,
  Chip,
  Divider,
  CircularProgress
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { motion } from "framer-motion";

const API_BASE = "http://localhost:8080";

/* ================================================= */

export default function ResortDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resort, setResort] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResort();
  }, [id]);

  const loadResort = async () => {
    try {
      const [resortRes, imageRes] = await Promise.all([
        axios.get(`${API_BASE}/user/resort/getById`, {
          params: { resId: id }
        }),
        axios.get(`${API_BASE}/user/resort/getResortImg`, {
          params: { resortId: id }
        })
      ]);

      setResort(resortRes.data);
      setImages(imageRes.data || []);
    } catch (err) {
      console.error("Failed to load resort details", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={12}>
        <CircularProgress />
        <Typography mt={2}>Loading resort details…</Typography>
      </Box>
    );
  }

  if (!resort) {
    return (
      <Typography textAlign="center" py={12}>
        Resort not found.
      </Typography>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", pb: 10 }}>

      {/* ================= BACK NAV ================= */}
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            color: "#10b981",
            "&:hover": { bgcolor: "#ecfdf5" }
          }}
        >
          Back to Resorts
        </Button>
      </Container>

      {/* ================= IMAGE SCROLLER ================= */}
{/* ================= IMAGE SCROLLER ================= */}
<Container maxWidth="lg" sx={{ mt: 4 }}>
  <Box
    sx={{
      display: "flex",
      gap: 3,
      overflowX: "auto",
      scrollSnapType: "x mandatory",
      pb: 2,
      "&::-webkit-scrollbar": { display: "none" }
    }}
  >
    {images.length > 0 ? (
      images.map((img, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.03, y: -6 }}
          style={{
            scrollSnapAlign: "center",
            minWidth: "75%",
            position: "relative"
          }}
        >
          {/* Glass Frame */}
          <Box
            sx={{
              position: "relative",
              borderRadius: "28px",
              overflow: "hidden",
              boxShadow:
                "0 30px 80px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)"
            }}
          >
            {/* Image */}
            <Box
              component="img"
              src={img}
              sx={{
                width: "100%",
                height: 440,
                objectFit: "cover",
                transition: "transform 0.6s ease"
              }}
            />

            {/* Gradient Overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.45), transparent 60%)"
              }}
            />

            {/* Corner Badge */}
            <Box
              sx={{
                position: "absolute",
                bottom: 20,
                left: 20,
                bgcolor: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(6px)",
                color: "white",
                px: 2,
                py: 0.6,
                borderRadius: "999px",
                fontSize: 13,
                fontWeight: 600
              }}
            >
              Resort View
            </Box>
          </Box>
        </motion.div>
      ))
    ) : (
      <Box
        component="img"
        src="https://via.placeholder.com/800x420?text=Resort+Image"
        sx={{
          width: "100%",
          height: 440,
          objectFit: "cover",
          borderRadius: "28px"
        }}
      />
    )}
  </Box>

  <Typography
    variant="caption"
    color="text.secondary"
    display="block"
    mt={1}
  >
    Swipe to explore the resort gallery →
  </Typography>
</Container>

      {/* ================= DETAILS ================= */}
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Grid container spacing={6}>

          {/* -------- LEFT -------- */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h4" fontWeight={900}>
                {resort.name}
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center" mt={2}>
                <LocationOnIcon color="action" />
                <Typography color="text.secondary">
                  {resort.location?.city?.cityName},{" "}
                  {resort.location?.city?.state}
                </Typography>

                <Divider orientation="vertical" flexItem />

                <Rating
                  value={resort.rating || 0}
                  precision={0.1}
                  readOnly
                />
                <Typography>
                  {resort.rating?.toFixed(1)}
                </Typography>

                {resort.rating >= 4.5 && (
                  <Chip label="Top Rated" color="success" size="small" />
                )}
              </Stack>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" fontWeight={700}>
                About this resort
              </Typography>

              <Typography mt={2} color="text.secondary" sx={{ lineHeight: 1.9 }}>
                {resort.description}
              </Typography>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" fontWeight={700}>
                Highlights
              </Typography>

              <Stack direction="row" spacing={2} mt={2} flexWrap="wrap">
                <Chip label={`Eco Score: ${resort.ecoScore}`} />
                <Chip label={`Status: ${resort.isActive}`} />
                <Chip label="Verified Property" />
                <Chip label="Secure Payments" />
              </Stack>
            </motion.div>
          </Grid>

          {/* -------- RIGHT (CTA) -------- */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card
                sx={{
                  p: 3,
                  position: "sticky",
                  top: 100,
                  borderRadius: 3,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
                }}
              >
                <Typography variant="h6" fontWeight={800}>
                  Book your stay
                </Typography>

                <Typography color="text.secondary" mt={1}>
                  Instant confirmation • No hidden charges
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  onClick={() => navigate("/login")}
                  sx={{
                    bgcolor: "#10b981",
                    "&:hover": { bgcolor: "#059669" }
                  }}
                >
                  Login to Book
                </Button>

                <Typography mt={2} variant="caption" color="text.secondary">
                  Booking available for registered users only.
                </Typography>
              </Card>
            </motion.div>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}
