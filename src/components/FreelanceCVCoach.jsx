import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert } from 'flowbite-react';
import { HiDocumentText, HiSparkles, HiInformationCircle, HiUpload, HiCheckCircle } from 'react-icons/hi';
import { analyzeCVWithAI, getMyFreelanceProfile } from '../services/api'; 

export default function FreelanceCVCoach() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingInit, setIsLoadingInit] = useState(true); 
  const [aiAdvice, setAiAdvice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSavedAdvice = async () => {
      try {
        const profile = await getMyFreelanceProfile();
        if (profile && profile.ai_cv_advice) {
          setAiAdvice(profile.ai_cv_advice);
        }
      } catch (err) {
        console.error("Erreur chargement profil", err);
      } finally {
        setIsLoadingInit(false);
      }
    };
    
    loadSavedAdvice();
  }, []);

  const handleFileChange = (e) => {
    setError("");
    const file = e.target.files[0];
    
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Le fichier doit obligatoirement être au format PDF.");
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    setError("");

    try {
      const response = await analyzeCVWithAI(selectedFile);
      setAiAdvice(response.cv_advice); 
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoadingInit) return <div className="flex justify-center my-20"><Spinner size="xl" /></div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black text-navy uppercase tracking-tight mb-2">Coach CV IA</h2>
        <p className="text-teal font-medium">Laissez notre IA analyser votre CV et vous donner des conseils personnalisés pour décrocher plus de missions.</p>
      </div>

      <Card className="border-t-4 border-t-coral shadow-xl rounded-2xl p-4 md:p-8">
        
        <div className="flex flex-col items-center justify-center w-full mb-8">
          <label 
            htmlFor="dropzone-file" 
            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
              selectedFile ? 'border-teal bg-teal/5' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
              {selectedFile ? (
                <>
                  <HiDocumentText className="w-16 h-16 text-teal mb-4" />
                  <p className="mb-2 text-xl font-bold text-navy">{selectedFile.name}</p>
                  <p className="text-sm text-teal font-medium flex items-center">
                    <HiCheckCircle className="mr-1" /> Prêt pour l'analyse
                  </p>
                </>
              ) : (
                <>
                  <HiUpload className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="mb-2 text-sm text-gray-500 font-bold"><span className="text-navy">Cliquez pour importer</span> ou glissez-déposez</p>
                  <p className="text-xs text-gray-500">PDF uniquement (MAX. 5MB). Le nouveau fichier remplacera votre ancienne analyse.</p>
                </>
              )}
            </div>
            <input id="dropzone-file" type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
          </label>
        </div>

        {error && (
          <Alert color="failure" icon={HiInformationCircle} className="mb-6">
            <span className="font-bold">Erreur :</span> {error}
          </Alert>
        )}

        <div className="flex justify-center mb-8">
          <button 
            onClick={handleAnalyze} 
            disabled={!selectedFile || isAnalyzing}
            className={`px-8 py-4 rounded-xl font-black text-white flex items-center shadow-lg transition-all ${
              !selectedFile 
                ? 'bg-gray-300 cursor-not-allowed' 
                : isAnalyzing 
                  ? 'bg-navy opacity-80 cursor-wait' 
                  : 'bg-coral hover:scale-105 hover:shadow-xl'
            }`}
          >
            {isAnalyzing ? (
              <><Spinner size="md" className="mr-3" /> L'IA lit votre CV...</>
            ) : (
              <><HiSparkles className="mr-2 h-6 w-6" /> OBTENIR MES CONSEILS</>
            )}
          </button>
        </div>

        {aiAdvice && (
          <div className="bg-teal/5 border border-teal/20 rounded-2xl p-6 md:p-8 animate-fade-in">
            <h3 className="text-xl font-black text-teal flex items-center mb-6">
              <HiSparkles className="mr-2" /> Rapport du Coach Flowlance
            </h3>
            
            <div className="prose max-w-none text-navy leading-relaxed whitespace-pre-wrap">
              {aiAdvice}
            </div>
            
            <div className="mt-6 pt-6 border-t border-teal/20 text-center">
              <p className="text-sm text-gray-500 font-medium">Ces conseils ont été sauvegardés sur votre profil. Vous pouvez les consulter à tout moment.</p>
            </div>
          </div>
        )}
      </Card>

    </div>
  );
}