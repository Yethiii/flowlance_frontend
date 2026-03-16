import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import FreelanceProfileForm from "./FreelanceProfileForm"; 
import FreelanceJobBoard from "./FreelanceJobBoard"; // <-- 1. L'IMPORT EST ICI

export default function DashboardFreelance() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // NOUVEAU : On met "Trouver une mission" par défaut pour que tu puisses le tester direct
  const [activeView, setActiveView] = useState("Trouver une mission");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const stats = [
    { label: "Nouveaux Matchs", value: "8", color: "#CE6A6B" },
    { label: "Offres sauvées", value: "3", color: "#4A919E" },
    { label: "Vues du profil", value: "24", color: "#212E53" },
  ];

  // 2. NOUVEAU MENU : J'ai renommé l'accueil en "Tableau de bord" et ajouté "Trouver une mission"
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

        {/* BOUTON DÉCONNEXION */}
        <div className="mt-auto border-t border-white/10 pt-4">
          <button 
            onClick={handleLogout} 
            className="text-coral font-bold p-4 hover:underline w-full text-left"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ZONE PRINCIPALE DYNAMIQUE */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        
        {/* CONDITION 1 : Le composant Profil */}
        {activeView === "Mon Profil" && (
          <FreelanceProfileForm />
        )}

        {/* CONDITION 2 : Le tout nouveau composant de recherche de missions ! */}
        {activeView === "Trouver une mission" && (
          <FreelanceJobBoard />
        )}

        {/* CONDITION 3 : L'accueil avec les stats (anciennement "Mes Opportunités") */}
        {activeView === "Tableau de bord" && (
          <>
            <header className="mb-8">
              <h1 className="text-2xl md:text-4xl font-black text-navy uppercase tracking-tight">Vos Opportunités</h1>
              <p className="text-teal font-medium">L'IA de Flowlance a trouvé de nouveaux matchs pour vous.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border-l-8" style={{ borderColor: stat.color }}>
                  <p className="text-teal font-semibold uppercase text-[10px] tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-navy">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-navy rounded-3xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-coral italic mb-6">Meilleur Match IA</h3>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h4 className="text-sage font-bold text-lg">Développeur Fullstack React/Django</h4>
                  <p className="text-white/40 text-xs">Entreprise : TechCorp • Match à 95%</p>
                </div>
                <button className="bg-coral text-navy font-black px-6 py-3 rounded-xl hover:scale-105 transition-transform text-sm">
                  POSTULER
                </button>
              </div>
            </div>
          </>
        )}

        {/* CONDITION 4 : Pour les menus pas encore codés */}
        {activeView !== "Mon Profil" && activeView !== "Trouver une mission" && activeView !== "Tableau de bord" && (
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