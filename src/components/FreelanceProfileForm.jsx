import { useState, useEffect } from "react";
import { Label, TextInput, Select, FileInput, Card, Spinner, Checkbox, Tabs } from "flowbite-react";
import { HiUser, HiCode, HiAcademicCap, HiTrash } from "react-icons/hi";
import { 
  getMyFreelanceProfile, updateFreelanceProfile,
  getMySkills, addSkill, deleteSkill 
} from "../services/api";

export default function FreelanceProfileForm() {
  const [profileId, setProfileId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  // --- ÉTATS ---
  const [formData, setFormData] = useState({
    freelance_birth_date: "",
    freelance_gender: "",
    freelance_location: "",
    freelance_full_remote: false,
    freelance_enterprise_number: "",
    freelance_github_url: "",
    freelance_linkedin_url: "",
    freelance_website_url: "",
    freelance_availability: "FULL"
  });
  const [cvFile, setCvFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: "", level: "BEGINNER" });

  useEffect(() => {
    const loadData = async () => {
      try {
        const profile = await getMyFreelanceProfile();
        if (profile) {
          setProfileId(profile.id);
          setFormData({
            freelance_birth_date: profile.freelance_birth_date || "",
            freelance_gender: profile.freelance_gender || "",
            freelance_location: profile.freelance_location || "",
            freelance_full_remote: profile.freelance_full_remote || false,
            freelance_enterprise_number: profile.freelance_enterprise_number || "",
            freelance_github_url: profile.freelance_github_url || "",
            freelance_linkedin_url: profile.freelance_linkedin_url || "",
            freelance_website_url: profile.freelance_website_url || "",
            freelance_availability: profile.freelance_availability || "FULL"
          });
        }
        setSkills(await getMySkills());
      } catch (err) {
        setMessage({ text: "Erreur de chargement.", type: "error" });
      } finally { setIsLoading(false); }
    };
    loadData();
  }, []);

  // --- ACTIONS ---
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (cvFile) data.append("freelance_cv_file", cvFile);

    try {
      await updateFreelanceProfile(profileId, data);
      setMessage({ text: "Profil mis à jour avec succès !", type: "success" });
    } catch (err) { setMessage({ text: "Erreur lors de la sauvegarde.", type: "error" }); }
  };

  const handleAddSkill = async () => {
    if (!newSkill.name) return;
    try {
      await addSkill({ skill_name: newSkill.name, skill_level: newSkill.level });
      setNewSkill({ name: "", level: "BEGINNER" });
      setSkills(await getMySkills());
    } catch (err) { setMessage({ text: "Erreur compétence.", type: "error" }); }
  };

  if (isLoading) return <div className="flex justify-center p-20"><Spinner size="xl" /></div>;

  return (
    <Card className="max-w-5xl mx-auto border-none shadow-2xl bg-white rounded-3xl">
      <div className="p-6 bg-navy text-white rounded-t-3xl">
        <h2 className="text-3xl font-black italic">MON PROFIL FLOWLANCE</h2>
      </div>

      {message.text && (
        <div className={`m-6 p-4 rounded-xl font-bold ${message.type === 'success' ? 'bg-teal/20 text-teal' : 'bg-coral/20 text-coral'}`}>
          {message.text}
        </div>
      )}

      <Tabs variant="underline" className="px-6">
        
        {/* 1. ONGLET PROFIL */}
        <Tabs.Item title="Profil" icon={HiUser}>
          <form onSubmit={handleSaveProfile} className="space-y-8 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="font-bold text-navy mb-2 block">Date de naissance <span className="text-coral">*</span></Label>
                <TextInput type="date" value={formData.freelance_birth_date} onChange={e => setFormData({...formData, freelance_birth_date: e.target.value})} required />
              </div>
              <div>
                <Label className="font-bold text-navy mb-2 block">Genre</Label>
                <Select value={formData.freelance_gender} onChange={e => setFormData({...formData, freelance_gender: e.target.value})}>
                  <option value="">Non spécifié</option>
                  <option value="M">Homme</option>
                  <option value="F">Femme</option>
                  <option value="X">Autre</option>
                </Select>
              </div>
              <div>
                <Label className="font-bold text-navy mb-2 block">Localisation <span className="text-coral">*</span></Label>
                <TextInput placeholder="Ex: Bruxelles, Belgique" value={formData.freelance_location} onChange={e => setFormData({...formData, freelance_location: e.target.value})} required />
              </div>
              <div>
                <Label className="font-bold text-navy mb-2 block">Numéro TVA / Entreprise <span className="text-coral">*</span></Label>
                <TextInput placeholder="BE0123456789" value={formData.freelance_enterprise_number} onChange={e => setFormData({...formData, freelance_enterprise_number: e.target.value})} required />
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
              <h4 className="font-bold text-navy">Liens Professionnels</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextInput placeholder="GitHub" value={formData.freelance_github_url} onChange={e => setFormData({...formData, freelance_github_url: e.target.value})} />
                <TextInput placeholder="LinkedIn" value={formData.freelance_linkedin_url} onChange={e => setFormData({...formData, freelance_linkedin_url: e.target.value})} />
                <TextInput placeholder="Portfolio/Site" value={formData.freelance_website_url} onChange={e => setFormData({...formData, freelance_website_url: e.target.value})} />
              </div>
              <Label className="font-bold block mt-4">Votre CV (PDF) <span className="text-coral">*</span></Label>
              <FileInput accept=".pdf" onChange={e => setCvFile(e.target.files[0])} />
            </div>

            <button type="submit" className="w-full py-4 bg-coral text-white font-black rounded-xl hover:scale-[1.02] transition-transform shadow-lg">
              ENREGISTRER MES INFORMATIONS
            </button>
          </form>
        </Tabs.Item>

        {/* 2. ONGLET COMPÉTENCES */}
        <Tabs.Item title="Compétences" icon={HiCode}>
          <div className="p-4 space-y-8">
            <div className="flex flex-col md:flex-row gap-4 items-end bg-sage/10 p-6 rounded-2xl">
              <div className="flex-1">
                <Label className="font-bold text-navy mb-2 block">Ajouter une Hard Skill <span className="text-coral">*</span></Label>
                <TextInput placeholder="Ex: Docker, React, SEO..." value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})} />
              </div>
              <div className="w-full md:w-1/4">
                <Label className="font-bold text-navy mb-2 block">Niveau <span className="text-coral">*</span></Label>
                <Select value={newSkill.level} onChange={e => setNewSkill({...newSkill, level: e.target.value})}>
                  <option value="BEGINNER">Débutant</option>
                  <option value="INTERMEDIATE">Intermédiaire</option>
                  <option value="ADVANCED">Avancé</option>
                  <option value="EXPERT">Expert</option>
                </Select>
              </div>
              <button type="button" onClick={handleAddSkill} className="bg-navy text-white px-8 py-2.5 rounded-lg font-bold">AJOUTER</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map(s => (
                <div key={s.id} className="flex justify-between items-center p-4 border-2 border-gray-100 rounded-xl hover:border-sage/30 transition-colors">
                  <div>
                    <span className="font-black text-navy">{s.skill_name || s.skill}</span>
                    <span className="ml-3 text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-md uppercase font-black">{s.level}</span>
                  </div>
                  <button onClick={() => deleteSkill(s.id)} className="text-coral p-2 hover:bg-coral/10 rounded-full transition-colors"><HiTrash /></button>
                </div>
              ))}
            </div>
          </div>
        </Tabs.Item>

        {/* 3. ONGLET CERTIFICATIONS */}
        <Tabs.Item title="Certifications" icon={HiAcademicCap}>
          <div className="p-12 text-center">
            <HiAcademicCap className="text-7xl mx-auto text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-navy">Diplômes & Certifications</h3>
            <p className="text-gray-500 max-w-sm mx-auto mt-2">Validez votre expertise en ajoutant vos formations officielles.</p>
            <button className="mt-6 bg-sage text-white px-8 py-3 rounded-xl font-bold opacity-60 cursor-not-allowed">
              BIENTÔT DISPONIBLE
            </button>
          </div>
        </Tabs.Item>

      </Tabs>
    </Card>
  );
}