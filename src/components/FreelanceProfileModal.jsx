import { useState, useEffect } from "react";
import { Modal, Spinner, Badge } from "flowbite-react";
import {
  HiUser, HiLocationMarker, HiAcademicCap, HiTranslate,
  HiLink, HiOutlineDocumentDownload, HiOutlineTruck,
  HiBadgeCheck, HiBriefcase, HiStar, HiCode, HiIdentification, HiCalendar, HiClock
} from "react-icons/hi";
import { getFreelanceProfileById, getSectors, getSoftSkills } from "../services/api";

export default function FreelanceProfileModal({ show, onClose, freelanceId }) {
  // Etat local de la modale profil
  const [profile, setProfile] = useState(null);
  const [allSectors, setAllSectors] = useState([]);
  const [allSoftSkills, setAllSoftSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Chargement des donnees du freelance selectionne
  useEffect(() => {
    if (show && freelanceId) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [profileData, sectorsData, softSkillsData] = await Promise.all([
            getFreelanceProfileById(freelanceId),
            getSectors(),
            getSoftSkills()
          ]);
          setProfile(profileData);
          setAllSectors(sectorsData);
          setAllSoftSkills(softSkillsData);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [show, freelanceId]);

  if (!show) return null;

  // Helpers d'affichage
  const getAvailabilityText = (val) => {
    if (val === "FULL") return "Temps plein";
    if (val === "PART") return "Temps partiel";
    if (val === "NONE") return "Indisponible";
    return "Non précisée";
  };

  const getGenderText = (val) => {
    if (val === "M") return "Homme";
    if (val === "F") return "Femme";
    if (val === "X") return "Autre";
    return "Non spécifié";
  };

  const calculateAge = (dob) => {
    if (!dob) return "";
    const age_dt = new Date(Date.now() - new Date(dob).getTime());
    return `${Math.abs(age_dt.getUTCFullYear() - 1970)} ans`;
  };

  const getSectorName = (idOrObj) => {
    if (typeof idOrObj === 'object') return idOrObj.name;
    const s = allSectors.find(sec => sec.id === idOrObj);
    return s ? s.name : "Secteur";
  };

  const getSoftSkillName = (idOrObj) => {
    if (typeof idOrObj === 'object') return idOrObj.name;
    const s = allSoftSkills.find(ss => ss.id === idOrObj);
    return s ? s.name : "Soft Skill";
  };

  return (
    <Modal show={show} size="5xl" onClose={onClose}>
      {/* En-tete de la modale */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-lg">
        <h3 className="text-2xl font-black text-navy flex items-center">
          <HiIdentification className="mr-3 text-coral h-7 w-7" /> Dossier Candidat Complet
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-coral font-black text-xl transition-colors">X</button>
      </div>

      {/* Contenu principal du dossier candidat */}
      <div className="p-8 bg-gray-50 max-h-[85vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner size="xl" className="text-coral" /></div>
        ) : profile ? (
          <div className="space-y-6">

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-coral text-white font-black px-6 py-2 rounded-bl-3xl shadow-sm">
                {getAvailabilityText(profile.freelance_availability)}
              </div>
              
              <div className="h-32 w-32 bg-teal/10 text-teal rounded-full flex items-center justify-center text-5xl flex-shrink-0 border-4 border-white shadow-md">
                {profile.first_name ? profile.first_name.charAt(0) : <HiUser />}
              </div>
              
              <div className="flex-1">
                <h2 className="text-3xl font-black text-navy mb-2">
                  {profile.first_name ? `${profile.first_name} ${profile.last_name?.charAt(0)}.` : `Candidat N°${profile.id}`}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-600 mt-4 mb-6">
                  <div className="flex items-center"><HiLocationMarker className="mr-2 text-teal h-5 w-5" /> {profile.freelance_location || "Localisation non spécifiée"}</div>
                  <div className="flex items-center"><HiCalendar className="mr-2 text-teal h-5 w-5" /> {calculateAge(profile.freelance_birth_date)} {profile.freelance_gender && `(${getGenderText(profile.freelance_gender)})`}</div>
                  <div className="flex items-center"><HiBriefcase className="mr-2 text-teal h-5 w-5" /> N° Entreprise : <span className="font-mono ml-1">{profile.freelance_enterprise_number || "Non renseigné"}</span></div>
                  <div className="flex items-center"><HiClock className="mr-2 text-teal h-5 w-5" /> Ouvert au 100% Remote : {profile.freelance_full_remote ? "✅ Oui" : "❌ Non"}</div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {profile.freelance_cv_file && (
                    <a href={profile.freelance_cv_file} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-5 py-2.5 bg-coral text-white font-bold rounded-xl shadow-md hover:scale-105 transition-transform text-sm">
                      <HiOutlineDocumentDownload className="mr-2 h-5 w-5" /> Télécharger le CV
                    </a>
                  )}
                  {profile.freelance_linkedin_url && <a href={profile.freelance_linkedin_url} target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-2.5 bg-gray-100 text-navy font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm"><HiLink className="mr-2"/> LinkedIn</a>}
                  {profile.freelance_github_url && <a href={profile.freelance_github_url} target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-2.5 bg-gray-100 text-navy font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm"><HiLink className="mr-2"/> GitHub</a>}
                  {profile.freelance_website_url && <a href={profile.freelance_website_url} target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-2.5 bg-gray-100 text-navy font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm"><HiLink className="mr-2"/> Portfolio</a>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 lg:col-span-1">
                <h4 className="text-lg font-black text-navy mb-4 flex items-center"><HiBriefcase className="mr-2 text-teal" /> Secteurs</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.freelance_sectors?.map((sec, idx) => (
                    <Badge key={idx} color="info" className="px-3 py-1">{getSectorName(sec)}</Badge>
                  ))}
                  {(!profile.freelance_sectors || profile.freelance_sectors.length === 0) && <p className="text-sm text-gray-500 italic">Non renseigné.</p>}
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2">
                <h4 className="text-lg font-black text-navy mb-4 flex items-center"><HiStar className="mr-2 text-teal" /> Savoir-être (Soft Skills)</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.freelance_soft_skills?.map((ss, idx) => (
                    <Badge key={idx} color="success" className="px-3 py-1">{getSoftSkillName(ss)}</Badge>
                  ))}
                  {(!profile.freelance_soft_skills || profile.freelance_soft_skills.length === 0) && <p className="text-sm text-gray-500 italic">Non renseigné.</p>}
                </div>
              </div>

              <div className="bg-teal/5 p-6 rounded-3xl shadow-sm border border-teal/20 lg:col-span-3">
                <h4 className="text-xl font-black text-navy mb-4 flex items-center"><HiCode className="mr-2 text-coral h-6 w-6" /> Expertises Techniques</h4>
                {profile.skill_levels && profile.skill_levels.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {profile.skill_levels.map((skill, idx) => (
                      <div key={idx} className="bg-white border border-gray-200 px-4 py-2 rounded-xl flex items-center shadow-sm">
                        <span className="font-black text-navy mr-2">{skill.skill_name || skill.skill?.name || "Compétence"}</span>
                        <Badge color="light">Niv. {skill.level}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">Aucune expertise technique renseignée.</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h4 className="text-lg font-black text-navy mb-4 flex items-center border-b border-gray-100 pb-2"><HiAcademicCap className="mr-2 text-coral h-5 w-5" /> Formation</h4>
                <div className="space-y-4">
                  {profile.educations?.map((edu, idx) => (
                    <div key={idx} className="border-l-2 border-teal pl-3">
                      <p className="font-bold text-navy">{edu.diploma_name}</p>
                      <p className="text-xs text-gray-500">{edu.school_name} - {edu.year_obtained}</p>
                    </div>
                  ))}
                  {(!profile.educations || profile.educations.length === 0) && <p className="text-sm text-gray-500 italic">Non renseigné.</p>}
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h4 className="text-lg font-black text-navy mb-4 flex items-center border-b border-gray-100 pb-2"><HiBadgeCheck className="mr-2 text-coral h-5 w-5" /> Certifications</h4>
                <div className="space-y-4">
                  {profile.certifications?.map((cert, idx) => (
                    <div key={idx} className="border-l-2 border-coral pl-3">
                      <p className="font-bold text-navy">{cert.certification_name}</p>
                      {cert.expiry_date && <p className="text-xs text-gray-500">Expire le : {cert.expiry_date}</p>}
                    </div>
                  ))}
                  {(!profile.certifications || profile.certifications.length === 0) && <p className="text-sm text-gray-500 italic">Non renseigné.</p>}
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h4 className="text-lg font-black text-navy mb-4 flex items-center border-b border-gray-100 pb-2"><HiTranslate className="mr-2 text-coral h-5 w-5" /> Langues</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.languages?.map((lang, idx) => (
                    <Badge key={idx} color="gray" className="px-3 py-1">
                      <span className="font-bold text-navy">{lang.language}</span> : {lang.level}
                    </Badge>
                  ))}
                  {(!profile.languages || profile.languages.length === 0) && <p className="text-sm text-gray-500 italic">Non renseigné.</p>}
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h4 className="text-lg font-black text-navy mb-4 flex items-center border-b border-gray-100 pb-2"><HiOutlineTruck className="mr-2 text-coral h-5 w-5" /> Permis & Habilitations</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.licenses?.map((lic, idx) => (
                    <Badge key={idx} color="light" className="px-3 py-1 border border-gray-200">{lic.license_type}</Badge>
                  ))}
                  {(!profile.licenses || profile.licenses.length === 0) && <p className="text-sm text-gray-500 italic">Non renseigné.</p>}
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">Profil introuvable.</div>
        )}
      </div>
    </Modal>
  );
}
