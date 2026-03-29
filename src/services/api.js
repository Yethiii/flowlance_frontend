const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// --- AUTHENTIFICATION ---
export const loginUser = async ({email, password}) => {
    const response = await fetch(`${API_URL}/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error("Identifiants incorrects");
    return await response.json();
};

// --- PROFIL FREELANCE ---
export const getMyFreelanceProfile = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/freelances/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error("Erreur profil");
    const data = await response.json();
    return data.length > 0 ? data[0] : null;
};

export const updateFreelanceProfile = async (profileId, formData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/freelances/${profileId}/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
    });
    if (!response.ok) throw new Error("Erreur mise à jour profil");
    return await response.json();
};

// --- COMPÉTENCES (SKILLS) ---
export const getMySkills = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/my-skills/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error("Erreur skills");
    return await response.json();
};

// --- HARD SKILLS ---
export const addSkill = async (skillData) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/my-skills/`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            skill: skillData.skill_name,
            level: parseInt(skillData.skill_level),     
            sector_id: parseInt(skillData.sector_id)   
        }),
    });
    
    if (!res.ok) { 
        const err = await res.json(); 
        alert("Erreur Hard Skill: " + JSON.stringify(err)); 
        throw new Error("Erreur Backend"); 
    }
    return await res.json();
};

export const deleteSkill = async (skillId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/my-skills/${skillId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Erreur suppression");
    return true;
};

export const registerUser = async ({ email, password, role }) => {
    const response = await fetch(`${API_URL}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
    }
    return await response.json();
};

export const getCurrentUser = async () => {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_URL}/users/me/`, { 
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        localStorage.removeItem("token");
        throw new Error("Session expirée, merci de vous reconnecter.");
    }

    return await response.json();
};

// --- SECTEURS & SOFT SKILLS ---
export const getSectors = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/sectors/`, { headers: { 'Authorization': `Bearer ${token}` } });
    return await res.json();
};

export const getSoftSkills = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/soft-skills/`, { headers: { 'Authorization': `Bearer ${token}` } });
    return await res.json();
};

export const addEducation = async (formData) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/educations/`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
    return await res.json();
};
export const deleteEducation = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/educations/${id}/`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }});
};

export const addCertification = async (formData) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/certifications/`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
    return await res.json();
};
export const deleteCertification = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/certifications/${id}/`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }});
};

export const addLicense = async (formData) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/licenses/`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
    return await res.json();
};
export const deleteLicense = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/licenses/${id}/`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }});
};

// --- LANGUES ---
export const addLanguage = async (data) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/languages/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return await res.json();
};
export const deleteLanguage = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/languages/${id}/`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }});
};

// --- CV & COMPTE ---
export const updateCV = async (profileId, cvFile) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("freelance_cv_file", cvFile);
    const res = await fetch(`${API_URL}/freelances/${profileId}/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
    });
    if (!res.ok) {
        const errorData = await res.json();
        console.error("Refus de Django pour le CV:", errorData);
        throw new Error("Le serveur a refusé le fichier.");
    }
    
    return await res.json();
}

// --- GESTION DE LA VIE DU COMPTE ---

export const deactivateAccount = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/freelances/deactivate/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Erreur lors de la suspension");
    return await res.json();
};

export const deleteAccount = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/freelances/delete_account/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    // La suppression renvoie un status 204 (No Content), donc on ne fait pas de .json()
    if (!res.ok) throw new Error("Erreur lors de la suppression");
    return true; 
};

export const getCompanyProfile = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/companies/`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Erreur Backend");
    const data = await res.json();
    return data[0]; 
};

export const updateCompanyProfile = async (id, formData) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/companies/${id}/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData, 
    });
    
    if (!res.ok) {
        const errorData = await res.json();
        alert("Refus du serveur (Erreur 400) : " + JSON.stringify(errorData));
        throw new Error("Erreur Backend");
    }
    
    return await res.json();
};

export const deactivateCompanyAccount = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/companies/deactivate/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Erreur lors de la suspension");
    return await res.json();
};

export const deleteCompanyAccount = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/companies/delete_account/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Erreur lors de la suppression");
    return true; 
};

// ==========================================
// --- GESTION DES ANNONCES (JOB OFFERS) ---
// ==========================================

export const getMyJobOffers = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/job-offers/`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Erreur de chargement des annonces");
    return await res.json();
};

