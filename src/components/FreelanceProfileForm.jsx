import { useState, useEffect } from "react";
import { Label, TextInput, Select, FileInput, Card, Spinner, Checkbox, Tabs, Badge, Button, Modal, Textarea } from "flowbite-react";
import { 
  HiUser, HiCode, HiAcademicCap, HiTrash, HiCheckCircle, 
  HiExclamationCircle, HiUpload, HiDocumentText, HiOutlineTruck, HiLink, HiPlusCircle
} from "react-icons/hi";
import { 
  getMyFreelanceProfile, updateFreelanceProfile,
  getMySkills, addSkill, deleteSkill,
  getSectors, getSoftSkills,
  addLanguage, deleteLanguage,
  addEducation, deleteEducation,
  addCertification, deleteCertification,
  addLicense, deleteLicense,
  updateCV, deactivateAccount, deleteAccount
} from "../services/api";

export default function FreelanceProfileForm() {
  const [profileId, setProfileId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  // --- MODALS DE CONFIRMATION (Thème Flowlance) ---
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ================= ONGLET 1 : PROFIL =================
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [fullRemote, setFullRemote] = useState(false);
  const [enterpriseNumber, setEnterpriseNumber] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [availability, setAvailability] = useState("FULL");
  const [isActive, setIsActive] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [cvUploading, setCvUploading] = useState(false);

  // ================= ONGLET 2 : COMPÉTENCES & LANGUES =================
  const [sectors, setSectors] = useState([]);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: "", level: "1", sector_id: "" });
  
  const [availableSoftSkills, setAvailableSoftSkills] = useState([]);
  const [mySoftSkills, setMySoftSkills] = useState([]); 
  const [selectedSoftSkill, setSelectedSoftSkill] = useState("");

  const [languages, setLanguages] = useState([]);
  const [newLang, setNewLang] = useState({ language: "", level: "B1" });

  // ================= ONGLET 3 : PARCOURS PRO =================
  const [educations, setEducations] = useState([]);
  const [newEdu, setNewEdu] = useState({ degree_type: "BAC", diploma_name: "", school_name: "", year_obtained: "", proof_file: null });

  const [certifications, setCertifications] = useState([]);
  const [newCert, setNewCert] = useState({ certification_name: "", expiry_date: "", proof_file: null });

  const [licenses, setLicenses] = useState([]);
  const [newPermis, setNewPermis] = useState({ license_type: "B", valid_until: "", proof_file: null });
  const [newLicencePro, setNewLicencePro] = useState({ license_type: "CACES_1", valid_until: "", proof_file: null });

  const [existingCvUrl, setExistingCvUrl] = useState(null);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [profile, skillList, sectorList, softList] = await Promise.all([
          getMyFreelanceProfile(), getMySkills(), getSectors(), getSoftSkills()
        ]);
        
        if (profile) {
          setProfileId(profile.id);
          setBirthDate(profile.freelance_birth_date || "");
          setGender(profile.freelance_gender || "");
          setLocation(profile.freelance_location || "");
          setFullRemote(profile.freelance_full_remote || false);
          setEnterpriseNumber(profile.freelance_enterprise_number || "");
          setGithubUrl(profile.freelance_github_url || "");
          setLinkedinUrl(profile.freelance_linkedin_url || "");
          setWebsiteUrl(profile.freelance_website_url || "");
          setAvailability(profile.freelance_availability || "FULL");
          setIsActive(profile.freelance_is_active || false);
          
          if (profile.freelance_soft_skills) setMySoftSkills(profile.freelance_soft_skills);
          if (profile.languages) setLanguages(profile.languages);
          if (profile.educations) setEducations(profile.educations);
          if (profile.certifications) setCertifications(profile.certifications);
          if (profile.licenses) setLicenses(profile.licenses);
          if (profile.freelance_cv_file) setExistingCvUrl(profile.freelance_cv_file);
        }
        setSkills(skillList);
        setSectors(sectorList);
        setAvailableSoftSkills(softList);
      } catch (err) { console.error(err); } 
      finally { setIsLoading(false); }
    };
    loadAllData();
  }, []);

  // --- ACTIONS GLOBALES ---
  const handleGlobalSave = async () => {
    setMessage({ text: "Sauvegarde du profil en cours...", type: "info" });
    const formData = new FormData();
    const formatUrl = (url) => {
      if (!url) return "";
      if (!url.startsWith("http://") && !url.startsWith("https://")) return "https://" + url;
      return url;
    };
    if (birthDate) formData.append("freelance_birth_date", birthDate);
    if (gender) formData.append("freelance_gender", gender);
    formData.append("freelance_location", location);
    formData.append("freelance_full_remote", fullRemote);
    formData.append("freelance_enterprise_number", enterpriseNumber);
    if (githubUrl) formData.append("freelance_github_url", formatUrl(githubUrl));
    if (linkedinUrl) formData.append("freelance_linkedin_url", formatUrl(linkedinUrl));
    if (websiteUrl) formData.append("freelance_website_url", formatUrl(websiteUrl));

    formData.append("freelance_availability", availability);
    mySoftSkills.forEach(id => formData.append("freelance_soft_skills", id));
    if (cvFile) formData.append("freelance_cv_file", cvFile);

    try {
      await updateFreelanceProfile(profileId, formData);
      setMessage({ text: "Profil sauvegardé avec succès !", type: "success" });
      setTimeout(() => setMessage({text: "", type:""}), 3000);
    } catch (error) { setMessage({ text: "Erreur lors de la sauvegarde.", type: "error" }); }
  };

  const handleCVSubmit = async () => {
   if (!cvFile) return;
    setCvUploading(true);
    try {
      const updatedProfile = await updateCV(profileId, cvFile);
      setExistingCvUrl(updatedProfile.freelance_cv_file); 
      setMessage({ text: "CV mis à jour avec succès !", type: "success" });
      setTimeout(() => setMessage({text: "", type:""}), 3000);
    } catch (error) { setMessage({ text: "Erreur lors de l'envoi du CV.", type: "error" }); } 
    finally { setCvUploading(false); setCvFile(null); }
  };

  const executeDeactivate = async () => {
    setShowDeactivateModal(false);
    try {
      await deactivateAccount();
      // On recharge la page : les données seront là, mais le statut is_active sera false
      window.location.reload(); 
    } catch (error) {
      alert("Erreur lors de la suspension de votre compte.");
    }
  };

  const executeDelete = async () => {
    setShowDeleteModal(false);
    try {
      await deleteAccount();
      // Règle de sécurité : On détruit le badge d'accès du navigateur !
      localStorage.removeItem("token"); 
      // On le renvoie violemment à l'accueil
      window.location.href = '/'; 
    } catch (error) {
      alert("Erreur lors de la suppression de votre compte.");
    }
  };

  // --- ACTIONS ONGLETS 2 & 3 ---
  const handleAddHardSkill = async () => {
    if (!newSkill.name || !newSkill.sector_id) return;
    await addSkill({ skill_name: newSkill.name, skill_level: newSkill.level, sector_id: newSkill.sector_id });
    setSkills(await getMySkills());
    setNewSkill({ name: "", level: "1", sector_id: "" });
  };

  const handleAddLanguage = async () => {
    if (!newLang.language) return;
    const saved = await addLanguage({ ...newLang, profile: profileId });
    setLanguages([...languages, saved]);
    setNewLang({ language: "", level: "B1" });
  };

  const handleAddEdu = async () => {
    if (!newEdu.diploma_name || !newEdu.school_name || !newEdu.year_obtained) return;
    const fd = new FormData();
    Object.keys(newEdu).forEach(key => { if(newEdu[key]) fd.append(key, newEdu[key]); });
    fd.append("profile", profileId);
    const saved = await addEducation(fd);
    setEducations([...educations, saved]);
    setNewEdu({ degree_type: "BAC", diploma_name: "", school_name: "", year_obtained: "", proof_file: null });
  };

  const handleAddCert = async () => {
    if (!newCert.certification_name) return;
    const fd = new FormData();
    Object.keys(newCert).forEach(key => { if(newCert[key]) fd.append(key, newCert[key]); });
    fd.append("profile", profileId);
    const saved = await addCertification(fd);
    setCertifications([...certifications, saved]);
    setNewCert({ certification_name: "", expiry_date: "", proof_file: null });
  };

  const handleAddPermis = async () => {
    const fd = new FormData();
    Object.keys(newPermis).forEach(key => { if(newPermis[key]) fd.append(key, newPermis[key]); });
    fd.append("profile", profileId);
    const saved = await addLicense(fd);
    setLicenses([...licenses, saved]);
    setNewPermis({ license_type: "B", valid_until: "", proof_file: null });
  };

  const handleAddLicencePro = async () => {
    const fd = new FormData();
    Object.keys(newLicencePro).forEach(key => { if(newLicencePro[key]) fd.append(key, newLicencePro[key]); });
    fd.append("profile", profileId);
    const saved = await addLicense(fd);
    setLicenses([...licenses, saved]);
    setNewLicencePro({ license_type: "CACES_1", valid_until: "", proof_file: null });
  };

  // --- HELPERS VISUELS ---
  const skillsBySector = skills.reduce((acc, s) => {
    const secName = s.sector_name || "Autres";
    if (!acc[secName]) acc[secName] = [];
    acc[secName].push(s);
    return acc;
  }, {});

  const renderStatusBadge = (isVerified) => {
    return isVerified 
      ? <Badge color="success" icon={HiCheckCircle}>Vérifié</Badge>
      : <Badge color="warning" icon={HiExclamationCircle}>En attente</Badge>;
  };

  const permisTypes = ['AM', 'A', 'B', 'C', 'D', 'BE'];
  const mesPermis = licenses.filter(l => permisTypes.includes(l.license_type));
  const mesLicencesPro = licenses.filter(l => !permisTypes.includes(l.license_type));

  if (isLoading) return <div className="text-center p-20"><Spinner size="xl" /></div>;

  return (
    <div className="max-w-6xl mx-auto relative pb-28"> 
      <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden mb-6">
        <div className="p-6 bg-navy text-white">
          <h2 className="text-2xl font-black italic">MON ESPACE EXPERT</h2>
        </div>

        {!isActive && (
          <div className="mx-6 mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-r-xl shadow-sm flex items-start">
            <HiExclamationCircle className="h-6 w-6 mr-3 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm">Votre compte est en attente d'activation.</h3>
              <p className="text-xs mt-1 text-yellow-700">
                Veuillez compléter votre profil à 100% (informations générales, CV, compétences, diplômes). 
                Une fois complété, un modérateur validera votre compte pour le rendre visible.
              </p>
            </div>
          </div>
        )}

        {message.text && (
          <div className={`m-4 p-4 rounded-xl font-bold ${message.type === 'success' ? 'bg-teal/20 text-teal' : 'bg-coral/20 text-coral'}`}>
            {message.text}
          </div>
        )}

        <Tabs variant="underline" className="px-6">
          
          {/* ================= ONGLET 1 : PROFIL ================= */}
          <Tabs.Item active title="Profil Général" icon={HiUser}>
            <div className="space-y-6 p-4">
              
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="font-bold mb-2 block">Date de naissance <span className="text-coral">*</span></Label>
                  <TextInput type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
                </div>
                <div>
                  <Label className="font-bold mb-2 block">Genre <span className="text-coral">*</span></Label>
                  <Select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Non spécifié</option>
                    <option value="M">Homme</option>
                    <option value="F">Femme</option>
                    <option value="X">Autre</option>
                  </Select>
                </div>
                <div>
                  <Label className="font-bold mb-2 block">Localisation <span className="text-coral">*</span></Label>
                  <TextInput value={location} onChange={(e) => setLocation(e.target.value)} required />
                </div>
                <div>
                  <Label className="font-bold mb-2 block">Numéro TVA / Entreprise <span className="text-coral">*</span></Label>
                  <TextInput value={enterpriseNumber} onChange={(e) => setEnterpriseNumber(e.target.value)} required />
                </div>
                <div>
                  <Label className="font-bold mb-2 block">Disponibilité <span className="text-coral">*</span></Label>
                  <Select value={availability} onChange={(e) => setAvailability(e.target.value)}>
                    <option value="FULL">Temps plein</option>
                    <option value="PART">Temps partiel</option>
                    <option value="NONE">Indisponible</option>
                  </Select>
                </div>
                <div className="flex items-center gap-3 mt-8 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                  <Checkbox id="fullRemote" checked={fullRemote} onChange={(e) => setFullRemote(e.target.checked)} />
                  <Label htmlFor="fullRemote" className="font-bold cursor-pointer">Ouvert au 100% télétravail</Label>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                 <h3 className="text-lg font-black text-navy flex items-center gap-2 mb-2">
                   <HiDocumentText className="text-2xl text-sage"/> Mon Curriculum Vitae (PDF) <span className="text-coral">*</span>
                 </h3>
                 <p className="text-sm text-gray-500 mb-4">Le document principal utilisé par l'IA pour analyser votre profil.</p>
                 
                 {existingCvUrl && (
                   <div className="mb-4 p-4 bg-sage/10 rounded-xl flex flex-col md:flex-row items-center justify-between border border-sage/30 gap-4">
                     <span className="text-sm font-bold text-navy flex items-center gap-2">
                       <HiCheckCircle className="text-sage text-2xl" /> Un CV est actuellement en ligne pour votre profil.
                     </span>
                     <a href={existingCvUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white text-navy border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
                       Voir mon CV
                     </a>
                   </div>
                 )}

                 <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 w-full">
                        <FileInput 
                          accept=".pdf" 
                          onChange={(e) => setCvFile(e.target.files[0])} 
                          /* On a supprimé le helperText ici ! */
                        />
                        {/* On affiche le texte d'aide proprement en dessous avec un <p> */}
                        {existingCvUrl && (
                          <p className="mt-2 text-xs text-gray-500 font-medium">
                            Sélectionnez un nouveau fichier PDF pour écraser le précédent.
                          </p>
                        )}
                    </div>
                    <Button color="dark" onClick={handleCVSubmit} disabled={!cvFile || cvUploading} className="w-full md:w-auto mb-auto">
                      {cvUploading ? <Spinner size="sm"/> : <><HiUpload className="mr-2"/> {existingCvUrl ? "Remplacer le CV" : "Soumettre le CV"}</>}
                    </Button>
                 </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-lg font-black text-navy flex items-center gap-2 mb-2">
                  <HiLink className="text-2xl text-sage" /> Présence en ligne & Portfolio
                </h3>
                <p className="text-sm text-gray-500 mb-6">Ajoutez les liens vers vos profils professionnels pour que les entreprises puissent découvrir vos travaux.</p>
                <div className="flex flex-col gap-5 max-w-3xl">
                  <div>
                    <Label className="font-bold mb-2 block">Profil LinkedIn</Label>
                    <TextInput placeholder="https://linkedin.com/in/..." value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
                  </div>
                  <div>
                    <Label className="font-bold mb-2 block">GitHub ou Dépôt</Label>
                    <TextInput placeholder="https://github.com/..." value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
                  </div>
                  <div>
                    <Label className="font-bold mb-2 block">Site personnel / Portfolio</Label>
                    <TextInput placeholder="https://mon-site.com" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mt-10">
                <h3 className="text-coral font-black mb-2 flex items-center gap-2 text-lg"><HiExclamationCircle /> Gestion du compte</h3>
                <p className="text-sm text-gray-600 mb-4">Ces actions limitent ou suppriment votre visibilité sur la plateforme de manière définitive.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Le bouton n'apparaît QUE si isActive est true */}
                  {isActive && (
                    <button onClick={() => setShowDeactivateModal(true)} className="px-6 py-2.5 rounded-xl font-bold bg-white border-2 transition-transform hover:scale-105" style={{ color: '#CE6A6B', borderColor: '#CE6A6B' }}>
                      Suspendre le compte
                    </button>
                  )}
                  {/* Le bouton Supprimer est toujours là */}
                  <button onClick={() => setShowDeleteModal(true)} className="px-6 py-2.5 rounded-xl font-bold text-white transition-transform hover:scale-105" style={{ backgroundColor: '#CE6A6B' }}>
                    Supprimer le compte
                  </button>
                </div>
              </div>

            </div>
          </Tabs.Item>

          {/* ================= ONGLET 2 : COMPÉTENCES & LANGUES ================= */}
          <Tabs.Item title="Compétences & Langues" icon={HiCode}>
            <div className="p-4 space-y-8">
              
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-lg font-black text-navy mb-4 border-b pb-2">Savoir-être (Soft Skills)</h3>
                <div className="flex flex-col md:flex-row gap-4 items-end mb-4">
                  <div className="flex-1 w-full">
                    <Select value={selectedSoftSkill} onChange={(e) => setSelectedSoftSkill(e.target.value)}>
                      <option value="">Choisir une compétence interpersonnelle...</option>
                      {availableSoftSkills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </Select>
                  </div>
                 <button 
                    onClick={() => {
                      if (selectedSoftSkill && !mySoftSkills.includes(parseInt(selectedSoftSkill))) {
                        setMySoftSkills([...mySoftSkills, parseInt(selectedSoftSkill)]);
                        setSelectedSoftSkill("");
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl font-bold text-white text-sm shadow-md transition-transform hover:scale-105 flex items-center justify-center w-full md:w-auto"
                    style={{ backgroundColor: '#CE6A6B' }}
                  >
                    <HiPlusCircle className="mr-2 h-5 w-5" />
                    {mySoftSkills.length > 0 ? "Ajouter un autre Soft Skill" : "Ajouter ce Soft Skill"}
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {mySoftSkills.map(id => {
                    const skillName = availableSoftSkills.find(s => s.id === id)?.name;
                    return (
                      <div key={id} className="bg-white border border-gray-200 px-4 py-2 rounded-xl flex items-center shadow-sm transition-all hover:shadow-md">
                        <span className="font-black text-navy mr-2">{skillName}</span>
                        <Badge color="info"></Badge>
                        <HiTrash 
                          className="cursor-pointer ml-3 text-gray-400 hover:text-coral transition-colors text-lg" 
                          onClick={() => setMySoftSkills(mySoftSkills.filter(sId => sId !== id))} 
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-lg font-black text-navy mb-4 border-b pb-2">Langues Parlées</h3>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <Label className="font-bold text-xs uppercase block mb-1">Langue <span className="text-coral">*</span></Label>
                    <TextInput placeholder="Ex: Anglais, Néerlandais..." value={newLang.language} onChange={e => setNewLang({...newLang, language: e.target.value})} />
                  </div>
                  <div className="w-full md:w-1/3">
                    <Label className="font-bold text-xs uppercase block mb-1">Niveau <span className="text-coral">*</span></Label>
                    <Select value={newLang.level} onChange={e => setNewLang({...newLang, level: e.target.value})}>
                      <option value="A1">A1 - Débutant</option>
                      <option value="A2">A2 - Élémentaire</option>
                      <option value="B1">B1 - Intermédiaire</option>
                      <option value="B2">B2 - Avancé</option>
                      <option value="C1">C1 - Autonome</option>
                      <option value="LM">Langue maternelle</option>
                    </Select>
                  </div>
                  <button 
                    onClick={handleAddLanguage} 
                    className="px-5 py-2.5 rounded-xl font-bold text-white text-sm shadow-md transition-transform hover:scale-105 flex items-center justify-center w-full md:w-auto"
                    style={{ backgroundColor: '#CE6A6B' }}
                  >
                    <HiPlusCircle className="mr-2 h-5 w-5" />
                    {languages.length > 0 ? "Ajouter une autre langue" : "Ajouter cette langue"}
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {languages.map(l => (
                    <div key={l.id} className="bg-white border border-gray-200 px-4 py-2 rounded-xl flex items-center shadow-sm">
                      <span className="font-black text-navy mr-2">{l.language}</span> 
                      <Badge color="gray">{l.level}</Badge>
                      <HiTrash className="cursor-pointer ml-3 text-gray-400 hover:text-coral" onClick={() => deleteLanguage(l.id).then(() => window.location.reload())} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-lg font-black text-navy mb-4 border-b pb-2">Expertises Techniques (Hard Skills)</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label className="font-bold text-xs uppercase block mb-1">Secteur <span className="text-coral">*</span></Label>
                    <Select value={newSkill.sector_id} onChange={e => setNewSkill({...newSkill, sector_id: e.target.value})}>
                      <option value="">Choisir...</option>
                      {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </Select>
                  </div>
                  <div>
                    <Label className="font-bold text-xs uppercase block mb-1">Compétence <span className="text-coral">*</span></Label>
                    <TextInput placeholder="Ex: Python, React..." value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})} />
                  </div>
                  <div>
                    <Label className="font-bold text-xs uppercase block mb-1">Niveau (1 à 5) <span className="text-coral">*</span></Label>
                    <Select value={newSkill.level} onChange={e => setNewSkill({...newSkill, level: e.target.value})}>
                        <option value="1">1 - Débutant</option>
                        <option value="2">2 - Pratique occasionnelle</option>
                        <option value="3">3 - Intermédiaire</option>
                        <option value="4">4 - Confirmé</option>
                        <option value="5">5 - Expert</option>
                    </Select>
                  </div>
                  <button 
                    onClick={handleAddHardSkill}
                    className="px-5 py-2.5 rounded-xl font-bold text-white text-sm shadow-md transition-transform hover:scale-105 flex items-center justify-center w-full md:w-auto"
                    style={{ backgroundColor: '#CE6A6B' }}
                  >
                    <HiPlusCircle className="mr-2 h-5 w-5" />
                    {skills.length > 0 ? "Ajouter une autre" : "Ajouter"}
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  {Object.keys(skillsBySector).map(sector => (
                    <div key={sector}>
                      <h4 className="text-navy font-black text-sm uppercase mb-2 pl-2">{sector}</h4>
                      <div className="flex flex-wrap gap-3">
                        {skillsBySector[sector].map(s => (
                          <div key={s.id} className="bg-white border border-gray-200 px-4 py-2 rounded-xl flex items-center shadow-sm">
                            <span className="font-black text-navy mr-2">{s.skill_name}</span>
                            <Badge color="light">Lvl {s.level}</Badge>
                            <HiTrash className="cursor-pointer ml-3 text-gray-400 hover:text-coral" onClick={() => deleteSkill(s.id).then(() => window.location.reload())} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </Tabs.Item>

          {/* ================= ONGLET 3 : PARCOURS PRO ================= */}
          <Tabs.Item title="Éducation, Certifs & Licences" icon={HiAcademicCap}>
            <div className="p-4 space-y-8">
              <p className="text-sm text-gray-500 mb-2 italic">
                Enrichissez votre profil en ajoutant vos différents diplômes, certificats et habilitations. <strong>Vous pouvez en ajouter autant que vous le souhaitez.</strong>
              </p>

              {/* ÉDUCATION */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-xl font-black text-navy mb-4 border-b pb-2">Diplômes & Éducation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end mb-6">
                    <div>
                      <Label className="text-xs font-bold mb-1">Type <span className="text-coral">*</span></Label>
                      <Select value={newEdu.degree_type} onChange={e => setNewEdu({...newEdu, degree_type: e.target.value})}>
                        <option value="SEC">Secondaire</option>
                        <option value="BAC">Bachelier / Licence</option>
                        <option value="MAS">Master</option>
                        <option value="DOC">Doctorat</option>
                        <option value="PRO">Formation Pro</option>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-bold mb-1">Diplôme <span className="text-coral">*</span></Label>
                      <TextInput placeholder="Intitulé exact" value={newEdu.diploma_name} onChange={e => setNewEdu({...newEdu, diploma_name: e.target.value})} />
                    </div>
                    <div>
                      <Label className="text-xs font-bold mb-1">École <span className="text-coral">*</span></Label>
                      <TextInput placeholder="Établissement" value={newEdu.school_name} onChange={e => setNewEdu({...newEdu, school_name: e.target.value})} />
                    </div>
                    <div>
                      <Label className="text-xs font-bold mb-1">Année <span className="text-coral">*</span></Label>
                      <TextInput type="number" placeholder="YYYY" value={newEdu.year_obtained} onChange={e => setNewEdu({...newEdu, year_obtained: e.target.value})} />
                    </div>
                    <div>
                      <Label className="text-xs font-bold mb-1">Preuve PDF</Label>
                      <FileInput accept=".pdf" onChange={e => setNewEdu({...newEdu, proof_file: e.target.files[0]})} />
                    </div>
                    <button 
                      onClick={handleAddEdu} 
                      className="md:col-span-2 lg:col-span-5 w-full px-5 py-2.5 rounded-xl font-bold text-white text-sm shadow-md transition-transform hover:scale-105 flex items-center justify-center"
                      style={{ backgroundColor: '#CE6A6B' }}
                    >
                      <HiPlusCircle className="mr-2 h-5 w-5" /> 
                      {educations.length > 0 ? "Ajouter un autre diplôme" : "Ajouter ce diplôme"}
                    </button>
                </div>
                
                <div className="space-y-3">
                  {educations.map(edu => (
                    <div key={edu.id} className="flex justify-between items-center bg-white p-4 border rounded-xl shadow-sm">
                      <div>
                        <p className="font-black text-navy">{edu.diploma_name} <span className="text-gray-500 font-normal">({edu.school_name} - {edu.year_obtained})</span></p>
                        <div className="mt-2 flex items-center gap-2">
                          {renderStatusBadge(edu.is_verified)}
                          {edu.proof_file && <span className="text-xs text-sage flex items-center gap-1"><HiDocumentText/> Document transmis</span>}
                        </div>
                      </div>
                      <HiTrash className="text-coral cursor-pointer text-xl" onClick={() => deleteEducation(edu.id).then(() => window.location.reload())} />
                    </div>
                  ))}
                </div>
              </div>

              {/* CERTIFICATIONS */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-xl font-black text-navy mb-4 border-b pb-2">Certifications (IT, Management, etc.)</h3>
                <div className="flex flex-col md:flex-row gap-4 items-end mb-6">
                    <div className="flex-1 w-full">
                      <Label className="text-xs font-bold mb-1">Nom de la certification <span className="text-coral">*</span></Label>
                      <TextInput placeholder="Ex: AWS Solutions Architect, Scrum Master..." value={newCert.certification_name} onChange={e => setNewCert({...newCert, certification_name: e.target.value})} />
                    </div>
                    <div className="w-full md:w-1/4">
                      <Label className="text-xs font-bold mb-1">Date d'expiration</Label>
                      <TextInput type="date" value={newCert.expiry_date} onChange={e => setNewCert({...newCert, expiry_date: e.target.value})} />
                    </div>
                    <div className="w-full md:w-1/4">
                      <Label className="text-xs font-bold mb-1">Preuve PDF</Label>
                      <FileInput accept=".pdf" onChange={e => setNewCert({...newCert, proof_file: e.target.files[0]})} />
                    </div>
                    <button 
                      onClick={handleAddCert} 
                      className="px-5 py-2.5 rounded-xl font-bold text-white text-sm shadow-md transition-transform hover:scale-105 flex items-center justify-center w-full md:w-auto"
                      style={{ backgroundColor: '#CE6A6B' }}
                    >
                      <HiPlusCircle className="mr-2 h-5 w-5" /> 
                      {certifications.length > 0 ? "Ajouter une autre certification" : "Ajouter cette certification"}
                    </button>
                </div>
                
                <div className="space-y-3">
                  {certifications.map(cert => (
                    <div key={cert.id} className="flex justify-between items-center bg-white p-4 border rounded-xl shadow-sm">
                      <div>
                        <p className="font-black text-navy">{cert.certification_name}</p>
                        <div className="mt-2 flex items-center gap-2">
                          {renderStatusBadge(cert.is_verified)}
                          {cert.expiry_date && <span className="text-xs text-gray-500">Expire le : {cert.expiry_date}</span>}
                        </div>
                      </div>
                      <HiTrash className="text-coral cursor-pointer text-xl" onClick={() => deleteCertification(cert.id).then(() => window.location.reload())} />
                    </div>
                  ))}
                </div>
              </div>

              {/* PERMIS DE CONDUIRE */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-xl font-black text-navy mb-4 border-b pb-2 flex items-center gap-2"><HiOutlineTruck /> Permis de conduire</h3>
                <div className="flex flex-col md:flex-row gap-4 items-end mb-6">
                    <div className="flex-1 w-full">
                      <Label className="text-xs font-bold mb-1">Catégorie <span className="text-coral">*</span></Label>
                      <Select value={newPermis.license_type} onChange={e => setNewPermis({...newPermis, license_type: e.target.value})}>
                        <option value="AM">Permis AM (Cyclomoteur)</option>
                        <option value="A">Permis A (Moto)</option>
                        <option value="B">Permis B (Voiture)</option>
                        <option value="C">Permis C (Poids Lourd)</option>
                        <option value="D">Permis D (Transport de personnes)</option>
                        <option value="BE">Permis BE (Remorque)</option>
                      </Select>
                    </div>
                    <div className="w-full md:w-1/4">
                      <Label className="text-xs font-bold mb-1">Preuve PDF (Optionnel)</Label>
                      <FileInput accept=".pdf" onChange={e => setNewPermis({...newPermis, proof_file: e.target.files[0]})} />
                    </div>
                   <button 
                      onClick={handleAddPermis} 
                      className="px-5 py-2.5 rounded-xl font-bold text-white text-sm shadow-md transition-transform hover:scale-105 flex items-center justify-center w-full md:w-auto"
                      style={{ backgroundColor: '#CE6A6B' }}
                    >
                      <HiPlusCircle className="mr-2 h-5 w-5" />
                      {mesPermis.length > 0 ? "Ajouter un autre permis" : "Ajouter ce permis"}
                    </button>
                </div>
                <div className="space-y-3">
                  {mesPermis.map(lic => (
                    <div key={lic.id} className="flex justify-between items-center bg-white p-4 border rounded-xl shadow-sm">
                      <div>
                        <p className="font-black text-navy">Permis Type : {lic.license_type}</p>
                        <div className="mt-2 flex items-center gap-2">
                          {renderStatusBadge(lic.is_verified)}
                        </div>
                      </div>
                      <HiTrash className="text-coral cursor-pointer text-xl" onClick={() => deleteLicense(lic.id).then(() => window.location.reload())} />
                    </div>
                  ))}
                </div>
              </div>

              {/* LICENCES ET HABILITATIONS PRO (CACES, etc.) */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-xl font-black text-navy mb-4 border-b pb-2 flex items-center gap-2"><HiAcademicCap /> Habilitations & Licences Pro</h3>
                <div className="flex flex-col md:flex-row gap-4 items-end mb-6">
                    <div className="flex-1 w-full">
                      <Label className="text-xs font-bold mb-1">Type d'habilitation <span className="text-coral">*</span></Label>
                      <Select value={newLicencePro.license_type} onChange={e => setNewLicencePro({...newLicencePro, license_type: e.target.value})}>
                        <option value="CACES_1">CACES R486 (Nacelle)</option>
                        <option value="CACES_3">CACES R489 (Chariot)</option>
                        <option value="ENGIN">Habilitation Engin de chantier</option>
                        <option value="AUTRE">Autre Habilitation Spécifique</option>
                      </Select>
                    </div>
                    <div className="w-full md:w-1/4">
                      <Label className="text-xs font-bold mb-1">Valide jusqu'au</Label>
                      <TextInput type="date" value={newLicencePro.valid_until} onChange={e => setNewLicencePro({...newLicencePro, valid_until: e.target.value})} />
                    </div>
                    <div className="w-full md:w-1/4">
                      <Label className="text-xs font-bold mb-1">Preuve PDF</Label>
                      <FileInput accept=".pdf" onChange={e => setNewLicencePro({...newLicencePro, proof_file: e.target.files[0]})} />
                    </div>
                    <button 
                      onClick={handleAddLicencePro} 
                      className="px-5 py-2.5 rounded-xl font-bold text-white text-sm shadow-md transition-transform hover:scale-105 flex items-center justify-center w-full md:w-auto"
                      style={{ backgroundColor: '#CE6A6B' }}
                    >
                      <HiPlusCircle className="mr-2 h-5 w-5" />
                      {mesLicencesPro.length > 0 ? "Ajouter une autre licence" : "Ajouter cette licence"}
                    </button>
                </div>
                <div className="space-y-3">
                  {mesLicencesPro.map(lic => (
                    <div key={lic.id} className="flex justify-between items-center bg-white p-4 border rounded-xl shadow-sm">
                      <div>
                        <p className="font-black text-navy">Licence Pro : {lic.license_type}</p>
                        <div className="mt-2 flex items-center gap-2">
                          {renderStatusBadge(lic.is_verified)}
                          {lic.valid_until && <span className="text-xs text-gray-500">Valide jusqu'au : {lic.valid_until}</span>}
                        </div>
                      </div>
                      <HiTrash className="text-coral cursor-pointer text-xl" onClick={() => deleteLicense(lic.id).then(() => window.location.reload())} />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </Tabs.Item>
        </Tabs>
      </Card>

      {/* BOUTON GLOBAL DE SAUVEGARDE */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] p-4 z-50 flex justify-center">
        <button 
          onClick={handleGlobalSave} 
          className="w-full max-w-5xl py-4 text-white font-black rounded-xl hover:scale-[1.01] transition-transform shadow-lg flex justify-center items-center gap-2 text-lg" 
          style={{ backgroundColor: '#CE6A6B' }}
        >
          <HiCheckCircle className="text-2xl" /> SAUVEGARDER MON PROFIL COMPLET
        </button>
      </div>

      {/* MODALS DE CONFIRMATION */}
      <Modal show={showDeactivateModal} size="md" popup onClose={() => setShowDeactivateModal(false)}>
        <div className="p-6 text-center">
          <HiExclamationCircle className="mx-auto mb-4 h-14 w-14 mt-4" style={{ color: '#CE6A6B' }} />
          <h3 className="mb-5 text-lg font-bold text-navy">Suspendre votre compte ?</h3>
          <p className="text-sm text-gray-500 mb-6">Vous n'apparaîtrez plus dans les recherches des entreprises, mais vos données seront conservées.</p>
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
          <p className="text-sm text-gray-500 mb-6">Attention, toutes vos données, votre CV et vos compétences seront effacés de nos serveurs de manière irréversible.</p>
          <div className="flex justify-center gap-4">
            <button className="px-5 py-2 rounded-lg font-bold text-white shadow-md hover:scale-105 transition-transform" style={{ backgroundColor: '#CE6A6B' }} onClick={executeDelete}>Oui, supprimer</button>
            <button className="px-5 py-2 rounded-lg font-bold bg-gray-100 text-navy hover:bg-gray-200 transition-colors" onClick={() => setShowDeleteModal(false)}>Annuler</button>
          </div>
        </div>
      </Modal>

    </div>
  );
}

