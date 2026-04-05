import { useEffect, useState } from "react";
import api from "../../api/axios";

import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Stack,
  Avatar,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  Fade,
  Slide
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import LockIcon from "@mui/icons-material/Lock";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

/* ===================================================== */
/*                      OWNER PROFILE                   */
/* ===================================================== */

export default function Profile() {
  const ownerId = Number(localStorage.getItem("ownerId"));

  const [owner, setOwner] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [openPwdDialog, setOpenPwdDialog] = useState(false);
  const [pwdForm, setPwdForm] = useState({ oldPassword: "", newPassword: "" });
  const [showPwd, setShowPwd] = useState(false);

  const [openStatusDialog, setOpenStatusDialog] = useState(false);

  const [form, setForm] = useState({ fullName: "", email: "", phone: "" });

  /* ===================================================== */
  /*                  LOAD OWNER PROFILE                  */
  /* ===================================================== */

  function loadProfile() {
    setLoading(true);
    api
      .get("/owner/Ownerme")
      .then(res => {
        setOwner(res.data);
        setForm({
          fullName: res.data.fullName,
          email: res.data.email,
          phone: res.data.phone
        });
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadProfile();
  }, []);

  /* ===================================================== */
  /*                  UPDATE PROFILE                      */
  /* ===================================================== */

  async function updateProfile() {
    setLoading(true);
    try {
      const res = await api.put(
        "/owner/updateOwner",
        { fullName: form.fullName, phone: form.phone },
        { params: { ownerId } }
      );
      setOwner(res.data);
      setEditMode(false);
    } finally {
      setLoading(false);
    }
  }

  /* ===================================================== */
  /*               CHANGE PASSWORD LOGIC                  */
  /* ===================================================== */

  async function changePassword() {
    if (!pwdForm.oldPassword || !pwdForm.newPassword) {
      alert("Both fields are required");
      return;
    }
    try {
      const res = await api.put(
        `/owner/changePassword/${ownerId}`,
        null,
        { params: { oldPassword: pwdForm.oldPassword, newPassword: pwdForm.newPassword } }
      );
      alert(res.data.message);
      setPwdForm({ oldPassword: "", newPassword: "" });
      setOpenPwdDialog(false);
    } catch {
      alert("Password change failed");
    }
  }

  /* ===================================================== */
  /*               CHANGE STATUS LOGIC                    */
  /* ===================================================== */

  async function toggleStatus() {
    try {
      if (owner.status === "ACTIVE") {
        await api.put("/owner/deactivateOwner", null, { params: { ownerId } });
        alert("Account deactivated");
        localStorage.clear();
        window.location.href = "/login";
      } else {
        await api.put("/owner/activateOwner", null, { params: { ownerId } });
        alert("Account activated");
        loadProfile();
      }
    } finally {
      setOpenStatusDialog(false);
    }
  }

  /* ===================================================== */
  /*                        UI                             */
  /* ===================================================== */

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress size={60} thickness={4} />
        <Typography mt={3} fontWeight={600}>
          Loading profile...
        </Typography>
      </Box>
    );
  }

  if (!owner) {
    return (
      <Typography textAlign="center" mt={5}>
        Unable to load profile
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f7fa, #f9fbe7)"
      }}
    >
      <Slide direction="down" in>
        <Card
          sx={{
            width: 460,
            p: 5,
            textAlign: "center",
            borderRadius: 5,
            boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
            transition: "0.3s",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
            }
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              mx: "auto",
              mb: 3,
              bgcolor: "primary.main",
              transition: "0.3s",
              "&:hover": { transform: "scale(1.1)" }
            }}
          >
            <PersonIcon fontSize="large" />
          </Avatar>

          {!editMode ? (
            <Fade in>
              <Box>
                <Typography variant="h5" fontWeight={700} mb={0.5}>
                  {owner.fullName}
                </Typography>
                <Typography color="text.secondary" mb={0.5}>
                  {owner.email}
                </Typography>
                <Typography color="text.secondary" mb={2}>
                  📞 {owner.phone}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography>
                  Status: <b>{owner.status}</b>
                </Typography>
                <Typography>
                  Role: <b>{owner.role}</b>
                </Typography>

                <Stack spacing={2} mt={3}>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => setEditMode(true)}
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      background: "linear-gradient(45deg,#43cea2,#185a9d)",
                      color: "#fff",
                      transition: "0.3s",
                      "&:hover": { transform: "scale(1.05)" }
                    }}
                  >
                    Edit Profile
                  </Button>

                  <Button
                    startIcon={<LockIcon />}
                    color="warning"
                    onClick={() => setOpenPwdDialog(true)}
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      transition: "0.3s",
                      "&:hover": { transform: "scale(1.05)" }
                    }}
                  >
                    Change Password
                  </Button>

                  <Button
                    startIcon={<PowerSettingsNewIcon />}
                    color={owner.status === "ACTIVE" ? "error" : "success"}
                    onClick={() => setOpenStatusDialog(true)}
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      transition: "0.3s",
                      "&:hover": { transform: "scale(1.05)" }
                    }}
                  >
                    {owner.status === "ACTIVE" ? "Deactivate Account" : "Activate Account"}
                  </Button>
                </Stack>
              </Box>
            </Fade>
          ) : (
            <Fade in>
              <Box>
                <TextField
                  fullWidth
                  label="Full Name"
                  margin="dense"
                  value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
                />

                <TextField
                  fullWidth
                  label="Email"
                  margin="dense"
                  value={form.email}
                  disabled
                />

                <TextField
                  fullWidth
                  label="Phone"
                  margin="dense"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />

                <Stack direction="row" spacing={2} mt={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={updateProfile}
                    sx={{
                      borderRadius: 3,
                      background: "linear-gradient(45deg,#f7971e,#ffd200)",
                      "&:hover": { transform: "scale(1.03)" }
                    }}
                  >
                    Save
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setEditMode(false)}
                    sx={{ borderRadius: 3, "&:hover": { backgroundColor: "#f0f0f0" } }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Box>
            </Fade>
          )}
        </Card>
      </Slide>

      {/* ================= CHANGE PASSWORD DIALOG ================= */}
      <Dialog
        open={openPwdDialog}
        onClose={() => setOpenPwdDialog(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
      >
        <DialogTitle fontWeight={700}>Change Password</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Old Password"
            type={showPwd ? "text" : "password"}
            value={pwdForm.oldPassword}
            onChange={e => setPwdForm({ ...pwdForm, oldPassword: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPwd(!showPwd)}>
                    {showPwd ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            margin="dense"
            label="New Password"
            type={showPwd ? "text" : "password"}
            value={pwdForm.newPassword}
            onChange={e => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenPwdDialog(false)} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={changePassword}
            sx={{
              borderRadius: 2,
              background: "linear-gradient(45deg,#f7971e,#ffd200)",
              "&:hover": { transform: "scale(1.03)" }
            }}
          >
            Change
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= CHANGE STATUS DIALOG ================= */}
      <Dialog
        open={openStatusDialog}
        onClose={() => setOpenStatusDialog(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
      >
        <DialogTitle fontWeight={700}>
          {owner.status === "ACTIVE" ? "Deactivate Account?" : "Activate Account?"}
        </DialogTitle>

        <DialogContent>
          <Typography>
            {owner.status === "ACTIVE"
              ? "You will be logged out and your account will be deactivated."
              : "Your account will be activated again."}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenStatusDialog(false)} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            color={owner.status === "ACTIVE" ? "error" : "success"}
            variant="contained"
            onClick={toggleStatus}
            sx={{ borderRadius: 2, "&:hover": { transform: "scale(1.03)" } }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
