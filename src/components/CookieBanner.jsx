import { useState, useEffect } from "react";
import { Button } from "flowbite-react";
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
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4 shadow-lg z-50 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-center sm:text-left">
        <p>
          <strong>Votre vie privée compte.</strong> Flowlance utilise uniquement des cookies techniques (stockage local) nécessaires à votre connexion. Nous ne vous traçons pas.
        </p>
      </div>
      <div className="flex gap-3 whitespace-nowrap">
        <Link to="/legal" className="text-sm underline hover:text-gray-300 flex items-center">
          En savoir plus
        </Link>
        <Button color="light" size="sm" onClick={handleDismiss}>
          J'ai compris
        </Button>
      </div>
    </div>
  );
}