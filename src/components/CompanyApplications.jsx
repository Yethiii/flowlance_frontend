import { useState, useEffect } from "react";
import { HiUser, HiBriefcase, HiOutlineMail, HiCheckCircle, HiXCircle, HiClock } from "react-icons/hi";
import { Spinner, Badge, Card, Modal } from "flowbite-react";
import { getCompanyApplications, updateApplicationStatus } from "../services/api";

export default function CompanyApplications() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pour la modale de visualisation du profil (en cours de construction)
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await getCompanyApplications();
      setApplications(data);
    } catch (error) {
      console.error("Erreur de chargement des candidatures", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      // On met à jour l'affichage localement pour que ce soit instantané sans recharger
      setApplications(applications.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED': return <Badge color="success" icon={HiCheckCircle} className="px-3 py-1 text-sm">Acceptée</Badge>;
      case 'REJECTED': return <Badge color="failure" icon={HiXCircle} className="px-3 py-1 text-sm">Refusée</Badge>;
      default: return <Badge color="warning" icon={HiClock} className="px-3 py-1 text-sm">En attente</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit'
    });
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="xl" className="text-coral"/></div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <header className="mb-8">
        <h2 className="text-3xl font-black text-navy uppercase tracking-tight">Candidatures Reçues</h2>
        <p className="text-gray-500 mt-2">Gérez les talents qui souhaitent rejoindre vos missions.</p>
      </header>

      {applications.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center shadow-sm border border-gray-100">
          <HiOutlineMail className="mx-auto h-16 w-16 text-teal opacity-30 mb-4" />
          <h3 className="text-xl font-bold text-navy mb-2">Boîte de réception vide</h3>
          <p className="text-gray-500">Vous n'avez pas encore reçu de candidatures pour vos annonces.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {applications.map((app) => (
            <Card key={app.id} className="border-none shadow-lg rounded-3xl overflow-hidden">
              <div className="flex flex-col md:flex-row gap-6 p-2">
                
                {/* Infos du Candidat */}
                <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-6 flex flex-col justify-center items-center text-center">
                  <div className="h-20 w-20 bg-teal/10 text-teal rounded-full flex items-center justify-center text-4xl mb-3 shadow-inner">
                    <HiUser />
                  </div>
                  <h3 className="text-xl font-black text-navy mb-1">
                    <span>
                      {app.freelance.first_name 
                        ? `${app.freelance.first_name} ${app.freelance.last_name?.charAt(0)}.` 
                        : "Candidat Anonyme"}
                    </span>
                  </h3>
                  <button 
                    onClick={() => { setSelectedCandidate(app.freelance); setIsCandidateModalOpen(true); }}
                    className="text-coral text-sm font-bold hover:underline flex items-center mt-2"
                  >
                    Voir le profil complet
                  </button>
                </div>

                {/* Infos de la Candidature */}
                <div className="md:w-2/3 flex flex-col">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">A postulé pour :</p>
                      <h4 className="text-lg font-bold text-teal flex items-center">
                        <HiBriefcase className="mr-2" /> {app.job_title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <HiClock className="mr-1" /> Le {formatDate(app.applied_at)}
                      </p>
                    </div>
                    <div>{renderStatusBadge(app.status)}</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex-1 mb-4">
                    <p className="text-xs font-bold text-gray-500 mb-2">MESSAGE D'ACCOMPAGNEMENT :</p>
                    <p className="text-sm text-gray-700 italic whitespace-pre-wrap">
                      <span>{app.cover_message ? `"${app.cover_message}"` : "Le candidat n'a pas laissé de message spécifique."}</span>
                    </p>
                  </div>

                  {/* Actions (Boutons) - Visibles seulement si c'est PENDING */}
                  {app.status === 'PENDING' && (
                    <div className="flex gap-3 justify-end mt-auto pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => handleStatusChange(app.id, 'REJECTED')}
                        className="px-5 py-2.5 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
                      >
                        Décliner
                      </button>
                      <button 
                        onClick={() => handleStatusChange(app.id, 'ACCEPTED')}
                        className="px-5 py-2.5 rounded-xl font-bold text-white shadow-md transition-transform hover:scale-105 text-sm flex items-center"
                        style={{ backgroundColor: '#CE6A6B' }}
                      >
                        <HiCheckCircle className="mr-2 h-5 w-5" /> Accepter le candidat
                      </button>
                    </div>
                  )}
                  
                  {/* Petit message si action déjà prise */}
                  {app.status !== 'PENDING' && (
                    <div className="text-right mt-auto pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-400 italic">Cette candidature a déjà été traitée.</p>
                    </div>
                  )}

                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modale "En construction" pour le profil */}
      <Modal show={isCandidateModalOpen} size="md" onClose={() => setIsCandidateModalOpen(false)}>
        <div className="p-6 text-center bg-gray-50 rounded-lg">
          <HiUser className="mx-auto mb-4 h-14 w-14 text-teal opacity-50" />
          <h3 className="mb-2 text-xl font-black text-navy">
            Profil de {selectedCandidate?.first_name || "ce candidat"}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            L'affichage de tous les diplômes et compétences du freelance sur cette pop-up sera l'étape finale !
          </p>
          <button className="px-5 py-2 rounded-lg font-bold bg-coral text-white" onClick={() => setIsCandidateModalOpen(false)}>Fermer</button>
        </div>
      </Modal>

    </div>
  );
}