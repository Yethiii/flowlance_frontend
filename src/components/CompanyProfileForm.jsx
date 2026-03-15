import React, { useState, useEffect } from 'react';
import { Button, TextInput, Select, Textarea, Spinner, Tabs, Modal, FileInput, Badge } from 'flowbite-react';
import { 
  HiOfficeBuilding, HiLocationMarker, HiBriefcase, HiExclamationCircle, 
  HiUpload, HiTrash, HiPlusCircle 
} from 'react-icons/hi';
import { 
  getCompanyProfile, updateCompanyProfile, deactivateCompanyAccount, deleteCompanyAccount 
} from '../services/api';

// Assure-toi d'avoir une fonction getSectors dans ton api.js (comme pour les freelances)
import { getSectors } from '../services/api';

export default function CompanyProfileForm() {
  const [profileId, setProfileId] = useState(null);
  const [isActive, setIsActive] = useState(false);
  
  // Onglet 1 : Identité & Contact
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState("1-10");
  const [companyDescription, setCompanyDescription] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyLinkedin, setCompanyLinkedin] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [existingLogoUrl, setExistingLogoUrl] = useState(null);

  // Onglet 2 : Siège & Légal
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [postcode, setPostcode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Belgique");
  const [tva, setTva] = useState("");
  const [bce, setBce] = useState("");

  // Onglet 3 : Secteurs
  const [availableSectors, setAvailableSectors] = useState([]);
  const [mySectors, setMySectors] = useState([]); // Tableau d'IDs
  const [selectedSector, setSelectedSector] = useState("");

  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, sectors] = await Promise.all([
          getCompanyProfile(),
          getSectors()
        ]);
        
        setAvailableSectors(sectors);

        if (profile) {
          setProfileId(profile.id);
          setIsActive(profile.company_is_active || false);
          
          setCompanyName(profile.company_name || "");
          setCompanySize(profile.company_size || "1-10");
          setCompanyDescription(profile.company_description || "");
          setCompanyPhone(profile.company_phone || "");
          setCompanyWebsite(profile.company_website || "");
          setCompanyLinkedin(profile.company_linkedin || "");
          setExistingLogoUrl(profile.company_logo || null);

          setStreet(profile.company_street || "");
          setNumber(profile.company_number || "");
          setPostcode(profile.company_postcode || "");
          setCity(profile.company_city || "");
          setCountry(profile.company_country || "Belgique");
          setTva(profile.company_TVA || "");
          setBce(profile.company_BCE || "");

          setMySectors(profile.company_sectors || []);
        }
      } catch (error) {
        console.error("Erreur de chargement", error);
        setMessage({ text: "Erreur lors du chargement de votre profil.", type: "error" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    const formData = new FormData();
    formData.append('company_name', companyName);
    formData.append('company_size', companySize);
    formData.append('company_description', companyDescription);
    formData.append('company_phone', companyPhone);
    
    if (companyWebsite && companyWebsite.trim() !== "") {
      let finalWebsite = companyWebsite.trim();
      if (!finalWebsite.startsWith("http://") && !finalWebsite.startsWith("https://")) {
        finalWebsite = "https://" + finalWebsite;
      }
      formData.append('company_website', finalWebsite);
    } else {
      formData.append('company_website', ""); // On envoie vide proprement
    }

    if (companyLinkedin && companyLinkedin.trim() !== "") {
      let finalLinkedin = companyLinkedin.trim();
      if (!finalLinkedin.startsWith("http://") && !finalLinkedin.startsWith("https://")) {
        finalLinkedin = "https://" + finalLinkedin;
      }
      formData.append('company_linkedin', finalLinkedin);
    } else {
      formData.append('company_linkedin', ""); 
    }
    
    formData.append('company_street', street);
    formData.append('company_number', number);
    formData.append('company_postcode', postcode);
    formData.append('company_city', city);
    formData.append('company_country', country);
    formData.append('company_TVA', tva);
    formData.append('company_BCE', bce);

    // Ajout des secteurs (Django va traiter ça via la vue)
    mySectors.forEach(sectorId => {
      formData.append('company_sectors', sectorId);
    });

    if (logoFile) {
      formData.append('company_logo', logoFile);
    }

    try {
      const updatedProfile = await updateCompanyProfile(profileId, formData);
      setExistingLogoUrl(updatedProfile.company_logo);
      setLogoFile(null); // On reset le fichier après upload
      setMessage({ text: "Profil entreprise sauvegardé avec succès !", type: "success" });
      window.scrollTo(0, 0);
    } catch (error) {
      setMessage({ text: "Erreur lors de la sauvegarde.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSector = () => {
    if (selectedSector && !mySectors.includes(parseInt(selectedSector))) {
      setMySectors([...mySectors, parseInt(selectedSector)]);
      setSelectedSector("");
    }
  };

  const executeDeactivate = async () => {
    setShowDeactivateModal(false);
    try {
      await deactivateCompanyAccount();
      window.location.reload(); 
    } catch (error) {
      alert("Erreur lors de la suspension.");
    }
  };

  const executeDelete = async () => {
    setShowDeleteModal(false);
    try {
      await deleteCompanyAccount();
      localStorage.removeItem("token"); 
      window.location.href = '/'; 
    } catch (error) {
      alert("Erreur lors de la suppression.");
    }
  };

  if (isLoading) return <div className="flex justify-center my-20"><Spinner size="xl" /></div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-3xl mt-10 mb-20">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
        <div className="p-4 rounded-full" style={{ backgroundColor: '#CE6A6B', color: 'white' }}>
          <HiOfficeBuilding className="text-3xl" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-navy">Espace Entreprise</h2>
          <p className="text-gray-500 text-sm">Gérez l'identité et les informations de votre société.</p>
        </div>
      </div>

      {/* BANNIÈRE D'AVERTISSEMENT (Visible uniquement si inactif) */}
      {!isActive && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-r-xl shadow-sm flex items-start">
          <HiExclamationCircle className="h-6 w-6 mr-3 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-sm">Votre compte entreprise est en attente d'activation.</h3>
            <p className="text-xs mt-1 text-yellow-700">
              Veuillez compléter votre profil à 100%. Un administrateur vérifiera les informations de votre entreprise avant de vous autoriser à publier des annonces.
            </p>
          </div>
        </div>
      )}

      {/* ALERTE DE SAUVEGARDE */}
      {message.text && (
        <div className={`p-4 mb-6 rounded-xl font-bold text-sm ${message.type === 'success' ? 'bg-sage/20 text-sage' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* ONGLETS */}
    <Tabs aria-label="Company Profile Tabs" className="mb-6">        
        {/* --- ONGLET 1 : IDENTITÉ --- */}
        <Tabs.Item active title="Identité & Contact" icon={HiOfficeBuilding}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-navy mb-2">Logo de l'entreprise</label>
              {existingLogoUrl && (
                <div className="mb-4">
                  <img src={existingLogoUrl} alt="Logo" className="h-24 w-24 object-cover rounded-xl border border-gray-200 shadow-sm" />
                </div>
              )}
              <FileInput accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} />
            </div>

            <div>
              <label className="block text-sm font-bold text-navy mb-2">Nom de l'entreprise <span className="text-coral">*</span></label>
              <TextInput value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-navy mb-2">Taille de l'entreprise</label>
              <Select value={companySize} onChange={(e) => setCompanySize(e.target.value)}>
                <option value="1-10">1-10 employés</option>
                <option value="11-50">11-50 employés</option>
                <option value="51-200">51-200 employés</option>
                <option value="201-500">201-500 employés</option>
                <option value="500+">Plus de 500 employés</option>
              </Select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-navy mb-2">Description / Présentation <span className="text-coral">*</span></label>
              <Textarea rows={4} value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} placeholder="Présentez votre entreprise, votre culture..." required />
            </div>

            <div>
              <label className="block text-sm font-bold text-navy mb-2">Téléphone</label>
              <TextInput value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} placeholder="+32 4..."/>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-navy mb-2">Site Web</label>
              <TextInput value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} placeholder="https://..."/>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-navy mb-2">Page LinkedIn</label>
              <TextInput value={companyLinkedin} onChange={(e) => setCompanyLinkedin(e.target.value)} placeholder="https://linkedin.com/company/..."/>
            </div>
          </div>

          {/* ZONE DANGER (VISIBLE SUR LE PREMIER ONGLET) */}
          <div className="mt-12 pt-6 border-t border-red-100">
            <h3 className="text-lg font-black text-red-800 mb-4">Gestion du compte</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              {isActive && (
                <button onClick={() => setShowDeactivateModal(true)} className="px-6 py-2.5 rounded-xl font-bold bg-white border-2 transition-transform hover:scale-105" style={{ color: '#CE6A6B', borderColor: '#CE6A6B' }}>
                  Suspendre le compte
                </button>
              )}
              <button onClick={() => setShowDeleteModal(true)} className="px-6 py-2.5 rounded-xl font-bold text-white transition-transform hover:scale-105" style={{ backgroundColor: '#CE6A6B' }}>
                Supprimer le compte
              </button>
            </div>
          </div>
        </Tabs.Item>

        {/* --- ONGLET 2 : SIÈGE & LÉGAL --- */}
        <Tabs.Item title="Siège & Légal" icon={HiLocationMarker}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            
            <div className="md:col-span-2">
              <h3 className="text-lg font-black text-navy mb-2">Adresse du Siège Social</h3>
            </div>

            <div>
              <label className="block text-sm font-bold text-navy mb-2">Rue</label>
              <TextInput value={street} onChange={(e) => setStreet(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-navy mb-2">Numéro / Boîte</label>
              <TextInput value={number} onChange={(e) => setNumber(e.target.value)} />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-navy mb-2">Code Postal</label>
              <TextInput value={postcode} onChange={(e) => setPostcode(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-navy mb-2">Ville</label>
              <TextInput value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-navy mb-2">Pays</label>
              <TextInput value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>

            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-black text-navy mb-2">Informations Légales</h3>
            </div>

            <div>
              <label className="block text-sm font-bold text-navy mb-2">Numéro de TVA</label>
              <TextInput value={tva} onChange={(e) => setTva(e.target.value)} placeholder="BE0123456789"/>
            </div>
            <div>
              <label className="block text-sm font-bold text-navy mb-2">Numéro BCE</label>
              <TextInput value={bce} onChange={(e) => setBce(e.target.value)} placeholder="0123.456.789"/>
            </div>
          </div>
        </Tabs.Item>

        {/* --- ONGLET 3 : SECTEURS --- */}
        <Tabs.Item title="Secteurs d'activité" icon={HiBriefcase}>
          <div className="mt-4">
            <h3 className="text-lg font-black text-navy mb-4">Dans quels secteurs recrutez-vous ?</h3>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Select className="flex-1" value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)}>
                <option value="">Sélectionnez un secteur...</option>
                {availableSectors.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </Select>
              <button 
                onClick={handleAddSector}
                className="px-5 py-2.5 rounded-xl font-bold text-white text-sm shadow-md transition-transform hover:scale-105 flex items-center justify-center w-full md:w-auto"
                style={{ backgroundColor: '#CE6A6B' }}
              >
                <HiPlusCircle className="mr-2 h-5 w-5" /> Ajouter
              </button>
            </div>

            {/* Affichage des secteurs sous forme de badges */}
            <div className="flex flex-wrap gap-3 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              {mySectors.length === 0 ? (
                <p className="text-gray-500 text-sm italic">Aucun secteur sélectionné pour le moment.</p>
              ) : (
                mySectors.map(id => {
                  const sectorName = availableSectors.find(s => s.id === id)?.name;
                  return (
                    <div key={id} className="bg-white border border-gray-200 px-4 py-2 rounded-xl flex items-center shadow-sm hover:shadow-md transition-all">
                      <span className="font-black text-navy mr-2">{sectorName}</span>
                      <Badge color="success">Actif</Badge>
                      <HiTrash 
                        className="cursor-pointer ml-3 text-gray-400 hover:text-coral transition-colors text-lg" 
                        onClick={() => setMySectors(mySectors.filter(sId => sId !== id))} 
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </Tabs.Item>

      </Tabs>

      {/* BOUTON DE SAUVEGARDE GLOBAL */}
      <div className="mt-8 flex justify-end">
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full md:w-auto px-8 py-3 rounded-xl font-black text-white shadow-lg transition-transform hover:scale-105 flex items-center justify-center"
          style={{ backgroundColor: '#CE6A6B' }}
        >
          {isSaving ? <Spinner size="sm" className="mr-3"/> : "SAUVEGARDER L'ENTREPRISE"}
        </button>
      </div>

      {/* MODALS DE CONFIRMATION */}
      <Modal show={showDeactivateModal} size="md" popup onClose={() => setShowDeactivateModal(false)}>
        <div className="p-6 text-center">
          <HiExclamationCircle className="mx-auto mb-4 h-14 w-14 mt-4" style={{ color: '#CE6A6B' }} />
          <h3 className="mb-5 text-lg font-bold text-navy">Suspendre votre entreprise ?</h3>
          <p className="text-sm text-gray-500 mb-6">Vos offres d'emploi seront masquées, mais vos données seront conservées.</p>
          <div className="flex justify-center gap-4">
            <button className="px-5 py-2 rounded-lg font-bold text-white shadow-md hover:scale-105 transition-transform" style={{ backgroundColor: '#CE6A6B' }} onClick={executeDeactivate}>Oui, suspendre</button>
            <button className="px-5 py-2 rounded-lg font-bold bg-gray-100 text-navy hover:bg-gray-200 transition-colors" onClick={() => setShowDeactivateModal(false)}>Annuler</button>
          </div>
        </div>
      </Modal>

      <Modal show={showDeleteModal} size="md" popup onClose={() => setShowDeleteModal(false)}>
        <div className="p-6 text-center">
          <HiExclamationCircle className="mx-auto mb-4 h-14 w-14 mt-4" style={{ color: '#CE6A6B' }} />
          <h3 className="mb-5 text-lg font-bold text-navy">Suppression définitive</h3>
          <p className="text-sm text-gray-500 mb-6">Attention, toutes vos données et vos offres d'emploi en cours seront définitivement effacées.</p>
          <div className="flex justify-center gap-4">
            <button className="px-5 py-2 rounded-lg font-bold text-white shadow-md hover:scale-105 transition-transform" style={{ backgroundColor: '#CE6A6B' }} onClick={executeDelete}>Oui, supprimer</button>
            <button className="px-5 py-2 rounded-lg font-bold bg-gray-100 text-navy hover:bg-gray-200 transition-colors" onClick={() => setShowDeleteModal(false)}>Annuler</button>
          </div>
        </div>
      </Modal>

    </div>
  );
}