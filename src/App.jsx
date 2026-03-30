import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Dashboard from "./components/dashboard";
import MentionsLegales from "./components/MentionsLegales";
import CookieBanner from "./components/CookieBanner";
import AppFooter from "./components/AppFooter";

function App() {

  return (

    <Router>

      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />



        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>

    </Router>

  );

}



export default App;