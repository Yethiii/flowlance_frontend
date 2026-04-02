import React, { useState, useEffect } from 'react';
import { Button, TextInput, Textarea, Select, Spinner, Modal, Badge, 
        Card, Alert, Checkbox } from 'flowbite-react';
import { 
  HiPlus, HiPencilAlt, HiTrash, HiEye, HiSparkles, HiLocationMarker, HiBriefcase, HiX,
  HiInformationCircle, 
} from 'react-icons/hi';
import { 
  getMyJobOffers, createJobOffer, updateJobOffer, deleteJobOffer, generateJobDescriptionAI, 
  getSectors, getHardSkills, getSoftSkills 
} from '../services/api';

export default function CompanyJobOffers() {
  const [offers, setOffers] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [hardSkillsList, setHardSkillsList] = useState([]);
  const [softSkillsList, setSoftSkillsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    offer_title: '',
    offer_sector: '',
    offer_location: '',
    offer_description: '',
    offer_hardskills: [],
    offer_softskills: [], 
    offer_is_active: true
  });

  const [selectedHardSkill, setSelectedHardSkill] = useState("");
  const [selectedSoftSkill, setSelectedSoftSkill] = useState("");

  const [aiKeywords, setAiKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [fetchedOffers, fetchedSectors, fetchedHard, fetchedSoft] = await Promise.all([
        getMyJobOffers(),
        getSectors(),
        getHardSkills(),
        getSoftSkills()
      ]);
      setOffers(fetchedOffers);
      setSectors(fetchedSectors);
      setHardSkillsList(fetchedHard);
      setSoftSkillsList(fetchedSoft);
    } catch (error) {
      console.error("Erreur de chargement", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenForm = (offer = null) => {
    setFormError("");
    if (offer) {
      setFormData({
        offer_title: offer.offer_title || '',
        offer_sector: offer.offer_sector || '',
        offer_location: offer.offer_location || '',
        offer_description: offer.offer_description || '',
        offer_hardskills: offer.offer_hardskills || [],
        offer_softskills: offer.offer_softskills || [],
        offer_is_active: offer.offer_is_active !== undefined ? offer.offer_is_active : true 
      });
      setSelectedOffer(offer);
    } else {
      setFormData({ 
        offer_title: '', offer_sector: '', offer_location: '', offer_description: '',
        offer_hardskills: [], offer_softskills: [],
        offer_is_active: true 
      });
      setSelectedOffer(null);
    }
    setAiKeywords('');
    setSelectedHardSkill("");
    setSelectedSoftSkill("");
    setIsFormModalOpen(true);
  };

  const handleAddHardSkill = () => {
    if (selectedHardSkill && !formData.offer_hardskills.includes(parseInt(selectedHardSkill))) {
      setFormData({ ...formData, offer_hardskills: [...formData.offer_hardskills, parseInt(selectedHardSkill)] });
      setSelectedHardSkill("");
    }
  };

  const handleRemoveHardSkill = (idToRemove) => {
    setFormData({ ...formData, offer_hardskills: formData.offer_hardskills.filter(id => id !== idToRemove) });
  };

  const handleAddSoftSkill = () => {
    if (selectedSoftSkill && !formData.offer_softskills.includes(parseInt(selectedSoftSkill))) {
      setFormData({ ...formData, offer_softskills: [...formData.offer_softskills, parseInt(selectedSoftSkill)] });
      setSelectedSoftSkill("");
    }
  };

  const handleRemoveSoftSkill = (idToRemove) => {
    setFormData({ ...formData, offer_softskills: formData.offer_softskills.filter(id => id !== idToRemove) });
  };

  const handleSave = async () => {
    setFormError("");

    if (!formData.offer_title || !formData.offer_sector || !formData.offer_location || !formData.offer_description) {
      setFormError("Veuillez remplir tous les champs obligatoires marqués d'un astérisque.");
      return; 
    }

    const payload = { ...formData };
    payload.offer_sector = parseInt(payload.offer_sector);

    try {
      if (selectedOffer) {
        await updateJobOffer(selectedOffer.id, payload);
      } else {
        await createJobOffer(payload);
      }
      setIsFormModalOpen(false);
      fetchData(); 
    } catch (error) {
      console.error("Erreur lors de la sauvegarde", error);
      setFormError("Une erreur est survenue lors de la sauvegarde avec le serveur.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      try {
        await deleteJobOffer(id);
        fetchData();
      } catch (error) {
        console.error("Erreur suppression", error);
      }
    }
  };

  const handleGenerateAI = async () => {
    if (!aiKeywords) return alert("Veuillez entrer quelques mots-clés d'abord.");
    setIsGenerating(true);
    try {
      const response = await generateJobDescriptionAI(aiKeywords);
      
      if (response.generated_description) {
        setFormData({ ...formData, offer_description: response.generated_description });
      } else {
        alert("L'IA n'a pas renvoyé de texte.");
      }
      
    } catch (error) {
      console.error("Erreur IA", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) return <div className="flex justify-center my-20"><Spinner size="xl" /></div>;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-navy uppercase tracking-tight">Mes Annonces</h2>
          <p className="text-teal font-medium">Gérez vos offres et recrutez les meilleurs freelances.</p>
        </div>
        <button 
          onClick={() => handleOpenForm()} 
          className="bg-coral text-white font-black px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center"
        >
          <HiPlus className="mr-2 h-5 w-5" /> NOUVELLE ANNONCE
        </button>
      </div>

      {offers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <HiBriefcase className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-navy mb-2">Aucune annonce publiée</h3>
          <p className="text-gray-500">Créez votre première annonce pour commencer à recevoir des candidatures.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map(offer => (
            <Card key={offer.id} className="hover:shadow-xl transition-shadow border-t-4 border-t-coral flex flex-col h-full">
              <div className="flex justify-between items-start mb-2">
                <Badge color={offer.offer_is_active ? "success" : "gray"}>
                  {offer.offer_is_active ? "Active" : "Clôturée"}
                </Badge>
                <span className="text-xs text-gray-400">
                  {new Date(offer.offer_created_at).toLocaleDateString()}
                </span>
              </div>
              <h5 className="text-xl font-bold tracking-tight text-navy mb-2 line-clamp-2">
                {offer.offer_title}
              </h5>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <HiLocationMarker className="mr-1 text-coral"/> {offer.offer_location || 'Non spécifié'}
              </div>
              
              <div className="flex justify-between mt-auto pt-4 border-t border-gray-100">
                <button onClick={() => { setSelectedOffer(offer); setIsPreviewModalOpen(true); }} className="text-teal hover:text-navy transition-colors p-2" title="Aperçu">
                  <HiEye className="h-5 w-5" />
                </button>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenForm(offer)} className="text-gray-400 hover:text-coral transition-colors p-2" title="Modifier">
                    <HiPencilAlt className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDelete(offer.id)} className="text-gray-400 hover:text-red-600 transition-colors p-2" title="Supprimer">
                    <HiTrash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal show={isFormModalOpen} size="4xl" onClose={() => setIsFormModalOpen(false)}>
        <div className="p-6 max-h-[70vh] overflow-y-auto bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {formError && (
              <div className="md:col-span-2">
                <Alert color="failure" icon={HiInformationCircle}>
                  <span className="font-medium">Erreur !</span> {formError}
                </Alert>
              </div>
            )}

            <div className="md:col-span-2 flex items-start p-4 bg-gray-50 border border-gray-200 rounded-xl mb-4 shadow-sm hover:bg-gray-100 transition-colors">
              <div className="flex items-center h-5">
                <Checkbox 
                  id="offer_active" 
                  checked={formData.offer_is_active}
                  onChange={(e) => setFormData({ ...formData, offer_is_active: e.target.checked })}
                  className="w-5 h-5 text-teal focus:ring-teal rounded border-gray-300 cursor-pointer"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="offer_active" className="font-bold text-navy cursor-pointer">
                  Active
                </label>
                <p className="text-gray-500 text-xs mt-1">
                  Décochez cette case si vous souhaitez désactiver l'annonce, elle ne sera plus visible par le candidat.  
                </p>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-navy mb-2">
                Titre de la mission <span className="text-coral text-lg">*</span>
              </label>
              <TextInput value={formData.offer_title} onChange={(e) => setFormData({...formData, offer_title: e.target.value})} placeholder="Ex: Développeur React Senior" required />
            </div>

            <div>
              <label className="block text-sm font-bold text-navy mb-2">
                Secteur d'activité <span className="text-coral text-lg">*</span>
              </label>
              <Select value={formData.offer_sector} onChange={(e) => setFormData({...formData, offer_sector: e.target.value})} required>
                <option value="">Sélectionnez un secteur...</option>
                {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-bold text-navy mb-2">
                Localisation (ou Télétravail) <span className="text-coral text-lg">*</span>
              </label>
              <TextInput value={formData.offer_location} onChange={(e) => setFormData({...formData, offer_location: e.target.value})} placeholder="Ex: Bruxelles (Hybride)" required />
            </div>

            <div>
              <label className="block text-sm font-bold text-navy mb-2">Hard Skills requises</label>
              <div className="flex gap-2 mb-3">
                <Select value={selectedHardSkill} onChange={(e) => setSelectedHardSkill(e.target.value)} className="flex-1">
                  <option value="">Ajouter une compétence technique...</option>
                  {hardSkillsList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Select>
                <button onClick={handleAddHardSkill} className="bg-navy text-white px-3 rounded-lg hover:bg-teal transition-colors">
                  <HiPlus />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.offer_hardskills.map(id => (
                  <Badge key={id} color="info" className="flex items-center px-2 py-1">
                    {hardSkillsList.find(s => s.id === id)?.name || id}
                    <HiX className="ml-2 cursor-pointer text-gray-500 hover:text-red-500" onClick={() => handleRemoveHardSkill(id)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-navy mb-2">Soft Skills requises</label>
              <div className="flex gap-2 mb-3">
                <Select value={selectedSoftSkill} onChange={(e) => setSelectedSoftSkill(e.target.value)} className="flex-1">
                  <option value="">Ajouter un atout...</option>
                  {softSkillsList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Select>
                <button onClick={handleAddSoftSkill} className="bg-navy text-white px-3 rounded-lg hover:bg-teal transition-colors">
                  <HiPlus />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.offer_softskills.map(id => (
                  <Badge key={id} color="purple" className="flex items-center px-2 py-1">
                    {softSkillsList.find(s => s.id === id)?.name || id}
                    <HiX className="ml-2 cursor-pointer text-gray-500 hover:text-red-500" onClick={() => handleRemoveSoftSkill(id)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 mt-4 p-5 bg-teal/5 border border-teal/20 rounded-2xl">
              <h4 className="flex items-center text-teal font-bold mb-3"><HiSparkles className="mr-2 h-5 w-5" /> Générateur IA Flowlance</h4>
              <p className="text-xs text-gray-500 mb-3">Saisissez quelques mots-clés et laissez notre IA rédiger une annonce professionnelle et attractive.</p>
              <div className="flex gap-3">
                <TextInput className="flex-1" value={aiKeywords} onChange={(e) => setAiKeywords(e.target.value)} placeholder="Ex: admin sys, linux, docker, 3 mois, remote..." />
                
                <button 
                  type="button" 
                  onClick={handleGenerateAI} 
                  disabled={isGenerating}
                  className={`bg-navy text-white font-bold px-6 rounded-lg transition-all duration-200 flex items-center justify-center min-w-[140px] shadow-md ${
                    isGenerating 
                      ? 'opacity-70 cursor-wait' 
                      : 'hover:bg-teal hover:scale-105 hover:shadow-lg'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Création...
                    </>
                  ) : (
                    <>
                      <HiSparkles className="mr-2 h-5 w-5" />
                      Générer
                    </>
                  )}
                </button>

              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-navy mb-2">
                Description complète <span className="text-coral text-lg">*</span>
              </label>
              <Textarea rows={10} value={formData.offer_description} onChange={(e) => setFormData({...formData, offer_description: e.target.value})} placeholder="Détaillez les missions, le profil recherché..." required />
            </div>

          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-4 rounded-b-lg">
          <button onClick={() => setIsFormModalOpen(false)} className="px-5 py-2.5 rounded-lg font-bold bg-gray-200 text-navy hover:bg-gray-300 transition-colors">
            Annuler
          </button>
          <button onClick={handleSave} className="px-5 py-2.5 rounded-lg font-bold text-white shadow-md hover:scale-105 transition-transform" style={{ backgroundColor: '#CE6A6B' }}>
            {selectedOffer ? "Enregistrer les modifications" : "Publier l'annonce"}
          </button>
        </div>
      </Modal>

      <Modal show={isPreviewModalOpen} size="3xl" onClose={() => setIsPreviewModalOpen(false)}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white rounded-t-lg">
          <h3 className="text-xl font-bold text-navy">Aperçu de l'annonce</h3>
          <button onClick={() => setIsPreviewModalOpen(false)} className="text-gray-400 hover:text-navy font-bold text-xl px-2">X</button>
        </div>
        
        <div className="p-8 bg-gray-50 max-h-[70vh] overflow-y-auto">
          {selectedOffer && (
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative">
              <div className="mb-6 border-b border-gray-100 pb-6">
                <div className="flex gap-2 mb-3">
                  <Badge color="info">
                    {sectors.find(s => s.id === parseInt(selectedOffer.offer_sector))?.name || "Secteur non défini"}
                  </Badge>
                  <Badge color="gray">Flowlance Vérifié</Badge>
                </div>
                <h1 className="text-3xl font-black text-navy mb-4">{selectedOffer.offer_title}</h1>
                
                <div className="flex flex-wrap gap-6 text-sm font-medium text-gray-600">
                  <div className="flex items-center"><HiBriefcase className="mr-2 text-coral h-5 w-5"/> {selectedOffer.company_name || "Votre Entreprise"}</div>
                  <div className="flex items-center"><HiLocationMarker className="mr-2 text-coral h-5 w-5"/> {selectedOffer.offer_location || 'Non spécifié'}</div>
                </div>
              </div>

              {(selectedOffer.offer_hardskills?.length > 0 || selectedOffer.offer_softskills?.length > 0) && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-navy mb-3">Compétences recherchées</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedOffer.offer_hardskills?.map(id => (
                      <Badge key={`hard-${id}`} color="info">
                        {hardSkillsList.find(s => s.id === id)?.name || id}
                      </Badge>
                    ))}
                    {selectedOffer.offer_softskills?.map(id => (
                      <Badge key={`soft-${id}`} color="purple">
                        {softSkillsList.find(s => s.id === id)?.name || id}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="prose max-w-none text-gray-700">
                <h3 className="text-lg font-bold text-navy mb-3">Description de la mission</h3>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {selectedOffer.offer_description}
                </div>
              </div>

              <div className="mt-10 flex justify-center pb-6">
                <button disabled className="px-8 py-3 rounded-xl font-black text-white bg-sage opacity-50 cursor-not-allowed shadow-md">
                  POSTULER À CETTE MISSION
                </button>
                <p className="w-full text-center text-xs text-gray-400 mt-2 absolute bottom-2 left-0">Ceci est un aperçu. Le bouton postuler est désactivé.</p>
              </div>
            </div>
          )}
        </div>
      </Modal>

    </div>
  );
}