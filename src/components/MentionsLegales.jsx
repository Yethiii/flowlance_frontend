import { Card } from "flowbite-react";

export default function MentionsLegales() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="max-w-4xl w-full border-none shadow-xl p-8 bg-white dark:bg-gray-800">
        
        {/* Titre principal : Teal foncé pour ton thème */}
        <h1 className="text-3xl font-black mb-6 text-teal-800 dark:text-white border-b border-teal-100 dark:border-gray-700 pb-4">
          Mentions Légales & Politique de Confidentialité
        </h1>

        {/* Div parente forcée en Gris très foncé/Noir pour la lisibilité sur fond blanc */}
        <div className="space-y-6 text-gray-900 dark:text-gray-100">
          
          <section>
            {/* Sous-titre : Teal foncé */}
            <h2 className="text-xl font-bold text-teal-700 dark:text-white mb-2">1. Édition du site</h2>
            <p className="leading-relaxed">
              Le site <strong>Flowlance</strong> est un projet académique à but non lucratif développé dans le cadre de ma formation en Informatique.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Créatrice et Développeuse :</strong> Laetitia Voué</li>
              <li><strong>Hébergement Frontend :</strong> Vercel Inc.</li>
              <li><strong>Hébergement Backend :</strong> Render</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-teal-700 dark:text-white mb-2">2. Données Personnelles (RGPD)</h2>
            <p className="leading-relaxed mb-2">
              Les données collectées lors de votre inscription (adresse email, informations professionnelles, CV au format PDF) sont utilisées <strong>exclusivement</strong> dans le cadre du fonctionnement de la plateforme (mise en relation et analyse par nos services d'Intelligence Artificielle).
            </p>
            <p className="leading-relaxed">
              Elles ne sont en aucun cas vendues, cédées à des tiers, ou utilisées à des fins de prospection commerciale. Conformément au Règlement Général sur la Protection des Données (RGPD), tout utilisateur possède un contrôle total sur ses données depuis les paramètres de son compte, incluant le droit de suspension et de suppression définitive de son profil et de ses fichiers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-teal-700 dark:text-white mb-2">3. Politique des Cookies et Stockage Local</h2>
            <p className="leading-relaxed mb-2">
              Flowlance fait le choix de la protection de votre vie privée. <strong>Aucun cookie de traçage publicitaire ou outil analytique (comme Google Analytics) n'est utilisé sur cette plateforme.</strong>
            </p>
            <p className="leading-relaxed">
              Pour maintenir votre session active et sécuriser vos accès de manière transparente, l'application utilise exclusivement le stockage local de votre navigateur (<code>localStorage</code>) pour conserver un jeton d'authentification crypté (Token JWT). Ce fonctionnement, purement technique et strictement nécessaire à la fourniture du service, ne nécessite aucun recueil de consentement préalable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-teal-700 dark:text-white mb-2">4. Propriété Intellectuelle</h2>
            <p className="leading-relaxed">
              L'ensemble des éléments figurant sur Flowlance (architecture logicielle, design, logotype) sont la propriété de son autrice, à l'exception des bibliothèques open-source utilisées sous leurs licences respectives.
            </p>
          </section>
        </div>
      </Card>
    </div>
  );
}