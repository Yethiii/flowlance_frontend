import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Dashboard from "./components/dashboard"; // <-- On importe le nouveau fichier

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* <-- On ajoute la route */}

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;