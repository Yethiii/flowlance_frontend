import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // On vérifie si l'utilisateur a déjà fermé le bandeau
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
    // Bannière gris très foncé pour le contraste
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4 shadow-xl z-50 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-700">
      <div className="text-sm text-center sm:text-left text-gray-100">
        <p>
          <strong>Votre vie privée compte.</strong> Flowlance utilise uniquement des cookies techniques (stockage local) nécessaires à votre connexion. Nous ne vous traçons pas.
        </p>
      </div>
      <div className="flex gap-4 whitespace-nowrap items-center">
        {/* Lien : Teal clair pour ressortir sur le gris foncé */}
        <Link to="/legal" className="text-sm text-teal-300 underline hover:text-teal-200 flex items-center">
          En savoir plus
        </Link>
        
        {/* BOUTON CORRIGÉ : Fond Teal foncé pour ton thème, texte Blanc pour le contraste */}
        <button 
          onClick={handleDismiss}
          className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 px-4 rounded shadow transition-colors"
        >
          J'ai compris
        </button>
      </div>
    </div>
  );
}