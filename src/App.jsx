import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import DashboardPage from "./pages/DashboardPage";
import BuyPage from "./pages/BuyPage";
import RentPage from "./pages/RentPage";
import AgentPage from "./pages/AgentPage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/buy" element={<BuyPage />} />
        <Route path="/rent" element={<RentPage />} />
        <Route path="/rent/:id" element={<PropertyDetailsPage />} />
        <Route path="/agents" element={<AgentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
