import { Outlet, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

export default function PublicLayout() {
  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }} variant="h6">
            Resort Booking
          </Typography>

          <Button color="inherit" component={Link} to="/home">
            Resorts
          </Button>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: 2 }}>
        <Outlet />
      </Box>
    </>
  );
}
