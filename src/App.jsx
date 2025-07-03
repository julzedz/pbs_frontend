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
import { useAppStore } from "./store";
import React from "react";

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
    <Router>
      <Navbar />
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
        {/* If you have a PostPropertyPage, protect it here too: */}
        {/* <Route path="/post-property" element={
          <ProtectedRoute>
            <PostPropertyPage />
          </ProtectedRoute>
        } /> */}
      </Routes>
    </Router>
  );
}

export default App;
