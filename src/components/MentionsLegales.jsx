import { Card } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiHome, HiX } from "react-icons/hi";

export default function MentionsLegales() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 pb-20">
      
      <Card className="max-w-4xl w-full border-none shadow-2xl bg-white rounded-3xl overflow-hidden p-0">
        
        {/* EN-TÊTE : Style Navy identique à ton Profil */}
        <div className="flex items-center justify-between p-6 bg-navy text-white">
          <span className="text-2xl font-black italic">
            MENTIONS LÉGALES
          </span>
          
          <div className="flex items-center gap-3">
            <Link 
              to="/" 
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Retour à l'accueil"
            >
              <HiHome className="w-5 h-5" />
            </Link>
            <Link 
              to="/" 
              className="p-2 rounded-full bg-coral/80 hover:bg-coral text-white shadow-md transition-colors"
              title="Fermer"
            >
              <HiX className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* CONTENU PRINCIPAL */}
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Bloc type "Profil" avec fond gris clair */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="text-lg font-black text-navy mb-4 border-b pb-2">1. Édition du site</h3>
            <p className="leading-relaxed text-gray-700">
              Le site <strong>Flowlance</strong> est un projet académique à but non lucratif développé dans le cadre de ma formation en Informatique.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1 text-gray-700">
              <li><strong>Créatrice et Développeuse :</strong> Laetitia Voué</li>
              <li><strong>Hébergement Frontend :</strong> Vercel Inc.</li>
              <li><strong>Hébergement Backend :</strong> Render</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="text-lg font-black text-navy mb-4 border-b pb-2">2. Données Personnelles (RGPD)</h3>
            <div className="mb-4 p-4 bg-sage/10 rounded-xl border border-sage/30">
              <span className="text-sm font-bold text-navy">
                Les données collectées lors de votre inscription sont utilisées exclusivement dans le cadre du fonctionnement de la plateforme (mise en relation et analyse IA).
              </span>
            </div>
            <p className="leading-relaxed text-gray-700">
              Elles ne sont en aucun cas vendues ou utilisées à des fins commerciales. Conformément au RGPD, vous possédez un contrôle total sur vos données depuis les paramètres de votre compte (suspension et suppression définitive).
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="text-lg font-black text-navy mb-4 border-b pb-2">3. Politique des Cookies</h3>
            <p className="leading-relaxed text-gray-700 mb-2">
              <strong>Aucun cookie de traçage publicitaire n'est utilisé.</strong>
            </p>
            <p className="leading-relaxed text-gray-700">
              L'application utilise exclusivement le stockage local (<code>localStorage</code>) pour conserver un jeton d'authentification crypté (Token JWT) indispensable à votre connexion sécurisée.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="text-lg font-black text-navy mb-4 border-b pb-2">4. Propriété Intellectuelle</h3>
            <p className="leading-relaxed text-gray-700">
              L'ensemble des éléments figurant sur Flowlance sont la propriété de son autrice, à l'exception des bibliothèques open-source utilisées sous leurs licences respectives.
            </p>
          </div>

        </div>
      </Card>
    </div>
  );
}