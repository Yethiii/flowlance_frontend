import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiMenu, HiX, HiUserCircle, HiBriefcase, HiOutlineChatAlt2, HiUser, HiCog} from "react-icons/hi";
import { Spinner, Modal, Badge } from "flowbite-react";
import CompanyApplications from "./CompanyApplications";
import CompanyProfileForm from "./CompanyProfileForm"; 
import CompanyJobOffers from "./CompanyJobOffers";
import { getCompanyDashboardData, getNotificationsCount, getConversationsList} from "../services/api";
import FreelanceProfileModal from "./FreelanceProfileModal";
import DirectChatModal from "./DirectChatModal";

export default function DashboardCompany() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState("Tableau de bord");

  const [aiMatches, setAiMatches] = useState([]);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);

  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedFreelanceId, setSelectedFreelanceId] = useState(null);
  const [notifs, setNotifs] = useState({ unread_messages: 0, pending_applications: 0 });
  const [conversations, setConversations] = useState([]);
  const [directChatUser, setDirectChatUser] = useState(null);
  const [directChatName, setDirectChatName] = useState("");
  const [isDirectChatOpen, setIsDirectChatOpen] = useState(false);


  useEffect(() => {
    if (activeView === "Tableau de bord") {
      const fetchMatches = async () => {
        setIsDashboardLoading(true);
        try {
          const data = await getCompanyDashboardData();
          if (data.company_dashboard && Array.isArray(data.company_dashboard)) {
            setAiMatches(data.company_dashboard);
          }
        } catch (error) {
          console.error("Erreur Dashboard IA Entreprise", error);
        } finally {
          setIsDashboardLoading(false);
        }
      };
      fetchMatches();
    }
  }, [activeView]);

  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        const notifData = await getNotificationsCount();
        setNotifs(notifData);

        if (activeView === "Messagerie") {
          const convos = await getConversationsList();
          setConversations(convos);
        }
      } catch (error) { console.error("Erreur Temps Réel", error); }
    };

    fetchRealTimeData(); 
    const interval = setInterval(fetchRealTimeData, 3000); 
    return () => clearInterval(interval);
  }, [activeView]);
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = ["Tableau de bord", "Mes Annonces", "Candidatures", "Mon Entreprise", "Messagerie"];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-teal/5">
      <div className="md:hidden bg-navy p-4 flex justify-between items-center shadow-lg">
        <img src="/logo.png" alt="Logo" className="h-10" />
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-coral text-3xl"><HiMenu /></button>
      </div>

      <aside className={`${isMenuOpen ? "block" : "hidden"} md:flex w-full md:w-64 bg-navy text-white flex-col p-6 shadow-xl transition-all`}>
        <div className="mb-10 hidden md:flex flex-col items-center">
          <img src="/logo.png" alt="Logo" className="h-16 mb-4" />
          <h2 className="text-xl font-black italic text-coral">FLOWLANCE</h2>
          <span className="text-xs text-sage mt-1">Espace Recruteur</span>
        </div>
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button key={item} onClick={() => { setActiveView(item); setIsMenuOpen(false); }}
              className={`w-full text-left p-4 rounded-xl transition-colors font-bold flex justify-between items-center ${activeView === item ? "bg-white/10 text-teal" : "text-gray-400 hover:bg-white/5"}`}>
              <span>{item}</span>
              
              {item === "Messagerie" && notifs.unread_messages > 0 && (
                <Badge color="failure" className="w-6 h-6 flex items-center justify-center rounded-full p-0 shadow-sm animate-pulse">{notifs.unread_messages}</Badge>
              )}
              
              {item === "Candidatures" && notifs.pending_applications > 0 && (
                <Badge color="warning" className="w-6 h-6 flex items-center justify-center rounded-full p-0 shadow-sm animate-pulse">{notifs.pending_applications}</Badge>
              )}
            </button>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/10 pt-4">
          <button onClick={handleLogout} className="text-coral font-bold p-4 hover:underline w-full text-left">Déconnexion</button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        {activeView === "Mon Entreprise" && <CompanyProfileForm />}
        {activeView === "Mes Annonces" && <CompanyJobOffers />}
        {activeView === "Candidatures" && <CompanyApplications />}

        {activeView === "Tableau de bord" && (
          <>
            <header className="mb-10">
              <h1 className="text-2xl md:text-4xl font-black text-navy uppercase tracking-tight">Vos Talents Recommandés</h1>
              <p className="text-teal font-medium mt-2">Notre IA scanne en continu la plateforme pour vous proposer les meilleurs profils.</p>
            </header>

            {isDashboardLoading ? (
              <div className="flex flex-col items-center justify-center py-20"><Spinner size="xl" className="mb-4 text-coral" /></div>
            ) : (
              <div className="space-y-10">
                {aiMatches.length > 0 ? aiMatches.map((offerMatch, index) => (
                    <div key={index} className="bg-white rounded-3xl p-6 shadow-xl border-t-4 border-t-teal">
                      <h2 className="text-2xl font-black text-navy mb-6 flex items-center border-b border-gray-100 pb-4">
                        <HiBriefcase className="mr-3 text-teal" /> Pour l'annonce : <span className="text-coral ml-2">{offerMatch.job_title}</span>
                      </h2>
                      <div className="grid grid-cols-1 gap-6">
                        {offerMatch.top_matches && offerMatch.top_matches.length > 0 ? offerMatch.top_matches.map((freelance, fIndex) => (
                            <div key={fIndex} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 relative overflow-hidden hover:shadow-md transition-shadow">
                              <div className="absolute top-0 right-0 bg-coral text-white font-black px-5 py-2 rounded-bl-2xl shadow-sm">
                                Match : {freelance.score}%
                              </div>
                              <div className="flex items-start gap-4">
                                <div className="h-12 w-12 bg-teal/20 text-teal rounded-full flex items-center justify-center text-2xl flex-shrink-0"><HiUserCircle /></div>
                                <div className="flex-1 pr-24">
                                  <h3 className="text-lg font-bold text-navy mb-2">
                                    <span>
                                        {freelance.first_name 
                                          ? `${freelance.first_name} ${freelance.last_name ? freelance.last_name.charAt(0) + '.' : ''}` 
                                          : `Candidat N°${freelance.freelance_id}`
                                        }
                                    </span>                                  
                                  </h3>
                                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap bg-white p-4 rounded-xl border border-gray-100 italic">
                                    <span>"{freelance.explication}"</span>
                                  </p>
                                </div>
                              </div>
                              
                              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end gap-4">
                                <button 
                                  onClick={() => { setSelectedFreelanceId(freelance.freelance_id); setIsMessageModalOpen(true); }}
                                  className="text-sm font-bold text-gray-500 hover:text-teal transition-colors flex items-center"
                                >
                                  <HiOutlineChatAlt2 className="mr-1 h-5 w-5" /> Envoyer un message
                                </button>
                                <button 
                                  onClick={() => { setSelectedFreelanceId(freelance.freelance_id); setIsCandidateModalOpen(true); }}
                                  className="text-sm font-black text-teal hover:text-coral transition-colors flex items-center"
                                >
                                  <HiUser className="mr-1 h-5 w-5" /> Voir le profil complet ➔
                                </button>
                              </div>

                            </div>
                          )) : <p className="text-gray-500 italic p-4 bg-gray-50 rounded-xl">L'IA n'a trouvé aucun profil correspondant.</p>}
                      </div>
                    </div>
                  )) : <div className="bg-white p-10 rounded-3xl text-center shadow-sm">Aucune recommandation disponible.</div>}
              </div>
            )}
          </>
        )}
        {activeView === "Messagerie" && (
          <>
            <header className="mb-10">
              <h1 className="text-2xl md:text-4xl font-black text-navy uppercase tracking-tight">Messagerie</h1>
              <p className="text-teal font-medium mt-2">Vos discussions en temps réel avec les candidats.</p>
            </header>
            
            {conversations.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl text-center shadow-sm border border-gray-100">
                <HiOutlineChatAlt2 className="mx-auto h-16 w-16 text-teal opacity-30 mb-4" />
                <h3 className="text-xl font-bold text-navy mb-2">Aucune conversation</h3>
                <p className="text-gray-500">Acceptez un candidat pour démarrer une discussion avec lui.</p>
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
                      <span className="text-xs font-bold text-teal bg-teal/5 px-2 py-1 rounded-md w-max mt-1 mb-1">
                        🏷️ Mission : {conv.job_title}
                      </span>
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

      <FreelanceProfileModal 
        show={isCandidateModalOpen} 
        onClose={() => setIsCandidateModalOpen(false)} 
        freelanceId={selectedFreelanceId} 
      />

      <Modal show={isMessageModalOpen} size="md" onClose={() => setIsMessageModalOpen(false)}>
        <div className="p-6 text-center bg-gray-50 rounded-lg">
          <HiOutlineChatAlt2 className="mx-auto mb-4 h-14 w-14 text-teal opacity-50" />
          <h3 className="mb-2 text-xl font-black text-navy">Messagerie Interne</h3>
          <p className="text-sm text-gray-500 mb-6">Le module de chat en direct pour contacter le candidat N°{selectedFreelanceId} arrive bientôt.</p>
          <button className="px-5 py-2 rounded-lg font-bold bg-coral text-white" onClick={() => setIsMessageModalOpen(false)}>Fermer</button>
        </div>
      </Modal>

        <DirectChatModal 
        show={isDirectChatOpen} 
        onClose={() => setIsDirectChatOpen(false)} 
        targetUserId={directChatUser}
        targetName={directChatName}
      />

    </div>
  );
}