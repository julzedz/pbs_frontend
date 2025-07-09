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
import { Toaster } from "./components/ui/toaster";
import PostPropertyPage from "./pages/PostPropertyPage";
import Footer from "./components/Footer";
import { Flex, Box } from "@chakra-ui/react";

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
        <Box flex="1 0 auto" display="flex" flexDirection="column">
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
        </Box>
        <Footer />
      </Router>
    </Flex>
  );
}

export default App;
