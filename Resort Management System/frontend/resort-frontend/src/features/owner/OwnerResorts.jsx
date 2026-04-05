import { useEffect, useState } from "react";
import api from "../../api/axios";

import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Stack,
  Divider,
  CircularProgress,
  Fade,
  Grow
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import LocationOnIcon from "@mui/icons-material/LocationOn";

/* ===================================================== */
/*                OWNER RESORT MANAGEMENT                */
/* ===================================================== */

export default function OwnerResorts() {
  const ownerId = Number(localStorage.getItem("ownerId"));

  /* ---------------- STATE ---------------- */

  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedResort, setSelectedResort] = useState(null);

  const [openResortDialog, setOpenResortDialog] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);

  const [resortForm, setResortForm] = useState({
    name: "",
    description: "",
    locationId: "",
    ecoScore: "GOOD"
  });

  const [imageUrl, setImageUrl] = useState("");

  /* ===================================================== */
  /*                  LOAD OWNER RESORTS                  */
  /* ===================================================== */

  async function loadResorts() {
    setLoading(true);
    try {
      const res = await api.get("/owner/getResortsByOwnerId", {
        params: { ownerId }
      });
      setResorts(res.data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResorts();
  }, []);

  /* ===================================================== */
  /*                  ADD / UPDATE RESORT                 */
  /* ===================================================== */

  async function saveResort() {
    if (!resortForm.name || !resortForm.description || !resortForm.locationId) {
      alert("All fields are required");
      return;
    }

    const payload = {
      name: resortForm.name,
      description: resortForm.description,
      ecoScore: resortForm.ecoScore,
      location: { locationId: resortForm.locationId },
      owner: { ownerId }
    };

    if (selectedResort) {
      await api.put("/user/resort/updateResort", payload, {
        params: { resortId: selectedResort.resortId }
      });
    } else {
      await api.post("/user/resort/addResort", payload);
    }

    setOpenResortDialog(false);
    setSelectedResort(null);
    setResortForm({
      name: "",
      description: "",
      locationId: "",
      ecoScore: "GOOD"
    });
    loadResorts();
  }

  /* ===================================================== */
  /*              ACTIVATE / DEACTIVATE                   */
  /* ===================================================== */

  async function toggleResort(resort) {
    if (resort.isActive === "ACTIVE") {
      await api.put("/user/resort/deactivateResort", null, {
        params: { resortId: resort.resortId }
      });
    } else {
      await api.put("/user/resort/activateResort", null, {
        params: { resortId: resort.resortId }
      });
    }
    loadResorts();
  }

  /* ===================================================== */
  /*                   RESORT IMAGES                      */
  /* ===================================================== */

  async function addImage() {
    if (!imageUrl || !selectedResort) return;

    await api.post("/user/resort/addImage", {
      imageUrl,
      resort: { resortId: selectedResort.resortId }
    });

    setImageUrl("");
    setOpenImageDialog(false);
  }

  /* ===================================================== */
  /*                        UI                             */
  /* ===================================================== */

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress size={60} thickness={4} />
        <Typography mt={3} fontWeight={600}>
          Loading your luxury resorts…
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #e0f7fa 0%, #ffffff 50%, #f1f8e9 100%)"
      }}
    >
      <Stack direction="row" justifyContent="space-between" mb={4}>
        <Typography variant="h4" fontWeight={800}>
          🏨 My Resorts
        </Typography>

        <Button
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedResort(null);
            setOpenResortDialog(true);
          }}
          sx={{
            borderRadius: 3,
            px: 3,
            background: "linear-gradient(45deg,#43cea2,#185a9d)",
            color: "#fff",
            "&:hover": { transform: "scale(1.05)" }
          }}
        >
          Add Resort
        </Button>
      </Stack>

      {resorts.length === 0 && (
        <Typography color="text.secondary">
          You have not added any resorts yet.
        </Typography>
      )}

      <Grid container spacing={4}>
        {resorts.map(r => (
          <Grid item xs={12} md={4} key={r.resortId}>
            <Grow in>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 4,
                  transition: "0.3s",
                  background:
                    "linear-gradient(180deg,#ffffff,#f9fbe7)",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
                  }
                }}
              >
                <Typography fontWeight={700} variant="h6">
                  {r.name}
                </Typography>

                <Typography variant="body2" mb={2} color="text.secondary">
                  {r.description}
                </Typography>

                <Stack direction="row" spacing={1} mb={2}>
                <Chip
                label={`🌱 ${r.ecoScore}`}
                color="success"
                variant="outlined"
                sx={{
                    fontWeight: 600,
                    borderRadius: 2
                }}
                />

                  <Chip
                    label={r.isActive}
                    color={r.isActive === "ACTIVE" ? "success" : "default"}
                  />
                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Stack spacing={1}>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => {
                      setSelectedResort(r);
                      setResortForm({
                        name: r.name,
                        description: r.description,
                        locationId: r.location.locationId,
                        ecoScore: r.ecoScore
                      });
                      setOpenResortDialog(true);
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    size="small"
                    startIcon={
                      r.isActive === "ACTIVE" ? (
                        <ToggleOffIcon />
                      ) : (
                        <ToggleOnIcon />
                      )
                    }
                    onClick={() => toggleResort(r)}
                  >
                    {r.isActive === "ACTIVE"
                      ? "Deactivate"
                      : "Activate"}
                  </Button>

                  <Button
                    size="small"
                    startIcon={<ImageIcon />}
                    onClick={() => {
                      setSelectedResort(r);
                      setOpenImageDialog(true);
                    }}
                  >
                    Add Image
                  </Button>
                </Stack>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openResortDialog} onClose={() => setOpenResortDialog(false)}>
        <DialogTitle fontWeight={700}>
          {selectedResort ? "Update Resort" : "Add Resort"}
        </DialogTitle>

        <DialogContent>
          <TextField fullWidth label="Resort Name" margin="dense"
            value={resortForm.name}
            onChange={e => setResortForm({ ...resortForm, name: e.target.value })}
          />
          <TextField fullWidth label="Description" margin="dense"
            value={resortForm.description}
            onChange={e => setResortForm({ ...resortForm, description: e.target.value })}
          />
          <TextField fullWidth label="Location ID" margin="dense"
            value={resortForm.locationId}
            onChange={e => setResortForm({ ...resortForm, locationId: e.target.value })}
            helperText="Use existing Location ID (admin-created)"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={saveResort} variant="contained">
            {selectedResort ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)}>
        <DialogTitle>Add Resort Image</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Image URL" margin="dense"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={addImage} variant="contained">
            Add Image
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
