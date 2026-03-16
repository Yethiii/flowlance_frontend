import React, { useState, useEffect } from 'react';
import { Card, Badge, Spinner, Modal, Textarea, Alert, Select } from 'flowbite-react';
import { 
  HiLocationMarker, HiBriefcase, HiOutlinePaperAirplane, HiInformationCircle, 
  HiCheckCircle, HiSearch, HiOfficeBuilding, HiGlobeAlt, HiUsers, HiPhone, HiIdentification
} from 'react-icons/hi';
import { 
  getAvailableJobOffers, applyToJob, getSectors, getCompanyProfileById, 
  getHardSkills, getSoftSkills, getMyApplications // <-- Nouveaux imports
} from '../services/api';

export default function FreelanceJobBoard() {
  const [offers, setOffers] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [hardSkillsList, setHardSkillsList] = useState([]);
  const [softSkillsList, setSoftSkillsList] = useState([]);
  const [myApplications, setMyApplications] = useState([]); // Historique des candidatures
  const [isLoading, setIsLoading] = useState(true);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("");

  // États pour LA LECTURE DE L'OFFRE EN GRAND
  const [viewedOffer, setViewedOffer] = useState(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  // États pour la candidature
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverMessage, setCoverMessage] = useState("");
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // États pour le profil Entreprise
  const [viewedCompany, setViewedCompany] = useState(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // On charge TOUTES les données en parallèle pour aller plus vite
      const [fetchedOffers, fetchedSectors, fetchedHard, fetchedSoft, fetchedApps] = await Promise.all([
        getAvailableJobOffers(),
        getSectors(),
        getHardSkills(),
        getSoftSkills(),
        getMyApplications()
      ]);
      setOffers(fetchedOffers);
      setSectors(fetchedSectors);
      setHardSkillsList(fetchedHard);
      setSoftSkillsList(fetchedSoft);
      setMyApplications(fetchedApps);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Vérifie si le freelance a déjà postulé à une offre donnée
  const hasAlreadyApplied = (offerId) => {
    return myApplications.some(app => app.job_offer === offerId);
  };

  // --- LOGIQUE DE FILTRAGE ---
  const filteredOffers = offers.filter(offer => {
    const matchesSearch = 
      (offer.offer_title?.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (offer.company_name?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSector = selectedSector === "" || offer.offer_sector?.toString() === selectedSector;
    
    return matchesSearch && matchesSector;
  });

  // --- ACTIONS ---
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
      const newApplication = await applyToJob(selectedOffer.id, coverMessage);
      setApplySuccess(true);
      
      // On ajoute la nouvelle candidature à la liste locale pour griser le bouton immédiatement
      setMyApplications([...myApplications, newApplication]);

      setTimeout(() => {
        setIsApplyModalOpen(false);
        setApplySuccess(false);
      }, 2000);
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
    } catch (error) {
      console.error("Erreur chargement entreprise", error);
    } finally {
      setIsLoadingCompany(false);
    }
  };

  if (isLoading) return <div className="flex justify-center my-20"><Spinner size="xl" /></div>;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black text-navy uppercase tracking-tight mb-2">Missions Disponibles</h2>
        <p className="text-teal font-medium">Trouvez la mission qui correspond à vos compétences et postulez en un clic.</p>
      </div>

      {/* --- BARRE DE FILTRES --- */}
      <div className="bg-white p-6 rounded-3xl shadow-lg border-t-4 border-t-teal mb-10 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <HiSearch className="w-5 h-5 text-teal" />
          </div>
          <input 
            type="text" 
            className="bg-gray-50 border border-gray-200 text-navy font-medium text-sm rounded-xl focus:ring-teal focus:border-teal block w-full pl-12 p-3.5 transition-colors"
            placeholder="Rechercher une mission, une entreprise..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:w-1/3 w-full">
          <Select 
            className="bg-gray-50 border-gray-200 text-navy rounded-xl p-1" 
            value={selectedSector} 
            onChange={(e) => setSelectedSector(e.target.value)}
          >
            <option value="">Tous les secteurs</option>
            {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
        </div>
      </div>

      {/* --- GRILLE DES OFFRES --- */}
      {filteredOffers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <HiSearch className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-navy mb-2">Aucune mission trouvée</h3>
          <p className="text-gray-500">Essayez de modifier vos filtres de recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map(offer => {
            const isApplied = hasAlreadyApplied(offer.id); // On vérifie si postulé
            
            return (
              <Card key={offer.id} className="hover:shadow-xl transition-all border-t-4 border-t-navy flex flex-col h-full bg-white relative">
                <div className="cursor-pointer flex-1" onClick={() => openOfferDetails(offer)}>
                  <div className="flex justify-between items-start mb-4">
                    <Badge color="info">Nouveau</Badge>
                    <span className="text-xs text-gray-400 font-medium">
                      {new Date(offer.offer_created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h5 className="text-xl font-black tracking-tight text-navy mb-2 line-clamp-2 hover:text-teal transition-colors">
                    {offer.offer_title}
                  </h5>
                  
                  <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openCompanyProfile(offer.offer_company); }}
                      className="flex items-center text-left hover:text-coral transition-colors w-max"
                    >
                      <HiBriefcase className="mr-2 text-coral h-5 w-5"/> 
                      <span className="font-bold underline decoration-transparent hover:decoration-coral transition-colors">
                        {offer.company_name || "Entreprise Confidentielle"}
                      </span>
                    </button>
                    <div className="flex items-center">
                      <HiLocationMarker className="mr-2 text-gray-400 h-5 w-5"/> 
                      {offer.offer_location || 'Non spécifié'}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-3 mb-6">
                    {offer.offer_description}
                  </p>
                </div>
                
                {/* --- BOUTON POSTULER (DYNAMIQUE) --- */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                  {isApplied ? (
                    <button disabled className="w-full bg-gray-100 text-gray-400 font-bold py-3 rounded-xl flex justify-center items-center cursor-not-allowed">
                      <HiCheckCircle className="mr-2 h-5 w-5" />
                      CANDIDATURE ENVOYÉE
                    </button>
                  ) : (
                    <button 
                      onClick={() => openApplyModal(offer)} 
                      className="w-full bg-coral text-white font-black py-3 rounded-xl hover:scale-105 hover:shadow-lg transition-transform flex justify-center items-center shadow-md"
                    >
                      <HiOutlinePaperAirplane className="mr-2 h-5 w-5 rotate-90" />
                      POSTULER
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* --- MODALE LECTURE DE L'OFFRE COMPLÈTE --- */}
      <Modal show={isOfferModalOpen} size="3xl" onClose={() => setIsOfferModalOpen(false)}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-lg">
          <h3 className="text-xl font-bold text-navy">Détails de la mission</h3>
          <button onClick={() => setIsOfferModalOpen(false)} className="text-gray-400 hover:text-coral font-bold text-xl px-2">X</button>
        </div>
        <div className="p-8 bg-gray-50 max-h-[70vh] overflow-y-auto">
          {viewedOffer && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h1 className="text-3xl font-black text-navy mb-4">{viewedOffer.offer_title}</h1>
              
              <div className="flex flex-wrap gap-6 text-sm font-medium text-gray-600 mb-8 pb-6 border-b border-gray-100">
                <button 
                  onClick={() => openCompanyProfile(viewedOffer.offer_company)}
                  className="flex items-center hover:text-coral transition-colors"
                >
                  <HiBriefcase className="mr-2 text-coral h-5 w-5"/> 
                  <span className="font-bold underline">{viewedOffer.company_name || "Entreprise Confidentielle"}</span>
                </button>
                <div className="flex items-center"><HiLocationMarker className="mr-2 text-coral h-5 w-5"/> {viewedOffer.offer_location || 'Non spécifié'}</div>
              </div>

              {/* NOUVEAU : AFFICHAGE DES SKILLS */}
              {(viewedOffer.offer_hardskills?.length > 0 || viewedOffer.offer_softskills?.length > 0) && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-navy mb-3">Compétences recherchées</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewedOffer.offer_hardskills?.map(id => (
                      <Badge key={`hard-${id}`} color="info" size="sm">
                        {hardSkillsList.find(s => s.id === id)?.name || id}
                      </Badge>
                    ))}
                    {viewedOffer.offer_softskills?.map(id => (
                      <Badge key={`soft-${id}`} color="purple" size="sm">
                        {softSkillsList.find(s => s.id === id)?.name || id}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                {viewedOffer.offer_description}
              </div>

              <div className="mt-10 flex justify-center border-t border-gray-100 pt-8">
                {hasAlreadyApplied(viewedOffer.id) ? (
                  <button disabled className="px-10 py-4 bg-gray-200 text-gray-500 font-black rounded-xl cursor-not-allowed flex items-center">
                    <HiCheckCircle className="mr-2 h-5 w-5" />
                    CANDIDATURE ENVOYÉE
                  </button>
                ) : (
                  <button 
                    onClick={() => openApplyModal(viewedOffer)}
                    className="px-10 py-4 bg-coral text-white font-black rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center"
                  >
                    <HiOutlinePaperAirplane className="mr-2 h-5 w-5 rotate-90" />
                    POSTULER À CETTE MISSION
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* --- MODALE DE CANDIDATURE --- */}
      <Modal show={isApplyModalOpen} size="lg" onClose={() => !isApplying && setIsApplyModalOpen(false)}>
        <div className="p-6 border-b border-gray-100 flex justify-between bg-white rounded-t-lg">
          <h3 className="text-xl font-black text-navy">Envoyer ma candidature</h3>
          <button onClick={() => !isApplying && setIsApplyModalOpen(false)} className="text-gray-400 hover:text-coral">X</button>
        </div>
        
        <div className="p-6 bg-gray-50">
          {selectedOffer && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">Vous postulez pour :</p>
              <p className="text-lg font-bold text-teal">{selectedOffer.offer_title}</p>
            </div>
          )}

          {applySuccess ? (
            <Alert color="success" icon={HiCheckCircle}>
              <span className="font-medium">Félicitations !</span> Votre candidature a bien été envoyée à l'entreprise.
            </Alert>
          ) : (
            <>
              {applyError && (
                <Alert color="failure" icon={HiInformationCircle} className="mb-4">
                  <span className="font-medium">Oups !</span> {applyError}
                </Alert>
              )}
              <label className="block text-sm font-bold text-navy mb-2">Message d'accompagnement (Optionnel)</label>
              <Textarea rows={4} value={coverMessage} onChange={(e) => setCoverMessage(e.target.value)} placeholder="Un petit mot pour vous démarquer..." />
            </>
          )}
        </div>

        {!applySuccess && (
          <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white rounded-b-lg">
            <button onClick={() => setIsApplyModalOpen(false)} disabled={isApplying} className="px-5 py-2.5 rounded-lg font-bold text-gray-600 hover:bg-gray-100">Annuler</button>
            <button onClick={handleApply} disabled={isApplying} className="px-6 py-2.5 rounded-lg font-bold text-white bg-coral shadow-md hover:scale-105 transition-transform flex items-center">
              {isApplying ? <Spinner size="sm" className="mr-2" /> : <HiOutlinePaperAirplane className="mr-2 h-4 w-4 rotate-90" />} POSTULER
            </button>
          </div>
        )}
      </Modal>

      {/* --- MODALE DU PROFIL ENTREPRISE --- */}
      <Modal show={isCompanyModalOpen} size="2xl" onClose={() => setIsCompanyModalOpen(false)}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-lg">
          <h3 className="text-2xl font-black text-navy flex items-center">
            <HiOfficeBuilding className="mr-3 text-coral h-6 w-6" /> 
            Profil de l'entreprise
          </h3>
          <button onClick={() => setIsCompanyModalOpen(false)} className="text-gray-400 hover:text-coral font-black text-xl px-2">X</button>
        </div>
        
        <div className="p-8 bg-gray-50 max-h-[80vh] overflow-y-auto">
          {isLoadingCompany ? (
            <div className="flex justify-center py-10"><Spinner size="xl" /></div>
          ) : viewedCompany ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              
              <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-6">
                {viewedCompany.company_logo ? (
                  <img src={viewedCompany.company_logo} alt="Logo" className="w-20 h-20 object-cover rounded-xl shadow-sm border border-gray-200" />
                ) : (
                  <div className="w-20 h-20 bg-teal/10 rounded-xl flex items-center justify-center text-teal font-bold text-2xl">
                    {viewedCompany.company_name?.charAt(0) || "🏢"}
                  </div>
                )}
                <div>
                  <h4 className="text-3xl font-black text-navy">{viewedCompany.company_name}</h4>
                  <Badge color="gray" className="w-max mt-2">Flowlance Vérifié</Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center text-gray-700 text-sm">
                  <HiUsers className="mr-3 text-teal h-5 w-5" />
                  <span className="font-bold mr-1">Taille :</span> {viewedCompany.company_size || "Non précisée"}
                </div>
                {viewedCompany.company_website && (
                  <div className="flex items-center text-gray-700 text-sm">
                    <HiGlobeAlt className="mr-3 text-teal h-5 w-5" />
                    <a href={viewedCompany.company_website} target="_blank" rel="noreferrer" className="text-coral hover:underline font-bold">
                      Site Internet
                    </a>
                  </div>
                )}
                {viewedCompany.company_phone && (
                  <div className="flex items-center text-gray-700 text-sm">
                    <HiPhone className="mr-3 text-teal h-5 w-5" />
                    <span className="font-bold mr-1">Tél :</span> <a href={`tel:${viewedCompany.company_phone}`} className="hover:text-coral">{viewedCompany.company_phone}</a>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <h5 className="font-bold text-navy mb-3 text-lg">Présentation</h5>
                <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed bg-gray-50 p-5 rounded-xl border border-gray-100">
                  {viewedCompany.company_description || "Cette entreprise n'a pas encore rédigé de description."}
                </p>
              </div>

              <div className="bg-teal/5 p-5 rounded-xl border border-teal/20">
                <h5 className="font-bold text-teal mb-3 flex items-center">
                  <HiIdentification className="mr-2 h-5 w-5" /> Informations légales & Adresse
                </h5>
                <div className="text-sm text-gray-600 space-y-2">
                  <p><span className="font-bold text-navy">Siège :</span> {viewedCompany.company_street} {viewedCompany.company_number}, {viewedCompany.company_postcode} {viewedCompany.company_city} ({viewedCompany.company_country})</p>
                  <p><span className="font-bold text-navy">TVA :</span> {viewedCompany.company_TVA || 'Non renseigné'}</p>
                  <p><span className="font-bold text-navy">BCE :</span> {viewedCompany.company_BCE || 'Non renseigné'}</p>
                </div>
              </div>

            </div>
          ) : (
            <Alert color="failure">Impossible de charger les données de cette entreprise.</Alert>
          )}
        </div>
      </Modal>

    </div>
  );
}