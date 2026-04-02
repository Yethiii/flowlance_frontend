import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardFreelance from "./dashboardFreelance";
import DashboardCompany from "./dashboardCompany";
import { getCurrentUser } from "../services/api"; 

export default function Dashboard() {
  // Etat local du dashboard
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Chargement du role utilisateur
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userData = await getCurrentUser();
        
        if (!userData.is_profile_active) {
          if (userData.role === 'FREELANCE') {
            navigate("/freelance-profile");
          } else {
            navigate("/company-profile");
          }
          return; 
        }

        setRole(userData.role); 
      } catch (error) {
        console.error("Erreur d'authentification:", error);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [navigate]);

  // Etat de chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-navy">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-coral border-solid mx-auto mb-4"></div>
          <p className="text-sage font-bold uppercase tracking-widest">Identification en cours...</p>
        </div>
      </div>
    );
  }

  // Rendu selon le role
  if (role === "FREELANCE") {
    return <DashboardFreelance />;
  } else if (role === "COMPANY") {
    return <DashboardCompany />;
  } else {
    return <div className="p-10 text-center text-xl text-coral font-bold">Rôle non défini dans la base de données.</div>;
  }
}

