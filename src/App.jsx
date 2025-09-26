import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import DashboardPage from "./pages/DashboardPage";
import BuyPage from "./pages/BuyPage";
import RentPage from "./pages/RentPage";
import AgentPage from "./pages/AgentPage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import MyListingsPage from "./pages/MyListingsPage";
import EditProfilePage from "./pages/EditProfilePage";
import { useAppStore } from "./store";
import React from "react";
import { Toaster } from "./components/ui/toaster";
import PostPropertyPage from "./pages/PostPropertyPage";
import Footer from "./components/Footer";
import { Flex, Box } from "@chakra-ui/react";
import FeaturedPropertyPage from "./pages/FeaturedPropertyPage";
import AboutUsPage from "./pages/AboutUsPage";
import ContactUs from "./pages/ContactUs";

// ProtectedRoute component
function ProtectedRoute({ children }) {
  const user = useAppStore((state) => state.user);
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

function App() {
  return (
    <Flex direction="column" minH="100vh">
      <Router>
        <Navbar />
        <Toaster />
        <Box
          flex="1 0 auto"
          // mb={{ base: 10, md: 36 }}
          display="flex"
          flexDirection="column"
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/buy" element={<BuyPage />} />
            <Route path="/rent" element={<RentPage />} />
            <Route path="/featured" element={<FeaturedPropertyPage />} />
            <Route path="/rent/:id" element={<PropertyDetailsPage />} />
            <Route path="/agents" element={<AgentPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-listings"
              element={
                <ProtectedRoute>
                  <MyListingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post-property"
              element={
                <ProtectedRoute>
                  <PostPropertyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute>
                  <EditProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
        <Footer />
      </Router>
    </Flex>
  );
}

export default App;
