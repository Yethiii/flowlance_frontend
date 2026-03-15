import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

import CompanyProfileForm from "./CompanyProfileForm"; 
import CompanyJobOffers from "./CompanyJobOffers";

export default function DashboardCompany() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [activeTab, setActiveTab] = useState("Mes Annonces"); 

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login"); 
  };

  const stats = [
    { label: "Annonces actives", value: "2", color: "#CE6A6B" },
    { label: "Profils suggérés", value: "15", color: "#4A919E" },
    { label: "Candidatures", value: "4", color: "#212E53" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-teal/5">
      {/* HEADER MOBILE */}
      <div className="md:hidden bg-navy p-4 flex justify-between items-center shadow-lg">
        <img src="/logo.png" alt="Logo" className="h-10" />
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-coral text-3xl">
          {isMenuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* SIDEBAR (MENU DE GAUCHE) */}
      <aside className={`${isMenuOpen ? "block" : "hidden"} md:flex w-full md:w-64 bg-navy text-white flex-col p-6 shadow-xl transition-all`}>
        <div className="mb-10 hidden md:flex flex-col items-center">
          <img src="/logo.png" alt="Logo" className="h-16 mb-4" />
          <h2 className="text-xl font-black italic text-coral">FLOWLANCE</h2>
          <span className="text-xs text-sage mt-1">Espace Recrutement</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {["Tableau de bord", "Mes Annonces", "Recherche IA", "Candidatures", "Profil Entreprise"].map((item) => (
            <button 
              key={item} 
              onClick={() => { setActiveTab(item); setIsMenuOpen(false); }}
              className={`w-full text-left p-4 rounded-xl transition-colors font-bold ${
                activeTab === item ? "bg-white/10 text-coral" : "text-sage hover:bg-white/5"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/10 pt-4">
          <button 
            onClick={handleLogout} 
            className="text-coral font-bold p-4 hover:underline w-full text-left"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ZONE PRINCIPALE (DYNAMIQUE) */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        
        {/* LE SYSTÈME D'ONGLETS */}
        {activeTab === "Profil Entreprise" ? (
          <CompanyProfileForm />
        ) : activeTab === "Mes Annonces" ? (
          <CompanyJobOffers />
        ) : activeTab === "Tableau de bord" ? (
          <>
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-navy uppercase tracking-tight">Vos Recrutements</h1>
                <p className="text-teal font-medium">Vue d'ensemble de votre activité.</p>
              </div>
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
              <h3 className="text-xl font-bold text-coral italic mb-6">Talents recommandés par Flowlance AI</h3>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h4 className="text-sage font-bold text-lg">Laetitia • Admin Sys Junior</h4>
                  <p className="text-white/40 text-xs">Match à 98% pour votre annonce "Admin Sys"</p>
                </div>
                <button className="bg-white text-navy font-black px-6 py-3 rounded-xl hover:bg-sage transition-colors text-sm">
                  VOIR LE PROFIL
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-full">
            <h3 className="text-xl text-gray-400">L'onglet "{activeTab}" est en cours de construction...</h3>
          </div>
        )}
      </main>
    </div>
  );
}