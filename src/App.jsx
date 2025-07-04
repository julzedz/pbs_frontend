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
import { useAppStore } from "./store";
import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { Toaster } from "./components/ui/toaster";

// ProtectedRoute component
function ProtectedRoute({ children }) {
  const user = useAppStore((state) => state.user);
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

function PostPropertyPage() {
  return (
    <Box maxW="2xl" mx="auto" py={10} px={4}>
      <Text fontSize="2xl" fontWeight="bold">
        Post a Property (Coming Soon)
      </Text>
    </Box>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/buy" element={<BuyPage />} />
        <Route path="/rent" element={<RentPage />} />
        <Route path="/rent/:id" element={<PropertyDetailsPage />} />
        <Route path="/agents" element={<AgentPage />} />
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
      </Routes>
    </Router>
  );
}

export default App;
