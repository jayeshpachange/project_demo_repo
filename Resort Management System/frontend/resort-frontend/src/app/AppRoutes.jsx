// import { Routes, Route, Navigate } from "react-router-dom";
// import PublicLayout from "../shared/layouts/PublicLayout";
// import Home from "../features/public/Home";

// export default function AppRoutes() {
//   return (
//     <Routes>
//       <Route element={<PublicLayout />}>
//         <Route path="/" element={<Navigate to="/home" />} />
//         <Route path="/home" element={<Home />} />
//       </Route>
//     </Routes>
//   );
// }







import { Routes, Route , Navigate } from "react-router-dom";

// /* PUBLIC */
import Home from "../features/public/Home";
import ResortList from "../features/public/ResortList";
import ResortDetails from "../features/public/ResortDetails";
import Login from "../features/public/Login";
import Register from "../features/public/Register";
import ProtectedRoute from "../shared/components/ProtectedRoute";


// /* USER */
import UserDashboard from "../features/user/Dashboard";
import Profile from "../features/user/Profile";
import Bookings from "../features/user/Bookings";
import Service from "../features/user/BookingServices";
import BookingServices from "../features/user/BookingServices";
import Payment from "../features/user/Payment";
import ChangePassword from "../features/user/ChangePassword";
import BookingHistory from "../features/user/BookingHistory";
import ExistingBooking from "../features/user/ExistingBooking";
import BookingRooms from "../features/user/BookingRooms";
import FoodOrder from "../features/user/FoodOrder";


// /* OWNER */
import OwnerDashboard from "../features/owner/OwnerDashboard";
 import OwnerBookings from "../features/owner/OwnerBookings";


// /* ADMIN */
import AdminDashboard from "../features/admin/AdminDashboard";
import Users from "../features/admin/Users";
import AdminResorts from "../features/admin/AdminResorts";
import AdminBookings from "../features/admin/AdminBookings";
import AdminPayments from "../features/admin/AdminPayments";
import Rooms from "../features/admin/Rooms";
import Foods from "../features/admin/Foods";
import MasterDataPage from "../features/admin/MasterDataPage";
import About from "../features/public/About";
import Contact from "../features/public/Contact";
import OwnerRooms from "../features/owner/OwnerRooms";
import OwnerServices from "../features/owner/OwnerServices";
import Revenue from "../features/owner/Revenue";
import OwnerResorts from "../features/owner/OwnerResorts";
import OwnerProfile from "../features/owner/OwnerProfile";


function AppRoutes() {
  return (
    <Routes>

      {/* PUBLIC*/}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/resorts" element={<ResortList />} />
      <Route path="/resort/:id" element={<ResortDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />  
      <Route path="/about" element={<About />} />  
      <Route path="/contact" element={<Contact />} />  
     
      
      {/* USER */}
      <Route path="/user/dashboard" element={<ProtectedRoute allowedRoles={["USER"]}><UserDashboard /></ProtectedRoute>}/>

     <Route path="/user/dashboard" element={<UserDashboard />} />
      <Route path="/user/profile" element={<Profile />} />
      <Route path="/user/bookings" element={<Bookings />} />
      <Route path="/user/booking/:bookingId/services" element={<BookingServices />} />
      <Route path="/user/payments" element={<Payment />} />
      <Route path="/user/change-password" element={<ChangePassword />} />
      <Route path="/user/bookingsHistory" element={<BookingHistory />} />
      <Route path="/user/existing-bookings" element={<ExistingBooking />} />
      <Route path="/user/booking/:bookingId" element={<BookingRooms />} />
      <Route path="/user/foodOrder" element={<FoodOrder />} />

      {/* <Route path="/user/reviews" element={<Reviews />} />
      <Route path="/user/recommendations" element={<Recommendations />} /> */}

      {/* OWNER */}
      <Route path="/owner/dashboard" element={<OwnerDashboard />} />
      <Route path="/owner/resorts" element={<OwnerResorts />} /> 
      <Route path="/owner/rooms" element={<OwnerRooms />} /> 
      <Route path="/owner/bookings" element={<OwnerBookings />} />
      <Route path="/owner/services" element={<OwnerServices />} />
      <Route path="/owner/revenue" element={<Revenue />} />
      <Route path="/owner/profile" element={<OwnerProfile />} />
      {/* <Route path="/owner/myNewbooking" element={<Bookings />} /> */}
      {/*<Route path="/owner/reports" element={<Reports />} /> */}

      {/* ADMIN */}
      <Route path="/admin/dashboard" element={ <ProtectedRoute allowedRoles={["ADMIN"]}> <AdminDashboard /> </ProtectedRoute> }/>


     <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/master" element={<MasterDataPage />} /> 
      <Route path="/admin/users" element={<Users />} />
      <Route path="/admin/resorts" element={<AdminResorts />} />
      <Route path="/admin/bookings" element={<AdminBookings />} />
      <Route path="/admin/payments" element={<AdminPayments />} />
      <Route path="/admin/room" element={<Rooms />} />
      <Route path="/admin/food" element={<Foods />} />
      {/*<Route path="/admin/pricing" element={<Pricing />} />
      <Route path="/admin/audit-logs" element={<AuditLogs />} /> */}

      {/* SUPER ADMIN */}
      {/* <Route path="/super-admin/admins" element={<Admins />} />
      <Route path="/super-admin/roles" element={<Roles />} />
      <Route path="/super-admin/system" element={<System />} /> */}

    </Routes>
  );
}

export default AppRoutes;