export const createJobOffer = async (offerData) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/job-offers/`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(offerData),
    });
    
    if (!res.ok) {
        const err = await res.json();
        alert("Refus du serveur (Création annonce) : " + JSON.stringify(err));
        throw new Error("Erreur Backend");
    }
    return await res.json();
};

export const updateJobOffer = async (id, offerData) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/job-offers/${id}/`, {
        method: 'PATCH',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(offerData),
    });
    
    if (!res.ok) {
        const err = await res.json();
        alert("Refus du serveur (Mise à jour annonce) : " + JSON.stringify(err));
        throw new Error("Erreur Backend");
    }
    return await res.json();
};

export const deleteJobOffer = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/job-offers/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Erreur lors de la suppression");
    return true;
};

// --- L'ASSISTANT IA ---
export const generateJobDescriptionAI = async (keywords) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/generate-job/`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ keywords }),
    });
    
    if (!res.ok) {
        const err = await res.json();
        alert("Erreur de l'IA : " + (err.error || JSON.stringify(err)));
        throw new Error("Erreur IA");
    }
    return await res.json();
};

export const getHardSkills = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/hard-skills/`, { 
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!res.ok) throw new Error("Erreur lors de la récupération des Hard Skills");
    return await res.json();
};

// ==========================================
// --- EXPLORATION & CANDIDATURES (FREELANCE) ---
// ==========================================

export const getAvailableJobOffers = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/job-offers/`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Erreur de chargement des offres");
    return await res.json();
};

export const applyToJob = async (jobId, coverMessage) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/applications/`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ job_offer: jobId, cover_message: coverMessage }),
    });
    
    if (!res.ok) {
        const err = await res.json();
        if (err.non_field_errors) throw new Error("Vous avez déjà postulé à cette mission !");
        throw new Error("Erreur lors de la candidature.");
    }
    return await res.json();
};

export const getCompanyProfileById = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/companies/${id}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Impossible de charger le profil de l'entreprise");
    return await res.json();
};

export const getMyApplications = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/applications/`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Erreur de chargement des candidatures");
    return await res.json();
};

// ==========================================
// --- COACHING CV IA (FREELANCE) ---
// ==========================================

export const analyzeCVWithAI = async (cvFile) => {
    const token = localStorage.getItem("token");
    
    const formData = new FormData();
    formData.append("cv_file", cvFile);

    const res = await fetch(`${API_URL}/cv-advice/`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`
        },
        body: formData,
    });
    
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.cv_file || err.error || "L'IA n'a pas pu analyser votre CV.");
    }
    
    return await res.json();
};

// ==========================================
// --- DASHBOARDS & MATCHING IA ---
// ==========================================

export const getFreelanceDashboardData = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/dashboard/freelance/`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Erreur de chargement du dashboard freelance");
    return await res.json();
};

export const getCompanyDashboardData = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/dashboard/company/`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Erreur de chargement du dashboard entreprise");
    return await res.json();
};

// --- GESTION DES CANDIDATURES (CÔTÉ ENTREPRISE) ---

export const getCompanyApplications = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/company/applications/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des candidatures");
    }
    return await response.json();
};

export const updateApplicationStatus = async (applicationId, status, rejectionMessage = "") => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/applications/${applicationId}/status/`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, rejection_message: rejectionMessage })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la mise à jour du statut");
    }
    return await response.json();
};

// Ajoute la fonction de l'IA :
export const generateRejectionMessageAI = async (freelanceName, jobTitle, draftMessage = "") => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/generate-rejection/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ freelance_name: freelanceName, job_title: jobTitle, draft_message: draftMessage })
    });
    
    if (!response.ok) throw new Error("Erreur IA");
    return await response.json();
};

// --- PROFIL FREELANCE (VU PAR L'ENTREPRISE) ---
export const getFreelanceProfileById = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/freelances/${id}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    if (!response.ok) {
        throw new Error("Impossible de charger le profil du freelance");
    }
    return await response.json();
};

// ==========================================
// --- MESSAGERIE INTERNE (CHAT) ---
// ==========================================

export const getConversation = async (otherUserId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/messages/${otherUserId}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    if (!response.ok) {
        throw new Error("Erreur de chargement des messages");
    }
    return await response.json();
};

export const sendMessage = async (otherUserId, content) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/messages/${otherUserId}/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
    });
    
    if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du message");
    }
    return await response.json();
};

export const getNotificationsCount = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/notifications/`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Erreur notifications");
    return await res.json();
};

export const getConversationsList = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/conversations/`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Erreur conversations");
    return await res.json();
};

export const deleteConversation = async (otherUserId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/messages/${otherUserId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Erreur de suppression");
    return true;
};