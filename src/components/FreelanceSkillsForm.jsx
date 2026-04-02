import { useState, useEffect } from "react";
import { Label, TextInput, Select, Card, Spinner, Button } from "flowbite-react";
import { HiTrash } from "react-icons/hi";
import { getMySkills, addSkill, deleteSkill } from "../services/api";

export default function FreelanceSkillsForm() {
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("BEGINNER");
  
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  const loadSkills = async () => {
    try {
      const data = await getMySkills();
      setSkills(data);
    } catch (error) {
      console.error(error);
      setMessage({ text: "Erreur de chargement de vos compétences.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    try {
      await addSkill({ 
        skill_name: newSkillName, 
        skill_level: newSkillLevel 
      });
      setNewSkillName(""); 
      setNewSkillLevel("BEGINNER"); 
      loadSkills(); 
      setMessage({ text: "Compétence ajoutée !", type: "success" });
    } catch (error) {
      console.error(error);
      setMessage({ text: "Impossible d'ajouter cette compétence.", type: "error" });
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await deleteSkill(id);
      loadSkills(); 
    } catch {
      setMessage({ text: "Impossible de supprimer la compétence.", type: "error" });
    }
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'BEGINNER': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'INTERMEDIATE': return 'bg-teal/10 text-teal border-teal/20';
      case 'ADVANCED': return 'bg-sage/20 text-navy border-sage/40';
      case 'EXPERT': return 'bg-coral/10 text-coral border-coral/20 font-black';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) return <div className="text-center p-10"><Spinner size="xl" /></div>;

  return (
    <Card className="max-w-4xl mx-auto border-none shadow-xl bg-white p-6 rounded-2xl">
      <h2 className="text-3xl font-black italic text-navy mb-2">Mes Compétences</h2>
      <p className="text-sage font-bold mb-6">Étape 2/3 : Détaillez vos "Hard Skills" pour affiner le matching IA.</p>
      
      {message.text && (
        <div className={`p-4 rounded-lg mb-6 font-bold ${message.type === 'success' ? 'bg-teal/20 text-teal' : 'bg-coral/20 text-coral'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleAddSkill} className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-8 flex flex-col md:flex-row items-end gap-4">
        <div className="flex-1 w-full">
          <Label htmlFor="skillName" className="font-bold text-navy mb-2 block">
            Nouvelle compétence <span className="text-coral">*</span>
          </Label>
          <TextInput 
            id="skillName" 
            placeholder="Ex: React, Python, Gestion de projet..." 
            value={newSkillName} 
            onChange={(e) => setNewSkillName(e.target.value)} 
            required
          />
        </div>
        
        <div className="w-full md:w-1/3">
          <Label htmlFor="skillLevel" className="font-bold text-navy mb-2 block">
            Niveau <span className="text-coral">*</span>
          </Label>
          <Select 
            id="skillLevel" 
            value={newSkillLevel} 
            onChange={(e) => setNewSkillLevel(e.target.value)}
          >
            <option value="BEGINNER">Débutant</option>
            <option value="INTERMEDIATE">Intermédiaire</option>
            <option value="ADVANCED">Avancé</option>
            <option value="EXPERT">Expert</option>
          </Select>
        </div>

        <button 
          type="submit"
          className="w-full md:w-auto px-6 py-2.5 rounded-lg font-black text-navy transition-all hover:scale-105"
          style={{ backgroundColor: '#BED3C3' }}
        >
          AJOUTER
        </button>
      </form>

      <h3 className="font-black text-navy text-lg mb-4">Compétences enregistrées</h3>
      
      {skills.length === 0 ? (
        <p className="text-gray-400 italic p-6 text-center border-2 border-dashed border-gray-200 rounded-xl">
          Vous n'avez pas encore ajouté de compétences.
        </p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <div 
              key={skill.id} 
              className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${getLevelColor(skill.skill_level)}`}
            >
              <div className="flex flex-col">
                <span className="font-bold">{skill.skill_name}</span>
                <span className="text-[10px] uppercase tracking-wider opacity-80">
                  {skill.skill_level.replace('BEGINNER', 'Débutant').replace('INTERMEDIATE', 'Intermédiaire').replace('ADVANCED', 'Avancé').replace('EXPERT', 'Expert')}
                </span>
              </div>
              <button 
                onClick={() => handleDeleteSkill(skill.id)}
                className="p-2 hover:bg-white/50 rounded-full transition-colors ml-2"
                title="Supprimer"
              >
                <HiTrash className="text-lg opacity-70 hover:opacity-100 hover:text-coral" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}