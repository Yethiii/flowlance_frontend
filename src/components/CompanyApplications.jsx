import { useState, useEffect } from "react";
import { HiUser, HiBriefcase, HiOutlineMail, HiCheckCircle, HiXCircle, HiClock, HiSparkles, HiOutlineChatAlt2 } from "react-icons/hi";
import { Spinner, Badge, Card, Modal, Textarea, Alert } from "flowbite-react";
import { getCompanyApplications, updateApplicationStatus, generateRejectionMessageAI } from "../services/api";
import FreelanceProfileModal from "./FreelanceProfileModal";
import MessageModal from "./MessageModal";

export default function CompanyApplications() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  // --- NOUVEAUX ÉTATS POUR LE REFUS ---
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [appToReject, setAppToReject] = useState(null);
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [rejectError, setRejectError] = useState("");

  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatFreelanceId, setChatFreelanceId] = useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await getCompanyApplications();
      setApplications(data);
    } catch (error) {
      console.error("Erreur de chargement", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Modification : On gère le refus séparément de l'acceptation
  const handleAccept = async (appId) => {
    try {
      await updateApplicationStatus(appId, 'ACCEPTED');
      setApplications(applications.map(app => app.id === appId ? { ...app, status: 'ACCEPTED' } : app));
    } catch (error) {
      alert(error.message);
    }
  };

  // Ouvre la modale de refus
  const openRejectModal = (app) => {
    setAppToReject(app);
    setRejectionMessage("");
    setRejectError("");
    setIsRejectModalOpen(true);
  };

  // Génération IA du message
  const handleAIGeneration = async () => {
    if (!appToReject) return;
    setIsGeneratingAI(true);
    try {
      const fName = appToReject.freelance.first_name || "Candidat";
      // NOUVEAU : On envoie `rejectionMessage` à l'API !
      const data = await generateRejectionMessageAI(fName, appToReject.job_title, rejectionMessage);
      setRejectionMessage(data.generated_message);
    } catch (error) {
      console.error(error);
      setRejectError("Impossible de joindre l'IA pour le moment.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Envoi final du refus
  const confirmRejection = async () => {
    if (!rejectionMessage.trim()) {
      setRejectError("Le message de refus ne peut pas être vide.");
      return;
    }
    
    try {
      await updateApplicationStatus(appToReject.id, 'REJECTED', rejectionMessage);
      setApplications(applications.map(app => app.id === appToReject.id ? { ...app, status: 'REJECTED', rejection_message: rejectionMessage } : app));
      setIsRejectModalOpen(false);
    } catch (error) {
      setRejectError(error.message);
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED': return <Badge color="success" icon={HiCheckCircle} className="px-3 py-1">Acceptée</Badge>;
      case 'REJECTED': return <Badge color="failure" icon={HiXCircle} className="px-3 py-1">Refusée</Badge>;
      default: return <Badge color="warning" icon={HiClock} className="px-3 py-1">En attente</Badge>;
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="xl" className="text-coral"/></div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <header className="mb-8">
        <h2 className="text-3xl font-black text-navy uppercase tracking-tight">Candidatures Reçues</h2>
        <p className="text-gray-500 mt-2">Gérez les talents et donnez-leur une réponse claire.</p>
      </header>

      {applications.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center shadow-sm border border-gray-100">
          <HiOutlineMail className="mx-auto h-16 w-16 text-teal opacity-30 mb-4" />
          <h3 className="text-xl font-bold text-navy">Boîte de réception vide</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {applications.map((app) => (
            <Card key={app.id} className="border-none shadow-lg rounded-3xl overflow-hidden">
              <div className="flex flex-col md:flex-row gap-6 p-2">
                
                <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-6 flex flex-col justify-center items-center text-center">
                  <div className="h-20 w-20 bg-teal/10 text-teal rounded-full flex items-center justify-center text-4xl mb-3">
                    {app.freelance.first_name ? app.freelance.first_name.charAt(0) : <HiUser />}
                  </div>
                  <h3 className="text-xl font-black text-navy mb-1">
                    <span>{app.freelance.first_name ? `${app.freelance.first_name} ${app.freelance.last_name?.charAt(0)}.` : "Anonyme"}</span>
                  </h3>
                  <button onClick={() => { setSelectedCandidateId(app.freelance.id); setIsCandidateModalOpen(true); }} className="text-coral text-sm font-bold hover:underline mt-2">
                    Voir le profil complet
                  </button>
                </div>

                <div className="md:w-2/3 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">A postulé pour :</p>
                      <h4 className="text-lg font-bold text-teal"><HiBriefcase className="inline mr-1" /> {app.job_title}</h4>
                      <p className="text-xs text-gray-500 mt-1">Le {formatDate(app.applied_at)}</p>
                    </div>
                    <div>{renderStatusBadge(app.status)}</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex-1 mb-4">
                    <p className="text-xs font-bold text-gray-500 mb-1">MOTIVATION :</p>
                    <p className="text-sm text-gray-700 italic whitespace-pre-wrap"><span>{app.cover_message ? `"${app.cover_message}"` : "Aucun message spécifique."}</span></p>
                  </div>

                  {app.status === 'PENDING' && (
                    <div className="flex gap-3 justify-end mt-auto pt-4 border-t border-gray-100">
                      <button onClick={() => openRejectModal(app)} className="px-5 py-2.5 rounded-xl font-bold text-coral bg-coral/10 hover:bg-coral/20 transition-colors text-sm">
                        Décliner
                      </button>
                      <button onClick={() => handleAccept(app.id)} className="px-5 py-2.5 rounded-xl font-bold text-white shadow-md transition-transform hover:scale-105 text-sm flex items-center" style={{ backgroundColor: '#CE6A6B' }}>
                        <HiCheckCircle className="mr-2 h-5 w-5" /> Accepter
                      </button>
                    </div>
                  )}
                  {app.status === 'ACCEPTED' && (
                    <div className="flex gap-3 justify-end mt-auto pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => {
                          setChatFreelanceId(app.freelance.id);
                          setIsChatModalOpen(true);
                        }} 
                        className="px-5 py-2.5 rounded-xl font-bold text-white bg-teal shadow-md transition-transform hover:scale-105 text-sm flex items-center"
                      >
                        <HiOutlineChatAlt2 className="mr-2 h-5 w-5" /> Discuter avec le candidat
                      </button>
                    </div>
                  )}

                  {/* Affichage du message de refus si la candidature a été rejetée */}
                  {app.status === 'REJECTED' && app.rejection_message && (
                    <div className="mt-2 bg-coral/5 p-3 rounded-lg border border-coral/20">
                      <p className="text-xs font-bold text-coral mb-1">VOTRE RÉPONSE (REFUS) :</p>
                      <p className="text-sm text-gray-700 italic">{app.rejection_message}</p>
                    </div>
                  )}

                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* MODALE DE REFUS AVEC IA */}
      <Modal show={isRejectModalOpen} size="xl" onClose={() => setIsRejectModalOpen(false)}>
        <div className="p-6 border-b border-gray-100 flex justify-between bg-white rounded-t-lg">
          <h3 className="text-xl font-black text-coral flex items-center"><HiXCircle className="mr-2 h-6 w-6" /> Décliner la candidature</h3>
          <button onClick={() => setIsRejectModalOpen(false)} className="text-gray-400 hover:text-coral font-bold">X</button>
        </div>
        <div className="p-6 bg-gray-50">
          <p className="text-sm text-gray-600 mb-4">
            Pour maintenir la qualité de Flowlance, merci de justifier brièvement votre refus à <strong>{appToReject?.freelance.first_name || "ce candidat"}</strong>.
          </p>

          {rejectError && <Alert color="failure" className="mb-4">{rejectError}</Alert>}

          <div className="flex justify-end mb-2">
            <button 
              onClick={handleAIGeneration} 
              disabled={isGeneratingAI}
              className="text-xs font-bold text-white bg-teal px-3 py-1.5 rounded-lg flex items-center hover:bg-teal/80 transition-colors"
            >
              {isGeneratingAI ? <Spinner size="sm" className="mr-2" /> : <HiSparkles className="mr-1" />}
              {/* C'est CE <span> qui empêche React de crasher ! */}
              <span>{rejectionMessage.trim() ? "Améliorer et corriger avec l'IA" : "Générer une réponse polie avec l'IA"}</span>
            </button>
          </div>

          <Textarea 
            rows={5} 
            value={rejectionMessage} 
            onChange={(e) => setRejectionMessage(e.target.value)} 
            placeholder="Bonjour, suite à l'examen de votre profil..." 
            className="w-full p-3 text-sm rounded-xl border-gray-200 focus:ring-coral focus:border-coral shadow-sm"
          />
        </div>
        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white rounded-b-lg">
          <button onClick={() => setIsRejectModalOpen(false)} className="px-5 py-2.5 rounded-lg font-bold text-gray-600 hover:bg-gray-100">Annuler</button>
          <button onClick={confirmRejection} className="px-6 py-2.5 rounded-lg font-bold text-white bg-coral flex items-center hover:bg-red-500">
            Confirmer le refus
          </button>
        </div>
      </Modal>

      <FreelanceProfileModal show={isCandidateModalOpen} onClose={() => setIsCandidateModalOpen(false)} freelanceId={selectedCandidateId} />
      <MessageModal 
        show={isChatModalOpen} 
        onClose={() => setIsChatModalOpen(false)} 
        freelanceProfileId={chatFreelanceId} 
      />
    </div>
  );
}