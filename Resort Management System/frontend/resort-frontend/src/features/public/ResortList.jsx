import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FormControl, Select, MenuItem } from "@mui/material";

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Rating,
  Stack,
  CircularProgress,
  Divider,
  Drawer,
  Checkbox,
  FormControlLabel,
  Slider,
  Pagination
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { motion } from "framer-motion";

const API_BASE = "http://localhost:8080";

/* ===================================================== */

export default function ResortList() {
  const navigate = useNavigate();

  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* FILTER STATE */
  const [rating, setRating] = useState(3);
  const [selectedCity, setSelectedCity] = useState("");

  /* PAGINATION */
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 4;

  useEffect(() => {
    loadResorts();
  }, []);

  const loadResorts = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/user/resort/getAllResort`
      );
      setResorts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const uniqueCities = [
    ...new Set(
      resorts
        .map(r => r.location?.city?.cityName)
        .filter(Boolean)
    )
  ];

  const filteredResorts = resorts.filter(r => {
    if (!selectedCity) return true;
    return r.location?.city?.cityName === selectedCity;
  });

  const paginatedResorts = filteredResorts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>

      {/* ================= HEADER ================= */}
      <Box
        sx={{
          py: 8,
          background: "radial-gradient(circle at top,#020617,#0f172a)",
          color: "white"
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h3" fontWeight={900}>
              Find Your Perfect Resort
            </Typography>
            <Typography mt={2} sx={{ color: "#cbd5f5", maxWidth: 640 }}>
              Filter by location, ratings and explore premium resorts
              curated for quality, security and comfort.
            </Typography>
          </motion.div>

          <Stack direction="row" spacing={2} mt={4}>
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              sx={{ color: "white", borderColor: "rgba(255,255,255,0.4)" }}
            >
              Home
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{ color: "white", borderColor: "rgba(255,255,255,0.4)" }}
            >
              Back
            </Button>

            <Button
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{
                bgcolor: "#10b981",
                "&:hover": { bgcolor: "#059669" }
              }}
            >
              Login
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* ================= BODY ================= */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>

          {/* ================= LEFT FILTER PANEL ================= */}
          <Grid item xs={12} md={3}>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                sx={{
                  p: 3,
                  position: "sticky",
                  top: 100,
                  borderRadius: 3,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <FilterAltIcon color="primary" />
                  <Typography fontWeight={700}>
                    Filters
                  </Typography>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                  City
                </Typography>

                <FormControl fullWidth size="small">
                  <Select
                    value={selectedCity}
                    displayEmpty
                    onChange={(e) => {
                      setSelectedCity(e.target.value);
                      setPage(1);
                    }}
                  >
                    <MenuItem value="">
                      <em>All Cities</em>
                    </MenuItem>

                    {uniqueCities.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle2" gutterBottom>
                  Minimum Rating
                </Typography>

                <Slider
                  value={rating}
                  step={0.5}
                  min={1}
                  max={5}
                  marks
                  valueLabelDisplay="auto"
                  onChange={(e, val) => setRating(val)}
                  sx={{ color: "#10b981" }}
                />
              </Card>
            </motion.div>
          </Grid>

          {/* ================= RIGHT CONTENT ================= */}
          <Grid item xs={12} md={9}>

            {loading && (
              <Box textAlign="center" py={10}>
                <CircularProgress />
                <Typography mt={2}>Loading resorts…</Typography>
              </Box>
            )}

            {!loading && paginatedResorts.length === 0 && (
              <Typography>No resorts found.</Typography>
            )}

            <Stack spacing={3}>
              {paginatedResorts.map(resort => (
                <motion.div
                  key={resort.resortId}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <BusinessResortCard
                    resort={resort}
                    onClick={() =>
                      navigate(`/resort/${resort.resortId}`)
                    }
                  />
                </motion.div>
              ))}
            </Stack>

            <Box display="flex" justifyContent="center" mt={6}>
              <Pagination
                count={Math.ceil(filteredResorts.length / PAGE_SIZE)}
                page={page}
                onChange={(e, val) => setPage(val)}
                color="primary"
                size="large"
              />
            </Box>

          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

/* ===================================================== */
/* ================= BUSINESS CARD ===================== */

function BusinessResortCard({ resort, onClick }) {
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState("");

  useEffect(() => {
    loadExtras();
  }, []);

  const loadExtras = async () => {
    try {
      const [ratingRes, imgRes] = await Promise.all([
        axios.get(
          `${API_BASE}/user/review/getResortRating`,
          { params: { resortId: resort.resortId } }
        ),
        axios.get(
          `${API_BASE}/user/resort/getResortImg`,
          { params: { resortId: resort.resortId } }
        )
      ]);

      setRating(ratingRes.data || 0);
      setImage(imgRes.data?.[0] || "");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        height: 220,
        borderRadius: 3,
        transition: "0.3s",
        "&:hover": {
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          transform: "translateY(-4px)"
        }
      }}
    >
      <CardMedia
        component="img"
        image={image || "https://via.placeholder.com/400x250"}
        sx={{ width: 260 }}
      />

      <CardContent sx={{ flex: 1 }}>
        <Stack height="100%" justifyContent="space-between">

          <Box>
            <Typography variant="h6" fontWeight={800}>
              {resort.resortName}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center" mt={1}>
              <LocationOnIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {resort.location?.locationName}, {resort.location?.city?.cityName}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" mt={2}>
              <Rating value={rating} precision={0.1} readOnly size="small" />
              <Typography variant="body2">
                {rating.toFixed(1)}
              </Typography>
            </Stack>
          </Box>

          <Button
            endIcon={<ArrowForwardIcon />}
            onClick={onClick}
            sx={{
              alignSelf: "flex-end",
              color: "#10b981",
              "&:hover": { bgcolor: "#ecfdf5" }
            }}
          >
            View Details
          </Button>

        </Stack>
      </CardContent>
    </Card>
  );
}
