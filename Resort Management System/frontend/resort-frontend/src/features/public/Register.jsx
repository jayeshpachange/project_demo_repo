import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Box,
  Container,
  Card,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";

import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { motion } from "framer-motion";

const API_BASE = "http://localhost:8080";

export default function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      let endpoint = "";
      let payload = {};

      if (role === "USER") {
        endpoint = "/user/register";
        payload = {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: "USER"
        };
      } else if (role === "ADMIN") {
        endpoint = "/admin/register";
        payload = {
          name: form.name,
          email: form.email,
          password: form.password,
          role: "ADMIN"
        };
      } else if (role === "OWNER") { // Added OWNER logic
        endpoint = "/owner/registerOwner";
        payload = {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: "OWNER"
        };
      }

      await axios.post(`${API_BASE}${endpoint}`, payload);

      setSuccess(
        role === "USER"
          ? "Account created successfully. Redirecting to login..."
          : role === "ADMIN"
          ? "Admin account created successfully."
          : "Owner account created successfully." // Added OWNER success message
      );

      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      console.error(err);
      setError(err.response?.data || "Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(15,23,42,0.65)",
          zIndex: 1
        },
        zIndex: 0
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card
            sx={{
              p: 5,
              borderRadius: 4,
              boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
              bgcolor: "rgba(255,255,255,0.9)"
            }}
          >

            {/* ===== HEADER ===== */}
            <Box textAlign="center" mb={4}>
              <PersonAddAltIcon
                sx={{
                  fontSize: 50,
                  color: "primary.main",
                  bgcolor: "rgba(0,123,255,0.15)",
                  borderRadius: "50%",
                  p: 2,
                  boxShadow: "0 4px 15px rgba(0,123,255,0.2)"
                }}
              />
              <Typography variant="h5" fontWeight={700} mt={2}>
               💼 Create your account
              </Typography>
              <Typography color="text.secondary" mt={1}>
               📝 👨🏻‍💼 Register securely on ResortHub
              </Typography>
            </Box>

            {/* ===== ROLE SWITCH ===== */}
            <Box display="flex" justifyContent="center" mb={4}>
              <ToggleButtonGroup
                value={role}
                exclusive
                onChange={(e, value) => value && setRole(value)}
                size="medium"
                sx={{
                  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                  borderRadius: 3,
                  ".Mui-selected": {
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": { bgcolor: "primary.dark" }
                  }
                }}
              >
                <ToggleButton value="USER">Customer</ToggleButton>
                <ToggleButton value="ADMIN">Admin</ToggleButton>
                <ToggleButton value="OWNER">Owner</ToggleButton> {/* Added OWNER */}
              </ToggleButtonGroup>
            </Box>


            {/* ===== ALERTS ===== */}
            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

            {/* ===== FORM ===== */}
            <form onSubmit={handleRegister}>
              <Stack spacing={3}>
{role === "USER" || role === "OWNER" ? (
  <>
    <TextField
      label="Full Name"
      name="fullName"
      required
      value={form.fullName}
      onChange={handleChange}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 3,
          "&.Mui-focused fieldset": {
            borderColor: "primary.main",
            boxShadow: "0 0 10px rgba(0,123,255,0.3)"
          }
        }
      }}
    />

    <TextField
      label="Phone Number"
      name="phone"
      required
      value={form.phone}
      onChange={handleChange}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 3,
          "&.Mui-focused fieldset": {
            borderColor: "primary.main",
            boxShadow: "0 0 10px rgba(0,123,255,0.3)"
          }
        }
      }}
    />
  </>
) : (
  <TextField
    label="Admin Name"
    name="name"
    required
    value={form.name}
    onChange={handleChange}
    sx={{
      "& .MuiOutlinedInput-root": {
        borderRadius: 3,
        "&.Mui-focused fieldset": {
          borderColor: "primary.main",
          boxShadow: "0 0 10px rgba(0,123,255,0.3)"
        }
      }
    }}
  />
)}


                <TextField
                  label="Email Address"
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                        boxShadow: "0 0 10px rgba(0,123,255,0.3)"
                      }
                    }
                  }}
                />

                <TextField
                  label="Password"
                  type="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                        boxShadow: "0 0 10px rgba(0,123,255,0.3)"
                      }
                    }
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: 16,
                    background: "linear-gradient(135deg,#06b6d4,#3b82f6)",
                    "&:hover": {
                      transform: "scale(1.03)",
                      background: "linear-gradient(135deg,#3b82f6,#06b6d4)"
                    },
                    transition: "0.3s"
                  }}
                >
                  {loading ? "Creating Account..." : "Register"}
                </Button>
              </Stack>
            </form>

            {/* ===== FOOTER ===== */}
            <Typography
              textAlign="center"
              mt={4}
              color="text.secondary"
              fontSize={14}
            >
              Already have an account?{" "}
              <Button
                variant="text"
                onClick={() => navigate("/login")}
                sx={{ textTransform: "none", color: "primary.main" }}
              >
                Login
              </Button>
            </Typography>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}
