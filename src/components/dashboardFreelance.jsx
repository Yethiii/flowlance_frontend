import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { Spinner } from "flowbite-react";

import FreelanceProfileForm from "./FreelanceProfileForm"; 
import FreelanceJobBoard from "./FreelanceJobBoard"; 
import FreelanceCVCoach from "./FreelanceCVCoach";
import { getFreelanceDashboardData } from "../services/api"; // L'import de la requête

export default function DashboardFreelance() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState("Tableau de bord");

  // --- NOUVEAUX ÉTATS POUR L'IA ---
  const [aiMatches, setAiMatches] = useState([]);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);

  // --- CHARGEMENT DU MATCHING IA ---
  useEffect(() => {
    // On ne déclenche la requête IA que si l'onglet actif est le Tableau de bord
    if (activeView === "Tableau de bord") {
      const fetchMatches = async () => {
        setIsDashboardLoading(true);
        try {
          const data = await getFreelanceDashboardData();
          // Le backend renvoie {"dashboard": [ {job_id: 1, score: 85, explication: "..."} ]}
          if (data.dashboard && Array.isArray(data.dashboard)) {
            setAiMatches(data.dashboard);
          }
        } catch (error) {
          console.error("Erreur Dashboard IA", error);
        } finally {
          setIsDashboardLoading(false);
        }
      };
      
      fetchMatches();
    }
  }, [activeView]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = ["Tableau de bord", "Trouver une mission", "Mon CV (IA)", "Messages", "Mon Profil"];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-teal/5">
      {/* HEADER MOBILE */}
      <div className="md:hidden bg-navy p-4 flex justify-between items-center shadow-lg">
        <img src="/logo.png" alt="Logo" className="h-10" />
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-coral text-3xl">
          {isMenuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* SIDEBAR FREELANCE */}
      <aside className={`${isMenuOpen ? "block" : "hidden"} md:flex w-full md:w-64 bg-navy text-white flex-col p-6 shadow-xl transition-all`}>
        <div className="mb-10 hidden md:flex flex-col items-center">
          <img src="/logo.png" alt="Logo" className="h-16 mb-4" />
          <h2 className="text-xl font-black italic text-coral">FLOWLANCE</h2>
          <span className="text-xs text-sage mt-1">Espace Expert</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button 
              key={item} 
              onClick={() => { setActiveView(item); setIsMenuOpen(false); }}
              className={`w-full text-left p-4 rounded-xl transition-colors font-bold ${
                activeView === item 
                  ? "bg-white/10 text-coral" 
                  : "text-sage hover:bg-white/5"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-white/10 pt-4">
          <button onClick={handleLogout} className="text-coral font-bold p-4 hover:underline w-full text-left">
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ZONE PRINCIPALE DYNAMIQUE */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        
        {activeView === "Mon Profil" && <FreelanceProfileForm />}
        {activeView === "Trouver une mission" && <FreelanceJobBoard />}
        {activeView === "Mon CV (IA)" && <FreelanceCVCoach />}

        {/* --- LE NOUVEAU TABLEAU DE BORD CONNECTÉ À L'IA --- */}
        {activeView === "Tableau de bord" && (
          <>
            <header className="mb-10">
              <h1 className="text-2xl md:text-4xl font-black text-navy uppercase tracking-tight">Vos Recommandations</h1>
              <p className="text-teal font-medium mt-2">Notre IA a analysé les annonces actives pour vous proposer les missions les plus compatibles.</p>
            </header>

            {isDashboardLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Spinner size="xl" className="mb-4 text-coral" />
                <p className="text-navy font-bold">L'Intelligence Artificielle analyse votre profil...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {aiMatches.length > 0 ? (
                  aiMatches.map((match, index) => (
                    <div key={index} className="bg-navy rounded-3xl p-6 shadow-2xl relative overflow-hidden border-l-8 border-coral">
                      {/* Badge Score IA */}
                      <div className="absolute top-0 right-0 bg-coral text-white font-black px-6 py-2 rounded-bl-3xl shadow-lg flex items-center">
                        <span className="text-sm mr-2 text-white/80">Match :</span> {match.score}%
                      </div>
                      
                      <h3 className="text-xl font-bold text-coral italic mb-4">Opportunité recommandée</h3>
                      
                      <div className="bg-white/5 p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="flex-1">
                          <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                            {match.explication}
                          </p>
                        </div>
                        <button 
                          onClick={() => setActiveView("Trouver une mission")}
                          className="bg-coral text-white font-black px-6 py-3 rounded-xl hover:scale-105 transition-transform text-sm whitespace-nowrap shadow-md"
                        >
                          ALLER POSTULER
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-10 rounded-3xl text-center shadow-sm border border-gray-100">
                    <p className="text-gray-500 font-medium text-lg">Aucune recommandation pour le moment.</p>
                    <p className="text-gray-400 text-sm mt-2">Vérifiez que votre profil est complet (compétences, secteurs) et attendez de nouvelles annonces ciblées !</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* CONDITION 5 : Pour les menus pas encore codés */}
        {activeView !== "Mon Profil" && activeView !== "Trouver une mission" && activeView !== "Tableau de bord" && activeView !== "Mon CV (IA)" && (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-2xl text-teal font-bold opacity-50 italic">
              Le module "{activeView}" est en cours de développement...
            </h2>
          </div>
        )}

      </main>
    </div>
  );
}