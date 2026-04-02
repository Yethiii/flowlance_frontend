import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Dashboard from "./components/dashboard";
import MentionsLegales from "./components/MentionsLegales";
import CookieBanner from "./components/CookieBanner";
import AppFooter from "./components/AppFooter";
import FreelanceProfileForm from "./components/FreelanceProfileForm";
import CompanyProfileForm from "./components/CompanyProfileForm";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} /> 
            
            <Route path="/legal" element={<MentionsLegales />} />

            <Route path="/freelance-profile" element={<FreelanceProfileForm />} />
            <Route path="/company-profile" element={<CompanyProfileForm />} />

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>

        <AppFooter />

        <CookieBanner />

      </div>
    </Router>
  );
}

export default App;