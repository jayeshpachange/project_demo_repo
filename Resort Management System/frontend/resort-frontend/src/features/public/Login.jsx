import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  Stack,
  Alert,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { motion } from "framer-motion";

const API_BASE = "http://localhost:8080";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("USER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

  try {
    const endpoint =
      role === "ADMIN"
        ? "/admin/login"
        : role === "OWNER"
        ? "/owner/login"
        : "/user/login"; 

    const res = await axios.post(`${API_BASE}${endpoint}`, null, {
      params: { email, password }
    });

    const token = res.data?.token;
    if (!token) throw new Error("Invalid login response");

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    if (role === "USER") {
      localStorage.setItem("userId", res.data.userId);
    }

    if (role === "OWNER") {
      localStorage.setItem("ownerId", res.data.ownerId);
    }

    if (role === "ADMIN") {
      localStorage.setItem("adminId", res.data.adminId);
    }


    navigate(
      role === "ADMIN"
        ? "/admin/dashboard"
        : role === "OWNER"
        ? "/owner/dashboard"
        : "/user/dashboard", 
      { replace: true }
    );
  } catch (err) {
    console.error(err);
    setError(err.response?.data || "Invalid credentials. Please try again.");
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
          bgcolor: "rgba(15, 23, 42, 0.6)", // gradient overlay
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
              <LockOutlinedIcon
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
                💻 Sign in to ResortHub
              </Typography>
              <Typography color="text.secondary" mt={1}>
                🔐 Secure access with trusted authentication
              </Typography>
            </Box>

        {/*  ===== ROLE SWITCH ===== */}
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
            <ToggleButton value="OWNER">Owner</ToggleButton> 
          </ToggleButtonGroup>
        </Box>


            {/* ===== ERROR ===== */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* ===== FORM ===== */}
            <form onSubmit={handleLogin}>
              <Stack spacing={3}>
                <TextField
                  label="Email address"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
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
                  {loading ? "Signing in..." : "Sign In"}
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
              Don’t have an account?{" "}
              <Button
                variant="text"
                onClick={() => navigate("/register")}
                sx={{ textTransform: "none", color: "primary.main" }}
              >
                Register
              </Button>
            </Typography>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}
