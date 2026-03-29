import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiMenu, HiX, HiUserCircle, HiBriefcase, HiSearch, 
  HiLocationMarker, HiStar, HiCurrencyEuro, HiClock, 
  HiOfficeBuilding, HiOutlinePaperAirplane, HiCheckCircle, HiOutlineChatAlt2,HiInformationCircle,
  HiXCircle, HiOutlineMail, HiSparkles } from "react-icons/hi";
import { Spinner, Modal, Textarea, Alert, Badge } from "flowbite-react";

import FreelanceProfileForm from "./FreelanceProfileForm"; 
import FreelanceJobBoard from "./FreelanceJobBoard"; 
import FreelanceCVCoach from "./FreelanceCVCoach";
import FreelanceChatModal from "./FreelanceChatModal";
import DirectChatModal from "./DirectChatModal";

// Import de TOUTES les fonctions nécessaires pour lire l'offre et postuler
import { getFreelanceDashboardData, getAvailableJobOffers, getCompanyProfileById, applyToJob, getMyApplications,getNotificationsCount, getConversationsList } from "../services/api";

export default function DashboardFreelance() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState("Tableau de bord");

  // --- ÉTATS POUR L'IA ET LES OFFRES COMPLÈTES ---
  const [aiMatches, setAiMatches] = useState([]);
  const [fullOffersData, setFullOffersData] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);

  // --- ÉTATS POUR LES MODALES (Copie de FreelanceJobBoard) ---
  const [viewedOffer, setViewedOffer] = useState(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [viewedCompany, setViewedCompany] = useState(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);
  
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverMessage, setCoverMessage] = useState("");
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  // --- ÉTATS POUR LA MESSAGERIE ---
  const [notifs, setNotifs] = useState({ unread_messages: 0, pending_applications: 0 });
  const [conversations, setConversations] = useState([]);
  const [directChatUser, setDirectChatUser] = useState(null);
  const [directChatName, setDirectChatName] = useState("");
  const [isDirectChatOpen, setIsDirectChatOpen] = useState(false);

  // --- LE MOTEUR TEMPS RÉEL (SHORT POLLING) ---
  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        // 1. On récupère le nombre de notifications générales (la petite pastille rouge)
        const notifData = await getNotificationsCount();
        setNotifs(notifData);

        // 2. Si l'utilisateur est sur l'onglet Messagerie, on rafraîchit la liste des conversations !
        if (activeView === "Messagerie") {
          const convos = await getConversationsList();
          setConversations(convos);
        }
      } catch (error) { console.error("Erreur Temps Réel", error); }
    };

    fetchRealTimeData(); // Appel immédiat au chargement
    const interval = setInterval(fetchRealTimeData, 3000); // Rafraîchit toutes les 3 secondes !
    return () => clearInterval(interval);
  }, [activeView]);



  // --- CHARGEMENT DES DONNÉES ---
  useEffect(() => {
    if (activeView === "Tableau de bord") {
      const fetchDashboardData = async () => {
        setIsDashboardLoading(true);
        try {
          // On charge l'IA, mais aussi toutes les annonces pour faire le lien !
          const [aiData, allOffers, myApps] = await Promise.all([
            getFreelanceDashboardData(),
            getAvailableJobOffers(),
            getMyApplications()
          ]);
          if (aiData.dashboard && Array.isArray(aiData.dashboard)) {
            setAiMatches(aiData.dashboard);
          }
          setFullOffersData(allOffers);
          setMyApplications(myApps);
        } catch (error) {
          console.error("Erreur Dashboard IA", error);
        } finally {
          setIsDashboardLoading(false);
        }
      };
      fetchDashboardData();
    }
  }, [activeView]);

  const hasAlreadyApplied = (offerId) => {
    return myApplications.some(app => app.job_offer === offerId);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // --- ACTIONS DES BOUTONS ---
  const openOfferDetails = (offer) => {
    setViewedOffer(offer);
    setIsOfferModalOpen(true);
  };

  const openApplyModal = (offer) => {
    setSelectedOffer(offer);
    setCoverMessage("");
    setApplyError("");
    setApplySuccess(false);
    setIsApplyModalOpen(true);
    setIsOfferModalOpen(false); 
  };

  const handleApply = async () => {
    setApplyError("");
    setIsApplying(true);
    try {
      const newApp = await applyToJob(selectedOffer.id, coverMessage);
      setApplySuccess(true);
      setMyApplications([...myApplications, newApp]);
      setTimeout(() => { setIsApplyModalOpen(false); setApplySuccess(false); }, 2000);
    } catch (error) {
      setApplyError(error.message);
    } finally {
      setIsApplying(false);
    }
  };

  const openCompanyProfile = async (companyId) => {
    setIsCompanyModalOpen(true);
    setIsLoadingCompany(true);
    try {
      const companyData = await getCompanyProfileById(companyId);
      setViewedCompany(companyData);
    } catch (error) { console.error("Erreur entreprise", error); } 
    finally { setIsLoadingCompany(false); }
  };

const menuItems = ["Tableau de bord", "Trouver une mission", "Mes Candidatures", "Mon CV (IA)", "Mon Profil", "Messagerie"];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-teal/5">
      {/* ... (HEADER ET SIDEBAR IDENTIQUES) ... */}
      <div className="md:hidden bg-navy p-4 flex justify-between items-center shadow-lg">
        <img src="/logo.png" alt="Logo" className="h-10" />
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-coral text-3xl"><HiMenu /></button>
      </div>

      <aside className={`${isMenuOpen ? "block" : "hidden"} md:flex w-full md:w-64 bg-navy text-white flex-col p-6 shadow-xl transition-all`}>
        <div className="mb-10 hidden md:flex flex-col items-center">
          <img src="/logo.png" alt="Logo" className="h-16 mb-4" />
          <h2 className="text-xl font-black italic text-coral">FLOWLANCE</h2>
          <span className="text-xs text-sage mt-1">Espace Expert</span>
        </div>
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button key={item} onClick={() => { setActiveView(item); setIsMenuOpen(false); }}
              className={`w-full text-left p-4 rounded-xl transition-colors font-bold flex justify-between items-center ${activeView === item ? "bg-white/10 text-coral" : "text-sage hover:bg-white/5"}`}>
              <span>{item}</span>
              {/* LA FAMEUSE PASTILLE ROUGE SI MESSAGE NON LU ! */}
              {item === "Messagerie" && notifs.unread_messages > 0 && (
                <Badge color="failure" className="w-6 h-6 flex items-center justify-center rounded-full p-0 shadow-sm animate-pulse">{notifs.unread_messages}</Badge>
              )}
            </button>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/10 pt-4">
          <button onClick={handleLogout} className="text-coral font-bold p-4 hover:underline w-full text-left">Déconnexion</button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        {activeView === "Mon Profil" && <FreelanceProfileForm />}
        {activeView === "Trouver une mission" && <FreelanceJobBoard />}
        {activeView === "Mon CV (IA)" && <FreelanceCVCoach />}

        {activeView === "Tableau de bord" && (
          <>
            <header className="mb-10">
              <h1 className="text-2xl md:text-4xl font-black text-navy uppercase tracking-tight">Vos Recommandations</h1>
              <p className="text-teal font-medium mt-2">Notre IA a analysé les annonces actives pour vous proposer les missions les plus compatibles.</p>
            </header>

            {isDashboardLoading ? (
              <div className="flex flex-col items-center justify-center py-20"><Spinner size="xl" className="mb-4 text-coral" /></div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {aiMatches.length > 0 ? aiMatches.map((match, index) => {
                  
                  // MAGIE : On retrouve la vraie annonce grâce à l'ID !
                  const actualOffer = fullOffersData.find(o => o.id === match.job_id);

                  return (
                    <div key={index} className="bg-white rounded-3xl p-6 shadow-xl relative overflow-hidden border-t-4 border-teal flex flex-col h-full">
                      
                      <div className="absolute top-0 right-0 bg-coral text-white font-black px-6 py-2 rounded-bl-3xl shadow-md">
                        Match : {match.score}%
                      </div>
                      
                      {actualOffer ? (
                        <>
                          <h3 className="text-xl font-black text-navy mb-2 pr-20 line-clamp-2">{actualOffer.offer_title}</h3>
                          
                          <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4 border-b border-gray-100 pb-4">
                            <button onClick={() => openCompanyProfile(actualOffer.offer_company)} className="flex items-center text-left hover:text-coral transition-colors w-max">
                              <HiBriefcase className="mr-2 text-coral h-5 w-5"/> 
                              <span className="font-bold underline decoration-transparent hover:decoration-coral transition-colors">
                                {actualOffer.company_name || "Entreprise Confidentielle"}
                              </span>
                            </button>
                            <div className="flex items-center"><HiLocationMarker className="mr-2 text-gray-400 h-5 w-5"/> {actualOffer.offer_location || 'Non spécifié'}</div>
                          </div>
                        </>
                      ) : (
                        <h3 className="text-lg font-bold text-gray-400 mb-4">Annonce N°{match.job_id} (Données indisponibles)</h3>
                      )}
                      
                      {/* Le nouveau texte positif de l'IA */}
                      <div className="bg-teal/5 p-4 rounded-xl border border-teal/20 mb-6 flex-1">
                        <p className="text-navy text-sm leading-relaxed italic">
                          "{match.explication}"
                        </p>
                      </div>

                      {actualOffer && (
                        <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                          <button 
                            onClick={() => openOfferDetails(actualOffer)}
                            className="flex-1 bg-gray-100 text-navy font-bold px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm"
                          >
                            Voir l'annonce
                          </button>
                          
                          {hasAlreadyApplied(actualOffer.id) ? (
                            <button disabled className="flex-1 bg-gray-100 text-gray-400 font-bold py-3 rounded-xl flex justify-center items-center cursor-not-allowed text-sm">
                              <HiCheckCircle className="mr-2 h-5 w-5" /> POSTULÉ
                            </button>
                          ) : (
                            <button 
                              onClick={() => openApplyModal(actualOffer)}
                              className="flex-1 bg-coral text-white font-black px-4 py-3 rounded-xl hover:scale-105 shadow-md transition-transform flex justify-center items-center text-sm"
                            >
                              <HiOutlinePaperAirplane className="mr-2 h-4 w-4 rotate-90" /> POSTULER
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }) : (
                  <div className="col-span-1 lg:col-span-2 bg-white p-10 rounded-3xl text-center shadow-sm border border-gray-100">
                    <p className="text-gray-500 font-medium text-lg">Aucune recommandation pour le moment.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* --- MODALES IDENTIQUES AU JOB BOARD --- */}
        <Modal show={isOfferModalOpen} size="3xl" onClose={() => setIsOfferModalOpen(false)}>
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-lg">
            <h3 className="text-xl font-bold text-navy">Détails de la mission</h3>
            <button onClick={() => setIsOfferModalOpen(false)} className="text-gray-400 hover:text-coral font-bold text-xl">X</button>
          </div>
          <div className="p-8 bg-gray-50 max-h-[70vh] overflow-y-auto">
            {viewedOffer && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-black text-navy mb-4">{viewedOffer.offer_title}</h1>
                <div className="flex flex-wrap gap-6 text-sm font-medium text-gray-600 mb-8 pb-6 border-b border-gray-100">
                  <button onClick={() => openCompanyProfile(viewedOffer.offer_company)} className="flex items-center hover:text-coral transition-colors">
                    <HiBriefcase className="mr-2 text-coral h-5 w-5"/> <span className="font-bold underline">{viewedOffer.company_name}</span>
                  </button>
                  <div className="flex items-center"><HiLocationMarker className="mr-2 text-coral h-5 w-5"/> {viewedOffer.offer_location}</div>
                </div>
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">{viewedOffer.offer_description}</div>
                <div className="mt-10 flex justify-center border-t border-gray-100 pt-8">
                  {hasAlreadyApplied(viewedOffer.id) ? (
                    <button disabled className="px-10 py-4 bg-gray-200 text-gray-500 font-black rounded-xl cursor-not-allowed flex items-center"><HiCheckCircle className="mr-2 h-5 w-5" /> POSTULÉ</button>
                  ) : (
                    <button onClick={() => openApplyModal(viewedOffer)} className="px-10 py-4 bg-coral text-white font-black rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center"><HiOutlinePaperAirplane className="mr-2 h-5 w-5 rotate-90" /> POSTULER À CETTE MISSION</button>
                  )}
                </div>
              </div>
            )}
          </div>
        </Modal>

        <Modal show={isApplyModalOpen} size="lg" onClose={() => !isApplying && setIsApplyModalOpen(false)}>
          <div className="p-6 border-b border-gray-100 flex justify-between bg-white rounded-t-lg">
            <h3 className="text-xl font-black text-navy">Envoyer ma candidature</h3>
            <button onClick={() => !isApplying && setIsApplyModalOpen(false)} className="text-gray-400 hover:text-coral">X</button>
          </div>
          <div className="p-6 bg-gray-50">
            {applySuccess ? (
              <Alert color="success" icon={HiCheckCircle}><span className="font-medium">Félicitations !</span> Candidature envoyée.</Alert>
            ) : (
              <>
                {applyError && <Alert color="failure" icon={HiInformationCircle} className="mb-4">{applyError}</Alert>}
                <label className="block text-sm font-bold text-navy mb-2">Message d'accompagnement (Optionnel)</label>
                <Textarea rows={4} value={coverMessage} onChange={(e) => setCoverMessage(e.target.value)} placeholder="Un petit mot pour vous démarquer..." />
              </>
            )}
          </div>
          {!applySuccess && (
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white rounded-b-lg">
              <button onClick={() => setIsApplyModalOpen(false)} disabled={isApplying} className="px-5 py-2.5 rounded-lg font-bold text-gray-600 hover:bg-gray-100">Annuler</button>
              <button onClick={handleApply} disabled={isApplying} className="px-6 py-2.5 rounded-lg font-bold text-white bg-coral flex items-center">{isApplying ? <Spinner size="sm" className="mr-2" /> : <HiOutlinePaperAirplane className="mr-2 h-4 w-4 rotate-90" />} POSTULER</button>
            </div>
          )}
        </Modal>

        <Modal show={isCompanyModalOpen} size="2xl" onClose={() => setIsCompanyModalOpen(false)}>
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-lg">
            <h3 className="text-2xl font-black text-navy flex items-center"><HiOfficeBuilding className="mr-3 text-coral h-6 w-6" /> Profil de l'entreprise</h3>
            <button onClick={() => setIsCompanyModalOpen(false)} className="text-gray-400 hover:text-coral font-black text-xl">X</button>
          </div>
          <div className="p-8 bg-gray-50 max-h-[80vh] overflow-y-auto">
            {isLoadingCompany ? <div className="flex justify-center py-10"><Spinner size="xl" /></div> : viewedCompany && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-6">
                  {viewedCompany.company_logo ? <img src={viewedCompany.company_logo} alt="Logo" className="w-20 h-20 object-cover rounded-xl shadow-sm border border-gray-200" /> : <div className="w-20 h-20 bg-teal/10 rounded-xl flex items-center justify-center text-teal font-bold text-2xl">{viewedCompany.company_name?.charAt(0) || "🏢"}</div>}
                  <div><h4 className="text-3xl font-black text-navy">{viewedCompany.company_name}</h4><Badge color="gray" className="w-max mt-2">Vérifié</Badge></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center text-gray-700 text-sm"><HiUsers className="mr-3 text-teal h-5 w-5" /> <span className="font-bold mr-1">Taille :</span> {viewedCompany.company_size || "Non précisée"}</div>
                  {viewedCompany.company_website && <div className="flex items-center text-gray-700 text-sm"><HiGlobeAlt className="mr-3 text-teal h-5 w-5" /><a href={viewedCompany.company_website} target="_blank" rel="noreferrer" className="text-coral hover:underline font-bold">Site Internet</a></div>}
                  {viewedCompany.company_phone && <div className="flex items-center text-gray-700 text-sm"><HiPhone className="mr-3 text-teal h-5 w-5" /><span className="font-bold mr-1">Tél :</span> <a href={`tel:${viewedCompany.company_phone}`} className="hover:text-coral">{viewedCompany.company_phone}</a></div>}
                </div>
                <div className="mb-8">
                  <h5 className="font-bold text-navy mb-3 text-lg">Présentation</h5>
                  <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed bg-gray-50 p-5 rounded-xl border border-gray-100">{viewedCompany.company_description || "Pas de description."}</p>
                </div>
                <div className="bg-teal/5 p-5 rounded-xl border border-teal/20">
                  <h5 className="font-bold text-teal mb-3 flex items-center"><HiIdentification className="mr-2 h-5 w-5" /> Adresse</h5>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>{viewedCompany.company_street} {viewedCompany.company_number}, {viewedCompany.company_postcode} {viewedCompany.company_city}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal>
           {/* ================= ONGLET : MES CANDIDATURES ================= */}
        {activeView === "Mes Candidatures" && (
          <>
            <header className="mb-10">
              <h1 className="text-2xl md:text-4xl font-black text-navy uppercase tracking-tight">Mes Candidatures</h1>
              <p className="text-teal font-medium mt-2">Suivez l'état de vos demandes auprès des recruteurs.</p>
            </header>

            {isDashboardLoading ? (
              <div className="flex justify-center py-20"><Spinner size="xl" className="text-coral" /></div>
            ) : (
              <div className="space-y-6">
                {myApplications.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl text-center shadow-sm border border-gray-100">
                    <HiOutlinePaperAirplane className="mx-auto h-16 w-16 text-teal opacity-30 mb-4 rotate-90" />
                    <h3 className="text-xl font-bold text-navy mb-2">Aucune candidature</h3>
                    <p className="text-gray-500">Vous n'avez pas encore postulé à des missions.</p>
                    <button onClick={() => setActiveView("Trouver une mission")} className="mt-6 px-6 py-2.5 bg-coral text-white font-bold rounded-xl shadow-md hover:scale-105 transition-transform">
                      Explorer les missions
                    </button>
                  </div>
                ) : (
                  myApplications.map((app) => {
                    // On retrouve les détails de l'annonce pour afficher le nom de la mission et de l'entreprise
                    const offer = fullOffersData.find(o => o.id === app.job_offer);
                    
                    return (
                      <div key={app.id} className={`bg-white rounded-3xl p-6 shadow-sm border-l-4 ${app.status === 'ACCEPTED' ? 'border-l-green-400' : app.status === 'REJECTED' ? 'border-l-coral' : 'border-l-yellow-400'}`}>
                        
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 border-b border-gray-100 pb-4">
                          <div>
                            <h3 className="text-xl font-black text-navy">{offer ? offer.offer_title : `Annonce N°${app.job_offer} (Supprimée)`}</h3>
                            {offer && (
                              <button onClick={() => openCompanyProfile(offer.offer_company)} className="text-teal font-bold hover:underline flex items-center text-sm mt-1">
                                <HiOfficeBuilding className="mr-1" /> {offer.company_name || "Entreprise confidentielle"}
                              </button>
                            )}
                          </div>
                          
                          {/* BADGES DE STATUT */}
                          <div className="flex-shrink-0">
                            {app.status === 'ACCEPTED' && <Badge color="success" icon={HiCheckCircle} className="px-4 py-2 text-sm font-bold">Candidature Acceptée !</Badge>}
                            {app.status === 'REJECTED' && <Badge color="failure" icon={HiXCircle} className="px-4 py-2 text-sm font-bold">Candidature Déclinée</Badge>}
                            {app.status === 'PENDING' && <Badge color="warning" icon={HiClock} className="px-4 py-2 text-sm font-bold">En attente de réponse</Badge>}
                          </div>
                        </div>

                        {/* MESSAGE DU CANDIDAT (RAPPEL) */}
                        {app.cover_message && (
                          <div className="mb-4">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Votre message :</p>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg italic">"{app.cover_message}"</p>
                          </div>
                        )}

                        {/* MESSAGE DE L'ENTREPRISE (IA) EN CAS DE REFUS */}
                        {app.status === 'REJECTED' && app.rejection_message && (
                          <div className="mt-4 bg-coral/5 border border-coral/20 p-4 rounded-xl">
                            <p className="text-xs font-black text-coral uppercase mb-2 flex items-center">
                              <HiOutlineMail className="mr-2 h-4 w-4" /> Réponse du recruteur :
                            </p>
                            <p className="text-sm text-gray-800 leading-relaxed">{app.rejection_message}</p>
                          </div>
                        )}
                        
                        {/* ======================================================== */}
                        {/* LE NOUVEAU BLOC ACCEPTÉ AVEC LE BOUTON MESSAGERIE        */}
                        {/* ======================================================== */}
                        {app.status === 'ACCEPTED' && (
                          <div className="mt-4 bg-green-50 border border-green-200 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <p className="text-sm text-green-800 font-bold flex items-center">
                              <HiSparkles className="mr-2 h-5 w-5 text-green-500" /> Félicitations ! Vous pouvez maintenant discuter avec le recruteur.
                            </p>
                            <button 
                              onClick={() => {
                                if (offer && offer.offer_company) {
                                  setSelectedCompanyId(offer.offer_company);
                                  setIsChatModalOpen(true);
                                }
                              }}
                              className="px-4 py-2 bg-teal text-white text-sm font-bold rounded-lg shadow hover:scale-105 transition-transform flex items-center justify-center whitespace-nowrap"
                            >
                              <HiOutlineChatAlt2 className="mr-2 h-5 w-5" /> Ouvrir la messagerie
                            </button>
                          </div>
                        )}

                      </div>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}

        {/* ================= ONGLET : MESSAGERIE ================= */}
        {activeView === "Messagerie" && (
          <>
            <header className="mb-10">
              <h1 className="text-2xl md:text-4xl font-black text-navy uppercase tracking-tight">Messagerie</h1>
              <p className="text-teal font-medium mt-2">Vos discussions en temps réel avec les recruteurs.</p>
            </header>
            
            {conversations.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl text-center shadow-sm border border-gray-100">
                <HiOutlineChatAlt2 className="mx-auto h-16 w-16 text-teal opacity-30 mb-4" />
                <h3 className="text-xl font-bold text-navy mb-2">Aucune conversation</h3>
                <p className="text-gray-500">Attendez qu'un recruteur valide votre profil pour démarrer le chat.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {conversations.map((conv) => (
                  <div key={conv.other_user_id} 
                    onClick={() => {
                      setDirectChatUser(conv.other_user_id);
                      setDirectChatName(conv.name);
                      setIsDirectChatOpen(true);
                    }}
                    className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 cursor-pointer hover:shadow-md transition-all flex items-center justify-between ${conv.unread_count > 0 ? 'border-l-coral bg-coral/5' : 'border-l-transparent'}`}>
                    <div className="flex flex-col">
                      <h4 className="font-bold text-navy text-lg flex items-center">
                        {conv.name}
                        {conv.unread_count > 0 && <Badge color="failure" className="ml-3 animate-pulse">Nouveau</Badge>}
                      </h4>
                      {/* LE TITRE DE LA MISSION */}
                      <span className="text-xs font-bold text-teal bg-teal/5 px-2 py-1 rounded-md w-max mt-1 mb-1">
                        🏷️ Mission : {conv.job_title}
                      </span>
                      {/* LE DERNIER MESSAGE */}
                      <p className={`text-sm truncate max-w-md ${conv.unread_count > 0 ? 'text-navy font-bold' : 'text-gray-500'}`}>
                        {conv.last_message === '__CHAT_CLOSED__' ? '🔒 Conversation clôturée' : conv.last_message}
                      </p>
                    </div>

                    <div className="text-xs font-bold text-gray-400">
                      {new Date(conv.timestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </main>

      {/* LA MODALE EST PLACÉE ICI, À L'EXTÉRIEUR DU MAIN POUR S'AFFICHER PAR DESSUS TOUT */}
      <FreelanceChatModal 
        show={isChatModalOpen} 
        onClose={() => setIsChatModalOpen(false)} 
        companyProfileId={selectedCompanyId} 
      />

      <DirectChatModal 
        show={isDirectChatOpen} 
        onClose={() => setIsDirectChatOpen(false)} 
        targetUserId={directChatUser}
        targetName={directChatName}
      />
      
    </div>
  );
}