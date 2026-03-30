import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiCheckCircle } from "react-icons/hi";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const bannerDismissed = localStorage.getItem("flowlance_banner_dismissed");
    if (!bannerDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("flowlance_banner_dismissed", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    // Bandeau fixe reprenant le style de ta barre de sauvegarde (ombre portée vers le haut)
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] p-4 z-50 flex flex-col md:flex-row items-center justify-between gap-4">
      
      <div className="text-sm text-center md:text-left text-navy">
        <p>
          <strong className="font-black text-coral uppercase tracking-wide">Votre vie privée compte.</strong><br/>
          Flowlance utilise uniquement des cookies techniques strictement nécessaires à votre connexion.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 whitespace-nowrap w-full md:w-auto">
        <Link 
          to="/legal" 
          className="text-sm font-bold text-gray-500 hover:text-navy underline transition-colors"
        >
          Mentions Légales
        </Link>
        
        {/* BOUTON : Exactement le même style "Coral" que tes boutons de validation */}
        <button 
          onClick={handleDismiss}
          className="w-full sm:w-auto px-6 py-2.5 text-white font-black rounded-xl hover:scale-105 transition-transform shadow-md flex items-center justify-center gap-2"
          style={{ backgroundColor: '#CE6A6B' }}
        >
          <HiCheckCircle className="text-lg" />
          J'AI COMPRIS
        </button>
      </div>
      
    </div>
  );
}